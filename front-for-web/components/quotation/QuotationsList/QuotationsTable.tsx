"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

interface Quotation {
  id: number;
  quotation_number: string;
  title: string;
  description?: string;
  customer_id?: number;
  project_id?: number;
  status: string;
  valid_until_date: string;
  subtotal_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  customer?: { name: string };
}

interface PaginationData {
  data: Quotation[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-success-50 text-success-500';
    case 'sent':
      return 'bg-info-50 text-info-500';
    case 'draft':
      return 'bg-warning-50 text-warning-500';
    case 'rejected':
      return 'bg-danger-50 text-danger-500';
    case 'revised':
      return 'bg-primary-50 text-primary-500';
    default:
      return 'bg-gray-50 text-gray-500';
  }
};

const QuotationsList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  
  // State management
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteQuotationId, setDeleteQuotationId] = useState<number | null>(null);
  const [deleteQuotationName, setDeleteQuotationName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const perPage = 15;

  // Fetch quotations from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchQuotations = async () => {
      setLoading(true);

      try {
        let url = `/api/quotations/list?page=${currentPage}&per_page=${perPage}`;
        if (statusFilter !== "all") {
          url += `&status=${statusFilter}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        // Don't process if request was aborted
        if (controller.signal.aborted) return;

        const data: PaginationData = await response.json();

        if (!response.ok) {
          addToast("Failed to load quotations", "error");
          setQuotations([]);
          return;
        }

        // Handle both paginated and direct responses
        const quotationList = data.data || data;
        setQuotations(Array.isArray(quotationList) ? quotationList : []);
        setTotalPages(data.last_page || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching quotations:", err);
        addToast("Error loading quotations. Please refresh the page.", "error");
        setQuotations([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchQuotations();
    } else {
      setLoading(false);
    }

    // Cleanup: abort request if effect runs again or component unmounts
    return () => controller.abort();
  }, [currentPage, statusFilter, accessToken, perPage, addToast]);

  // Handle page change
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const deleteQuotation = async (quotationId: number, accessToken: string): Promise<any> => {
    try {
      const response = await fetch(`/api/quotations/delete?id=${quotationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete quotation");
      }

      return { message: "Quotation deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete quotation");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (quotationId: number, quotationTitle: string) => {
    setDeleteQuotationId(quotationId);
    setDeleteQuotationName(quotationTitle);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteQuotationId(null);
    setDeleteQuotationName("");
    setDeleteError(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteQuotationId) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteQuotation(deleteQuotationId, accessToken as string);
      addToast("Quotation deleted successfully", "success");
      closeDeleteModal();
      if (quotations.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setCurrentPage(currentPage);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete quotation";
      setDeleteError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter quotations based on search term
  const filteredQuotations = quotations.filter((quotation) =>
    quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination display values
  const indexOfFirstQuotation = (currentPage - 1) * perPage + 1;
  const indexOfLastQuotation = Math.min(currentPage * perPage, totalCount);

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
        itemName={deleteQuotationName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
      
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Quotations</h5>
        </div>

        <div className="flex items-center gap-[15px] w-full md:w-auto flex-wrap md:flex-nowrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="revised">Revised</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>

          <Link
            href="/quotation/create-quotation"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                add
              </i>
              Create Quotation
            </span>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        {/* Loading State */}
        {loading ? (
          <div className="p-[20px] md:p-[25px]">
            <div className="space-y-[10px]">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Quotation #
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Title
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Amount
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Tax Amount
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Discount
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Net Amount
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Valid Until
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredQuotations.length > 0 ? (
                    filteredQuotations.map((quotation) => (
                      <tr key={quotation.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/quotation/${quotation.id}`}
                            className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {quotation.quotation_number}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px]">
                          <Link
                            href={`/quotation/${quotation.id}`}
                            className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                          >
                            {quotation.title}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold">
                            {quotation.currency} {quotation.subtotal_amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold">
                            {quotation.currency} {quotation.tax_amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold">
                            {quotation.currency} {quotation.discount_amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold text-primary-500">
                            {quotation.currency} {quotation.total_amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {quotation.valid_until_date ? new Date(quotation.valid_until_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                            {quotation.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link
                              href={`/quotation/${quotation.id}`}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                              title="View Details"
                            >
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>
                            <button
                              onClick={() => openDeleteModal(quotation.id, quotation.title)}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                              title="Delete Quotation"
                            >
                              <i className="material-symbols-outlined !text-[18px]">delete</i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm || statusFilter !== "all" ? "No quotations match your criteria" : "No quotations found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-[20px] py-[12px] md:py-[14px] border-t border-gray-100 dark:border-[#172036] flex items-center justify-between flex-wrap gap-[10px]">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstQuotation} to {indexOfLastQuotation} of {totalCount} results
                </p>
                <div className="flex gap-[5px]">
                  <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="material-symbols-outlined">chevron_left</i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageClick(i + 1)}
                      className={`w-[31px] h-[31px] flex items-center justify-center rounded-md border transition-all ${
                        currentPage === i + 1
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="material-symbols-outlined">chevron_right</i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default QuotationsList;
