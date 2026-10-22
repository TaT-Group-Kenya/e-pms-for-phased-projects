"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { useFilterOptions } from "../../../hooks/useFilterOptions";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";
import PaginationFooter from "../../common/PaginationFooter";
import FilterSelect from "../../common/FilterSelect";
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

const CompaniesList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  // Server-side listing: pagination and debounced search live in useListQuery.
  const {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    clearFilters,
    page,
    setPage,
    perPage,
    changePerPage,
    rows: companies,
    loading,
    error, 
    meta,
    refresh,
  } = useListQuery<Company>("/api/companies/list", {
    accessToken,
    onError: (message) => addToast(message, "error"),
  });

  // Option list for the country filter.
  const accessTokenRef = accessToken as string;
  const { options: countryOptions } = useFilterOptions(
    accessTokenRef ? "/api/companies/list?page=1&per_page=500" : null,
    (row) => (row?.country ? { value: String(row.country), label: String(row.country) } : null),
    { accessToken: accessTokenRef }
  );
  const countryFilter = filters.country || "all";
  const hasActiveSearch = !!searchInput || countryFilter !== "all";

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
  const [deleteCompanyName, setDeleteCompanyName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      // Refetch on current page in the background
      refresh();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete company";
      setDeleteError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

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
          {(hasActiveSearch) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-[4px] h-[36px] px-[10px] text-xs rounded-md border border-gray-50 dark:border-[#15203c] text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 whitespace-nowrap"
              title="Clear all filters"
            >
              <i className="material-symbols-outlined !text-[16px]">filter_alt_off</i>
              Clear
            </button>
          )}
          {/* Country Filter */}
          <FilterSelect
            value={countryFilter}
            options={countryOptions}
            placeholder="All Countries"
            onChange={(value) => setFilter("country", value)}
          />
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Consignments</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Logo</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {!loading && error && (
                    <tr>
                      <td colSpan={7} className="text-center px-[20px] py-[40px] text-danger-500">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && companies.length > 0 ? (
                    companies.map((company) => (
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
                        {hasActiveSearch ? "No companies match your criteria" : "No companies found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {!loading && !error && (
              <PaginationFooter
                meta={meta}
                page={page}
                perPage={perPage}
                loading={loading}
                onPageChange={setPage}
                onPerPageChange={changePerPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CompaniesList;
