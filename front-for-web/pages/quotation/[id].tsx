import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken, selectUser } from "../../store/auth/selectors";
import { useToast } from "../../hooks/useToast";
import AuthenticatedLayout from "../../components/authenticated/AuthenticatedLayout";
import { ToastContainer } from "../../components/common/Toast";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { fetchWithErrorHandlingSafe, formatApiError } from "../../utils/errorHandler";
import Can from "../../components/auth/Can";
import { currencySymbols, formatCurrency } from "../../utils/format";

interface QuoteLineItem {
  id: number;
  quotation_id: number;
  item_name: string;
  description?: string;
  quoted_amount: number;
  quantity: number;
  total: number;
  estimated_hours?: number;
  custom_note?: string;
  is_taxable: boolean;
  tax_id?: number | null;
  tax_item_name?: string | null;
  item_type?: "fixed" | "percent" | null;
  item_value?: number | null;
  item_amount?: number | null;
}

interface QuoteLineItemFormState {
  item_name: string;
  description: string;
  quoted_amount: string;
  quantity: string;
  is_taxable: boolean;
  tax_id: string;
  tax_item_name: string;
  item_type: "fixed" | "percent";
  item_value: string;
}

interface QuoteApproval {
  id: number;
  user_id: number;
  quote_id: number;
  action: string;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: string;
  updated_at: string;
  user?: {
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  };
}

interface ProjectPhase {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  quote_item_id?: number | null;
}

interface Project {
  id: number;
  code: string;
  name: string;
  customer_id?: number;
  phases?: ProjectPhase[];
}

interface Customer {
  id: number;
  name: string;
}

interface OrderSummary {
  id: number;
  order_number: string;
  quotation_id: number;
  project_id: number;
  customer_id: number;
  title: string;
  description?: string | null;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  discount_percentage: number | null;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_terms?: string | null;
  notes_to_customer?: string | null;
  created_at: string;
  updated_at: string;
  project?: {
    id: number;
    code: string;
    name: string;
  } | null;
  customer?: {
    id: number;
    name: string;
  } | null;
}

interface TaxSummary {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  rate?: number | null;
  is_default?: boolean | number | null;
}

interface Quotation {
  id: number;
  quotation_number: string;
  job_reference_id?: string;
  title: string;
  description?: string;
  status: string;
  customer_id?: number;
  customer?: { name: string };
  project_id?: number;
  project?: Project;
  valid_until_date: string;
  subtotal_amount: number;
  tax_amount: number;
  discount_percentage: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_terms?: string;
  notes_to_customer?: string;
  quoteItems?: QuoteLineItem[];
  approvals?: QuoteApproval[];
  min_approval_count?: number;
  order?: OrderSummary | null;
  created_at: string;
  updated_at: string;
}

const QuotationDetail: React.FC = () => {
  const router = useRouter();
  const quotationId = (router.query.id as string) || "";
  const accessToken = useSelector(selectAccessToken);
  const currentUser = useSelector(selectUser);
  const { toasts, addToast, removeToast } = useToast();

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Quotation>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuoteLineItem | null>(null);
  const [itemForm, setItemForm] = useState<QuoteLineItemFormState>({
    item_name: "",
    description: "",
    quoted_amount: "",
    quantity: "1",
    is_taxable: false,
    tax_id: "",
    tax_item_name: "",
    item_type: "percent",
    item_value: "16.00",
  });
  const [isItemSubmitting, setIsItemSubmitting] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<QuoteLineItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [deleteItemError, setDeleteItemError] = useState<string | null>(null);

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<string>("make");
  const [isApprovalSubmitting, setIsApprovalSubmitting] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [isGeneratingOrder, setIsGeneratingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [deleteOrderError, setDeleteOrderError] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [taxes, setTaxes] = useState<TaxSummary[]>([]);
  const [loadingTaxes, setLoadingTaxes] = useState(false);
  const [taxesError, setTaxesError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!quotation) return;

    try {
      setIsSendingEmail(true);

      const response = await fetch("/api/quotations/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: quotation.id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Failed to send quotation email";
        addToast(message, "error");
        return;
      }

      addToast(
        data?.message || "Quotation emailed to customer successfully.",
        "success"
      );
    } catch (err) {
      console.error("Error sending quotation email:", err);
      addToast("Failed to send quotation email. Please try again.", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Fetch quotation details
  useEffect(() => {
    const controller = new AbortController();

    const fetchQuotation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/quotations/${quotationId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data = await response.json();

        if (!response.ok) {
          addToast("Failed to load quotation details", "error");
          return;
        }

        const quotationData = data.data || data;
        setQuotation(quotationData);
        setEditData(quotationData);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching quotation:", err);
        addToast("Error loading quotation. Please refresh the page.", "error");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (accessToken && quotationId && router.isReady) {
      fetchQuotation();
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [quotationId, accessToken, router.isReady, addToast]);

  // Load customers and projects for editing header fields
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [customersRes, projectsRes] = await Promise.all([
          fetch("/api/customers/list?per_page=1000", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
          fetch("/api/projects/list?per_page=1000", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        const customersData = await customersRes.json();
        const projectsData = await projectsRes.json();

        const customerList = customersData.data || customersData;
        const projectList = projectsData.data || projectsData;

        setCustomers(Array.isArray(customerList) ? customerList : []);
        setProjects(Array.isArray(projectList) ? projectList : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching edit form data:", err);
      }
    };

    if (accessToken) {
      fetchData();
    }

    return () => controller.abort();
  }, [accessToken]);

  // Load taxes for quotation tax items
  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchTaxes = async () => {
      setLoadingTaxes(true);
      setTaxesError(null);

      try {
        const resp = await fetch(`/api/taxes/list?per_page=1000`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data = await resp.json().catch(() => null);

        if (!resp.ok) {
          const message = data?.message || "Failed to load taxes";
          setTaxesError(message);
          addToast(message, "error");
          return;
        }

        const list = (data?.data || data) as TaxSummary[];
        setTaxes(Array.isArray(list) ? list : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("fetch taxes error", err);
        setTaxesError("Error loading taxes");
      } finally {
        setLoadingTaxes(false);
      }
    };

    fetchTaxes();

    return () => controller.abort();
  }, [accessToken, addToast]);

  const refreshQuotationDetails = async () => {
    if (!quotationId || !accessToken) return;

    try {
      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        addToast("Failed to refresh quotation details", "error");
        return;
      }

      const quotationData = data.data || data;
      setQuotation(quotationData);
      setEditData(quotationData);
    } catch (err) {
      console.error("Error refreshing quotation:", err);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { data, error, details } = await fetchWithErrorHandlingSafe(`/api/quotations/update?id=${quotationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (error) {
        console.error("Failed to update quotation status:", error, details);
        addToast(error, "error");
        return;
      }

      setQuotation(data);
      addToast("Quotation status updated successfully", "success");
    } catch (err) {
      console.error("Error updating quotation:", err);
      addToast("An error occurred while updating the quotation.", "error");
    }
  };

  const openEditModal = () => {
    if (!quotation) return;
    setEditError(null);
    setEditData({ ...quotation });
    setIsEditing(true);
  };

  const closeEditModal = () => {
    if (isEditSubmitting) return;
    setIsEditing(false);
    setEditError(null);
  };

  const handleEditFieldChange = (field: keyof Quotation, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotation) return;

    setIsEditSubmitting(true);
    setEditError(null);

    try {
      const bodyData = {
        title: (editData.title || quotation.title || "").toString(),
        description: (editData.description ?? quotation.description ?? "").toString(),
        customer_id:
          editData.customer_id != null
            ? Number(editData.customer_id)
            : quotation.customer_id ?? null,
        valid_until_date:
          typeof editData.valid_until_date === "string" && editData.valid_until_date
            ? editData.valid_until_date
            : quotation.valid_until_date,
        currency: editData.currency ?? quotation.currency,
        payment_terms: (editData.payment_terms ?? quotation.payment_terms ?? "").toString(),
        notes_to_customer: (editData.notes_to_customer ?? quotation.notes_to_customer ?? "").toString(),
        job_reference_id: (editData.job_reference_id ?? quotation.job_reference_id ?? "").toString(),
        // tax_percentage removed; tax_amount is driven by backend/tax items.
        discount_percentage:
          typeof editData.discount_percentage === "number"
            ? editData.discount_percentage
            : quotation.discount_percentage,
        min_approval_count:
          typeof editData.min_approval_count === "number"
            ? editData.min_approval_count
            : quotation.min_approval_count ?? 1,
        created_at:
          typeof editData.created_at === "string" && editData.created_at
            ? editData.created_at
            : quotation.created_at,
      };

      const response = await fetch(`/api/quotations/update?id=${quotationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setEditError(formatApiError(responseData));
        return;
      }

      const updated = responseData.data || responseData;
      setQuotation(updated);
      setEditData(updated);
      setIsEditing(false);
      addToast("Quotation updated successfully", "success");
    } catch (err) {
      console.error("Error updating quotation:", err);
      setEditError("An error occurred while updating the quotation.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-success-50 text-success-500";
      case "sent":
        return "bg-info-50 text-info-500";
      case "draft":
        return "bg-warning-50 text-warning-500";
      case "rejected":
        return "bg-danger-50 text-danger-500";
      case "revised":
        return "bg-primary-50 text-primary-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getOrderStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-success-50 text-success-500";
      case "sent":
        return "bg-info-50 text-info-500";
      case "draft":
        return "bg-warning-50 text-warning-500";
      case "rejected":
        return "bg-danger-50 text-danger-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getAvailableApprovalActions = (quotation: Quotation | null): string[] => {
    if (!quotation) return [];

    const approvals = quotation.approvals || [];
    const hasMake = approvals.some((a) => a.action === "make");
    const hasCheck = approvals.some((a) => a.action === "check");
    const minCount = quotation.min_approval_count ?? 0;

    if (minCount > 2) {
      return ["make", "check"];
    }

    const actions: string[] = [];

    if (!hasMake) {
      actions.push("make");
    }
    if (!hasCheck) {
      actions.push("check");
    }

    return actions;
  };

  const handleOpenApprovalModal = (preferredAction?: string) => {
    const hasApprovalByCurrentUser =
      quotation && currentUserId != null
        ? (quotation.approvals || []).some((a) => a.user_id === currentUserId)
        : false;

    if (hasApprovalByCurrentUser) {
      addToast("You have already approved this quotation.", "info");
      return;
    }

    const actions = getAvailableApprovalActions(quotation);
    if (!actions.length) {
      addToast("No further approvals allowed for this quotation.", "info");
      return;
    }

    let actionToUse = actions[0];

    if (preferredAction) {
      if (actions.includes(preferredAction)) {
        actionToUse = preferredAction;
      } else {
        addToast("This approval action is not available for this quotation.", "info");
      }
    }

    setApprovalError(null);
    setApprovalAction(actionToUse);
    setIsApprovalModalOpen(true);
  };

  const handleCloseApprovalModal = () => {
    setIsApprovalModalOpen(false);
    setApprovalError(null);
  };

  const handleSubmitApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotation) return;

    setIsApprovalSubmitting(true);
    setApprovalError(null);

    try {
      const payload = {
        quote_id: quotation.id,
        action: approvalAction,
      };

      const response = await fetch("/api/quote-approvals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || "Failed to submit approval";
        setApprovalError(message);
        addToast(message, "error");
        return;
      }

      addToast("Approval submitted successfully", "success");
      handleCloseApprovalModal();
      await refreshQuotationDetails();
    } catch (err) {
      console.error("Error submitting approval:", err);
      setApprovalError("Unexpected error while submitting approval.");
      addToast("Error submitting approval", "error");
    } finally {
      setIsApprovalSubmitting(false);
    }
  };

  const handleOpenAddItemModal = () => {
    setEditingItem(null);
    setItemError(null);
    setItemForm({
      item_name: "",
      description: "",
      quoted_amount: "",
      quantity: "1",
      is_taxable: false,
      tax_id: "",
      tax_item_name: "",
      item_type: "percent",
      item_value: "",
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItemModal = (item: QuoteLineItem) => {
    setEditingItem(item);
    setItemError(null);
    setItemForm({
      item_name: item.item_name || "",
      description: item.description || "",
      quoted_amount: item.quoted_amount != null ? String(item.quoted_amount) : "",
      quantity: item.quantity != null ? String(item.quantity) : "1",
      is_taxable: !!item.is_taxable,
      tax_id: item.tax_id != null ? String(item.tax_id) : "",
      tax_item_name: item.tax_item_name || "",
      item_type: item.item_type || "percent",
      item_value: item.item_value != null ? String(item.item_value) : "",
    });
    setIsItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItem(null);
    setItemError(null);
  };

  const handleItemFormChange = (field: string, value: any) => {
    setItemForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotation) return;

    if (!itemForm.item_name || !itemForm.quoted_amount) {
      setItemError("Item name and quoted amount are required.");
      return;
    }

    setIsItemSubmitting(true);
    setItemError(null);

    try {
      const payload: any = {
        quotation_id: quotation.id,
        item_name: itemForm.item_name.trim(),
        description: itemForm.description?.trim() || null,
        quoted_amount: Number(itemForm.quoted_amount || 0),
        quantity: Number(itemForm.quantity || 1),
        is_taxable: Boolean(itemForm.is_taxable),
      };

      if (itemForm.is_taxable) {
        payload.tax_id = itemForm.tax_id ? Number(itemForm.tax_id) : null;
        payload.tax_item_name = itemForm.tax_item_name || null;
        payload.item_type = itemForm.item_type || null;
        payload.item_value = itemForm.item_value
          ? Number(itemForm.item_value)
          : null;
      } else {
        payload.tax_id = null;
        payload.tax_item_name = null;
        payload.item_type = null;
        payload.item_value = null;
      }

      const isEditingItem = !!editingItem;
      const url = isEditingItem
        ? `/api/quote-line-items/update?id=${editingItem?.id}`
        : "/api/quote-line-items/create";

      const response = await fetch(url, {
        method: isEditingItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || "Failed to save line item";
        setItemError(message);
        addToast(message, "error");
        return;
      }

      addToast(
        isEditingItem ? "Line item updated successfully" : "Line item added successfully",
        "success"
      );
      handleCloseItemModal();
      await refreshQuotationDetails();
    } catch (err) {
      console.error("Error saving line item:", err);
      setItemError("Unexpected error while saving line item.");
      addToast("Error saving line item", "error");
    } finally {
      setIsItemSubmitting(false);
    }
  };

  const openDeleteItemModal = (item: QuoteLineItem) => {
    setDeleteItem(item);
    setDeleteItemError(null);
    setDeleteItemModalOpen(true);
  };

  const closeDeleteItemModal = () => {
    setDeleteItemModalOpen(false);
    setDeleteItem(null);
    setDeleteItemError(null);
  };

  const handleConfirmDeleteItem = async () => {
    if (!deleteItem) return;

    setIsDeletingItem(true);
    setDeleteItemError(null);

    try {
      const response = await fetch(
        `/api/quote-line-items/delete?id=${deleteItem.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const message = data?.message || "Failed to delete line item";
        setDeleteItemError(message);
        addToast(message, "error");
        return;
      }

      addToast("Line item deleted successfully", "success");
      closeDeleteItemModal();
      await refreshQuotationDetails();
    } catch (err) {
      console.error("Error deleting line item:", err);
      setDeleteItemError("Unexpected error while deleting line item.");
      addToast("Error deleting line item", "error");
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleGenerateOrder = async () => {
    if (!quotation || isGeneratingOrder) return;

    setIsGeneratingOrder(true);
    setOrderError(null);

    try {
      const response = await fetch("/api/orders/generate-from-quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quotation_id: quotation.id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = formatApiError(data) || data?.message || "Failed to generate order";
        setOrderError(message);
        addToast(message, "error");
        return;
      }

      // Prefer navigating directly to the newly generated order for a
      // seamless experience, using the ID from the API response.
      const orderData = (data && (data.data || data)) as OrderSummary | null;

      addToast("Order generated successfully", "success");

      if (orderData && orderData.id) {
        router.push(`/orders/${orderData.id}`);
        return;
      }

      // Fallback: if the response shape is unexpected, just refresh the
      // quotation details so the "View Order" link appears.
      await refreshQuotationDetails();
    } catch (err) {
      console.error("Error generating order:", err);
      const message = "Unexpected error while generating order.";
      setOrderError(message);
      addToast(message, "error");
    } finally {
      setIsGeneratingOrder(false);
    }
  };

  const openDeleteOrderModal = () => {
    setDeleteOrderError(null);
    setIsDeleteOrderModalOpen(true);
  };

  const closeDeleteOrderModal = () => {
    if (isDeletingOrder) return;
    setIsDeleteOrderModalOpen(false);
    setDeleteOrderError(null);
  };

  const handleConfirmDeleteOrder = async () => {
    if (!quotation?.order) return;

    setIsDeletingOrder(true);
    setDeleteOrderError(null);

    try {
      const response = await fetch(`/api/orders/${quotation.order.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = formatApiError(data) || data?.message || "Failed to delete order";
        setDeleteOrderError(message);
        addToast(message, "error");
        return;
      }

      addToast("Order deleted successfully", "success");
      closeDeleteOrderModal();
      await refreshQuotationDetails();
    } catch (err) {
      console.error("Error deleting order:", err);
      const message = "Unexpected error while deleting order.";
      setDeleteOrderError(message);
      addToast(message, "error");
    } finally {
      setIsDeletingOrder(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!quotation || isDownloadingPdf) return;

    setIsDownloadingPdf(true);

    try {
      const response = await fetch(`/api/quotations/download-pdf?id=${quotation.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.message || "Failed to download PDF";
        addToast(message, "error");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${quotation.quotation_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      addToast("Error downloading PDF", "error");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const itemsSubtotal =
    quotation?.quoteItems && quotation.quoteItems.length > 0
      ? quotation.quoteItems.reduce(
        (sum, item) => sum + Number(item.total ?? 0),
        0
      )
      : quotation?.subtotal_amount ?? 0;


  const defaultTax = useMemo(() => {
    if (!taxes || taxes.length === 0) return null;
    const byDefaultFlag = taxes.find(
      (t) => t.is_default === true || t.is_default === 1
    );
    return byDefaultFlag || taxes[0];
  }, [taxes]);

  // When a line item is marked taxable and no tax is chosen yet,
  // automatically select the default tax (if any) and seed the value
  // from its rate. This also covers the case where taxes load after
  // the user has already checked "Is Taxable".
  useEffect(() => {
    if (!itemForm.is_taxable) return;
    if (!defaultTax) return;
    if (itemForm.tax_id) return; // user already has a tax selected

    setItemForm((prev) => ({
      ...prev,
      tax_id: String(defaultTax.id),
      tax_item_name: defaultTax.name,
      item_type: prev.item_type || "percent",
      item_value:
        prev.item_value !== ""
          ? prev.item_value
          : defaultTax.rate != null
            ? String(defaultTax.rate)
            : prev.item_value,
    }));
  }, [itemForm.is_taxable, itemForm.tax_id, defaultTax]);

  // Ensure value defaults to the selected tax's rate when none is set yet
  useEffect(() => {
    if (!itemForm.is_taxable) return;
    if (!itemForm.tax_id) return;
    if (itemForm.item_value !== "") return;

    const selectedTax = taxes.find((t) => String(t.id) === itemForm.tax_id);
    if (selectedTax && selectedTax.rate != null) {
      setItemForm((prev) => ({
        ...prev,
        item_value: prev.item_value || String(selectedTax.rate),
      }));
    }
  }, [itemForm.is_taxable, itemForm.tax_id, itemForm.item_value, taxes]);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-[20px] md:p-[25px]">
          <div className="space-y-[10px]">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!quotation) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-[60px]">
          <p className="text-gray-500 dark:text-gray-400 mb-[20px]">Quotation not found</p>
          <Link
            href="/quotation/quotation-list"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600"
          >
            Back to Quotations
          </Link>
        </div>
      </AuthenticatedLayout>
    );
  }

  const currentUserId = currentUser?.id ? Number(currentUser.id) : null;

  const hasCurrentUserApproval =
    currentUserId != null
      ? (quotation.approvals || []).some((approval) => approval.user_id === currentUserId)
      : false;

  const canEditLineItems = quotation.status === "draft";
  const canEditHeaderFields = quotation.status === "draft";

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <Can any={["ROLE_DELETE_QUOTE_LINE_ITEM"]}>
        <DeleteConfirmationModal
          isOpen={deleteItemModalOpen}
          title="Delete Line Item"
          message="Are you sure you want to delete this line item? This action cannot be undone."
          itemName={deleteItem?.item_name || ""}
          isDeleting={isDeletingItem}
          error={deleteItemError}
          onConfirm={handleConfirmDeleteItem}
          onCancel={closeDeleteItemModal}
        />
      </Can>

      <Can any={["ROLE_DELETE_ORDER"]}>
        <DeleteConfirmationModal
          isOpen={isDeleteOrderModalOpen}
          title="Delete Order"
          message="Are you sure you want to delete this order? This action cannot be undone."
          itemName={quotation.order?.order_number || "Order"}
          isDeleting={isDeletingOrder}
          error={deleteOrderError}
          onConfirm={handleConfirmDeleteOrder}
          onCancel={closeDeleteOrderModal}
        />
      </Can>

      <DeleteConfirmationModal
        isOpen={false}
        title=""
        message=""
        itemName=""
        isDeleting={false}
        error={null}
        onConfirm={() => { }}
        onCancel={() => { }}
      />

      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Quotation Details</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link href="/quotation/quotation-list" className="transition-all hover:text-primary-500">
              Quotations
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            {quotation.quotation_number}
          </li>
        </ol>
      </div>

      {/* Header Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[20px]">
          <div>
            <h4 className="text-black dark:text-white text-xl font-semibold mb-[10px]">
              {quotation.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Quote #: <span className="font-semibold">{quotation.quotation_number}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Job Ref: <span className="font-semibold">{quotation.job_reference_id || "-"}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-[10px]">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
            >
              Back
            </button>
            <Can any={["ROLE_EDIT_QUOTATION"]}>
              {quotation.status === "draft" && (
                <button
                  onClick={() => handleStatusChange("sent")}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  Mark as Sent
                </button>
              )}
              {quotation.status === "sent" && (
                <button
                  onClick={() => handleStatusChange("draft")}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-warning-500 border border-warning-500 hover:bg-warning-500 hover:text-white"
                >
                  Revert to Draft
                </button>
              )}
            </Can>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="trezo-card bg-transparent pt-[20px] md:pt-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="trezo-tabs mb-[20px] md:mb-[25px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(0)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${activeTab === 0
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">dashboard</i>
                  Overview
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${activeTab === 1
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">list_alt</i>
                  Line Items
                </button>
              </li>
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${activeTab === 2
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">task_alt</i>
                  Approvals
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${activeTab === 3
                    ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">shopping_cart</i>
                  Order
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          {activeTab === 0 && (
            <div className="pt-[20px]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Basic Info */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">Basic Information</h6>

                    <div className="space-y-[15px]">
                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                        <span className="text-black dark:text-white font-semibold">{quotation.customer?.name || "N/A"}</span>
                      </div>

                      {quotation.project && (
                        <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Related Project:</span>
                          <span className="text-black dark:text-white font-semibold">
                            {quotation.project.code} - {quotation.project.name}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {new Date(quotation.valid_until_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                          {quotation.status}
                        </span>
                      </div>

                      {quotation.description && (
                        <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Description:</span>
                          <p className="text-black dark:text-white text-sm">{quotation.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quote Line Items */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">Quote Line Items</h6>

                    <div className="table-responsive overflow-x-auto mb-[20px]">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="font-medium ltr:text-left rtl:text-right px-[15px] py-[12px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-sm">Item</th>
                            <th className="font-medium text-right px-[15px] py-[12px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-sm">Qty</th>
                            <th className="font-medium text-right px-[15px] py-[12px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-sm">Unit Price({currencySymbols[quotation.currency]})</th>
                            <th className="font-medium text-right px-[15px] py-[12px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-sm">Tax({currencySymbols[quotation.currency]})</th>
                            <th className="font-medium text-right px-[15px] py-[12px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-sm">Subtotal({currencySymbols[quotation.currency]})</th>
                          </tr>
                        </thead>
                        <tbody className="text-black dark:text-white text-sm">
                          {quotation.quoteItems && quotation.quoteItems.length > 0 ? (
                            <>
                              {quotation.quoteItems.map((item: any, index: number) => {
                                const quantity = item.quantity ?? 1;
                                const unitPrice = item.quoted_amount ?? 0;
                                const isTaxable = Boolean(item.is_taxable);
                                const itemType = item.item_type as "fixed" | "percent" | undefined;
                                const itemValue = item.item_value as number | null | undefined;
                                const itemAmount = item.item_amount as number | null | undefined;
                                const hasTaxAmount =
                                  typeof itemAmount === "number" && !Number.isNaN(itemAmount);
                                const lineTotal = (item.total ?? unitPrice * quantity) + (hasTaxAmount ? itemAmount : 0);

                                const taxLabel = isTaxable
                                  ? itemType === "percent" && itemValue != null && hasTaxAmount
                                    ? `${formatCurrency(itemAmount as number, '')}`
                                    : hasTaxAmount
                                      ? `${formatCurrency(itemAmount as number, '')}`
                                      : "Not taxable"
                                  : "Not taxable";

                                return (
                                  <tr key={index} className="border-b border-gray-100 dark:border-[#172036]">
                                    <td className="ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                      <div className="font-medium">{item.item_name || "N/A"}</div>
                                      {item.description && (
                                        <div className="text-xs text-gray-500">
                                          {item.description}
                                        </div>
                                      )}
                                    </td>
                                    <td className="text-right px-[15px] py-[12px] text-sm">{quantity}</td>
                                    <td className="text-right px-[15px] py-[12px] text-sm">
                                      {formatCurrency(unitPrice, '')}
                                    </td>
                                    <td className="text-right px-[15px] py-[12px] text-sm">{taxLabel}</td>
                                    <td className="text-right px-[15px] py-[12px] text-sm">
                                      {formatCurrency(lineTotal, '')}
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center px-[15px] py-[30px] text-gray-500 dark:text-gray-400">
                                No line items added yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">Financial Summary</h6>

                    <div className="space-y-[15px]">
                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Items Subtotal:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {quotation.currency} {itemsSubtotal.toLocaleString()}
                        </span>
                      </div>

                      {quotation.tax_amount > 0 && (
                        <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="text-black dark:text-white font-semibold">
                            {quotation.currency} {quotation.tax_amount?.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {quotation.discount_percentage > 0 && (
                        <>
                          <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                            <span className="text-gray-600 dark:text-gray-400">Discount ({quotation.discount_percentage}%):</span>
                            <span className="text-black dark:text-white font-semibold text-danger-500">
                              -{quotation.currency} {quotation.discount_amount?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center pt-[15px] border-t-2 border-gray-200 dark:border-[#172036]">
                        <span className="text-black dark:text-white font-semibold text-lg">Total:</span>
                        <span className="text-primary-500 font-bold text-2xl">
                          {quotation.currency} {quotation.total_amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(quotation.payment_terms || quotation.notes_to_customer) && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">Additional Information</h6>

                      <div className="space-y-[15px]">
                        {quotation.payment_terms && (
                          <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                            <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Payment Terms:</span>
                            <p className="text-black dark:text-white text-sm">{quotation.payment_terms}</p>
                          </div>
                        )}

                        {quotation.notes_to_customer && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Notes:</span>
                            <p className="text-black dark:text-white text-sm">{quotation.notes_to_customer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Quick Stats */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">Quote Summary</h6>

                    <div className="space-y-[10px]">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Quotation #</span>
                        <span className="text-black dark:text-white font-medium">{quotation.quotation_number}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Job Ref</span>
                        <span className="text-black dark:text-white font-medium">
                          {quotation.job_reference_id || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Currency</span>
                        <span className="text-black dark:text-white font-medium">{quotation.currency}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Created</span>
                        <span className="text-black dark:text-white font-medium">
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Updated</span>
                        <span className="text-black dark:text-white font-medium">
                          {new Date(quotation.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">Actions</h6>

                    <div className="space-y-[10px]">
                      <Can any={["ROLE_EDIT_QUOTATION"]}>
                        <button
                          type="button"
                          onClick={openEditModal}
                          disabled={!canEditHeaderFields}
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">edit</i>
                          Edit Quotation
                        </button>
                      </Can>

                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-info-50 dark:bg-info-950 text-info-500 hover:bg-info-100 dark:hover:bg-info-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">download</i>
                        {isDownloadingPdf ? "Downloading..." : "Download PDF"}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-success-50 dark:bg-success-950 text-success-500 hover:bg-success-100 dark:hover:bg-success-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">mail</i>
                        {isSendingEmail ? "Sending..." : "Send Email"}
                      </button>

                      {quotation.status === "draft" && (
                        <Can any={["ROLE_DELETE_QUOTATION"]}>
                          <button className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-danger-50 dark:bg-danger-950 text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900">
                            <i className="material-symbols-outlined mr-[8px] !text-[20px]">delete</i>
                            Delete Quote
                          </button>
                        </Can>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Tab */}
          {activeTab === 1 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[20px]">
                  <h6 className="text-black dark:text-white font-semibold">Quote Line Items</h6>
                  <div className="flex gap-[10px]">
                    <Can any={["ROLE_ADD_QUOTE_LINE_ITEM"]}>
                      <button
                        type="button"
                        onClick={handleOpenAddItemModal}
                        disabled={!canEditLineItems}
                        className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[18px]">add</i>
                        Add Item
                      </button>
                    </Can>
                  </div>
                </div>
                <div className="table-responsive overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Item</th>
                        <th className="font-medium text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Qty</th>
                        <th className="font-medium text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Unit Price({currencySymbols[quotation.currency]})</th>
                        <th className="font-medium text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Tax({currencySymbols[quotation.currency]})</th>
                        <th className="font-medium text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Subtotal({currencySymbols[quotation.currency]})</th>
                        <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-black dark:text-white">
                      {quotation.quoteItems && quotation.quoteItems.length > 0 ? (
                        <>
                          {quotation.quoteItems.map((item, index: number) => {
                            const quantity = item.quantity ?? 1;
                            const unitPrice = item.quoted_amount ?? 0;
                            const isTaxable = Boolean(item.is_taxable);
                            const itemType = item.item_type as "fixed" | "percent" | undefined;
                            const itemValue = item.item_value as number | null | undefined;
                            const itemAmount = item.item_amount as number | null | undefined;
                            const hasTaxAmount =
                              typeof itemAmount === "number" && !Number.isNaN(itemAmount);
                            const lineTotal = (item.total ?? unitPrice * quantity) + (hasTaxAmount ? itemAmount : 0);

                            const taxLabel = isTaxable
                              ? itemType === "percent" && itemValue != null && hasTaxAmount
                                ? `${formatCurrency(itemAmount as number, '')}`
                                : hasTaxAmount
                                  ? `${formatCurrency(itemAmount as number, '')}`
                                  : "Not taxable"
                              : "Not taxable";

                            return (
                              <tr key={index} className="border-b border-gray-100 dark:border-[#172036]">
                                <td className="ltr:text-left rtl:text-right px-[20px] py-[12px]">
                                  <span className="font-medium">{item.item_name}</span>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-[4px]">{item.description}</p>
                                  )}
                                </td>
                                <td className="text-right px-[20px] py-[12px]">
                                  {quantity}
                                </td>
                                <td className="text-right px-[20px] py-[12px]">
                                  {formatCurrency(unitPrice, '')}
                                </td>
                                <td className="text-right px-[20px] py-[12px] align-top">
                                  {taxLabel}
                                </td>
                                <td className="text-right px-[20px] py-[12px] font-semibold">
                                  {formatCurrency(lineTotal, '')}
                                </td>
                                <td className="ltr:text-left rtl:text-right px-[20px] py-[12px]">
                                  {canEditLineItems && (
                                    <div className="flex items-center gap-[8px]">
                                      <Can any={["ROLE_EDIT_QUOTE_LINE_ITEM"]}>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditItemModal(item)}
                                          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[8px] py-[4px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white text-xs"
                                        >
                                          <i className="material-symbols-outlined !text-[16px]">edit</i>
                                        </button>
                                      </Can>
                                      <Can any={["ROLE_DELETE_QUOTE_LINE_ITEM"]}>
                                        <button
                                          type="button"
                                          onClick={() => openDeleteItemModal(item)}
                                          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[8px] py-[4px] text-danger-500 border border-danger-500 hover:bg-danger-500 hover:text-white text-xs"
                                        >
                                          <i className="material-symbols-outlined !text-[16px]">delete</i>
                                        </button>
                                      </Can>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">
                            No line items yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === 2 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[20px]">
                  <h6 className="text-black dark:text-white font-semibold">Approvals</h6>
                  {quotation.status === "sent" && !hasCurrentUserApproval && (
                    <Can any={["ROLE_ADD_QUOTE_APPROVAL"]}>
                      <div className="flex gap-[10px]">
                        {getAvailableApprovalActions(quotation).includes("make") && (
                          <button
                            type="button"
                            onClick={() => handleOpenApprovalModal("make")}
                            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap text-sm"
                          >
                            <i className="material-symbols-outlined mr-[8px] !text-[18px]">check_circle</i>
                            Approve as Maker
                          </button>
                        )}
                        {getAvailableApprovalActions(quotation).includes("check") && (
                          <button
                            type="button"
                            onClick={() => handleOpenApprovalModal("check")}
                            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap text-sm"
                          >
                            <i className="material-symbols-outlined mr-[8px] !text-[18px]">check_circle</i>
                            Approve as Checker
                          </button>
                        )}
                      </div>
                    </Can>
                  )}
                </div>
                <div className="table-responsive overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">User</th>
                        <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Role</th>
                        <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-black dark:text-white">
                      {quotation.approvals && quotation.approvals.length > 0 ? (
                        <>
                          {quotation.approvals.map((approval) => (
                            <tr
                              key={approval.id}
                              className="border-b border-gray-100 dark:border-[#172036]"
                            >
                              <td className="ltr:text-left rtl:text-right px-[20px] py-[12px]">
                                <span className="font-medium">
                                  {approval.user
                                    ? (() => {
                                      const fullName = `${approval.user.first_name ?? ""} ${approval.user.last_name ?? ""}`.trim();
                                      return fullName || approval.user.name || `User #${approval.user_id}`;
                                    })()
                                    : `User #${approval.user_id}`}
                                </span>
                                {approval.user?.email && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-[4px]">
                                    {approval.user.email}
                                  </p>
                                )}
                              </td>
                              <td className="ltr:text-left rtl:text-right px-[20px] py-[12px] capitalize">
                                {approval.action === "make" ? "Maker" : approval.action === "check" ? "Checker" : approval.action}
                              </td>
                              <td className="ltr:text-left rtl:text-right px-[20px] py-[12px]">
                                {approval.created_at
                                  ? new Date(approval.created_at).toLocaleString()
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                          >
                            No approvals yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 3 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
                <div className="flex items-center justify-between mb-[20px]">
                  <h6 className="text-black dark:text-white font-semibold">Order</h6>
                  {!quotation.order && quotation.status === "approved" && (
                    <Can any={["ROLE_ADD_ORDER"]}>
                      <button
                        type="button"
                        onClick={handleGenerateOrder}
                        disabled={isGeneratingOrder}
                        className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingOrder ? (
                          <>
                            <span className="inline-block w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-[8px]" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="material-symbols-outlined mr-[8px] !text-[18px]">add</i>
                            Generate Order
                          </>
                        )}
                      </button>
                    </Can>
                  )}
                </div>
                {orderError && (
                  <div className="mb-[15px] p-[12px] bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-md">
                    <div className="text-danger-600 dark:text-danger-400 text-sm flex items-start gap-[8px]">
                      <i className="ri-error-warning-line mt-[2px] flex-shrink-0"></i>
                      <span className="break-words">{orderError}</span>
                    </div>
                  </div>
                )}

                {!quotation.order && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {quotation.status !== "approved"
                      ? "Orders can only be created after quotation is approved."
                      : "No order has been generated for this quotation yet. Once generated, it will appear here."}
                  </p>
                )}

                {quotation.order && (
                  <div className="space-y-[15px]">
                    <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                      <span className="text-black dark:text-white font-semibold">
                        {quotation.order.order_number}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span
                        className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getOrderStatusColor(
                          quotation.order.status
                        )}`}
                      >
                        {quotation.order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="text-black dark:text-white font-medium">
                          {quotation.order.currency} {quotation.order.subtotal_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="text-black dark:text-white font-medium">
                          {quotation.order.currency} {quotation.order.tax_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Discount{quotation.order.discount_percentage != null ? ` (${quotation.order.discount_percentage}%)` : ''}:</span>
                        <span className="text-black dark:text-white font-medium">
                          {quotation.order.currency} {quotation.order.discount_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {quotation.order.currency} {quotation.order.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-black dark:text-white font-medium">
                        {new Date(quotation.order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {quotation.order.description && (
                      <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Description:</span>
                        <p className="text-black dark:text-white text-sm">
                          {quotation.order.description}
                        </p>
                      </div>
                    )}

                    {quotation.order.payment_terms && (
                      <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Payment Terms:</span>
                        <p className="text-black dark:text-white text-sm">
                          {quotation.order.payment_terms}
                        </p>
                      </div>
                    )}

                    {quotation.order.notes_to_customer && (
                      <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">Notes to Customer:</span>
                        <p className="text-black dark:text-white text-sm">
                          {quotation.order.notes_to_customer}
                        </p>
                      </div>
                    )}

                    <div className="pt-[10px] flex justify-end">
                      <Can any={["ROLE_DELETE_ORDER"]}>
                        <button
                          type="button"
                          onClick={openDeleteOrderModal}
                          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-danger-500 border border-danger-500 hover:bg-danger-500 hover:text-white text-sm"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[18px]">delete</i>
                          Delete Order
                        </button>
                      </Can>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <Can any={["ROLE_ADD_QUOTE_APPROVAL"]}>
        {isApprovalModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-[20px]">
                <h6 className="font-semibold text-black dark:text-white">Approve Quotation</h6>
                {isApprovalSubmitting && (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                  </div>
                )}
              </div>

              {approvalError && (
                <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                  <div className="flex gap-[10px]">
                    <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                    <div>
                      <p className="text-sm font-medium text-danger-700 dark:text-danger-400">{approvalError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitApproval} className="space-y-[20px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Approval Type
                  </label>
                  <select
                    value={approvalAction}
                    onChange={(e) => setApprovalAction(e.target.value)}
                    disabled={isApprovalSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {getAvailableApprovalActions(quotation).includes("make") && (
                      <option value="make">Maker</option>
                    )}
                    {getAvailableApprovalActions(quotation).includes("check") && (
                      <option value="check">Checker</option>
                    )}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                  <button
                    type="button"
                    onClick={handleCloseApprovalModal}
                    disabled={isApprovalSubmitting}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApprovalSubmitting}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Can>

      {/* Add/Edit Line Item Modal */}
      <Can
        any={
          editingItem
            ? ["ROLE_EDIT_QUOTE_LINE_ITEM"]
            : ["ROLE_ADD_QUOTE_LINE_ITEM"]
        }
      >
        {isItemModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-[20px]">
                <h6 className="font-semibold text-black dark:text-white">
                  {editingItem ? "Edit Line Item" : "Add Line Item"}
                </h6>
                {isItemSubmitting && (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                  </div>
                )}
              </div>

              {itemError && (
                <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                  <div className="flex gap-[10px]">
                    <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                    <div>
                      <p className="text-sm font-medium text-danger-700 dark:text-danger-400">{itemError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitItem} className="space-y-[20px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Item Name <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itemForm.item_name}
                    onChange={(e) => handleItemFormChange("item_name", e.target.value)}
                    disabled={isItemSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="E.g. Design work for phase"
                  />
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Description
                  </label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => handleItemFormChange("description", e.target.value)}
                    disabled={isItemSubmitting}
                    className="min-h-[80px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Optional description for this item"
                  />
                </div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Quoted Amount <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemForm.quoted_amount}
                      onChange={(e) => handleItemFormChange("quoted_amount", e.target.value)}
                      disabled={isItemSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={itemForm.quantity}
                      onChange={(e) => handleItemFormChange("quantity", e.target.value)}
                      disabled={isItemSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-[8px] text-black dark:text-white font-medium">
                    <input
                      type="checkbox"
                      checked={itemForm.is_taxable}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (!checked) {
                          setItemForm((prev) => ({
                            ...prev,
                            is_taxable: false,
                            tax_id: "",
                            tax_item_name: "",
                            item_type: "percent",
                            item_value: "",
                          }));
                          return;
                        }

                        if (itemForm.tax_id || !defaultTax) {
                          setItemForm((prev) => ({
                            ...prev,
                            is_taxable: true,
                          }));
                          return;
                        }

                        setItemForm((prev) => ({
                          ...prev,
                          is_taxable: true,
                          tax_id: String(defaultTax.id),
                          tax_item_name: defaultTax.name,
                          item_type: "percent",
                          item_value:
                            defaultTax.rate != null
                              ? String(defaultTax.rate)
                              : prev.item_value || "",
                        }));
                      }}
                      disabled={isItemSubmitting}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span>Is Taxable</span>
                  </label>
                </div>

                {itemForm.is_taxable && (
                  <div className="mt-[15px] border border-primary-100 dark:border-primary-900 rounded-md p-[15px] bg-primary-50/40 dark:bg-primary-900/10 space-y-[12px]">
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Tax Name <span className="text-danger-500">*</span>
                        </label>
                        <select
                          value={itemForm.tax_id}
                          onChange={(e) => {
                            const value = e.target.value;
                            const selectedTax =
                              taxes.find((t) => String(t.id) === value) || null;
                            setItemForm((prev) => ({
                              ...prev,
                              tax_id: value,
                              tax_item_name: selectedTax ? selectedTax.name : "",
                              item_value:
                                selectedTax && selectedTax.rate != null
                                  ? String(selectedTax.rate)
                                  : prev.item_value,
                            }));
                          }}
                          disabled={isItemSubmitting || loadingTaxes || taxes.length === 0}
                          required
                          className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="" disabled>
                            {loadingTaxes
                              ? "Loading taxes..."
                              : taxes.length === 0
                                ? "No taxes configured"
                                : "Select tax"}
                          </option>
                          {taxes.map((tax) => (
                            <option key={tax.id} value={tax.id}>
                              {tax.name}
                            </option>
                          ))}
                        </select>
                        {taxesError && (
                          <p className="mt-[6px] text-[11px] text-danger-500">
                            {taxesError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Type <span className="text-danger-500">*</span>
                        </label>
                        <select
                          value={itemForm.item_type}
                          onChange={(e) =>
                            setItemForm((prev) => ({
                              ...prev,
                              item_type: e.target.value as "fixed" | "percent",
                            }))
                          }
                          disabled={isItemSubmitting}
                          required
                          className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="percent">Percentage</option>
                          <option disabled value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-[10px] text-black dark:text-white font-medium block">
                        Value
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-[6px]">
                          {itemForm.item_type === "percent"
                            ? "as % of line total"
                            : `in ${quotation.currency}`}
                        </span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={itemForm.item_value}
                        onChange={(e) =>
                          setItemForm((prev) => ({
                            ...prev,
                            item_value: e.target.value,
                          }))
                        }
                        disabled={isItemSubmitting}
                        required
                        className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={itemForm.item_type === "percent" ? "0.00" : "0.00"}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                  <button
                    type="button"
                    onClick={handleCloseItemModal}
                    disabled={isItemSubmitting}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isItemSubmitting}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingItem ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Can>

      {/* Tax Item Modal removed: quotation now uses inline per-item tax configuration only */}

      {/* Edit Quotation Header Modal */}
      <Can any={["ROLE_EDIT_QUOTATION"]}>
        {isEditing && quotation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-[20px]">
                <h6 className="font-semibold text-black dark:text-white">Edit Quotation</h6>
                {isEditSubmitting && (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Saving...</span>
                  </div>
                )}
              </div>

              {editError && (
                <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                  <div className="flex gap-[10px]">
                    <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                    <div>
                      <p className="text-sm font-medium text-danger-700 dark:text-danger-400 whitespace-pre-wrap">{editError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-[15px] p-[12px] rounded-md bg-warning-50 dark:bg-[#2a2410] border border-warning-200 dark:border-warning-900 text-sm text-warning-800 dark:text-warning-300">
                Changing the customer will clear all existing quote line items and reset quote totals.
              </div>

              <form onSubmit={handleSubmitEdit} className="space-y-[20px]">
                <div className="sm:grid sm:grid-cols-3 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Title <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.title ?? quotation.title}
                      onChange={(e) => handleEditFieldChange("title", e.target.value)}
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Quotation title"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Customer
                    </label>
                    <select
                      value={editData.customer_id != null ? String(editData.customer_id) : quotation.customer_id ? String(quotation.customer_id) : ""}
                      onChange={(e) =>
                        handleEditFieldChange(
                          "customer_id",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Creation Date
                    </label>
                    <input
                      type="date"
                      value={(() => {
                        const value = editData.created_at ?? quotation.created_at;
                        if (!value) return "";
                        const date = new Date(value);
                        if (Number.isNaN(date.getTime())) return "";
                        return date.toISOString().split("T")[0];
                      })()}
                      onChange={e => {
                        // preserve time if present, otherwise set to 00:00:00
                        const oldValue = editData.created_at ?? quotation.created_at;
                        let time = "00:00:00";
                        if (oldValue) {
                          const t = new Date(oldValue);
                          if (!Number.isNaN(t.getTime())) {
                            time = t.toISOString().split("T")[1]?.split(".")[0] || "00:00:00";
                          }
                        }
                        // Compose new ISO string
                        const newDate = e.target.value;
                        let newIso = newDate ? `${newDate}T${time}` : "";
                        handleEditFieldChange("created_at", newIso);
                      }}
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={(() => {
                        const value = editData.valid_until_date ?? quotation.valid_until_date;
                        if (!value) return "";
                        const date = new Date(value);
                        if (Number.isNaN(date.getTime())) return "";
                        return date.toISOString().split("T")[0];
                      })()}
                      onChange={(e) => handleEditFieldChange("valid_until_date", e.target.value)}
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Tax %
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        editData.tax_amount != null
                          ? String(editData.tax_amount)
                          : String(quotation.tax_amount)
                      }
                      onChange={(e) =>
                        handleEditFieldChange(
                          "tax_amount",
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        editData.discount_percentage != null
                          ? String(editData.discount_percentage)
                          : String(quotation.discount_percentage)
                      }
                      onChange={(e) =>
                        handleEditFieldChange(
                          "discount_percentage",
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Job Reference ID
                    </label>
                    <input
                      type="text"
                      value={editData.job_reference_id ?? quotation.job_reference_id ?? ""}
                      onChange={(e) => handleEditFieldChange("job_reference_id", e.target.value)}
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="E.g. JOB12345"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Minimum Approvals
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={
                        editData.min_approval_count != null
                          ? String(editData.min_approval_count)
                          : String(quotation.min_approval_count ?? 1)
                      }
                      onChange={(e) =>
                        handleEditFieldChange(
                          "min_approval_count",
                          e.target.value === "" ? 1 : Number(e.target.value)
                        )
                      }
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={editData.payment_terms ?? quotation.payment_terms ?? ""}
                      onChange={(e) => handleEditFieldChange("payment_terms", e.target.value)}
                      disabled={isEditSubmitting}
                      className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g. 30 days from invoice date"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-1 sm:gap-[15px]">
                  <div>
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Description
                    </label>
                    <textarea
                      value={editData.description ?? quotation.description ?? ""}
                      onChange={(e) => handleEditFieldChange("description", e.target.value)}
                      disabled={isEditSubmitting}
                      className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      rows={3}
                      placeholder="Short description of this quotation"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Notes to Customer
                  </label>
                  <textarea
                    value={editData.notes_to_customer ?? quotation.notes_to_customer ?? ""}
                    onChange={(e) => handleEditFieldChange("notes_to_customer", e.target.value)}
                    disabled={isEditSubmitting}
                    className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                    placeholder="Any additional notes that will appear on the quote"
                  />
                </div>

                <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={isEditSubmitting}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditSubmitting}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Can>
    </AuthenticatedLayout>
  );
};

export default QuotationDetail;
