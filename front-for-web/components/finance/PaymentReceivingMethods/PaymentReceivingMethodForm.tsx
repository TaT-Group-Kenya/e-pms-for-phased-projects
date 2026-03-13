import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface PaymentReceivingMethodFormProps {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const schema = z.object({
  type: z.enum(["Bank", "MPesa", "Other"]),
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
  type: "Bank",
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
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...initial },
    values: initial ? { ...defaultValues, ...initial } : undefined,
  });

  React.useEffect(() => {
    reset(initial ? { ...defaultValues, ...initial } : defaultValues);
  }, [initial, reset]);

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
            <option value="Bank">Bank</option>
            <option value="MPesa">MPesa</option>
            <option value="Other">Other</option>
          </select>
          {errors.type && <span className="text-danger-600 text-sm">{errors.type.message}</span>}
        </div>
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Name</label>
          <input
            {...register("name")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
            required
          />
          {errors.name && <span className="text-danger-600 text-sm">{errors.name.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Currency</label>
          <input
            {...register("currency")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
            required
          />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Account Number</label>
          <input
            {...register("account_number")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
          />
          {errors.account_number && <span className="text-danger-600 text-sm">{errors.account_number.message}</span>}
        </div>
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Bank</label>
          <input
            {...register("bank")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
          />
          {errors.bank && <span className="text-danger-600 text-sm">{errors.bank.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Branch</label>
          <input
            {...register("branch")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
          />
          {errors.branch && <span className="text-danger-600 text-sm">{errors.branch.message}</span>}
        </div>
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Swift Code</label>
          <input
            {...register("swift_code")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
          />
          {errors.swift_code && <span className="text-danger-600 text-sm">{errors.swift_code.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">IBAN</label>
          <input
            {...register("iban")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
          />
          {errors.iban && <span className="text-danger-600 text-sm">{errors.iban.message}</span>}
        </div>
        <div>
          <label className="mb-[8px] text-black dark:text-white font-medium block">Instruction</label>
          <input
            {...register("instruction")}
            className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
          />
          {errors.instruction && <span className="text-danger-600 text-sm">{errors.instruction.message}</span>}
        </div>
      </div>
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
