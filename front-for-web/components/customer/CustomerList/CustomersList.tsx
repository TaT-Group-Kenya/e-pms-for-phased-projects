"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

const internalImages = process.env.NEXT_PUBLIC_EPMS_API_BASE + '/images/logos/';

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
      <div className="trezo-card-header bg-white mb-[20px] md:mb-[25px] flex items-center justify-between p-5 rounded-md">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Customers</h5>
        </div>

        <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
          <Link
            href="/customer/create-customer"
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                add
              </i>
              Create New Customer
            </span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md animate-pulse"
            >
              <div className="h-[80px] bg-gray-200 dark:bg-gray-700 rounded-md mb-[20px]"></div>
              <div className="h-[20px] bg-gray-200 dark:bg-gray-700 rounded-md mb-[10px]"></div>
              <div className="h-[16px] bg-gray-200 dark:bg-gray-700 rounded-md mb-[15px]"></div>
              <div className="space-y-[10px]">
                <div className="h-[16px] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-[16px] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-[16px] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
            >
              <div className="trezo-card-content relative -mt-[7px]">
                {customer.logo && (
                  <div className="absolute -top-[18px] ltr:-left-[20px] rtl:-right-[20px] ltr:md:-left-[25px] rtl:md:-right-[25px] w-[90px] bg-gray-50 dark:bg-[#0a0e19] border-b-[10px] ltr:border-r-[10px] rtl:border-l-[10px] border-gray-50 dark:border-[#0a0e19] ltr:rounded-br-md rtl:rounded-bl-md">
                    <img
                      src={internalImages + customer.logo}
                      alt={customer.name}
                      className="rounded-md"
                      width={80}
                      height={60}
                    />
                  </div>
                )}

                <div className={`mb-[20px] md:mb-[25px] ${customer.logo ? "ltr:pl-[88px] rtl:pr-[88px]" : ""}`}>
                  <span className="font-medium text-black dark:text-white block text-md mb-[2px]">
                    {customer.name}
                  </span>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">{customer.email}</span>
                </div>

                <ul>
                  <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                    <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                      Contact:
                    </span>
                    {customer.contact_person_name || "N/A"}
                  </li>

                  <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                    <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                      Phone:
                    </span>
                    {customer.phone}
                  </li>

                  <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                    <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                      Projects:
                    </span>
                    {customer.projects_count ?? 0}
                  </li>
                </ul>

                <div className="mt-[17px]">
                  <Link
                    href={`/customer/${customer.id}`}
                    className="inline-block rounded-md font-medium border border-primary-500 text-white bg-primary-500 py-[4.5px] px-[15.5px] transition-all hover:bg-primary-400 hover:border-primary-400 ltr:mr-[10px] rtl:ml-[10px]"
                  >
                    View Customer
                  </Link>

                  <button
                    onClick={() => openDeleteModal(customer.id, customer.name)}
                    className="inline-block rounded-md font-medium border border-danger-500 text-white bg-danger-500 py-[4.5px] px-[15.5px] transition-all hover:bg-danger-600 hover:border-danger-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && customers.length === 0 && (
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">No customers found</p>
        </div>
      )}

      {/* Pagination */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {indexOfFirstCustomer} to {indexOfLastCustomer} of{" "}
              {totalCount} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className="inline-block mx-[2px]">
                  <button
                    onClick={() => handlePageClick(index + 1)}
                    disabled={loading}
                    className={`w-[31px] h-[31px] block leading-[29px] text-center rounded-md border transition-all ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px]">
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersList;
