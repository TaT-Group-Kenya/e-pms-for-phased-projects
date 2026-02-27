"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import { formatApiError } from "../../../utils/errorHandler";

const orderSchema = z.object({
  quotation_id: z.string().min(1, "Quotation is required"),
  title: z
    .string()
    .max(255, "Title must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  payment_terms: z
    .string()
    .max(255, "Payment terms must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  notes_to_customer: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type OrderFormData = z.infer<typeof orderSchema>;

interface QuotationOption {
  id: number;
  quotation_number: string;
  title?: string | null;
}

const CreateOrderForm: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [quotations, setQuotations] = useState<QuotationOption[]>([]);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadQuotations = async () => {
      try {
        const response = await fetch("/api/quotations/list?per_page=1000", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data = await response.json();
        const list = data.data || data;

        if (Array.isArray(list)) {
          setQuotations(list);
        } else {
          setQuotations([]);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        // eslint-disable-next-line no-console
        console.error("Error loading quotations:", err);
        addToast("Error loading quotations. Please refresh the page.", "error");
      } finally {
        setIsLoadingQuotations(false);
      }
    };

    if (accessToken) {
      loadQuotations();
    } else {
      setIsLoadingQuotations(false);
    }

    return () => {
      controller.abort();
    };
  }, [accessToken, addToast]);

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const bodyData = {
        quotation_id: Number(data.quotation_id),
        title: data.title || "",
        description: data.description || "",
        payment_terms: data.payment_terms || "",
        notes_to_customer: data.notes_to_customer || "",
      };

      const response = await fetch("/api/orders/create", {
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

      setSuccessMessage("Order created successfully! Redirecting...");
      addToast("Order created successfully!", "success");
      reset();

      setTimeout(() => {
        const id = responseData.data?.id || responseData.id;
        if (id) {
          router.push(`/orders/${id}`);
        } else {
          router.push("/orders/order-list");
        }
      }, 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error creating order:", err);
      setFormError("An error occurred while creating the order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName: keyof OrderFormData) => {
    const error = errors[fieldName];
    if (error && error.message) {
      return <p className="text-danger-500 text-sm mt-1">{error.message.toString()}</p>;
    }
    return null;
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            {formError && (
              <div className="mb-[20px] p-[15px] bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-md">
                <div className="text-danger-600 dark:text-danger-400 text-sm whitespace-pre-wrap">
                  {formError}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-[20px] p-[15px] bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800 rounded-md">
                <p className="text-success-600 dark:text-success-400 text-sm">{successMessage}</p>
              </div>
            )}

            <div className="mb-[25px]">
              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Quotation
                </label>
                <select
                  {...register("quotation_id")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.quotation_id ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  disabled={isLoadingQuotations || quotations.length === 0}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {isLoadingQuotations
                      ? "Loading quotations..."
                      : quotations.length === 0
                      ? "No quotations available"
                      : "Select a quotation"}
                  </option>
                  {quotations.map((q) => (
                    <option key={q.id} value={q.id.toString()}>
                      {q.quotation_number}
                      {q.title ? ` - ${q.title}` : ""}
                    </option>
                  ))}
                </select>
                {renderFieldError("quotation_id")}
              </div>

              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Order Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className={`h-[44px] rounded-md text-black dark:text-white border ${
                    errors.title ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
                  } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
                  placeholder="E.g. Website Development Order"
                />
                {renderFieldError("title")}
              </div>

              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter order description"
                  rows={3}
                />
                {renderFieldError("description")}
              </div>

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
                {renderFieldError("payment_terms")}
              </div>

              <div className="mb-[20px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Notes to Customer
                </label>
                <textarea
                  {...register("notes_to_customer")}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Add any special notes or instructions for the customer"
                  rows={3}
                />
                {renderFieldError("notes_to_customer")}
              </div>
            </div>

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
                {isSubmitting ? "Creating..." : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateOrderForm;
