"use client";

import React, { useMemo } from "react";

interface ProjectPhase {
  id: number;
  name: string;
  description?: string;
  status?: 'new' | 'progress' | 'draft' | 'complete';
  progress_percentage?: number;
  phase_order?: string;
  start_date?: string;
  end_date?: string;
}

interface ProjectDetailsData {
  id: number;
  name: string;
  no_of_phases?: number;
  progress?: number;
  phases?: ProjectPhase[];
}

interface ProjectPhasesProps {
  project?: ProjectDetailsData | null;
  onNavigateToPhases?: () => void;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'complete':
      return { badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', progress: 'bg-green-500' };
    case 'progress':
      return { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', progress: 'bg-blue-500' };
    case 'draft':
      return { badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', progress: 'bg-yellow-500' };
    case 'new':
      return { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300', progress: 'bg-gray-500' };
    default:
      return { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300', progress: 'bg-gray-500' };
  }
};

const getStatusLabel = (status?: string) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'New';
};

const ProjectPhases: React.FC<ProjectPhasesProps> = ({ project, onNavigateToPhases }) => {
  const phases = useMemo<ProjectPhase[]>(() => {
    return project?.phases || [];
  }, [project?.phases]);

  if (phases.length === 0) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Project Phases</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="flex flex-col items-center justify-center py-[40px] text-center">
            <i className="material-symbols-outlined text-gray-400 dark:text-gray-600 mb-[15px] !text-[48px]">
              layers
            </i>
            <p className="text-gray-600 dark:text-gray-400 mb-[20px]">
              No phases have been created yet for this project.
            </p>
            <button
              onClick={onNavigateToPhases}
              className="px-[20px] py-[10px] bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
            >
              Add Phases
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Project Phases</h5>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto without-border">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Phase Name
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Progress
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Start Date
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {phases.map((phase) => {
                  const statusColors = getStatusColor(phase.status);
                  const progressPercent = phase.progress_percentage || 0;

                  return (
                    <tr key={phase.id} className="hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <span className="font-medium">{phase.name}</span>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center gap-[8px]">
                          <div className="flex w-[60px] h-[4px] overflow-hidden rounded-md bg-gray-200 dark:bg-[#172036]">
                            <div
                              className={`flex flex-col justify-center overflow-hidden ${statusColors.progress} rounded-md`}
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm min-w-[30px]">{progressPercent}%</span>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className={`inline-flex items-center px-[8px] py-[4px] rounded-full text-xs font-medium ${statusColors.badge}`}>
                          {getStatusLabel(phase.status)}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">
                          {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectPhases;
