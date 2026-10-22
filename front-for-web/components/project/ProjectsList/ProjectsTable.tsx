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

interface Project {
  id: number;
  code: string;
  name: string;
  description?: string;
  bol_number?: string;
  customer_id?: number;
  project_category_id?: number;
  no_of_phases?: number;
  start_date: string;
  end_date: string;
  budget_estimate?: string;
  status: string;
  priority: string;
  progress?: number;
  currency?: string;
  customer?: { name: string };
  created_at?: string;
  order?: { title?: string } | null;
  project_owner?: {
    id: number;
    name: string;
  };
  created_by_user?: {
    first_name?: string;
    last_name?: string;
  };
}

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'finished':
      return 'bg-success-50 text-success-500';
    case 'in progress':
      return 'bg-warning-50 text-warning-500';
    case 'pending':
      return 'bg-info-50 text-info-500';
    default:
      return 'bg-gray-50 text-gray-500';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-danger-50 text-danger-500';
    case 'medium':
      return 'bg-warning-50 text-warning-500';
    case 'low':
      return 'bg-info-50 text-info-500';
    default:
      return 'bg-gray-50 text-gray-500';
  }
};

const ProjectsList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  // Server-side listing: pagination, debounced search and status filter all
  // live in useListQuery; this component keeps only its own columns/actions.
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
    rows: projects,
    loading,
    error,
    meta, 
    refresh,
  } = useListQuery<Project>("/api/projects/list", {
    accessToken,
    initialFilters: { status: "all" },
    onError: (message) => addToast(message, "error"),
  });

  const statusFilter = filters.status || "all";

  // Option lists for the extra filter dropdowns (small reference data).
  const accessTokenRef = accessToken as string;
  const { options: customerOptions } = useFilterOptions(
    accessTokenRef ? "/api/customers/list?page=1&per_page=500" : null,
    (row) => (row?.id != null && row?.name ? { value: String(row.id), label: row.name } : null),
    { accessToken: accessTokenRef }
  );
  const { options: categoryOptions } = useFilterOptions(
    accessTokenRef ? "/api/projects/categories/list?page=1&per_page=500" : null,
    (row) => (row?.id != null && row?.name ? { value: String(row.id), label: row.name } : null),
    { accessToken: accessTokenRef }
  );
  const customerIdFilter = filters.customer_id || "all";
  const categoryFilter = filters.project_category_id || "all";
  const priorityFilter = filters.priority || "all";
  const hasExtraFilters =
    searchInput || statusFilter !== "all" || customerIdFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all";

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteProject = async (projectId: number, accessToken: string): Promise<any> => {
    try {
      const response = await fetch(`/api/projects/delete?id=${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete Consignment");
      }

      return { message: "Consignment deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete Consignment");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (projectId: number, projectName: string) => {
    setDeleteProjectId(projectId);
    setDeleteProjectName(projectName);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteProjectId(null);
    setDeleteProjectName("");
    setDeleteError(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteProjectId) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProject(deleteProjectId, accessToken as string);
      addToast("Consignment deleted successfully", "success");
      closeDeleteModal();
      // Refetch on current page in the background
      refresh();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete Consignment";
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
        title="Delete Consignment"
        message="Are you sure you want to delete this Consignment? This action cannot be undone."
        itemName={deleteProjectName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
      
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          {/* <h5 className="!mb-0">All Consignments</h5> */}
        </div>

        <div className="flex items-center gap-[15px] w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setFilter("status", e.target.value)}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="progress">In Progress</option>
            <option value="draft">Draft</option>
            <option value="complete">Complete</option>
          </select>

          {(hasExtraFilters) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-[4px] h-[36px] px-[10px] text-xs rounded-md border border-gray-50 dark:border-[#15203c] text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 whitespace-nowrap"
              title="Clear all filters"
            >
              <i className="material-symbols-outlined !text-[16px]">filter_alt_off</i>
              Clear
            </button>
          )}

          {/* Customer Filter */}
          <FilterSelect
            value={customerIdFilter}
            options={customerOptions}
            placeholder="All Customers"
            onChange={(value) => setFilter("customer_id", value)}
          />

          {/* Category Filter */}
          <FilterSelect
            value={categoryFilter}
            options={categoryOptions}
            placeholder="All Categories"
            onChange={(value) => setFilter("project_category_id", value)}
          />

          {/* Priority Filter */}
          <FilterSelect
            value={priorityFilter}
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
            placeholder="All Priorities"
            onChange={(value) => setFilter("priority", value)}
          />

          {/* Search Box */}
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search Consignments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>
          <Can any={["ROLE_ADD_PROJECT"]}>
            <Link
              href="/project/create-project"
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Consignment
              </span>
            </Link>
          </Can>
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
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Date
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      BOL Number
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Order
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Consignment
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Customer
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Consignee
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Currency
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Amount
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Progress
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Priority
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Created By
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {!loading && error && (
                    <tr>
                      <td
                        colSpan={13}
                        className="text-center px-[20px] py-[40px] text-danger-500"
                      >
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && projects.length > 0 ? (
                    projects.map((project) => (
                      <tr key={project.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {project.created_at ? new Date(project.created_at).toLocaleDateString() : ""}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          {project.bol_number || ""}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {project.order?.title || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <Link
                            href={`/project/${project.id}`}
                            className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                          >
                            {project.name}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          {project.customer?.name || "N/A"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {project.project_owner?.name || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {project.currency || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {project.budget_estimate ? `${project.currency || ""} ${project.budget_estimate}` : "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {project.progress != null ? `${project.progress}%` : "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {[
                            project.created_by_user?.first_name,
                            project.created_by_user?.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link
                              href={`/project/${project.id}`}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                              title="View Details"
                            >
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>
                            <Can any={["ROLE_DELETE_PROJECT"]}>
                              <button
                                onClick={() => openDeleteModal(project.id, project.name)}
                                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                                title="Delete Consignment"
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
                      <td
                        colSpan={14}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {hasExtraFilters ? "No Consignments match your criteria" : "No Consignments found"}
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

export default ProjectsList;
