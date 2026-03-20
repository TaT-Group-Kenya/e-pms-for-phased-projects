import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";

interface PaymentReceivingMethodFormProps {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const schema = z.object({
  type: z.enum(["Bank", "Mpesa", ""]),
  name: z.string().min(2, "Name is required"),
  currency: z.string().min(1, "Currency is required"),
  instruction: z.string().optional(),
  paybill: z.string().optional(),
  account_holder_name: z.string().optional(),
  account_number: z.string().optional(),
  bank: z.string().optional(),
  branch: z.string().optional(),
  swift_code: z.string().optional(),
  iban: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  type: "",
  name: "",
  currency: "",
  instruction: "",
  paybill: "",
  account_holder_name: "",
  account_number: "",
  bank: "",
  branch: "",
  swift_code: "",
  iban: "",
  status: "active",
};

const PaymentReceivingMethodForm: React.FC<PaymentReceivingMethodFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...initial },
    values: initial ? { ...defaultValues, ...initial } : undefined,
  });

  const [currencies, setCurrencies] = useState<{ code: string; name: string }[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [currencyError, setCurrencyError] = useState("");
  const accessToken = useSelector(selectAccessToken);
  

  useEffect(() => {
    setLoadingCurrencies(true);
    fetch("/api/currencies/list", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch currencies");
        const data = await res.json();
        // Expecting array of { code, name }
        setCurrencies(Array.isArray(data) ? data : data.data || []);
        setLoadingCurrencies(false);
      })
      .catch(() => {
        setCurrencyError("Failed to load currencies");
        setLoadingCurrencies(false);
      });
  }, []);

  // Kenyan banks list
  const kenyanBanks = [
    "ABSA Bank Kenya",
    "Bank of Africa Kenya",
    "Bank of Baroda Kenya",
    "Bank of India Kenya",
    "CFC Stanbic Bank",
    "Chase Bank Kenya",
    "Citibank Kenya",
    "Co-operative Bank of Kenya",
    "Credit Bank",
    "Diamond Trust Bank",
    "Ecobank Kenya",
    "Equity Bank",
    "Family Bank",
    "First Community Bank",
    "Guaranty Trust Bank Kenya",
    "Gulf African Bank",
    "Habib Bank AG Zurich",
    "Housing Finance Company",
    "I&M Bank",
    "Imperial Bank",
    "Jamii Bora Bank",
    "Kenya Commercial Bank",
    "Middle East Bank Kenya",
    "National Bank of Kenya",
    "NCBA Bank",
    "Paramount Bank",
    "Prime Bank",
    "Sidian Bank",
    "Spire Bank",
    "Standard Chartered Bank Kenya",
    "Trans National Bank",
    "United Bank for Africa Kenya",
    "Victoria Commercial Bank",
  ].sort();

  React.useEffect(() => {
    reset(initial ? { ...defaultValues, ...initial } : defaultValues);
  }, [initial, reset]);

  const type = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[16px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Type</label>
          <select
            {...register("type")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
            required
          >
            <option value="">Select type</option>
            <option value="Bank">Bank</option>
            <option value="Mpesa">Mpesa</option>
          </select>
          {errors.type && <span className="text-danger-600 text-sm">{errors.type.message}</span>}
        </div>
        {type && (
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Name</label>
            <input
              {...register("name")}
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              required
            />
            {errors.name && <span className="text-danger-600 text-sm">{errors.name.message}</span>}
          </div>
        )}
      </div>
      {type && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Currency</label>
            {loadingCurrencies ? (
              <div className="text-gray-500">Loading...</div>
            ) : currencyError ? (
              <div className="text-danger-600 text-sm">{currencyError}</div>
            ) : (
              <select
                {...register("currency")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                required
              >
                <option value="">Select currency</option>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
            )}
            {errors.currency && <span className="text-danger-600 text-sm">{errors.currency.message}</span>}
          </div>
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Status</label>
            <select
              {...register("status")}
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <span className="text-danger-600 text-sm">{errors.status.message}</span>}
          </div>
        </div>
      )}
      {type === "Bank" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Account Holder Name</label>
              <input
                {...register("account_holder_name")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              />
              {errors.account_holder_name && <span className="text-danger-600 text-sm">{errors.account_holder_name.message}</span>}
            </div>
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Account Number</label>
              <input
                {...register("account_number")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              />
              {errors.account_number && <span className="text-danger-600 text-sm">{errors.account_number.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Bank</label>
              <select
                {...register("bank")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              >
                <option value="">Select bank</option>
                {kenyanBanks.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
              {errors.bank && <span className="text-danger-600 text-sm">{errors.bank.message}</span>}
            </div>
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Branch</label>
              <input
                {...register("branch")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              />
              {errors.branch && <span className="text-danger-600 text-sm">{errors.branch.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Swift Code</label>
              <input
                {...register("swift_code")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              />
              {errors.swift_code && <span className="text-danger-600 text-sm">{errors.swift_code.message}</span>}
            </div>
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">IBAN</label>
              <input
                {...register("iban")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              />
              {errors.iban && <span className="text-danger-600 text-sm">{errors.iban.message}</span>}
            </div>
          </div>
        </>
      )}
      {type === "Mpesa" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Paybill</label>
            <input
              {...register("paybill")}
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
            />
            {errors.paybill && <span className="text-danger-600 text-sm">{errors.paybill.message}</span>}
          </div>
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Account Holder Name</label>
            <input
              {...register("account_holder_name")}
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
            />
            {errors.account_holder_name && <span className="text-danger-600 text-sm">{errors.account_holder_name.message}</span>}
          </div>
        </div>
      )}
      {type && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          { type === "Mpesa" && (
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Account Number</label>
              <input
                {...register("account_number")}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              />
              {errors.account_number && <span className="text-danger-600 text-sm">{errors.account_number.message}</span>}
            </div>
          )}
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Instruction</label>
            <input
              {...register("instruction")}
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
            />
            {errors.instruction && <span className="text-danger-600 text-sm">{errors.instruction.message}</span>}
          </div>
        </div>
      )}
      <div className="flex items-center justify-end gap-[10px] mt-[10px]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default PaymentReceivingMethodForm;
