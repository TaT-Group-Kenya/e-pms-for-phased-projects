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

// Zod schema for form validation - based on ProjectStoreRequest
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255, "Project name must not exceed 255 characters"),
  description: z.string().min(1, "Description is required").max(255, "Description must not exceed 255 characters"),
  customer_id: z.string().min(1, "Customer is required"),
  project_category_id: z.string().min(1, "Project category is required"),
  no_of_phases: z.string().min(1, "Number of phases is required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget_estimate: z.string().optional(),
  status: z.enum(["new", "progress", "draft", "complete"]).optional(),
  priority: z.string().min(1, "Priority is required"),
  progress: z.string().min(1, "Progress is required"),
  tags: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  updated_by: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Customer {
  id: number;
  name: string;
}

interface ProjectCategory {
  id: number;
  name: string;
}

interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
}

const CreateProjectForm: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
  });

  // Load customers and project categories
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [customersRes, categoriesRes, currenciesRes] = await Promise.all([
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
          fetch("/api/currencies/list?per_page=100", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        const customersData = await customersRes.json();
        const categoriesData = await categoriesRes.json();
        const currenciesData = await currenciesRes.json();

        const customerList = customersData.data || customersData;
        const categoriesList = categoriesData.data || categoriesData;
        const currenciesList = currenciesData.data || currenciesData;
        
        setCustomers(Array.isArray(customerList) ? customerList : []);
        setProjectCategories(Array.isArray(categoriesList) ? categoriesList : []);
        setCurrencies(Array.isArray(currenciesList) ? currenciesList : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching data:", err);
        addToast("Error loading form data. Please refresh the page.", "error");
      } finally {
        setLoadingData(false);
      }
    };

    if (accessToken) {
      fetchData();
    } else {
      setLoadingData(false);
    }

    return () => controller.abort();
  }, [accessToken, addToast]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const bodyData = {
        name: data.name,
        description: data.description,
        customer_id: data.customer_id ? parseInt(data.customer_id) : null,
        project_category_id: parseInt(data.project_category_id),
        no_of_phases: data.no_of_phases,
        start_date: data.start_date,
        end_date: data.end_date,
        budget_estimate: data.budget_estimate,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
        tags: tags.join(","),
        currency: data.currency,
      };

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setFormError(formatApiError(responseData));
        return;
      }

      setSuccessMessage("Project created successfully!");
      reset();
      setTags([]);

      setTimeout(() => {
        router.push("/project/project-list");
      }, 2000);
    } catch (err) {
      console.error("Error creating project:", err);
      setFormError("An error occurred while creating the project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName: keyof ProjectFormData) => {
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
                  Project Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.name ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. Website Redesign"
                />
                {renderFieldError("name")}
              </div>

              {/* Description - Required */}
              <div className="sm:col-span-2 mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Description <span className="text-danger-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  className={`rounded-md text-black dark:text-white border ${
                    errors.description ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="Enter project description"
                  rows={3}
                />
                {renderFieldError("description")}
              </div>

              {/* Customer - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Customer <span className="text-danger-500">*</span>
                </label>
                <select
                  {...register("customer_id")}
                  disabled={loadingData}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.customer_id ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer disabled:opacity-50`}
                >
                  <option value="">{loadingData ? "Loading customers..." : "Select a customer (required)"}</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {renderFieldError("customer_id")}
              </div>

              {/* Project Category - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Project Category <span className="text-danger-500">*</span>
                </label>
                <select
                  {...register("project_category_id")}
                  disabled={loadingData}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.project_category_id ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer disabled:opacity-50`}
                >
                  <option value="">{loadingData ? "Loading categories..." : "Select a category"}</option>
                  {projectCategories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {renderFieldError("project_category_id")}
              </div>

              {/* Number of Phases - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Number of Phases <span className="text-danger-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("no_of_phases")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.no_of_phases ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. 3"
                />
                {renderFieldError("no_of_phases")}
              </div>

              {/* Start Date - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("start_date")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.start_date ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500`}
                />
                {renderFieldError("start_date")}
              </div>

              {/* End Date - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("end_date")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.end_date ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500`}
                />
                {renderFieldError("end_date")}
              </div>

              {/* Budget Estimate - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Budget Estimate
                </label>
                <input
                  type="text"
                  {...register("budget_estimate")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.budget_estimate ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. 50000"
                />
                {renderFieldError("budget_estimate")}
              </div>

              {/* Currency - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Currency <span className="text-danger-500">*</span>
                </label>
                <select
                  {...register("currency")}
                  disabled={loadingData}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.currency ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer disabled:opacity-50`}
                >
                  <option value="">{loadingData ? "Loading currencies..." : "Select a currency"}</option>
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                {renderFieldError("currency")}
              </div>

              {/* Status - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Status
                </label>
                <select
                  {...register("status")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.status ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer`}
                >
                  <option value="">Select a status (optional)</option>
                  <option value="draft">Draft</option>
                  <option value="new">New</option>
                  <option value="progress">Progress</option>
                  <option value="complete">Complete</option>
                </select>
                {renderFieldError("status")}
              </div>

              {/* Priority - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Priority <span className="text-danger-500">*</span>
                </label>
                <select
                  {...register("priority")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.priority ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 cursor-pointer`}
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {renderFieldError("priority")}
              </div>

              {/* Progress - Required */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Progress (%) <span className="text-danger-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register("progress")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.progress ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. 50"
                />
                {renderFieldError("progress")}
              </div>

              {/* Tags - Optional */}
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Tags
                </label>
                <div className={`rounded-md border ${
                  tags.length === 0 && !errors.tags ? "border-gray-200 dark:border-[#172036]" : 
                  tags.length === 0 ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                } bg-white dark:bg-[#0c1427] px-[12px] py-[8px] block w-full outline-0 transition-all focus:border-primary-500`}>
                  <div className="flex flex-wrap gap-[8px] mb-[8px]">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="hover:text-primary-900 dark:hover:text-primary-100 cursor-pointer font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !tags.includes(value)) {
                          setTags([...tags, value]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                    className="w-full outline-0 bg-transparent text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder={tags.length === 0 ? "E.g. web, frontend, api (Press Enter to add)" : "Press Enter to add"}
                  />
                </div>
                {renderFieldError("tags")}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-start gap-[15px] mt-[25px] pt-[20px] border-t border-gray-200 dark:border-[#172036]">
              <button
                type="button"
                onClick={() => router.push("/project/project-list")}
                className="px-[25px] py-[10px] rounded-md bg-danger-500 text-white hover:bg-danger-600 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-[25px] py-[10px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateProjectForm;
