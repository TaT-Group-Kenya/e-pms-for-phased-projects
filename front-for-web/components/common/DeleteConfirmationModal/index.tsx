import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  isDeleting?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  isDeleting = false,
  error = null,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#0c1427] text-left shadow-xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in w-full max-w-sm"
          >
            <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
              {/* Header */}
              <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">{title}</h5>
                </div>
                <div className="trezo-card-subtitle">
                  <button
                    type="button"
                    className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-danger-500"
                    onClick={onCancel}
                    disabled={isDeleting}
                  >
                    <i className="ri-close-fill"></i>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="trezo-card-content mb-[20px] md:mb-[25px]">
                {error && (
                  <div className="mb-[15px] p-[12px] bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-md">
                    <div className="text-danger-600 dark:text-danger-400 text-sm flex items-start gap-[8px]">
                      <i className="ri-error-warning-line mt-[2px] flex-shrink-0"></i>
                      <span className="break-words">{error}</span>
                    </div>
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-[10px]">
                  {message}
                </p>
                <p className="text-black dark:text-white font-medium break-words">
                  "{itemName}"
                </p>
              </div>

              {/* Footer */}
              <div className="mt-[20px] md:mt-[25px] flex gap-[15px] justify-end">
                <button
                  type="button"
                  className="rounded-md inline-block transition-all font-medium px-[26.5px] py-[12px] bg-gray-200 dark:bg-[#172036] text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#1a2847] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onCancel}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-block bg-danger-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[8px] justify-center"
                  onClick={onConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="inline-block w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="ri-delete-bin-6-line"></i>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
