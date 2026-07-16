"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import { formatApiError } from "../../../utils/errorHandler";
import { fetchActivePaymentReceivingMethods } from "../../../utils/paymentReceivingMethods";

const quotationSchema = z.object({
  title: z
    .string()
    .min(1, "Quotation title is required")
    .max(255, "Title must not exceed 255 characters"),
  job_reference_id: z
    .string()
    .min(1, "Job reference ID is required")
    .max(32, "Job reference ID must not exceed 32 characters"),
  // status is hidden, set in API call
  description: z.string().optional(),
  customer_id: z.string().min(1, "Customer is required"),
  project_owner_id: z.string().nullable(),
  valid_until_date: z.string().min(1, "Valid until date is required"),
  currency: z.string().min(1, "Currency is required"),
  payment_receiving_method_id: z.string().nullable().optional(),
  payment_terms: z.string().optional(),
  notes_to_customer: z.string().optional(),
  discount_percentage: z.string().optional(),
  min_approval_count: z.string().min(1, "Minimum approval count is required"),
  creationDate: z.string().min(7, "Creation date is required"),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface Customer {
  id: number;
  name: string;
}

interface Currency {
  id: number;
  code: string;
  symbol?: string;
  name: string;
}

const CreateQuotationForm: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [projectOwners, setProjectOwners] = useState<any[]>([]);
  const [paymentReceivingMethods, setPaymentReceivingMethods] = useState<Array<{ id: number; name: string; currency: string }>>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    mode: "onBlur",
    defaultValues: {
      // status is not shown, set in API call
      min_approval_count: "1",
      creationDate: new Date().toISOString().split('T')[0],
    },
  });

  // Handle customer change and clear project selection
  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
    // Reset project owner when customer changes
    setValue("project_owner_id", null);
  };

  // Fetch project owners when customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      const controller = new AbortController();
      fetchProjectOwners(selectedCustomer, controller);
      return () => controller.abort();
    } else {
      setProjectOwners([]);
    }
  }, [selectedCustomer]);

  const fetchProjectOwners = async (customerId: string, controller: AbortController) => {
    try {
      const response = await fetch(
        `/api/project-owners/list?customer_id=${customerId}&per_page=1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        }
      );

      if (controller.signal.aborted) return;

      const data = await response.json();
      if (response.ok) {
        const projectOwnerList = data.data || data;
        setProjectOwners(Array.isArray(projectOwnerList) ? projectOwnerList : []);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error("Error fetching project owners:", err);
    }
  };

  // Load customers, projects, and currencies
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [customersRes, currenciesRes] = await Promise.all([
          fetch("/api/customers/list?per_page=1000", {
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
        const currenciesData = await currenciesRes.json();

        const customerList = customersData.data || customersData;
        const currenciesList = currenciesData.data || currenciesData;

        setCustomers(Array.isArray(customerList) ? customerList : []);
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

  // Fetch payment receiving methods
  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    fetchActivePaymentReceivingMethods(accessToken)
      .then((methods) => setPaymentReceivingMethods(methods))
      .catch(() => setPaymentReceivingMethods([]));
    return () => controller.abort();
  }, [accessToken]);

  const onSubmit: SubmitHandler<QuotationFormData> = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      // Combine creationDate (date) with current time to get full datetime string
      const now = new Date();
      const [year, month, day] = data.creationDate.split("-");
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const creation_datetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      const bodyData = {
        title: data.title,
        job_reference_id: data.job_reference_id,
        status: "draft", // always set to draft
        description: data.description || "",
        customer_id: data.customer_id ? parseInt(data.customer_id) : null,
        project_owner_id: data.project_owner_id ? parseInt(data.project_owner_id) : null,
        valid_until_date: data.valid_until_date,
        currency: data.currency,
        payment_receiving_method_id: data.payment_receiving_method_id ? parseInt(data.payment_receiving_method_id) : null,
        payment_terms: data.payment_terms || "",
        notes_to_customer: data.notes_to_customer || "",
        subtotal_amount: 0,
        tax_amount: 0,
        discount_percentage: parseFloat(data.discount_percentage || "0") || 0,
        discount_amount: 0,
        total_amount: 0,
        min_approval_count: parseInt(data.min_approval_count || "1") || 1,
        creationDate: creation_datetime,
      };

      const response = await fetch("/api/quotations/create", {
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

      setSuccessMessage("Quotation created successfully! Redirecting...");
      reset();

      setTimeout(() => {
        router.push(`/quotation/${responseData.data?.id || responseData.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error creating quotation:", err);
      setFormError("An error occurred while creating the quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName: keyof QuotationFormData) => {
    const error = errors[fieldName];
    if (error && error.message) {
      return (
        <p className="text-danger-500 text-sm mt-1">{error.message.toString()}</p>
      );
    }
    return null;
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

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

            <div className="mb-[25px]">
              <div className="sm:grid sm:grid-cols-3 sm:gap-[25px] mb-[20px]">
                {/* Title - Required */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Quotation Title <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className={`h-[44px] rounded-md text-black dark:text-white border ${
                      errors.title ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                    } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                    placeholder="E.g. Website Development Quote"
                  />
                  {renderFieldError("title")}
                </div>

                {/* Job Reference ID - Required */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Job Reference ID <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("job_reference_id")}
                    className={`h-[44px] rounded-md text-black dark:text-white border ${
                      errors.job_reference_id
                        ? "border-danger-500"
                        : "border-gray-200 dark:border-[#172036]"
                    } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                    placeholder="E.g. JOB12345"
                  />
                  {renderFieldError("job_reference_id")}
                </div>

                {/* Customer - Required */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Customer <span className="text-danger-500">*</span>
                  </label>
                  <select
                    {...register("customer_id")}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className={`h-[44px] rounded-md text-black dark:text-white border ${
                      errors.customer_id ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                    } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500`}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  {renderFieldError("customer_id")}
                </div>

                {/* Project Owner - Optional */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Project Owner
                  </label>
                  <select
                    {...register("project_owner_id")}
                    disabled={!selectedCustomer}
                    className={`h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">{!selectedCustomer ? "Select a customer first" : "Select Project Owner"}</option>
                    {projectOwners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Creation Date - Required */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Creation Date <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("creationDate")}
                    max={today}
                    className={`h-[44px] rounded-md text-black dark:text-white border ${
                      errors.creationDate ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                    } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500`}
                  />
                  {renderFieldError("creationDate")}
                </div>

                {/* Payment Receiving Method */}
              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payment Receiving Method
                </label>
                <select
                  {...register("payment_receiving_method_id")}
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                >
                  <option value="">Select payment receiving method</option>
                  {paymentReceivingMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name} ({method.currency})
                    </option>
                  ))}
                </select>
              </div>

              </div>

              {/* Description */}
              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter quotation description"
                  rows={3}
                />
              </div>
            </div>

            <div className="mb-[25px]">
              <div className="sm:grid sm:grid-cols-3 sm:gap-[25px] mb-[20px]">
                {/* Valid Until Date - Required */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Valid Until <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("valid_until_date")}
                    // min={today}
                    className={`h-[44px] rounded-md text-black dark:text-white border ${
                      errors.valid_until_date ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                    } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500`}
                  />
                  {renderFieldError("valid_until_date")}
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

                {/* Discount Percentage */}
                {/* <div className="mb-[20px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    {...register("discount_percentage")}
                    defaultValue="0"
                    min="0"
                    max="100"
                    step="0.01"
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div> */}

                {/* Min Approval Count */}
                <div className="mb-[20px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Minimum Approval Count <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("min_approval_count")}
                    defaultValue="1"
                    min="1"
                    max="10"
                    step="1"
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="1"
                  />
                </div>

              </div>

              {/* Payment Terms */}
              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payment Terms
                </label>
                <textarea
                  {...register("payment_terms")}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="E.g. 50% deposit required, balance on completion"
                  rows={2}
                />
              </div>

            </div>

            <div className="mb-[25px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Notes to Customer
                </label>
                <textarea
                  {...register("notes_to_customer")}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Add any special notes or instructions for the customer"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-[12px] justify-start pt-[20px] border-t border-gray-200 dark:border-[#172036] mt-[25px]">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-gray-100 dark:bg-[#15203c] text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#1f2d4d]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Quotation"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateQuotationForm;
