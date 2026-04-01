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

interface Customer {
  id: number;
  name: string;
  email: string;
  contact_person_name: string;
  phone: string;
  // For list/index: numeric count from CustomerResource::projects_count
  projects_count?: number;
  // For detail views (when loaded): may be an array of project objects
  projects?: any;
  logo?: string;
}

interface PaginationData {
  data: Customer[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

const CustomersList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  
  // State management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [deleteCustomerName, setDeleteCustomerName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const perPage = 15;

  // Fetch customers from API
  const fetchCustomers = async (page: number = currentPage) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/customers/list?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data: PaginationData = await response.json();

      if (!response.ok) {
        addToast("Failed to load customers", "error");
        setCustomers([]);
        return;
      }

      // Handle both paginated and direct responses
      const customerList = data.data || data;
      setCustomers(Array.isArray(customerList) ? customerList : []);
      setTotalPages(data.last_page || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error("Error fetching customers:", err);
      addToast("Error loading customers. Please refresh the page.", "error");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchCustomersWithAbort = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/customers/list?page=${currentPage}&per_page=${perPage}`,
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
          addToast("Failed to load customers", "error");
          setCustomers([]);
          return;
        }

        // Handle both paginated and direct responses
        const customerList = data.data || data;
        setCustomers(Array.isArray(customerList) ? customerList : []);
        setTotalPages(data.last_page || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching customers:", err);
        addToast("Error loading customers. Please refresh the page.", "error");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchCustomersWithAbort();
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

  const deleteCustomer = async (customerId: number, accessToken: string): Promise<any> => {
    try {
      const response = await fetch(`/api/customers/delete?id=${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      return { message: "Customer deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete customer");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (customerId: number, customerName: string) => {
    setDeleteCustomerId(customerId);
    setDeleteCustomerName(customerName);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteCustomerId(null);
    setDeleteCustomerName("");
    setDeleteError(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteCustomerId) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCustomer(deleteCustomerId, accessToken as string);
      addToast("Customer deleted successfully", "success");
      closeDeleteModal();
      // Refetch customers on current page in the background
      await fetchCustomers(currentPage);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete customer";
      setDeleteError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate pagination display values
  const indexOfFirstCustomer = (currentPage - 1) * perPage + 1;
  const indexOfLastCustomer = Math.min(currentPage * perPage, totalCount);

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        itemName={deleteCustomerName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Customers</h5>
        </div>
        <div className="flex items-center gap-[15px] w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>
          <Can any={["ROLE_ADD_CUSTOMER"]}>
            <Link
              href="/customer/create-customer"
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Customer
              </span>
            </Link>
          </Can>
        </div>
      </div>

      {/* Table Section */}
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
                  {customers.filter((customer) =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (customer.contact_person_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (customer.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    customers.filter((customer) =>
                      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (customer.contact_person_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (customer.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link href={`/customer/${customer.id}`} className="text-primary-500 hover:text-primary-600 hover:underline font-medium text-sm">
                            {customer.name}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">{customer.email}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">{customer.contact_person_name || "N/A"}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">{customer.phone}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">{customer.projects_count ?? 0}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {customer.logo ? (
                            <img src={internalImages + customer.logo} alt={customer.name} className="rounded-md" width={40} height={30} />
                          ) : (
                            <span className="text-sm">-</span>
                          )}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link href={`/customer/${customer.id}`} className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all" title="View Details">
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>
                            <Can any={["ROLE_DELETE_CUSTOMER"]}>
                              <button
                                onClick={() => openDeleteModal(customer.id, customer.name)}
                                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                                title="Delete Customer"
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
                        {searchTerm ? "No customers match your search" : "No customers found"}
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
                  Showing {indexOfFirstCustomer} to {indexOfLastCustomer} of {totalCount} results
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

export default CustomersList;
