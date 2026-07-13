"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../common/Toast";
import { selectAccessToken } from "../../store/auth/selectors";
import { useSelector } from "react-redux";

interface ProjectOwnerFormProps {
  initialData?: any;
  customerId?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface Country {
  id: number;
  code: string;
  name: string;
}

const ProjectOwnerForm: React.FC<ProjectOwnerFormProps> = ({
  initialData,
  customerId,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { toasts, addToast, removeToast } = useToast();
  const accessToken = useSelector(selectAccessToken);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    contact_person_name: initialData?.contact_person_name || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "",
    kra_pin: initialData?.kra_pin || "",
    customer_id: customerId || "",
    project_owner_id: initialData?.project_owner_id || "",
  });

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

    fetchCountries();
  }, []);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      addToast("Name is required", "error");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        contact_person_name: formData.contact_person_name || null,
        description: formData.description || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        kra_pin: formData.kra_pin || null,
        customer_id: formData.customer_id || null,
        project_owner_id: formData.project_owner_id || null,
      };

      await onSubmit(payload);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-[20px]">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-[25px]">
          <h6 className="font-semibold text-black dark:text-white text-lg">
            {initialData ? "Edit Project Owner" : "Add Project Owner"}
          </h6>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-md border border-gray-200 dark:border-[#172036] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="material-symbols-outlined !text-[20px]">close</i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[15px]">
          <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
            {/* Name */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Name <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className={`h-[48px] rounded-md text-black dark:text-white border ${
                  !formData.name && isSubmitting ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                placeholder="E.g. John Doe"
                required
              />
              {!formData.name && isSubmitting && (
                <p className="text-danger-500 text-sm mt-1">Name is required</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. contact@company.com"
              />
            </div>

            {/* Phone */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. +254712345678"
              />
            </div>

            {/* Contact Person */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Contact Person Name
              </label>
              <input
                type="text"
                value={formData.contact_person_name}
                onChange={(e) => handleFormChange("contact_person_name", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. Jane Smith"
              />
            </div>

            {/* Address */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleFormChange("address", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. 123 Main Street"
              />
            </div>

            {/* City */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. Nairobi"
              />
            </div>

            {/* State */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleFormChange("state", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. Nairobi County"
              />
            </div>

            {/* Country */}
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Country
              </label>
              <select
                value={formData.country || ""}
                onChange={(e) => handleFormChange("country", e.target.value)}
                disabled={loadingCountries}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="mb-[15px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                KRA PIN
              </label>
              <input
                type="text"
                value={formData.kra_pin}
                onChange={(e) => handleFormChange("kra_pin", e.target.value)}
                className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="E.g. P123456789X"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 mb-[15px]">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter project owner description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-[15px] mt-[20px]">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-[25px] py-[10px] rounded-md border border-gray-200 dark:border-[#172036] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-[25px] py-[10px] rounded-md bg-primary-500 text-white hover:bg-primary-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectOwnerForm;
