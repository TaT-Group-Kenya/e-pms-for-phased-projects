"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";

interface Project {
  id: number;
  code: string;
  name: string;
  description: string;
  customer_id: number;
  project_category_id: number;
  no_of_phases: string;
  start_date: string;
  end_date: string;
  budget_estimate: string;
  status: string;
  priority: string;
  progress: string;
  tags: string;
  currency: string;
  updated_at: string;
  updated_by: number;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  [key: string]: any;
}

interface ProjectCategory {
  id: number;
  name: string;
  [key: string]: any;
}

const ProjectSearchableReportingTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]); // State to hold projects
  const [selectedProjects, setSelectedProjects] = useState<Set<string | number>>(new Set()); // Track selected projects
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter
  const [customerFilter, setCustomerFilter] = useState(""); // Customer filter
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [customers, setCustomers] = useState<Customer[]>([]); // Load customers from API
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]); // Load categories from API
  const [filterLoadingData, setFilterLoadingData] = useState(true); // Loading state for filters
  const itemsPerPage = 10;

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!accessToken) {
          setError('Not authenticated. Please log in.');
          setProjects([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/projects/list?page=${currentPage}&per_page=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch projects`);
        }

        const data = await response.json();
        
        // Handle different response structures (data might be in data.projects or data.data)
        const projectsData = Array.isArray(data) ? data : (data.data || data.projects || []);
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching projects';
        setError(errorMessage);
        console.error('Fetch projects error:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, accessToken]);

  // Load customers and project categories for filters
  useEffect(() => {
    const controller = new AbortController();

    const fetchFilterData = async () => {
      try {
        setFilterLoadingData(true);

        if (!accessToken) {
          setCustomers([]);
          setProjectCategories([]);
          setFilterLoadingData(false);
          return;
        }

        const [customersRes, categoriesRes] = await Promise.all([
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
        ]);

        if (controller.signal.aborted) return;

        const customersData = await customersRes.json();
        const categoriesData = await categoriesRes.json();

        const customerList = customersData.data || customersData;
        const categoriesList = categoriesData.data || categoriesData;
        
        setCustomers(Array.isArray(customerList) ? customerList : []);
        setProjectCategories(Array.isArray(categoriesList) ? categoriesList : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching filter data:", err);
        setCustomers([]);
        setProjectCategories([]);
      } finally {
        setFilterLoadingData(false);
      }
    };

    if (accessToken) {
      fetchFilterData();
    }

    return () => controller.abort();
  }, [accessToken]);

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(
    (project) =>
      (String(project.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "" || project.project_category_id === parseInt(categoryFilter)) &&
      (customerFilter === "" || project.customer_id === parseInt(customerFilter)) &&
      (statusFilter === "" || project.status === statusFilter)
  );

  const totalProjects = filteredProjects.length;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const projectsToDisplay = filteredProjects.slice(startIndex, endIndex);

  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectProject = (id: string | number) => {
    const newSelectedProjects = new Set(selectedProjects);
    if (newSelectedProjects.has(id)) {
      newSelectedProjects.delete(id); // Deselect the project
    } else {
      newSelectedProjects.add(id); // Select the project
    }
    setSelectedProjects(newSelectedProjects);
  };

  const handleSelectAllProjects = () => {
    if (selectedProjects.size === projectsToDisplay.length) {
      setSelectedProjects(new Set()); // Deselect all projects
    } else {
      const newSelectedProjects = new Set(projectsToDisplay.map((project) => project.id));
      setSelectedProjects(newSelectedProjects); // Select all projects
    }
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['ID', 'Code', 'Project Name', 'Description', 'Customer', 'Category', 'Timeline', 'Budget', 'Status', 'Priority', 'Progress', 'Tags'];
    const rows = filteredProjects.map((project) => {
      const customer = customers.find((c) => c.id === project.customer_id);
      const category = projectCategories.find((cat) => cat.id === project.project_category_id);
      return [
        project.id,
        project.code,
        project.name,
        project.description || '',
        customer?.name || '',
        category?.name || '',
        `${project.start_date || ''} to ${project.end_date || ''}`,
        `${project.budget_estimate} ${project.currency}`,
        project.status || '',
        project.priority || '',
        project.progress || '',
        project.tags || '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if cell contains comma, quote, or newline
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `projects_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title mb-[15px] flex items-center justify-between gap-[15px]">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search project here....."
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#15203c] transition-all font-medium text-sm whitespace-nowrap"
            >
              <i className="material-symbols-outlined !text-[18px]">download</i>
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[15px]">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-[6px]">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={filterLoadingData}
                className="w-full px-[12px] py-[8px] text-xs rounded-md border border-gray-50 bg-gray-50 text-black dark:bg-[#15203c] dark:border-[#15203c] dark:text-white outline-0 transition-all disabled:opacity-50 cursor-pointer"
              >
                <option value="">{filterLoadingData ? "Loading categories..." : "All Categories"}</option>
                {projectCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-[6px]">
                Customer
              </label>
              <select
                value={customerFilter}
                onChange={(e) => {
                  setCustomerFilter(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={filterLoadingData}
                className="w-full px-[12px] py-[8px] text-xs rounded-md border border-gray-50 bg-gray-50 text-black dark:bg-[#15203c] dark:border-[#15203c] dark:text-white outline-0 transition-all disabled:opacity-50 cursor-pointer"
              >
                <option value="">{filterLoadingData ? "Loading customers..." : "All Customers"}</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-[6px]">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-[12px] py-[8px] text-xs rounded-md border border-gray-50 bg-gray-50 text-black dark:bg-[#15203c] dark:border-[#15203c] dark:text-white outline-0 transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="new">New</option>
                <option value="progress">Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          {loading && (
            <div className="text-center py-[40px] text-gray-500">
              <p>Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-[40px] text-danger-500">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      <div className="form-check relative top-[2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedProjects.size === projectsToDisplay.length && projectsToDisplay.length > 0}
                          onChange={handleSelectAllProjects}
                        />
                      </div>
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Code
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Project Name
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Timeline
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Budget
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Priority
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Progress
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Tags
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                  {projectsToDisplay.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-[40px] text-gray-500">
                        No projects found
                      </td>
                    </tr>
                  ) : (
                    projectsToDisplay.map((project) => (
                      <tr key={project.id}>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="form-check relative top-[2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedProjects.has(project.id)}
                              onChange={() => handleSelectProject(project.id)}
                            />
                          </div>
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span className="font-medium">{project.code}</span>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span className="block font-medium">{project.name}</span>
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {project.start_date && project.end_date
                            ? `${project.start_date} to ${project.end_date}`
                            : '-'}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {project.budget_estimate} {project.currency}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span
                            className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs ${
                              project.priority === "High"
                                ? "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                                : project.priority === "Medium"
                                ? "bg-warning-50 dark:bg-[#15203c] text-warning-500"
                                : "bg-success-50 dark:bg-[#15203c] text-success-500"
                            }`}
                          >
                            {project.priority}
                          </span>
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex items-center gap-2">
                            <div className="w-[100px] bg-gray-200 dark:bg-[#172036] rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full transition-all"
                                style={{ width: `${parseInt(project.progress) || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{project.progress}%</span>
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span
                            className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                              project.status === "Active" || project.status === "active"
                                ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                                : project.status === "Completed" || project.status === "completed"
                                ? "bg-success-50 dark:bg-[#15203c] text-success-500"
                                : project.status === "On Hold" || project.status === "on_hold"
                                ? "bg-warning-50 dark:bg-[#15203c] text-warning-500"
                                : "bg-gray-50 dark:bg-[#15203c] text-gray-500"
                            } rounded-sm font-medium text-xs`}
                          >
                            {project.status || 'Unknown'}
                          </span>
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex flex-wrap gap-1">
                            {project.tags
                              ? project.tags.split(',').map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-[6px] py-[2px] bg-gray-100 dark:bg-[#15203c] text-gray-700 dark:text-gray-300 rounded text-xs"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))
                              : '-'}
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex items-center gap-[9px]">
                            <div className="relative group">
                              <button
                                type="button"
                                className="text-primary-500 leading-none"
                              >
                                <i className="material-symbols-outlined !text-md">
                                  visibility
                                </i>
                              </button>

                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                View
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
              <p className="!mb-0 !text-sm">
                Showing {startIndex + 1} to {Math.min(endIndex, totalProjects)} of{" "}
                {totalProjects} results
              </p>

              <ol className="mt-[10px] sm:mt-0">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  >
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                        currentPage === index + 1
                          ? "border-primary-500 bg-primary-500 text-white"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_right
                    </i>
                  </button>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectSearchableReportingTable;
