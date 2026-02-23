"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";

interface Project {
  id: string;
  name: string;
  status: string;
  budget: string;
  startDate: string;
  endDate: string;
}

interface Quotation {
  id: string;
  quotationNo: string;
  amount: string;
  status: string;
  date: string;
  validUntil: string;
}

interface Order {
  id: string;
  orderNo: string;
  amount: string;
  status: string;
  date: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  amount: string;
  status: string;
  date: string;
  dueDate: string;
}

interface CustomerDetailsData {
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
}

interface TableSearchableProps {
  data: any[];
  columns: { key: string; label: string }[];
}

const TableSearchable: React.FC<TableSearchableProps> = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      String(item[col.key])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      {/* Search */}
      <div className="mb-[20px] md:mb-[25px]">
        <form className="relative sm:w-[265px]">
          <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
            <i className="material-symbols-outlined !text-[20px]">search</i>
          </label>
          <input
            type="text"
            placeholder="Search here....."
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
      <div className="table-responsive overflow-x-auto">
        <table className="w-full">
          <thead className="text-black dark:text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {displayData.length > 0 ? (
              displayData.map((item, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]"
                    >
                      {item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-[20px] py-[30px] text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex gap-[5px]">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50"
            >
              <i className="material-symbols-outlined">chevron_left</i>
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-[31px] h-[31px] flex items-center justify-center rounded-md border transition-all ${
                  currentPage === i + 1
                    ? "bg-primary-500 text-white border-primary-500"
                    : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50"
            >
              <i className="material-symbols-outlined">chevron_right</i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface CustomerDetailsViewProps {
  customerId: string;
}

const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({
  customerId,
}) => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [customer, setCustomer] = useState<CustomerDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<CustomerDetailsData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Array<{ id: number; code: string; name: string }>>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-dismiss update message after 5 seconds
  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  // Sample data for tables
  const sampleProjects: Project[] = [
    {
      id: "1",
      name: "Website Redesign",
      status: "In Progress",
      budget: "$50,000",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
    },
    {
      id: "2",
      name: "Mobile App Development",
      status: "Completed",
      budget: "$75,000",
      startDate: "2023-06-01",
      endDate: "2023-12-15",
    },
  ];

  const sampleQuotations: Quotation[] = [
    {
      id: "1",
      quotationNo: "QT-001",
      amount: "$25,000",
      status: "Approved",
      date: "2024-01-10",
      validUntil: "2024-02-10",
    },
    {
      id: "2",
      quotationNo: "QT-002",
      amount: "$15,500",
      status: "Pending",
      date: "2024-02-01",
      validUntil: "2024-03-01",
    },
  ];

  const sampleOrders: Order[] = [
    {
      id: "1",
      orderNo: "ORD-001",
      amount: "$25,000",
      status: "Shipped",
      date: "2024-01-20",
    },
    {
      id: "2",
      orderNo: "ORD-002",
      amount: "$15,500",
      status: "Processing",
      date: "2024-02-05",
    },
  ];

  const sampleInvoices: Invoice[] = [
    {
      id: "1",
      invoiceNo: "INV-001",
      amount: "$25,000",
      status: "Paid",
      date: "2024-01-20",
      dueDate: "2024-02-20",
    },
    {
      id: "2",
      invoiceNo: "INV-002",
      amount: "$15,500",
      status: "Pending",
      date: "2024-02-10",
      dueDate: "2024-03-10",
    },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          const countryList = data.data || data;
          setCountries(Array.isArray(countryList) ? countryList : []);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };

    if (accessToken) {
      fetchCountries();
    } else {
      setLoadingCountries(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load customer");
        }

        const data = await response.json();
        const customerData = data.data || data;
        setCustomer(customerData);
        setEditFormData(customerData);
      } catch (err) {
        console.error("Error fetching customer:", err);
        addToast("Error loading customer details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && customerId) {
      fetchCustomer();
    }
  }, [customerId, accessToken, addToast]);

  if (loading) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">Customer not found</p>
        </div>
      </div>
    );
  }

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditFormData(customer);
    setLogoPreview(null);
    setSelectedLogo(null);
  };

  const handleUpdateCustomer = async () => {
    if (!editFormData || !customer) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editFormData.name || "");
      formData.append("email", editFormData.email || "");
      formData.append("phone", editFormData.phone || "");
      formData.append("address", editFormData.address || "");
      formData.append("city", editFormData.city || "");
      formData.append("country", editFormData.country || "");
      
      if (editFormData.description) formData.append("description", editFormData.description);
      if (editFormData.contact_person_name) formData.append("contact_person_name", editFormData.contact_person_name);
      if (editFormData.state) formData.append("state", editFormData.state);
      if (editFormData.kra_pin) formData.append("kra_pin", editFormData.kra_pin);
      
      if (selectedLogo) {
        const ext = selectedLogo.name.split('.').pop()?.toLowerCase() || 'png';
        const filename = `${Date.now()}.${ext}`;
        const normalizedFile = new File([selectedLogo], filename, { type: selectedLogo.type });
        formData.append("logo", normalizedFile);
      }

      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUpdateMessage({ type: 'error', text: data.message || "Failed to update customer" });
        return;
      }

      setCustomer(data.data || editFormData);
      setIsEditMode(false);
      setLogoPreview(null);
      setSelectedLogo(null);
      setUpdateMessage({ type: 'success', text: 'Customer updated successfully' });
    } catch (err) {
      console.error("Error updating customer:", err);
      setUpdateMessage({ type: 'error', text: 'Error updating customer' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        addToast(data.message || "Failed to delete customer", "error");
        return;
      }

      addToast("Customer deleted successfully", "success");
      setTimeout(() => {
        router.push("/customer/customer-list");
      }, 1500);
    } catch (err) {
      console.error("Error deleting customer:", err);
      addToast("Error deleting customer", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof CustomerDetailsData, value: any) => {
    setEditFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        addToast("Logo must be an image file", "error");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast("Logo must be less than 5MB", "error");
        e.target.value = "";
        return;
      }

      setSelectedLogo(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-content">
        {/* Tabs Navigation */}
        <div className="trezo-tabs mb-[20px] md:mb-[25px]">
          <ul className="navs border-b border-gray-100 dark:border-[#172036]">
            <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
              <button
                type="button"
                onClick={() => handleTabClick(0)}
                className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium ${
                  activeTab === 0
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-[20px]">info</i>
                Customer Info
              </button>
            </li>

            <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
              <button
                type="button"
                onClick={() => handleTabClick(1)}
                className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium ${
                  activeTab === 1
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-[20px]">
                  assignment
                </i>
                Projects
              </button>
            </li>

            <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
              <button
                type="button"
                onClick={() => handleTabClick(2)}
                className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium ${
                  activeTab === 2
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-[20px]">
                  description
                </i>
                Quotations
              </button>
            </li>

            <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
              <button
                type="button"
                onClick={() => handleTabClick(3)}
                className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium ${
                  activeTab === 3
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-[20px]">
                  shopping_cart
                </i>
                Orders
              </button>
            </li>

            <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
              <button
                type="button"
                onClick={() => handleTabClick(4)}
                className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium ${
                  activeTab === 4
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-[20px]">receipt</i>
                Invoices
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <div>
            <div className="flex items-center justify-between mb-[20px]">
              <h6 className="font-semibold text-black dark:text-white">
                Customer Information
              </h6>
              {!isEditMode && (
                <div className="flex gap-[8px]">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit customer"
                    disabled={isSubmitting}
                  >
                    <i className="material-symbols-outlined !text-[18px]">edit</i>
                  </button>
                  <button
                    onClick={handleDeleteCustomer}
                    className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete customer"
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
                  {/* Name */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Customer Name <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Email <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || ""}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Phone <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone || ""}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.contact_person_name || ""}
                      onChange={(e) => handleFormChange("contact_person_name", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Address <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.address || ""}
                      onChange={(e) => handleFormChange("address", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* City */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      City <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.city || ""}
                      onChange={(e) => handleFormChange("city", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* State */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      State
                    </label>
                    <input
                      type="text"
                      value={editFormData.state || ""}
                      onChange={(e) => handleFormChange("state", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* Country */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Country <span className="text-danger-500">*</span>
                    </label>
                    <select
                      value={editFormData.country || ""}
                      onChange={(e) => handleFormChange("country", e.target.value)}
                      disabled={loadingCountries}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{loadingCountries ? "Loading countries..." : "Select a country"}</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* KRA PIN */}
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      KRA PIN
                    </label>
                    <input
                      type="text"
                      value={editFormData.kra_pin || ""}
                      onChange={(e) => handleFormChange("kra_pin", e.target.value)}
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 mb-[20px]">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Description
                    </label>
                    <textarea
                      value={editFormData.description || ""}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="Enter customer description"
                      rows={4}
                    />
                  </div>

                  {/* Logo */}
                  <div className="sm:col-span-2 mb-[20px]">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Logo
                    </label>
                    <div className="flex items-center gap-[15px]">
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 file:mr-[10px] file:py-[8px] file:px-[12px] file:rounded-md file:border-0 file:bg-primary-500 file:text-white file:cursor-pointer file:transition-all hover:file:bg-primary-400"
                      />
                      {logoPreview && (
                        <div className="relative w-[60px] h-[60px] flex-shrink-0">
                          <img
                            src={logoPreview}
                            alt="logo-preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview(null);
                              setSelectedLogo(null);
                            }}
                            className="absolute top-[-8px] right-[-8px] bg-danger-500 text-white w-[24px] h-[24px] flex items-center justify-center rounded-full text-xs hover:bg-danger-600"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-[20px] md:mt-[25px]">
                  <button
                    type="reset"
                    onClick={handleCancel}
                    className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateCustomer}
                    className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Full Name
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Email
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Phone
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Contact Person
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.contact_person_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Address
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.address || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    City
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.city || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    State
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.state || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Country
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.country || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    KRA PIN
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.kra_pin || "N/A"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Description
                  </label>
                  <p className="text-black dark:text-white">
                    {customer.description || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <h6 className="font-semibold text-black dark:text-white mb-[15px]">
              Projects
            </h6>
            <TableSearchable
              data={sampleProjects}
              columns={[
                { key: "name", label: "Project Name" },
                { key: "status", label: "Status" },
                { key: "budget", label: "Budget" },
                { key: "startDate", label: "Start Date" },
                { key: "endDate", label: "End Date" },
              ]}
            />
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <h6 className="font-semibold text-black dark:text-white mb-[15px]">
              Quotations
            </h6>
            <TableSearchable
              data={sampleQuotations}
              columns={[
                { key: "quotationNo", label: "Quotation No" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
                { key: "validUntil", label: "Valid Until" },
              ]}
            />
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <h6 className="font-semibold text-black dark:text-white mb-[15px]">
              Orders
            </h6>
            <TableSearchable
              data={sampleOrders}
              columns={[
                { key: "orderNo", label: "Order No" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ]}
            />
          </div>
        )}

        {activeTab === 4 && (
          <div>
            <h6 className="font-semibold text-black dark:text-white mb-[15px]">
              Invoices
            </h6>
            <TableSearchable
              data={sampleInvoices}
              columns={[
                { key: "invoiceNo", label: "Invoice No" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
                { key: "dueDate", label: "Due Date" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsView;
