"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";

interface ProjectDetailsData {
  id: number;
  code: string;
  name: string;
  description?: string;
  customer_id?: number;
  project_category_id?: number;
  project_source_origin_id?: number;
  project_location_id?: number;
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
  source_origin?: { id: number; name: string };
  location?: { id: number; name: string };
  phases?: any[];
  order?: any;
  quotation?: any;
  customer_invoices?: any[];
  company_invoices?: any[];
  in_coming_payments?: any[];
  out_going_payments?: any[];
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
}

interface ProjectEditComponentProps {
  project: ProjectDetailsData | null;
  projectId?: string;
  onProjectDeleted?: () => void;
  onProjectUpdated?: () => void;
}

const ProjectEditComponent: React.FC<ProjectEditComponentProps> = ({
  project,
  projectId,
  onProjectDeleted,
  onProjectUpdated,
}) => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { addToast } = useToast();
  
  const [editFormData, setEditFormData] = useState<Partial<ProjectDetailsData> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [customers, setCustomers] = useState<Array<{ id: number; name: string }>>([]);
  const [projectCategories, setProjectCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [projectSources, setProjectSources] = useState<Array<{ id: number; name: string }>>([]);
  const [projectLocations, setProjectLocations] = useState<Array<{ id: number; name: string }>>([]);
  const [currencies, setCurrencies] = useState<Array<{ id: number; code: string; symbol: string; name: string }>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Auto-dismiss update message after 5 seconds
  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  // Load customers, categories, and currencies
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [
          customersRes,
          categoriesRes,
          sourcesRes,
          locationsRes,
          currenciesRes,
        ] = await Promise.all([
          fetch("/api/customers/list?per_page=1000", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
          fetch("/api/projects/categories/list?per_page=1000", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
          fetch("/api/projects/source-origins/list?per_page=1000", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
          fetch("/api/projects/locations/list?per_page=1000", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
          fetch("/api/currencies/list?per_page=100", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        const customersData = await customersRes.json();
        const categoriesData = await categoriesRes.json();
        const sourcesData = await sourcesRes.json();
        const locationsData = await locationsRes.json();
        const currenciesData = await currenciesRes.json();

        const customerList = customersData.data || customersData;
        const categoriesList = categoriesData.data || categoriesData;
        const sourcesList = sourcesData.data || sourcesData;
        const locationsList = locationsData.data || locationsData;
        const currenciesList = currenciesData.data || currenciesData;

        setCustomers(Array.isArray(customerList) ? customerList : []);
        setProjectCategories(Array.isArray(categoriesList) ? categoriesList : []);
        setProjectSources(Array.isArray(sourcesList) ? sourcesList : []);
        setProjectLocations(Array.isArray(locationsList) ? locationsList : []);
        setCurrencies(Array.isArray(currenciesList) ? currenciesList : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (accessToken) {
      fetchData();
    } else {
      setLoadingData(false);
    }

    return () => controller.abort();
  }, [accessToken]);

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setEditFormData(project);
    }
  }, [project]);

  const handleEdit = () => {
    setIsEditMode(true);
    setTags(project?.tags ? project.tags.split(',').map(tag => tag.trim()) : []);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditFormData(project);
    setTags([]);
  };

  const handleUpdateProject = async () => {
    if (!editFormData || !project) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...editFormData,
          tags: tags.join(","),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setUpdateMessage({ type: 'error', text: data.message || "Failed to update project" });
        return;
      }

      // Update local state
      const updatedProject = data.data || editFormData;
      setEditFormData(updatedProject);
      setIsEditMode(false);
      setUpdateMessage({ type: 'success', text: 'Project updated successfully' });

      // Trigger parent refresh
      onProjectUpdated?.();
    } catch (err) {
      console.error("Error updating project:", err);
      setUpdateMessage({ type: 'error', text: 'Error updating project' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        addToast(data.message || "Failed to delete project", "error");
        return;
      }

      addToast("Project deleted successfully", "success");
      onProjectDeleted?.();
      setTimeout(() => {
        router.push("/project/project-list");
      }, 1500);
    } catch (err) {
      console.error("Error deleting project:", err);
      addToast("Error deleting project", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof ProjectDetailsData, value: any) => {
    setEditFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="pt-[20px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="font-semibold text-black dark:text-white">
            Edit Project
          </h6>
          {!isEditMode && (
            <div className="flex gap-[8px]">
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit project"
                disabled={isSubmitting}
              >
                <i className="material-symbols-outlined !text-[18px]">edit</i>
              </button>
              <button
                onClick={handleDeleteProject}
                className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete project"
                disabled={isSubmitting}
              >
                <i className="material-symbols-outlined !text-[18px] text-danger-500">delete</i>
              </button>
            </div>
          )}
        </div>

        {updateMessage && (
          <div
            className={`mb-[20px] p-[15px] rounded-md flex items-center gap-[10px] animate-pulse ${
              updateMessage.type === 'success'
                ? 'bg-green-50 dark:bg-[#1a3a2a] border border-green-200 dark:border-green-900'
                : 'bg-red-50 dark:bg-[#3a1a1a] border border-red-200 dark:border-red-900'
            }`}
          >
            <i
              className={`material-symbols-outlined !text-[20px] ${
                updateMessage.type === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {updateMessage.type === 'success' ? 'check_circle' : 'error'}
            </i>
            <p
              className={`${
                updateMessage.type === 'success'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {updateMessage.text}
            </p>
          </div>
        )}

        {isEditMode && editFormData ? (
          <div className="space-y-[20px]">
            <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
              {/* Project Name */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Project Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>

              {/* Project Code */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Project Code
                </label>
                <input
                  type="text"
                  value={editFormData.code || ""}
                  readOnly
                  disabled
                  className="h-[55px] rounded-md text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#111827] px-[17px] block w-full outline-0 cursor-not-allowed"
                />
              </div>

              {/* Customer */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Customer <span className="text-danger-500">*</span>
                </label>
                <select
                  value={editFormData.customer_id || ""}
                    onChange={(e) => handleFormChange("customer_id", e.target.value ? parseInt(e.target.value) : null)}
                  disabled={loadingData}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">{loadingData ? "Loading customers..." : "Select a customer"}</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Category */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Project Category <span className="text-danger-500">*</span>
                </label>
                <select
                  value={editFormData.project_category_id || ""}
                    onChange={(e) => handleFormChange("project_category_id", e.target.value ? parseInt(e.target.value) : null)}
                  disabled={loadingData}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {projectCategories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Source */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Project Source
                </label>
                <select
                  value={editFormData.project_source_origin_id || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "project_source_origin_id",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  disabled={loadingData}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select a source (optional)</option>
                  {projectSources.map((source) => (
                    <option key={source.id} value={source.id.toString()}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Location */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Project Location
                </label>
                <select
                  value={editFormData.project_location_id || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "project_location_id",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  disabled={loadingData}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select a location (optional)</option>
                  {projectLocations.map((location) => (
                    <option key={location.id} value={location.id.toString()}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Status
                </label>
                <select
                  value={editFormData.status || ""}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer"
                >
                    <option value="">Select a status</option>
                    <option value="draft">Draft</option>
                    <option value="new">New</option>
                    <option value="progress">Progress</option>
                    <option value="complete">Complete</option>
                </select>
              </div>

              {/* Priority */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Priority <span className="text-danger-500">*</span>
                </label>
                <select
                  value={editFormData.priority || ""}
                  onChange={(e) => handleFormChange("priority", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer"
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editFormData.start_date || ""}
                  onChange={(e) => handleFormChange("start_date", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                />
              </div>

              {/* End Date */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  End Date
                </label>
                <input
                  type="date"
                  value={editFormData.end_date || ""}
                  onChange={(e) => handleFormChange("end_date", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                />
              </div>

              {/* Budget */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Budget Estimate
                </label>
                <input
                  type="number"
                  value={editFormData.budget_estimate || ""}
                  onChange={(e) => handleFormChange("budget_estimate", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="E.g. 50000"
                />
              </div>

              {/* Currency */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Currency <span className="text-danger-500">*</span>
                </label>
                <select
                  value={editFormData.currency || ""}
                  disabled
                  className="h-[55px] rounded-md text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#111827] px-[17px] block w-full outline-0 cursor-not-allowed"
                >
                  <option value="">{loadingData ? "Loading currencies..." : "Select a currency"}</option>
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.progress || ""}
                  onChange={(e) => handleFormChange("progress", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>

              {/* Number of Phases */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Number of Phases
                </label>
                <input
                  type="number"
                  min="1"
                  value={editFormData.no_of_phases || ""}
                  onChange={(e) => handleFormChange("no_of_phases", e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Description
              </label>
              <textarea
                value={editFormData.description || ""}
                onChange={(e) => handleFormChange("description", e.target.value)}
                rows={4}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter project description"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Tags
              </label>
              <div className="rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[12px] py-[8px] block w-full outline-0 transition-all focus:border-primary-500">
                <div className="flex flex-wrap gap-[8px] mb-[8px]">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="hover:text-primary-900 dark:hover:text-primary-100 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !tags.includes(value)) {
                        setTags([...tags, value]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                  className="w-full outline-0 bg-transparent text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder={tags.length === 0 ? "E.g. web, frontend, api (Press Enter to add)" : "Press Enter to add"}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px] justify-end pt-[20px]">
              <button
                onClick={handleCancel}
                className="h-[45px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] text-black dark:text-white px-[24px] font-medium transition-all hover:bg-gray-50 dark:hover:bg-[#172036] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProject}
                className="h-[45px] rounded-md bg-primary-500 text-white px-[24px] font-medium transition-all hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-[15px]">
            <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Project Name</span>
                <p className="text-black dark:text-white font-medium">{project?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Project Code</span>
                <p className="text-black dark:text-white font-medium">{project?.code || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Status</span>
                <p className="text-black dark:text-white font-medium capitalize">{project?.status || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Priority</span>
                <p className="text-black dark:text-white font-medium capitalize">{project?.priority || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Budget</span>
                <p className="text-black dark:text-white font-medium">
                  {project?.currency} {project?.budget_estimate || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Progress</span>
                <p className="text-black dark:text-white font-medium">{project?.progress || 0}%</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Source</span>
                <p className="text-black dark:text-white font-medium">{project?.source_origin?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-[5px]">Location</span>
                <p className="text-black dark:text-white font-medium">{project?.location?.name || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditComponent;
