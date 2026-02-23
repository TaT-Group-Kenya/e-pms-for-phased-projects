"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface ProjectDetailsData {
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
  customer?: { id: number; name: string };
  category?: { id: number; name: string };
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
}

interface ProjectDetailsViewProps {
  projectId: string;
}

const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({ projectId }) => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const getStatusBadgeColor = (status: string): string => {
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

  const getPriorityBadgeColor = (priority: string): string => {
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

  // Fetch project details
  useEffect(() => {
    const controller = new AbortController();

    const fetchProjectDetails = async () => {
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
        setLoading(false);
      }
    };

    if (accessToken && projectId) {
      fetchProjectDetails();
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [projectId, accessToken, addToast]);

  if (loading) {
    return (
      <div className="text-center py-[40px]">
        <p className="text-gray-600 dark:text-gray-400">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-[40px]">
        <p className="text-gray-600 dark:text-gray-400">Project not found</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Project Header Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex items-start justify-between gap-[15px] mb-[20px]">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-[8px]">
              {project.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-[15px]">
              Code: <span className="font-medium text-black dark:text-white">{project.code}</span>
            </p>
            <div className="flex flex-wrap gap-[10px]">
              <span className={`inline-block px-[12px] py-[6px] rounded-full text-sm font-medium ${getStatusBadgeColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`inline-block px-[12px] py-[6px] rounded-full text-sm font-medium ${getPriorityBadgeColor(project.priority)}`}>
                {project.priority} Priority
              </span>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <Link
              href={`/project/project-list`}
              className="inline-flex items-center justify-center w-[40px] h-[40px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
              title="Back to Projects"
            >
              <i className="material-symbols-outlined">arrow_back</i>
            </Link>
          </div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mb-[25px]">
        {/* Left Column */}
        <div className="space-y-[25px]">
          {/* Basic Information */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <h5 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Basic Information
            </h5>
            <div className="space-y-[15px]">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.customer?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.category?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">No. of Phases:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.no_of_phases || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                <span className="text-black dark:text-white font-medium">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[100px] h-[6px] bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                    <span>{project.progress || 0}%</span>
                  </div>
                </span>
              </div>
            </div>
          </div>

          {/* Budget Information */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <h5 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Budget Information
            </h5>
            <div className="space-y-[15px]">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Budget Estimate:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.currency} {project.budget_estimate || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.currency || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-[25px]">
          {/* Timeline Information */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <h5 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Timeline
            </h5>
            <div className="space-y-[15px]">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="text-black dark:text-white font-medium">
                  {project.start_date && project.end_date
                    ? Math.ceil(
                        (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                      ) + " days"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <h5 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Additional Information
            </h5>
            <div className="space-y-[15px]">
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Tags:</span>
                <div className="flex flex-wrap gap-[8px]">
                  {project.tags
                    ? project.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-[10px] py-[4px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))
                    : <span className="text-gray-500 dark:text-gray-400">N/A</span>}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Description:</span>
                <p className="text-black dark:text-white text-sm">
                  {project.description || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <h5 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
          Metadata
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[15px] text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400 block">Created At:</span>
            <span className="text-black dark:text-white font-medium">
              {project.created_at ? new Date(project.created_at).toLocaleString() : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 block">Updated At:</span>
            <span className="text-black dark:text-white font-medium">
              {project.updated_at ? new Date(project.updated_at).toLocaleString() : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 block">Created By:</span>
            <span className="text-black dark:text-white font-medium">
              {project.created_by || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 block">Updated By:</span>
            <span className="text-black dark:text-white font-medium">
              {project.updated_by || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsView;
