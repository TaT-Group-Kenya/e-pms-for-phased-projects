"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";

const internalImages = process.env.NEXT_PUBLIC_EPMS_API_BASE;

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  contact_person_name: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  kra_pin: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
  updated_by: number;
  [key: string]: any;
}

const CompanySearchableReportingTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string | number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!accessToken) {
          setError('Not authenticated. Please log in.');
          setCompanies([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/companies/list?page=${currentPage}&per_page=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch companies`);
        }

        const data = await response.json();
        
        // Handle different response structures
        const companiesData = Array.isArray(data) ? data : (data.data || data.companies || []);
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching companies';
        setError(errorMessage);
        console.error('Fetch companies error:', err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage, accessToken]);

  // Filter companies based on search term
  const filteredCompanies = companies.filter(
    (company) =>
      String(company.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompanies = filteredCompanies.length;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const companiesToDisplay = filteredCompanies.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(totalCompanies / itemsPerPage);

  // Toggle company selection
  const handleSelectCompany = (companyId: string | number) => {
    const updatedSelected = new Set(selectedCompanies);
    if (updatedSelected.has(companyId)) {
      updatedSelected.delete(companyId);
    } else {
      updatedSelected.add(companyId);
    }
    setSelectedCompanies(updatedSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCompanies.size === companiesToDisplay.length) {
      setSelectedCompanies(new Set());
    } else {
      const allIds = new Set(companiesToDisplay.map((c) => c.id));
      setSelectedCompanies(allIds);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-[40px]">
        <p className="text-gray-600 dark:text-gray-400">Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-[40px]">
        <p className="text-danger-600 dark:text-danger-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-[20px] md:mb-[25px]">
        <form className="relative sm:w-[265px]">
          <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
            <i className="material-symbols-outlined !text-[20px]">search</i>
          </label>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
          />
        </form>
      </div>

      {/* Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#172036]">
              <th className="text-left py-[12px] px-[15px]">
                <input
                  type="checkbox"
                  checked={
                    companiesToDisplay.length > 0 &&
                    selectedCompanies.size === companiesToDisplay.length
                  }
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                ID
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                Company Name
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                Email
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                Phone
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                Contact Person
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                City
              </th>
              <th className="text-left py-[12px] px-[15px] text-gray-600 dark:text-gray-400 font-semibold text-sm">
                Country
              </th>
            </tr>
          </thead>
          <tbody>
            {companiesToDisplay.length > 0 ? (
              companiesToDisplay.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
                >
                  <td className="py-[12px] px-[15px]">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.has(company.id)}
                      onChange={() => handleSelectCompany(company.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-[12px] px-[15px] text-black dark:text-white text-sm">
                    {company.id}
                  </td>
                  <td className="py-[12px] px-[15px] text-black dark:text-white text-sm font-medium">
                    {company.name}
                  </td>
                  <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                    {company.email}
                  </td>
                  <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                    {company.phone}
                  </td>
                  <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                    {company.contact_person_name || "N/A"}
                  </td>
                  <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                    {company.city}
                  </td>
                  <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                    {company.country}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-[40px] text-center">
                  <p className="text-gray-600 dark:text-gray-400">No companies found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mt-[20px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {startIndex + 1} to {Math.min(endIndex, totalCompanies)} of{" "}
              {totalCompanies} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px]">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className="inline-block mx-[2px]">
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] text-center rounded-md border transition-all ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px]">
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
        </div>
      </div>
    </div>
  );
};

export default CompanySearchableReportingTable;
