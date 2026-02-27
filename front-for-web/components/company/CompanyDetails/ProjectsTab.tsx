"use client";

import { useState } from "react";

interface Project {
  id: number;
  code: string;
  name: string;
  description?: string;
  customer_id: number;
  project_category_id: number;
  no_of_phases: number | string;
  start_date: string;
  end_date: string;
  budget_estimate: number | string;
  status: string;
  priority: string;
  progress: number | string;
  tags?: string;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

interface Assignment {
  id: number;
  project_id: number;
  phase_id: number;
  company_id: number;
  is_complete: boolean;
  updated_at: string;
  updated_by?: number | null;
  created_at: string;
  created_by: number;
  project: Project;
}

interface CompanyDetailsData {
  id: number;
  name: string;
  email: string;
  phone: string;
  contact_person_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  description?: string;
  kra_pin?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by?: number;
  users: any[];
  assignments: Assignment[];
  bank_accounts: any[];
  invoices: any[];
}

interface ProjectsTabProps {
  companyId: string;
  company: CompanyDetailsData;
  onRefresh: () => Promise<void>;
  accessToken: string;
}

interface ProgressUpdateForm {
  percentage_complete: string;
  comment: string;
}

interface ProgressUpdate {
  id: number;
  project_id: number;
  project_phase_id: number;
  percentage_complete: string;
  comment: string;
  created_at: string;
  created_by: number;
  updated_at?: string;
  updated_by?: number;
}

interface PaginatedResponse {
  data: ProgressUpdate[];
  current_page?: number;
  last_page?: number;
  total?: number;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  companyId,
  company,
  onRefresh,
  accessToken,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<ProgressUpdateForm>({
    percentage_complete: "",
    comment: "",
  });
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineAssignment, setTimelineAssignment] = useState<Assignment | null>(null);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [editingUpdateId, setEditingUpdateId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<{ percentage: string; comment: string }>({
    percentage: "",
    comment: "",
  });
  const [editingSaving, setEditingSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (text: string, type: 'success' | 'error' = 'success', duration = 3000) => {
    setToastMessage({ type, text });
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

  const filterData = (data: Assignment[], term: string) => {
    if (!term) return data;
    return data.filter((item) =>
      [item.project.code, item.project.name].some((field) =>
        String(field || "").toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const filteredAssignments = filterData(company.assignments, searchTerm);

  const handleOpenModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({ percentage_complete: "", comment: "" });
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setFormData({ percentage_complete: "", comment: "" });
    setError("");
    setSuccessMessage("");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;
    
    if (!formData.percentage_complete || !formData.comment.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const percentage = parseFloat(formData.percentage_complete);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setError("Percentage must be a number between 0 and 100");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        project_id: selectedAssignment.project_id,
        project_phase_id: selectedAssignment.phase_id,
        percentage_complete: formData.percentage_complete,
        comment: formData.comment,
      };

      const response = await fetch("/api/project-progress-updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save progress update");
      }

      setSuccessMessage("Progress update saved successfully!");
      setTimeout(() => {
        handleCloseModal();
        onRefresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTimelineModal = async (assignment: Assignment) => {
    setTimelineAssignment(assignment);
    setProgressUpdates([]);
    setEditingUpdateId(null);
    setTimelineLoading(true);
    setShowTimelineModal(true);

    try {
      const response = await fetch(
        `/api/project-progress-updates?project_id=${assignment.project_id}&project_phase_id=${assignment.phase_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch progress updates");
      }

      const data: PaginatedResponse = await response.json();
      const updates = Array.isArray(data.data) ? data.data : [];
      // Sort by created_at descending (latest first)
      updates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setProgressUpdates(updates);
    } catch (err) {
      console.error("Error fetching updates:", err);
      setProgressUpdates([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleCloseTimelineModal = () => {
    setShowTimelineModal(false);
    setTimelineAssignment(null);
    setProgressUpdates([]);
    setEditingUpdateId(null);
  };

  const handleStartEdit = (update: ProgressUpdate) => {
    setEditingUpdateId(update.id);
    setEditingData({
      percentage: update.percentage_complete,
      comment: update.comment,
    });
  };

  const handleEditChange = (field: "percentage" | "comment", value: string) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (updateId: number) => {
    if (!editingData.percentage || !editingData.comment.trim()) {
      showToastMessage("Please fill in all fields", "error");
      return;
    }

    const percentage = parseFloat(editingData.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      showToastMessage("Percentage must be between 0 and 100", "error");
      return;
    }

    setEditingSaving(true);
    try {
      const response = await fetch(`/api/project-progress-updates/${updateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          percentage_complete: editingData.percentage,
          comment: editingData.comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update progress");
      }

      // Update the local state
      setProgressUpdates((prev) =>
        prev.map((u) =>
          u.id === updateId
            ? {
                ...u,
                percentage_complete: editingData.percentage,
                comment: editingData.comment,
                updated_at: new Date().toISOString(),
              }
            : u
        )
      );
      showToastMessage("Progress update saved successfully!", "success");
      setEditingUpdateId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save update";
      showToastMessage(errorMessage, "error");
    } finally {
      setEditingSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUpdateId(null);
    setEditingData({ percentage: "", comment: "" });
  };

  return (
    <div>
      <h6 className="font-semibold text-black dark:text-white mb-[15px]">
        Projects
      </h6>
      {company.assignments.length === 0 ? (
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">
            There are no projects yet, when there are, they will be shown here
          </p>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#0c1427] text-black dark:text-white"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Phase
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Budget
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Complete
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">{assignment.project.code}</td>
                    <td className="py-3 px-4">{assignment.project.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Phase {assignment.phase_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                        {assignment.project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {assignment.project.currency}{" "}
                      {Number(assignment.project.budget_estimate).toLocaleString() ||
                        "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Number(assignment.project.progress)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs">
                        {parseFloat(String(assignment.project.progress)).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assignment.is_complete
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {assignment.is_complete ? "Complete" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(assignment)}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded transition-colors"
                        >
                          Add Update
                        </button>
                        <button
                          onClick={() => handleOpenTimelineModal(assignment)}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded transition-colors"
                        >
                          View Timeline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0c1427] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Add Progress Update
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {selectedAssignment && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Project:</strong> {selectedAssignment.project.code} - {selectedAssignment.project.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Phase:</strong> Phase {selectedAssignment.phase_id}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmitProgress} className="space-y-4">
                {/* Percentage Complete */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Percentage Complete (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    name="percentage_complete"
                    value={formData.percentage_complete}
                    onChange={handleFormChange}
                    placeholder="e.g., 75"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1a2847] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comment/Notes
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleFormChange}
                    placeholder="Add any notes about the progress..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1a2847] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Saving...
                      </>
                    ) : (
                      "Save Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && toastMessage && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-[60] transition-opacity duration-300 ${
          toastMessage.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {toastMessage.type === 'success' ? (
            <span className="text-xl">✓</span>
          ) : (
            <span className="text-xl">✕</span>
          )}
          <span className="font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Timeline Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0c1427] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Progress Updates Timeline
                </h3>
                {timelineAssignment && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {timelineAssignment.project.code} - Phase {timelineAssignment.phase_id}
                  </p>
                )}
              </div>
              <button
                onClick={handleCloseTimelineModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Timeline Content */}
            <div className="px-6 py-6">
              {timelineLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block mb-3">
                      <span className="text-3xl animate-spin">⏳</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Loading updates...</p>
                  </div>
                </div>
              ) : progressUpdates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No progress updates yet for this phase.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Add your first update to get started.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <span className="block absolute top-0 bottom-0 ltr:left-[19px] rtl:right-[19px] w-0.5 bg-gradient-to-b from-blue-400 to-purple-400 dark:from-blue-500 dark:to-purple-600"></span>

                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {progressUpdates.map((update, index) => (
                      <div key={update.id} className="relative ltr:pl-[60px] rtl:pr-[60px]">
                        {/* Timeline Dot */}
                        <span className="block absolute top-1 ltr:left-0 rtl:right-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-white dark:border-[#0c1427] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        </span>

                        {/* Update Card */}
                        <div className={`rounded-lg border p-4 ${
                          editingUpdateId === update.id
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                            : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700"
                        }`}>
                          {editingUpdateId === update.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                              {/* Editable Percentage */}
                              <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                  Progress (%)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={editingData.percentage}
                                  onChange={(e) => handleEditChange("percentage", e.target.value)}
                                  className="w-full px-2 py-1.5 text-sm border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-[#1a2847] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Editable Comment */}
                              <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                  Comment
                                </label>
                                <textarea
                                  value={editingData.comment}
                                  onChange={(e) => handleEditChange("comment", e.target.value)}
                                  rows={3}
                                  className="w-full px-2 py-1.5 text-sm border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-[#1a2847] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                              </div>

                              {/* Edit Action Buttons */}
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => handleSaveEdit(update.id)}
                                  disabled={editingSaving}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded transition-colors disabled:opacity-50"
                                >
                                  {editingSaving ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={editingSaving}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              {/* Progress Indicator */}
                              <div className="flex items-end justify-between mb-3">
                                <div>
                                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    {update.percentage_complete}%
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {new Date(update.created_at).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                                {update.percentage_complete === '100' && (
                                  <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold rounded-full">
                                    ✓ Complete
                                  </span>
                                )}
                              </div>

                              {/* Comment */}
                              {update.comment && (
                                <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                                    {update.comment}
                                  </p>
                                </div>
                              )}

                              {/* Update Info and Edit Button */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {update.updated_at && update.updated_at !== update.created_at ? (
                                    <>Updated {new Date(update.updated_at).toLocaleDateString()}</>
                                  ) : (
                                    <>Created {new Date(update.created_at).toLocaleDateString()}</>
                                  )}
                                </p>
                                <button
                                  onClick={() => handleStartEdit(update)}
                                  title="Edit this update"
                                  className="px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                >
                                  ✎
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {progressUpdates.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Updates</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {progressUpdates[0]?.percentage_complete || '0'}%
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Latest Progress</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {Math.round(
                            progressUpdates.reduce((sum, u) => sum + parseFloat(u.percentage_complete), 0) /
                            progressUpdates.length
                          )}%
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Average Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
