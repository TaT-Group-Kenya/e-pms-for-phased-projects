"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";
import Can from "../../auth/Can";

const internalImages = process.env.NEXT_PUBLIC_EPMS_API_BASE;

interface Company {
  id: number;
  name: string;
  email: string;
  contact_person_name: string;
  phone: string;
  // Numeric projects count provided by API (CompanyResource::projects)
  projects?: number;
  logo?: string;
}

interface PaginationData {
  data: Company[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

const CompaniesList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  
  // State management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
  const [deleteCompanyName, setDeleteCompanyName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const perPage = 15;

  // Fetch companies from API
  const fetchCompanies = async (page: number = currentPage) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/companies/list?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data: PaginationData = await response.json();

      if (!response.ok) {
        addToast("Failed to load companies", "error");
        setCompanies([]);
        return;
      }

      // Handle both paginated and direct responses
      const companiesList = data.data || data;
      setCompanies(Array.isArray(companiesList) ? companiesList : []);
      setTotalPages(data.last_page || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error("Error fetching companies:", err);
      addToast("Error loading companies. Please refresh the page.", "error");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchCompaniesWithAbort = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/companies/list?page=${currentPage}&per_page=${perPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }
        );

        // Don't process if request was aborted
        if (controller.signal.aborted) return;

        const data: PaginationData = await response.json();

        if (!response.ok) {
          addToast("Failed to load companies", "error");
          setCompanies([]);
          return;
        }

        // Handle both paginated and direct responses
        const companiesList = data.data || data;
        setCompanies(Array.isArray(companiesList) ? companiesList : []);
        setTotalPages(data.last_page || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching companies:", err);
        addToast("Error loading companies. Please refresh the page.", "error");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchCompaniesWithAbort();
    } else {
      setLoading(false);
    }

    // Cleanup: abort request if effect runs again or component unmounts
    return () => controller.abort();
  }, [currentPage, accessToken, perPage, addToast]);

  // Handle page change
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const deleteCompany = async (companyId: number, accessToken: string): Promise<any> => {
    try {
      const response = await fetch(`/api/companies/delete?id=${companyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      return { message: "Company deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete company");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (companyId: number, companyName: string) => {
    setDeleteCompanyId(companyId);
    setDeleteCompanyName(companyName);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteCompanyId(null);
    setDeleteCompanyName("");
    setDeleteError(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteCompanyId) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCompany(deleteCompanyId, accessToken as string);
      addToast("Company deleted successfully", "success");
      closeDeleteModal();
      // Refetch companies on current page in the background
      await fetchCompanies(currentPage);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete company";
      setDeleteError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate pagination display values
  const indexOfFirstCompany = (currentPage - 1) * perPage + 1;
  const indexOfLastCompany = Math.min(currentPage * perPage, totalCount);

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Company"
        message="Are you sure you want to delete this company? This action cannot be undone."
        itemName={deleteCompanyName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
      <div className="trezo-card-header bg-white mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Companies</h5>
        </div>
        <div className="flex items-center gap-[15px] w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>
          <Can any={["ROLE_ADD_COMPANY"]}>
            <Link
              href="/company/create-company"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Company
              </span>
            </Link>
          </Can>
        </div>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
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
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Name</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Email</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Contact Person</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Phone</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Projects</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Logo</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {companies.filter((company) =>
                    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (company.contact_person_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (company.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    companies.filter((company) =>
                      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (company.contact_person_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (company.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((company) => (
                      <tr key={company.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link href={`/company/${company.id}`} className="text-primary-500 hover:text-primary-600 hover:underline font-medium text-sm">
                            {company.name}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{company.email}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{company.contact_person_name || "N/A"}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{company.phone}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{company.projects ?? 0}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {company.logo ? (
                            <img src={internalImages + company.logo} alt={company.name} className="rounded-md" width={40} height={30} />
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link href={`/company/${company.id}`} className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all" title="View Details">
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>
                            <Can any={["ROLE_DELETE_COMPANY"]}>
                              <button
                                onClick={() => openDeleteModal(company.id, company.name)}
                                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                                title="Delete Company"
                              >
                                <i className="material-symbols-outlined !text-[18px]">delete</i>
                              </button>
                            </Can>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">
                        {searchTerm ? "No companies match your search" : "No companies found"}
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
                  Showing {indexOfFirstCompany} to {indexOfLastCompany} of {totalCount} results
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

export default CompaniesList;
