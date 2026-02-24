"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";

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

interface ProjectPhasesComponentProps {
  projectId: string;
  initialPhases?: ProjectPhase[];
}

const ProjectPhasesComponent: React.FC<ProjectPhasesComponentProps> = ({ projectId, initialPhases }) => {
  const accessToken = useSelector(selectAccessToken);
  const { addToast } = useToast();

  const [phases, setPhases] = useState<ProjectPhase[]>(initialPhases || []);
  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [isEditPhaseModalOpen, setIsEditPhaseModalOpen] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [deletePhaseId, setDeletePhaseId] = useState<number | null>(null);
  const [isPhaseSubmitting, setIsPhaseSubmitting] = useState(false);
  const [phaseError, setPhaseError] = useState<string>("");
  const [editPhaseError, setEditPhaseError] = useState<string>("");
  const [phaseFormData, setPhaseFormData] = useState<Partial<ProjectPhase>>({
    status: 'new',
    progress_percentage: 0,
  });

  useEffect(() => {
    if (initialPhases && initialPhases.length > 0) {
      setPhases(initialPhases);
      return;
    }
  }, [initialPhases]);

  const handlePhaseFormChange = (field: keyof ProjectPhase, value: any) => {
    setPhaseFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhase = async () => {
    setPhaseError("");

    if (!projectId || !phaseFormData.name || !phaseFormData.phase_order) {
      setPhaseError("Please fill in all required fields");
      addToast("Please fill in all required fields", "error");
      return;
    }

    setIsPhaseSubmitting(true);
    try {
      const response = await fetch(`/api/projects/phases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          project_id: parseInt(projectId),
          name: phaseFormData.name,
          description: phaseFormData.description || null,
          phase_order: phaseFormData.phase_order,
          status: phaseFormData.status || "new",
          start_date: phaseFormData.start_date || null,
          end_date: phaseFormData.end_date || null,
          progress_percentage: phaseFormData.progress_percentage?.toString() || "0",
          quote_item_id: phaseFormData.quote_item_id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to add phase";
        setPhaseError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      setPhases([...phases, data.data || data]);
      setIsAddPhaseModalOpen(false);
      setPhaseFormData({ status: 'new', progress_percentage: 0 });
      setPhaseError("");
      addToast("Phase added successfully", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error adding phase";
      setPhaseError(errorMsg);
      console.error("Error adding phase:", err);
      addToast(errorMsg, "error");
    } finally {
      setIsPhaseSubmitting(false);
    }
  };

  const handleDeletePhase = async (phaseId: number) => {
    setIsPhaseSubmitting(true);
    try {
      const response = await fetch(`/api/projects/phases`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          project_id: parseInt(projectId || "0"),
          phase_id: phaseId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        addToast(data.error || data.message || "Failed to delete phase", "error");
        return;
      }

      setPhases(phases.filter(p => p.id !== phaseId));
      setDeletePhaseId(null);
      addToast("Phase deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting phase:", err);
      addToast("Error deleting phase", "error");
    } finally {
      setIsPhaseSubmitting(false);
    }
  };

  const handleEditPhase = (phase: ProjectPhase) => {
    setEditingPhaseId(phase.id);
    setPhaseFormData(phase);
    setIsEditPhaseModalOpen(true);
  };

  const handleUpdatePhase = async () => {
    setEditPhaseError("");

    if (!editingPhaseId || !phaseFormData.name || !phaseFormData.phase_order) {
      setEditPhaseError("Please fill in all required fields");
      addToast("Please fill in all required fields", "error");
      return;
    }

    setIsPhaseSubmitting(true);
    try {
      const response = await fetch(`/api/projects/phases`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          project_id: parseInt(projectId),
          phase_id: editingPhaseId,
          name: phaseFormData.name,
          description: phaseFormData.description || null,
          phase_order: phaseFormData.phase_order,
          status: phaseFormData.status || "new",
          start_date: phaseFormData.start_date || null,
          end_date: phaseFormData.end_date || null,
          progress_percentage: phaseFormData.progress_percentage?.toString() || "0",
          quote_item_id: phaseFormData.quote_item_id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to update phase";
        setEditPhaseError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      setPhases(phases.map(p => p.id === editingPhaseId ? (data.data || data) : p));
      setIsEditPhaseModalOpen(false);
      setEditingPhaseId(null);
      setPhaseFormData({ status: 'new', progress_percentage: 0 });
      setEditPhaseError("");
      addToast("Phase updated successfully", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error updating phase";
      setEditPhaseError(errorMsg);
      console.error("Error updating phase:", err);
      addToast(errorMsg, "error");
    } finally {
      setIsPhaseSubmitting(false);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="pt-[20px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="font-semibold text-black dark:text-white">
            Project Phases
          </h6>
          <button
            onClick={() => setIsAddPhaseModalOpen(true)}
            className="inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium"
          >
            <i className="material-symbols-outlined !text-[18px]">add</i>
            Add Phase
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#172036]">
                <th className="px-[15px] py-[12px] text-left text-black dark:text-white font-semibold text-sm"></th>
                <th className="px-[15px] py-[12px] text-left text-black dark:text-white font-semibold text-sm">Phase Name</th>
                <th className="px-[15px] py-[12px] text-left text-black dark:text-white font-semibold text-sm">Status</th>
                <th className="px-[15px] py-[12px] text-left text-black dark:text-white font-semibold text-sm">Progress</th>
                <th className="px-[15px] py-[12px] text-left text-black dark:text-white font-semibold text-sm">Start Date</th>
                <th className="px-[15px] py-[12px] text-left text-black dark:text-white font-semibold text-sm">End Date</th>
              </tr>
            </thead>
            <tbody>
              {phases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-[15px] py-[20px] text-center text-gray-600 dark:text-gray-400">
                    No phases added yet
                  </td>
                </tr>
              ) : (
                phases.map((phase) => (
                  <tr key={phase.id} className="border-b border-gray-100 dark:border-[#0f1621] hover:bg-gray-50 dark:hover:bg-[#131f32]">
                    <td className="px-[15px] py-[15px]">
                      <div className="flex gap-[8px]">
                        <button
                          onClick={() => handleEditPhase(phase)}
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all"
                          title="Edit phase"
                        >
                          <i className="material-symbols-outlined !text-[16px]">edit</i>
                        </button>
                        <button
                          onClick={() => setDeletePhaseId(phase.id)}
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all"
                          title="Delete phase"
                        >
                          <i className="material-symbols-outlined !text-[16px]">delete</i>
                        </button>
                      </div>
                    </td>
                    <td className="px-[15px] py-[15px] text-black dark:text-white font-medium">{phase.name}</td>
                    <td className="px-[15px] py-[15px]">
                      <span className={`inline-flex items-center px-[8px] py-[4px] rounded-full text-xs font-medium capitalize ${
                        phase.status === 'complete' ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300' :
                        phase.status === 'progress' ? 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300' :
                        phase.status === 'draft' ? 'bg-info-100 dark:bg-info-900 text-info-700 dark:text-info-300' :
                        'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      }`}>
                        {phase.status}
                      </span>
                    </td>
                    <td className="px-[15px] py-[15px]">
                      <div className="flex items-center gap-[8px]">
                        <div className="flex-1 w-[60px] h-[6px] rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                          <div className="h-full bg-primary-500" style={{ width: `${phase.progress_percentage}%` }}></div>
                        </div>
                        <span className="text-sm text-black dark:text-white font-medium">{phase.progress_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-[15px] py-[15px] text-black dark:text-white">{phase.start_date ? new Date(phase.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-[15px] py-[15px] text-black dark:text-white">{phase.end_date ? new Date(phase.end_date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Phase Modal */}
        {isAddPhaseModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-[20px]">
                <h6 className="font-semibold text-black dark:text-white">Add Project Phase</h6>
                {isPhaseSubmitting && (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {phaseError && (
                <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                  <div className="flex gap-[10px]">
                    <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                    <div>
                      <p className="text-sm font-medium text-danger-700 dark:text-danger-400">{phaseError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-[20px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Phase Name <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phaseFormData.name || ""}
                    onChange={(e) => handlePhaseFormChange("name", e.target.value)}
                    disabled={isPhaseSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="E.g. Design Phase"
                  />
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Description
                  </label>
                  <textarea
                    value={phaseFormData.description || ""}
                    onChange={(e) => handlePhaseFormChange("description", e.target.value)}
                    disabled={isPhaseSubmitting}
                    className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Phase description"
                    rows={3}
                  />
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Phase Order <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phaseFormData.phase_order || ""}
                      onChange={(e) => handlePhaseFormChange("phase_order", e.target.value)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="E.g. Phase 1"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Status <span className="text-danger-500">*</span>
                    </label>
                    <select
                      value={phaseFormData.status || "new"}
                      onChange={(e) => handlePhaseFormChange("status", e.target.value as any)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="draft">Draft</option>
                        <option value="new">New</option>
                        <option value="progress">Progress</option>
                        <option value="complete">Complete</option>
                    </select>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={phaseFormData.start_date || ""}
                      onChange={(e) => handlePhaseFormChange("start_date", e.target.value)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={phaseFormData.end_date || ""}
                      onChange={(e) => handlePhaseFormChange("end_date", e.target.value)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Progress Percentage <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={phaseFormData.progress_percentage || ""}
                    onChange={(e) => handlePhaseFormChange("progress_percentage", parseInt(e.target.value) || 0)}
                    disabled={isPhaseSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0-100"
                  />
                </div>
              </div>

              <div className="flex gap-[10px] justify-end mt-[25px] pt-[20px] border-t border-gray-200 dark:border-[#172036]">
                <button
                  onClick={() => {
                    setIsAddPhaseModalOpen(false);
                    setPhaseFormData({ status: 'new', progress_percentage: 0 });
                    setPhaseError("");
                  }}
                  className="px-[20px] py-[10px] rounded-md border border-gray-200 dark:border-[#172036] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#172036] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPhaseSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPhase}
                  className="px-[20px] py-[10px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-[8px]"
                  disabled={isPhaseSubmitting}
                >
                  {isPhaseSubmitting ? (
                    <>
                      <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Phase"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Phase Modal */}
        {isEditPhaseModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-[20px]">
                <h6 className="font-semibold text-black dark:text-white">Edit Project Phase</h6>
                {isPhaseSubmitting && (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {editPhaseError && (
                <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                  <div className="flex gap-[10px]">
                    <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                    <div>
                      <p className="text-sm font-medium text-danger-700 dark:text-danger-400">{editPhaseError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-[20px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Phase Name <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phaseFormData.name || ""}
                    onChange={(e) => handlePhaseFormChange("name", e.target.value)}
                    disabled={isPhaseSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="E.g. Design Phase"
                  />
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Description
                  </label>
                  <textarea
                    value={phaseFormData.description || ""}
                    onChange={(e) => handlePhaseFormChange("description", e.target.value)}
                    disabled={isPhaseSubmitting}
                    className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Phase description"
                    rows={3}
                  />
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Phase Order <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phaseFormData.phase_order || ""}
                      onChange={(e) => handlePhaseFormChange("phase_order", e.target.value)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="E.g. Phase 1"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Status <span className="text-danger-500">*</span>
                    </label>
                    <select
                      value={phaseFormData.status || "new"}
                      onChange={(e) => handlePhaseFormChange("status", e.target.value as any)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="draft">Draft</option>
                        <option value="new">New</option>
                        <option value="progress">Progress</option>
                        <option value="complete">Complete</option>
                    </select>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={phaseFormData.start_date || ""}
                      onChange={(e) => handlePhaseFormChange("start_date", e.target.value)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={phaseFormData.end_date || ""}
                      onChange={(e) => handlePhaseFormChange("end_date", e.target.value)}
                      disabled={isPhaseSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Progress Percentage <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={phaseFormData.progress_percentage || ""}
                    onChange={(e) => handlePhaseFormChange("progress_percentage", parseInt(e.target.value) || 0)}
                    disabled={isPhaseSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0-100"
                  />
                </div>
              </div>

              <div className="flex gap-[10px] justify-end mt-[25px] pt-[20px] border-t border-gray-200 dark:border-[#172036]">
                <button
                  onClick={() => {
                    setIsEditPhaseModalOpen(false);
                    setEditingPhaseId(null);
                    setPhaseFormData({ status: 'new', progress_percentage: 0 });
                    setEditPhaseError("");
                  }}
                  className="px-[20px] py-[10px] rounded-md border border-gray-200 dark:border-[#172036] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#172036] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPhaseSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePhase}
                  className="px-[20px] py-[10px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-[8px]"
                  disabled={isPhaseSubmitting}
                >
                  {isPhaseSubmitting ? (
                    <>
                      <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Phase"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Phase Confirmation Modal */}
        {deletePhaseId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] max-w-[400px] w-[90%]">
              <h6 className="font-semibold text-black dark:text-white mb-[15px]">Delete Phase</h6>
              <p className="text-gray-600 dark:text-gray-400 mb-[25px]">
                Are you sure you want to delete this phase? This action cannot be undone.
              </p>
              <div className="flex gap-[10px] justify-end">
                <button
                  onClick={() => setDeletePhaseId(null)}
                  className="px-[20px] py-[10px] rounded-md border border-gray-200 dark:border-[#172036] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#172036] transition-all font-medium"
                  disabled={isPhaseSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePhase(deletePhaseId!)}
                  className="px-[20px] py-[10px] rounded-md bg-danger-500 text-white hover:bg-danger-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPhaseSubmitting}
                >
                  {isPhaseSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPhasesComponent;
