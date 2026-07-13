"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import RecentActivity from "./RecentActivity";
import ProjectRoadmap from "./ProjectRoadmap";
import ProjectOverview from "./ProjectOverview";
import ProjectPhases from "./ProjectPhases";
import ProjectEditComponent from "./ProjectEditComponent";
import ProjectPhasesComponent from "./ProjectPhasesComponent";
import ProjectTransactionsComponent from "./ProjectTransactionsComponent";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface ProjectDetailsData {
  id: number;
  code: string;
  name: string;
  description?: string;
  project_owner?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
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
  customer?: { id: number; name: string };
  category?: { id: number; name: string };
  phases?: ProjectPhase[];
  order?: any;
  // quotation removed: projects are no longer directly linked to quotations
  customer_invoices?: any[];
  company_invoices?: any[];
  in_coming_payments?: any[];
  out_going_payments?: any[];
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
}

interface ProjectPhase {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  phase_order: string;
  status: 'new' | 'progress' | 'draft' | 'complete';
  start_date?: string;
  end_date?: string;
  progress_percentage: number;
  quote_item_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface ProjectOverviewContentProps {
  projectId: string;
}

const ProjectOverviewContent: React.FC<ProjectOverviewContentProps> = ({ projectId }) => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch project details
  const fetchProjectDetails = async (showLoading: boolean = true) => {
    if (showLoading) setLoading(true);

    const controller = new AbortController();

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      const data = await response.json();

      if (!response.ok) {
        addToast("Failed to load project details", "error");
        return;
      }

      const projectData = data.data || data;
      setProject(projectData);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error("Error fetching project details:", err);
      addToast("Error loading project details. Please refresh the page.", "error");
    } finally {
      if (showLoading) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (accessToken && projectId) {
      fetchProjectDetails(true);
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [projectId, accessToken, addToast]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  if (loading) {
    return (
      <div className="text-center py-[40px]">
        <p className="text-gray-600 dark:text-gray-400">Loading project details...</p>
      </div>
    );
  }

  if (!project && projectId) {
    return (
      <div className="text-center py-[40px]">
        <p className="text-gray-600 dark:text-gray-400">Project not found</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="trezo-card bg-transparent p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          {/* Back to Projects List */}
          <div className="mb-[15px]">
            <Link
              href="/project/project-list"
              className="inline-flex items-center gap-[6px] text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500"
            >
              <i className="material-symbols-outlined !text-[18px]">arrow_back</i>
              <span>Back to Projects</span>
            </Link>
          </div>

          {/* Tabs Navigation */}
          <div className="trezo-tabs mb-[20px] md:mb-[25px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(0)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 0
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">dashboard</i>
                  Overview
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(1)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 1
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">edit</i>
                  Edit Project
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(2)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 2
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">task_alt</i>
                  Project Phases
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(3)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 3
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">shopping_cart</i>
                  Order
                  {project?.order && (
                    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-green-500 text-white text-xs font-bold">✓</span>
                  )}
                </button>
              </li>
              
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(5)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 5
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">payments</i>
                  Transactions
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          {activeTab === 0 && (
            <div className="pt-[20px]">
              <div className="lg:grid xl:grid-cols-2 gap-[25px]">
                <div>
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                      <div className="trezo-card-title">
                        <h5 className="!mb-0">{project?.name || "Project Details"}</h5>
                      </div>
                    </div>

                    <div className="trezo-card-content">
                      <div className="bg-primary-500 rounded-md mb-[12px] pt-[20px] md:pt-[25px] px-[20px] md:px-[25px] pb-[18px]">
                        <div className="md:flex items-center justify-between">
                          <div className="flex items-center mt-[15px] first:mt-0 md:mt-0">
                            <div className="w-[45px] h-[45px] rounded-full bg-primary-600 text-white flex items-center justify-center">
                              <i className="material-symbols-outlined">for_you</i>
                            </div>
                            <div className="ltr:ml-[12px] rtl:mr-[12px]">
                              <span className="block text-white">Client</span>
                              <span className="font-semibold text-white block text-md">
                                {project?.customer?.name || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center mt-[15px] first:mt-0 md:mt-0">
                            <div className="w-[45px] h-[45px] rounded-full bg-primary-600 text-white flex items-center justify-center">
                              <i className="material-symbols-outlined">attach_money</i>
                            </div>
                            <div className="ltr:ml-[12px] rtl:mr-[12px]">
                              <span className="block text-white">Budget</span>
                              <span className="font-semibold text-white block text-md">
                                {project?.currency} {project?.budget_estimate || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center mt-[15px] first:mt-0 md:mt-0">
                            <div className="w-[45px] h-[45px] rounded-full bg-primary-600 text-white flex items-center justify-center">
                              <i className="material-symbols-outlined">pace</i>
                            </div>
                            <div className="ltr:ml-[12px] rtl:mr-[12px]">
                              <span className="block text-white">Duration</span>
                              <span className="font-semibold text-white block text-md">
                                {project?.start_date && project?.end_date
                                  ? Math.ceil(
                                      (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                    ) + " days"
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex w-full h-[7px] overflow-hidden rounded-md bg-gray-200 mt-[20px] mb-[8px]">
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-orange-400 rounded-md"
                            style={{ width: `${project?.progress || 0}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="block text-white">Progress</span>
                          <span className="block text-white">{project?.progress || 0}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="block">
                          Project Started: {project?.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}
                        </span>
                        <span className="block">
                          Project Deadline: {project?.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
                        </span>
                      </div>

                      <span className="block text-black dark:text-white mb-[8px] mt-[20px] font-bold">
                        Project Details
                      </span>

                      <p className="leading-[1.7]">
                        {project?.description || "No description available"}
                      </p>

                      <span className="block text-black dark:text-white mb-[8px] mt-[20px] font-bold">
                        Project Owner
                      </span>

                      <p className="leading-[1.7]">
                        {project?.project_owner?.name || "No project owner available"}
                      </p>

                      {project?.tags && (
                        <ul className="list-disc ltr:pl-[22px] rtl:pr-[22px] mt-[15px]">
                          {project.tags.split(',').map((tag, index) => (
                            <li key={index} className="leading-[1.7] mb-[4px] last:mb-0">
                              {tag.trim()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* RecentActivity */}
                  <RecentActivity project={project} />
                </div>

                <div>
                  <ProjectRoadmap project={project} />

                  <ProjectOverview project={project} />
                </div>
              </div>

              <div className="mt-[25px]">
                <ProjectPhases 
                  project={project}
                  onNavigateToPhases={() => handleTabClick(2)}
                />
              </div>
            </div>
          )}

          {/* Edit Project Tab */}
          {activeTab === 1 && (
            <ProjectEditComponent
              project={project}
              projectId={projectId}
              onProjectDeleted={() => {
                // Project will be deleted and user redirected, nothing needed here
              }}
              onProjectUpdated={() => {
                // Refresh project data across all tabs
                fetchProjectDetails(false);
              }}
            />
          )}

          {/* Project Phases Tab */}
          {activeTab === 2 && (
            <ProjectPhasesComponent
              projectId={projectId}
              initialPhases={project?.phases}
            />
          )}

          {/* Orders Tab */}
          {activeTab === 3 && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
              <div className="pt-[20px]">
                <h6 className="font-semibold text-black dark:text-white mb-[20px] flex items-center gap-[8px]">
                  <i className="material-symbols-outlined text-[20px]">shopping_cart</i>
                  Project Order
                </h6>

                {!project?.order || Object.keys(project.order).length === 0 ? (
                  <div className="text-center py-[40px]">
                    <div className="mb-[15px]">
                      <i className="material-symbols-outlined text-[48px] text-gray-400">shopping_cart</i>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No order available</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-[8px]">
                      An order will appear here once one is created for this project
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-[#172036]">
                          <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">Order #</th>
                          <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">Title</th>
                          <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">Status</th>
                          <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">Total</th>
                          <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 dark:border-[#0f1829] hover:bg-gray-50 dark:hover:bg-[#172036] transition-colors">
                          <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                            {project.order.order_number || `ORD-${project.order.id}`}
                          </td>
                          <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300">
                            {project.order.title || "N/A"}
                          </td>
                          <td className="py-[12px] px-[16px]">
                            <span className="inline-block px-[8px] py-[4px] rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-700">
                              {project.order.status || "Unknown"}
                            </span>
                          </td>
                          <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                            {project.order.currency || project.currency || ""}{" "}
                            {typeof project.order.total_amount === "number"
                              ? project.order.total_amount.toFixed(2)
                              : project.order.total_amount || "0.00"}
                          </td>
                          <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 text-sm">
                            {project.order.created_at
                              ? new Date(project.order.created_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 5 && (
            <ProjectTransactionsComponent
              incomingPayments={project?.in_coming_payments || []}
              outgoingPayments={project?.out_going_payments || []}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectOverviewContent;
