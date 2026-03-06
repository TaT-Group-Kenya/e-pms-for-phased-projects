"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";
import Can from "../../auth/Can";

interface Project {
  id: number;
  code: string;
  name: string;
  description?: string;
  customer_id?: number;
  project_category_id?: number;
  no_of_phases?: number;
  start_date: string;
  end_date: string;
  budget_estimate?: string;
  status: string;
  priority: string;
  progress?: number;
  tags?: string;
  currency?: string;
  customer?: { name: string };
}

interface PaginationData {
  data: Project[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
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
  
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const perPage = 15;

  // Fetch projects from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/projects/list?page=${currentPage}&per_page=${perPage}`,
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
          addToast("Failed to load projects", "error");
          setProjects([]);
          return;
        }

        // Handle both paginated and direct responses
        const projectList = data.data || data;
        setProjects(Array.isArray(projectList) ? projectList : []);
        setTotalPages(data.last_page || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching projects:", err);
        addToast("Error loading projects. Please refresh the page.", "error");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchProjects();
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

  const deleteProject = async (projectId: number, accessToken: string): Promise<any> => {
    try {
      const response = await fetch(`/api/projects/delete?id=${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return { message: "Project deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete project");
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
      addToast("Project deleted successfully", "success");
      closeDeleteModal();
      // Refetch projects on current page in the background
      // Trigger a refetch by resetting to page 1 if needed
      if (projects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setCurrentPage(currentPage);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete project";
      setDeleteError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination display values
  const indexOfFirstProject = (currentPage - 1) * perPage + 1;
  const indexOfLastProject = Math.min(currentPage * perPage, totalCount);

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={deleteProjectName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
      
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Projects</h5>
        </div>

        <div className="flex items-center gap-[15px] w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
                Create Project
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
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Code
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Name
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Customer
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Priority
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Start Date
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      End Date
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/project/${project.id}`}
                            className="text-primary-500 hover:text-primary-600 hover:underline font-medium text-sm"
                          >
                            {project.code}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px]">
                          <Link
                            href={`/project/${project.id}`}
                            className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                          >
                            {project.name}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {project.customer?.name || "N/A"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
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
                                title="Delete Project"
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
                        colSpan={8}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm ? "No projects match your search" : "No projects found"}
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
                  Showing {indexOfFirstProject} to {indexOfLastProject} of {totalCount} results
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

export default ProjectsList;
