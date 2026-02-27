"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import { formatApiError } from "../../../utils/errorHandler";

// Zod schema for form validation
const companySchema = z.object({
  name: z.string().min(1, "Company name is required").min(3, "Company name must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().min(1, "Phone is required").min(10, "Phone must be at least 10 characters"),
  address: z.string().min(1, "Address is required").min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  description: z.string().optional(),
  contact_person_name: z.string().optional(),
  state: z.string().optional(),
  kra_pin: z.string().optional(),
  logo: z.any().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface Country {
  id: number;
  code: string;
  name: string;
}

const CreateCompanyForm: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        // Don't process if request was aborted
        if (controller.signal.aborted) return;

        const data = await response.json();
        
        if (!response.ok) {
          addToast("Failed to load countries list", "error");
          setCountries([]);
          return;
        }
        
        const countryList = data.data || data;
        setCountries(Array.isArray(countryList) ? countryList : []);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching countries:", err);
        addToast("Error loading countries. Please refresh the page.", "error");
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    if (accessToken) {
      fetchCountries();
    } else {
      setLoadingCountries(false);
    }

    // Cleanup: abort request if effect runs again or component unmounts
    return () => controller.abort();
  }, [accessToken, addToast]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setFormError("Logo must be an image file");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Logo must be less than 5MB");
        e.target.value = "";
        return;
      }

      setFormError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("country", data.country);
      
      if (data.description) formData.append("description", data.description);
      if (data.contact_person_name) formData.append("contact_person_name", data.contact_person_name);
      if (data.state) formData.append("state", data.state);
      if (data.kra_pin) formData.append("kra_pin", data.kra_pin);
      
      if (data.logo?.[0]) {
        const file = data.logo[0];
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const filename = `${Date.now()}.${ext}`;
        const normalizedFile = new File([file], filename, { type: file.type });
        formData.append("logo", normalizedFile);
      }

      const response = await fetch("/api/companies/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        setFormError(formatApiError(responseData));
        return;
      }

      setSuccessMessage("Company created successfully!");
      reset();
      setLogoPreview(null);

      setTimeout(() => {
        router.push("/company/company-list");
      }, 3000);
    } catch (err) {
      console.error("Error creating company:", err);
      setFormError("An error occurred while creating the company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName: keyof CompanyFormData) => {
    const error = errors[fieldName];
    if (error && error.message) {
      return (
        <p className="text-danger-500 text-sm mt-1">{error.message.toString()}</p>
      );
    }
    return null;
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            {/* Form Error Alert */}
            {formError && (
              <div className="mb-[20px] p-[15px] bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-md">
                <div className="text-danger-600 dark:text-danger-400 text-sm whitespace-pre-wrap">
                  {formError}
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-[20px] p-[15px] bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800 rounded-md">
                <p className="text-success-600 dark:text-success-400 text-sm">
                  {successMessage}
                </p>
              </div>
            )}

            <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
              {/* Name - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Company Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`h-[55px] rounded-md text-black dark:text-white border ${
                    errors.name ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. ABC Corporation"
                />
                {renderFieldError("name")}
              </div>

              {/* Email - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Email <span className="text-danger-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`h-[55px] rounded-md text-black dark:text-white border ${
                    errors.email ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. contact@company.com"
                />
                {renderFieldError("email")}
              </div>

              {/* Phone - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Phone <span className="text-danger-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className={`h-[55px] rounded-md text-black dark:text-white border ${
                    errors.phone ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. +254712345678"
                />
                {renderFieldError("phone")}
              </div>

              {/* Contact Person Name - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  {...register("contact_person_name")}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="E.g. Jane Smith"
                />
                {renderFieldError("contact_person_name")}
              </div>

              {/* Address - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Address <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className={`h-[55px] rounded-md text-black dark:text-white border ${
                    errors.address ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. 123 Main Street"
                />
                {renderFieldError("address")}
              </div>

              {/* City - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  City <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className={`h-[55px] rounded-md text-black dark:text-white border ${
                    errors.city ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. Nairobi"
                />
                {renderFieldError("city")}
              </div>

              {/* State - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  State
                </label>
                <input
                  type="text"
                  {...register("state")}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="E.g. Nairobi"
                />
                {renderFieldError("state")}
              </div>

              {/* Country - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Country <span className="text-danger-500">*</span>
                </label>
                <select
                  {...register("country")}
                  disabled={loadingCountries}
                  className={`h-[55px] rounded-md text-black dark:text-white border ${
                    errors.country ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">{loadingCountries ? "Loading countries..." : "Select a country"}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {renderFieldError("country")}
              </div>

              {/* KRA PIN - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  KRA PIN
                </label>
                <input
                  type="text"
                  {...register("kra_pin")}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="E.g. A001234567K"
                />
                {renderFieldError("kra_pin")}
              </div>

              {/* Description - Optional */}
              <div className="sm:col-span-2 mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter company description"
                  rows={4}
                />
                {renderFieldError("description")}
              </div>

              {/* Logo - Optional */}
              <div className="sm:col-span-2 mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Logo
                </label>
                <div className="flex items-center gap-[15px]">
                  <input
                    type="file"
                    {...register("logo")}
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
                        }}
                        className="absolute top-[-8px] right-[-8px] bg-danger-500 text-white w-[24px] h-[24px] flex items-center justify-center rounded-full text-xs hover:bg-danger-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                {renderFieldError("logo")}
              </div>
            </div>

            <div className="mt-[20px] md:mt-[25px]">
              <button
                type="reset"
                onClick={() => router.push("/company/company-list")}
                className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create Company"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateCompanyForm;
