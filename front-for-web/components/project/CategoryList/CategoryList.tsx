"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import { formatApiError } from "../../../utils/errorHandler";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal/DeleteConfirmationModal";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

interface Category {
  id: number;
  name: string;
  description?: string;
}

const CategoryList: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/projects/categories/list?per_page=1000", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        const categoryList = data.data || data;
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        addToast("Error loading categories", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [accessToken, addToast, refreshTrigger]);

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setDeleting(deleteTargetId);
      const response = await fetch(`/api/projects/categories/${deleteTargetId}`, {
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

      setCategories(categories.filter((cat) => cat.id !== deleteTargetId));
      addToast("Project category deleted successfully", "success");
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      addToast("Error deleting project category", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleCategoryAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowModal(false);
  };

  const handleCategoryUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowEditModal(false);
    setEditingCategory(null);
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px]">
        <div className="flex items-center justify-between mb-[25px]">
          <h6 className="!mb-0">Project Categories</h6>
          <button
            onClick={() => setShowModal(true)}
            className="px-[20px] py-[8px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium text-sm"
          >
            + Add Category
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
                  <td colSpan={4} className="py-[20px] px-[15px] text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-[20px] px-[15px] text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all"
                  >
                    <td className="py-[12px] px-[15px] text-black dark:text-white text-sm">
                      {category.id}
                    </td>
                    <td className="py-[12px] px-[15px] text-black dark:text-white text-sm font-medium">
                      {category.name}
                    </td>
                    <td className="py-[12px] px-[15px] text-gray-600 dark:text-gray-400 text-sm">
                      {category.description || "-"}
                    </td>
                    <td className="py-[12px] px-[15px] text-right">
                      <div className="flex items-center justify-end gap-[10px]">
                        <button
                          onClick={() => handleEdit(category)}
                          disabled={deleting === category.id}
                          className="hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                          title="Edit category"
                        >
                          <i className="material-symbols-outlined !text-[20px] text-primary-500">edit</i>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deleting === category.id}
                          className="hover:text-danger-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                          title="Delete category"
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
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onSuccess={handleCategoryAdded}
        />
      )}

      {showEditModal && editingCategory && (
        <EditCategoryModal
          categoryId={editingCategory.id}
          category={editingCategory}
          onClose={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          onSuccess={handleCategoryUpdated}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Project Category"
        message="Are you sure you want to delete this project category? This action cannot be undone."
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

export default CategoryList;
