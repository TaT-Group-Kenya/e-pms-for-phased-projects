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

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  companyId,
  company,
  onRefresh,
  accessToken,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filterData = (data: Assignment[], term: string) => {
    if (!term) return data;
    return data.filter((item) =>
      [item.project.code, item.project.name].some((field) =>
        String(field || "").toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const filteredAssignments = filterData(company.assignments, searchTerm);

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
                        {assignment.project.progress}%
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
