"use client";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-[20px]">
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[400px]">
        <div className="mb-[20px]">
          <h6 className="!mb-0 text-danger-500">{title}</h6>
        </div>

        <div className="mb-[25px]">
          <p className="text-black dark:text-white text-sm">
            {itemName ? message.replace("{item}", itemName) : message}
          </p>
        </div>

        <div className="flex items-center justify-start gap-[15px]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-[25px] py-[10px] rounded-md border border-gray-200 dark:border-[#172036] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-[25px] py-[10px] rounded-md bg-danger-500 text-white hover:bg-danger-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
