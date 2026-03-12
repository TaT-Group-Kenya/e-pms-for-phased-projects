"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";

const internalImages = process.env.NEXT_PUBLIC_EPMS_API_BASE;

interface Customer {
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

const CustomerSearchableReportingTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string | number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!accessToken) {
          setError('Not authenticated. Please log in.');
          setCustomers([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/customers/list?page=${currentPage}&per_page=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch customers`);
        }

        const data = await response.json();
        
        // Handle different response structures
        const customersData = Array.isArray(data) ? data : (data.data || data.customers || []);
        setCustomers(customersData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching customers';
        setError(errorMessage);
        console.error('Fetch customers error:', err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, accessToken]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      String(customer.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = filteredCustomers.length;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const customersToDisplay = filteredCustomers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectCustomer = (id: string | number) => {
    const newSelectedCustomers = new Set(selectedCustomers);
    if (newSelectedCustomers.has(id)) {
      newSelectedCustomers.delete(id);
    } else {
      newSelectedCustomers.add(id);
    }
    setSelectedCustomers(newSelectedCustomers);
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomers.size === customersToDisplay.length) {
      setSelectedCustomers(new Set());
    } else {
      const newSelectedCustomers = new Set(customersToDisplay.map((customer) => customer.id));
      setSelectedCustomers(newSelectedCustomers);
    }
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Contact Person', 'City', 'State', 'Country', 'KRA PIN', 'Status'];
    const rows = filteredCustomers.map((customer) => [
      customer.id,
      customer.name,
      customer.email,
      customer.phone,
      customer.contact_person_name || '',
      customer.city || '',
      customer.state || '',
      customer.country || '',
      customer.kra_pin || '',
      customer.status || '',
    ]);

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
    link.setAttribute('download', `customers_${new Date().toISOString().slice(0, 10)}.csv`);
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
                placeholder="Search customer here....."
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
        </div>

        <div className="trezo-card-content">
          {loading && (
            <div className="text-center py-[40px] text-gray-500">
              <p>Loading customers...</p>
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
                          checked={selectedCustomers.size === customersToDisplay.length && customersToDisplay.length > 0}
                          onChange={handleSelectAllCustomers}
                        />
                      </div>
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Logo
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Name
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Email
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Phone
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Contact Person
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Location
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Country
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      KRA PIN
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                  {customersToDisplay.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-[40px] text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    customersToDisplay.map((customer) => (
                      <tr key={customer.id}>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="form-check relative top-[2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedCustomers.has(customer.id)}
                              onChange={() => handleSelectCustomer(customer.id)}
                            />
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.logo ? (
                            <div className="w-[40px] h-[40px] rounded-md overflow-hidden bg-gray-100 dark:bg-[#15203c]">
                              <img
                                src={internalImages + customer.logo}
                                alt={customer.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-[40px] h-[40px] rounded-md bg-gray-100 dark:bg-[#15203c] flex items-center justify-center">
                              <i className="material-symbols-outlined text-gray-400 !text-[20px]">
                                imagenotch
                              </i>
                            </div>
                          )}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span className="block font-medium">{customer.name}</span>
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.email}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.phone}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.contact_person_name || '-'}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.city ? `${customer.city}, ${customer.state || ''}` : '-'}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.country || '-'}
                        </td>

                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.kra_pin || '-'}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {customer.status ? (
                            <span
                              className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                                customer.status === "Active" || customer.status === "active"
                                  ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                                  : customer.status === "Inactive" || customer.status === "inactive"
                                  ? "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                                  : "bg-gray-50 dark:bg-[#15203c] text-gray-500"
                              }`}
                            >
                              {customer.status}
                            </span>
                          ) : (
                            '-'
                          )}
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
                Showing {startIndex + 1} to {Math.min(endIndex, totalCustomers)} of{" "}
                {totalCustomers} results
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

export default CustomerSearchableReportingTable;
