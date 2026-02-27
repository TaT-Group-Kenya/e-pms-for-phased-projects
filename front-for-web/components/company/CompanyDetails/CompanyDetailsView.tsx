"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import BankAccountsTab from "./BankAccountsTab";
import ProjectsTab from "./ProjectsTab";
import UsersTab from "./UsersTab";

interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  avatar_pic?: string;
  category: string;
  is_active: boolean;
}

interface BankAccount {
  id: number;
  company_id: number;
  type: string;
  account_no: string;
  swiftcode?: string;
  branch?: string;
  account_holder_name: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

interface Invoice {
  id: number;
  invoice_number: string;
  project_id: number;
  company_id: number;
  project_phase_id?: number;
  title: string;
  description?: string;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  discount_percentage?: number;
  discount_amount?: number;
  total_amount: number;
  currency: string;
  payment_terms?: string;
  notes_to_customer?: string;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}

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
  users: User[];
  assignments: Assignment[];
  bank_accounts: BankAccount[];
  invoices: Invoice[];
}

interface CompanyDetailsViewProps {
  companyId: string;
}

const CompanyDetailsView: React.FC<CompanyDetailsViewProps> = ({ companyId }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const accessToken = useSelector(selectAccessToken);
  const [activeTab, setActiveTab] = useState(0);
  const [company, setCompany] = useState<CompanyDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<CompanyDetailsData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Array<{ id: number; code: string; name: string }>>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerms, setSearchTerms] = useState({
    users: "",
    invoices: "",
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmData, setDeleteConfirmData] = useState<{ type: 'company'; id?: number } | null>(null);

  // Auto-dismiss update message after 5 seconds
  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

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
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          // Try to read a more specific error message from the API response
          let errorMessage = "Failed to load company";
          try {
            const errorData = await response.json();
            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // Fallback to status text if JSON parsing fails
            if (response.statusText) {
              errorMessage = response.statusText;
            }
          }

          console.error("Error response when fetching company:", response.status, errorMessage);
          addToast(errorMessage, "error");
          setCompany(null);
          return;
        }

        const data = await response.json();
        const companyData = data.data || data;
        // Ensure arrays have default values
        companyData.users = companyData.users || [];
        companyData.assignments = companyData.assignments || [];
        companyData.bank_accounts = companyData.bank_accounts || [];
        companyData.invoices = companyData.invoices || [];
        
        setCompany(companyData);
        setEditFormData(companyData);
      } catch (err) {
        console.error("Unexpected error fetching company:", err);
        addToast("Unexpected error loading company details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && companyId) {
      fetchCompany();
    }
  }, [companyId, accessToken, addToast]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditFormData(company);
    setLogoPreview(null);
    setSelectedLogo(null);
  };

  const handleUpdateCompany = async () => {
    if (!editFormData || !company) return;

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

      const response = await fetch(`/api/companies/${companyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUpdateMessage({ type: 'error', text: data.message || "Failed to update company" });
        setIsSubmitting(false);
        return;
      }

      // Re-fetch company data after successful update
      try {
        const refetchResponse = await fetch(`/api/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (refetchResponse.ok) {
          const refetchData = await refetchResponse.json();
          const updatedCompanyData = refetchData.data || refetchData;
          // Ensure arrays have default values
          updatedCompanyData.users = updatedCompanyData.users || [];
          updatedCompanyData.assignments = updatedCompanyData.assignments || [];
          updatedCompanyData.bank_accounts = updatedCompanyData.bank_accounts || [];
          updatedCompanyData.invoices = updatedCompanyData.invoices || [];
          
          setCompany(updatedCompanyData);
          setEditFormData(updatedCompanyData);
        }
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      setIsEditMode(false);
      setLogoPreview(null);
      setSelectedLogo(null);
      setUpdateMessage({ type: 'success', text: 'Company updated successfully' });
    } catch (err) {
      console.error("Error updating company:", err);
      setUpdateMessage({ type: 'error', text: 'Error updating company' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = () => {
    setDeleteConfirmData({ type: 'company' });
    setShowDeleteConfirmModal(true);
  };

  const refetchCompanyData = async () => {
    try {
      const refetchResponse = await fetch(`/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (refetchResponse.ok) {
        const refetchData = await refetchResponse.json();
        const updatedCompanyData = refetchData.data || refetchData;
        updatedCompanyData.users = updatedCompanyData.users || [];
        updatedCompanyData.assignments = updatedCompanyData.assignments || [];
        updatedCompanyData.bank_accounts = updatedCompanyData.bank_accounts || [];
        updatedCompanyData.invoices = updatedCompanyData.invoices || [];
        
        setCompany(updatedCompanyData);
      }
    } catch (refetchErr) {
      console.error("Error refetching company:", refetchErr);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmData) return;

    setShowDeleteConfirmModal(false);
    setIsSubmitting(true);

    try {
      if (deleteConfirmData.type === 'company') {
        const response = await fetch(`/api/companies/${companyId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          addToast(data.message || "Failed to delete company", "error");
          return;
        }

        addToast("Company deleted successfully", "success");
        setTimeout(() => {
          router.push("/company");
        }, 1500);
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      addToast("Error deleting company", "error");
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmData(null);
    }
  };

  const handleFormChange = (field: keyof CompanyDetailsData, value: any) => {
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

  const handleSearch = (tab: string, term: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [tab]: term,
    }));
  };

  const filterData = (data: any[], searchTerm: string, fields: string[]) => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      fields.some((field) => {
        // Support nested fields using dot notation (e.g., "project.code")
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return String(value || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  };

  if (loading) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">Company not found</p>
        </div>
      </div>
    );
  }

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
                Company Info
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
                <i className="material-symbols-outlined !text-[20px]">group</i>
                Users
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
                <i className="material-symbols-outlined !text-[20px]">assignment</i>
                Projects
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
                <i className="material-symbols-outlined !text-[20px]">account_balance</i>
                Bank Accounts
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
                Company Information
              </h6>
              {!isEditMode && (
                <div className="flex gap-[8px]">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit company"
                    disabled={isSubmitting}
                  >
                    <i className="material-symbols-outlined !text-[18px]">edit</i>
                  </button>
                  <button
                    onClick={handleDeleteCompany}
                    className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete company"
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
                      Company Name <span className="text-danger-500">*</span>
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
                      placeholder="Enter company description"
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
                        <div className="w-[60px] h-[60px] rounded-md overflow-hidden border border-primary-200 dark:border-primary-800">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
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
                    onClick={handleUpdateCompany}
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
                    Company Name
                  </label>
                  <p className="text-black dark:text-white">{company.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Email
                  </label>
                  <p className="text-black dark:text-white">{company.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Phone
                  </label>
                  <p className="text-black dark:text-white">{company.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Contact Person
                  </label>
                  <p className="text-black dark:text-white">{company.contact_person_name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Address
                  </label>
                  <p className="text-black dark:text-white">{company.address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    City
                  </label>
                  <p className="text-black dark:text-white">{company.city || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    State
                  </label>
                  <p className="text-black dark:text-white">{company.state || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    Country
                  </label>
                  <p className="text-black dark:text-white">{company.country || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                    KRA PIN
                  </label>
                  <p className="text-black dark:text-white">{company.kra_pin || "N/A"}</p>
                </div>
                {company.description && (
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-[5px] font-medium">
                      Description
                    </label>
                    <p className="text-black dark:text-white">{company.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 1 && (
          <UsersTab
            companyId={companyId}
            company={company}
            onRefresh={refetchCompanyData}
            accessToken={accessToken || ""}
          />
        )}

        {/* Projects Tab */}
        {activeTab === 2 && (
          <ProjectsTab
            companyId={companyId}
            company={company}
            onRefresh={refetchCompanyData}
            accessToken={accessToken || ""}
          />
        )}

        {/* Bank Accounts Tab */}
        {activeTab === 3 && (
          <BankAccountsTab
            companyId={companyId}
            company={company}
            onRefresh={refetchCompanyData}
            accessToken={accessToken || ""}
          />
        )}

        {/* Invoices Tab */}
        {activeTab === 4 && (
          <div>
            <h6 className="font-semibold text-black dark:text-white mb-[15px]">
              Invoices
            </h6>
            {company.invoices.length === 0 ? (
              <div className="text-center py-[40px]">
                <p className="text-gray-600 dark:text-gray-400">
                  There are no invoices yet, when there are, they will be shown here
                </p>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerms.invoices}
                  onChange={(e) => handleSearch("invoices", e.target.value)}
                  className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#0c1427] text-black dark:text-white"
                />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Invoice No
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Title
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterData(company.invoices, searchTerms.invoices, ["invoice_number", "title"]).map(
                        (invoice) => (
                          <tr
                            key={invoice.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-3 px-4">{invoice.invoice_number}</td>
                            <td className="py-3 px-4">{invoice.title}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {invoice.currency} {invoice.total_amount?.toLocaleString() || "N/A"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && deleteConfirmData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[400px] w-full mx-[20px]">
              <div className="flex items-center justify-center mb-[20px]">
                <div className="w-[56px] h-[56px] rounded-full bg-danger-100 dark:bg-danger-900/20 flex items-center justify-center">
                  <i className="material-symbols-outlined text-danger-500 text-[32px]">warning</i>
                </div>
              </div>

              <h5 className="text-lg font-semibold text-black dark:text-white text-center mb-[10px]">
                Delete Company
              </h5>

              <p className="text-gray-600 dark:text-gray-400 text-center mb-[25px]">
                Are you sure you want to delete this company? This action cannot be undone.
              </p>

              <div className="flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-[10px] px-[15px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-danger-500 hover:bg-danger-600 disabled:bg-gray-400 text-white font-medium py-[10px] px-[15px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsView;
