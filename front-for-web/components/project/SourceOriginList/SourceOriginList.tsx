"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import { formatApiError } from "../../../utils/errorHandler";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal/DeleteConfirmationModal";
import AddSourceOriginModal from "./AddSourceOriginModal";
import EditSourceOriginModal from "./EditSourceOriginModal";

interface SourceOrigin {
  id: number;
  code?: string | null;
  name: string;
  description?: string | null;
}

const SourceOriginList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [items, setItems] = useState<SourceOrigin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SourceOrigin | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/projects/source-origins/list?per_page=1000", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          const message = formatApiError(data) || "Failed to fetch project sources";
          console.error("Error response fetching project sources:", data);
          addToast(message, "error");
          setItems([]);
          return;
        }

        const list = data.data || data;
        setItems(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Error fetching project sources:", err);
        addToast("Error loading project sources", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [accessToken, addToast, refreshTrigger]);

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (item: SourceOrigin) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setDeleting(deleteTargetId);
      const response = await fetch(`/api/projects/source-origins/${deleteTargetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        addToast(formatApiError(errorData), "error");
        return;
      }

      setItems(items.filter((item) => item.id !== deleteTargetId));
      addToast("Project source deleted successfully", "success");
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Error deleting project source:", err);
      addToast("Error deleting project source", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleItemAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowModal(false);
  };

  const handleItemUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px]">
        <div className="flex items-center justify-between mb-[25px]">
          <h6 className="!mb-0">Project Sources</h6>
          <button
            onClick={() => setShowModal(true)}
            className="px-[20px] py-[8px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium text-sm"
          >
            + Add Source
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#172036]">
                <th className="py-[12px] px-[15px] text-black dark:text-white font-medium text-left text-sm">
                  ID
                </th>
                <th className="py-[12px] px-[15px] text-black dark:text-white font-medium text-left text-sm">
                  Code
                </th>
                <th className="py-[12px] px-[15px] text-black dark:text-white font-medium text-left text-sm">
                  Name
                </th>
                <th className="py-[12px] px-[15px] text-black dark:text-white font-medium text-left text-sm">
                  Description
                </th>
                <th className="py-[12px] px-[15px] text-black dark:text-white font-medium text-right text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-[20px] px-[15px] text-center text-gray-500">
                    Loading project sources...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-[20px] px-[15px] text-center text-gray-500">
                    No project sources found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all"
                  >
                    <td className="py-[12px] px-[15px] text-black dark:text-white text-sm">{item.id}</td>
                    <td className="py-[12px] px-[15px] text-black dark:text-white text-sm font-medium">
                      {item.code || "-"}
                    </td>
                    <td className="py-[12px] px-[15px] text-black dark:text-white text-sm font-medium">
                      {item.name}
                    </td>
                    <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                      {item.description || "-"}
                    </td>
                    <td className="py-[12px] px-[15px] text-right">
                      <div className="flex items-center justify-end gap-[10px]">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={deleting === item.id}
                          className="hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                          title="Edit project source"
                        >
                          <i className="material-symbols-outlined !text-[20px] text-primary-500">edit</i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="hover:text-danger-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                          title="Delete project source"
                        >
                          <i className="material-symbols-outlined !text-[20px] text-danger-500">delete</i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddSourceOriginModal onClose={() => setShowModal(false)} onSuccess={handleItemAdded} />
      )}

      {showEditModal && editingItem && (
        <EditSourceOriginModal
          sourceOriginId={editingItem.id}
          sourceOrigin={editingItem}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSuccess={handleItemUpdated}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Project Source"
        message="Are you sure you want to delete this project source? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        isDeleting={deleting !== null}
      />
    </>
  );
};

export default SourceOriginList;
