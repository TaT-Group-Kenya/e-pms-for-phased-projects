"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { formatApiError } from "../../../utils/errorHandler";

const sourceOriginSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Source name is required").max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
});

type SourceOriginFormData = z.infer<typeof sourceOriginSchema>;

interface EditSourceOriginModalProps {
  sourceOriginId: number;
  sourceOrigin: { id: number; code?: string | null; name: string; description?: string | null };
  onClose: () => void;
  onSuccess: () => void;
}

const EditSourceOriginModal: React.FC<EditSourceOriginModalProps> = ({
  sourceOriginId,
  sourceOrigin,
  onClose,
  onSuccess,
}) => {
  const accessToken = useSelector(selectAccessToken);
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SourceOriginFormData>({
    resolver: zodResolver(sourceOriginSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (sourceOrigin) {
      reset({
        code: sourceOrigin.code || "",
        name: sourceOrigin.name,
        description: sourceOrigin.description || "",
      });
    }
  }, [sourceOrigin, reset]);

  const onSubmit = async (data: SourceOriginFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/source-origins/${sourceOriginId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          code: data.code || null,
          name: data.name,
          description: data.description || null,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const formattedError = formatApiError(responseData);
        setError(`Failed to update project source: ${formattedError}`);
        return;
      }

      addToast("Project source updated successfully", "success");
      onSuccess();
    } catch (err) {
      console.error("Error updating project source:", err);
      setError("Failed to update the project source. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-[20px]">
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px]">
        <div className="mb-[20px]">
          <h6 className="!mb-0">Edit Project Source</h6>
        </div>

        {error && (
          <div className="mb-[20px] p-[15px] bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-md">
            <div className="text-danger-600 dark:text-danger-400 text-sm whitespace-pre-wrap">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-[20px]">
            <label className="mb-[10px] text-black dark:text-white font-medium block">Code</label>
            <input
              type="text"
              {...register("code")}
              className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="Optional code"
            />
          </div>

          <div className="mb-[20px]">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Source Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className={`h-[44px] rounded-md text-black dark:text-white border ${
                errors.name ? "border-danger-500" : "border-gray-200 dark:border-[#172036]"
              } bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500`}
              placeholder="E.g. Referral, Tender, Direct"
            />
            {errors.name && <p className="text-danger-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-[25px]">
            <label className="mb-[10px] text-black dark:text-white font-medium block">Description</label>
            <textarea
              {...register("description")}
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[12px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-start gap-[15px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[25px] py-[10px] rounded-md bg-danger-500 text-white hover:bg-danger-600 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-[25px] py-[10px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSourceOriginModal;
