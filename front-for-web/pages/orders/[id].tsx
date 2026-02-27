import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import AuthenticatedLayout from "../../components/authenticated/AuthenticatedLayout";
import { ToastContainer } from "../../components/common/Toast";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { useToast } from "../../hooks/useToast";
import { selectAccessToken } from "../../store/auth/selectors";

interface OrderItem {
  id: number;
  order_id: number;
  project_phase_id: number | null;
  item_name: string;
  item_description?: string | null;
  order_amount: number;
  quantity: number;
  total: number;
  custom_note?: string | null;
  is_taxable: boolean;
}

interface OrderTaxItem {
  id: number;
  order_id: number;
  item_name: string;
  item_type: string; // fixed | percent
  item_value: number | null;
  item_amount: number | null;
}

interface TaxSummary {
  id: number;
  name: string;
  code: string;
  description?: string | null;
}

interface CustomerSummary {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  contact_person_name?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

interface ProjectSummary {
  id: number;
  code: string;
  name: string;
  status?: string | null;
  priority?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  progress?: string | null;
}

interface OrderDocument {
  id: number;
  order_id: number;
  document_path: string;
  document_type: string;
  created_at: string;
  updated_at: string;
}

interface OrderDetail {
  id: number;
  order_number: string;
  quotation_id: number | null;
  project_id: number | null;
  customer_id: number | null;
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
  customer?: CustomerSummary;
  project?: ProjectSummary;
  orderItems?: OrderItem[];
  taxitems?: OrderTaxItem[];
  documents?: OrderDocument[];
}

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = (router.query.id as string) || "";
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<OrderDetail>>({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [itemEditData, setItemEditData] = useState<Partial<OrderItem>>({});
  const [isItemSubmitting, setIsItemSubmitting] = useState(false);
  const [itemEditError, setItemEditError] = useState<string | null>(null);
  const [isDeleteOrderItemModalOpen, setIsDeleteOrderItemModalOpen] = useState(false);
  const [orderItemToDelete, setOrderItemToDelete] = useState<OrderItem | null>(null);
  const [deleteOrderItemError, setDeleteOrderItemError] = useState<string | null>(null);
  const [isDeletingOrderItem, setIsDeletingOrderItem] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [editingTaxItem, setEditingTaxItem] = useState<OrderTaxItem | null>(null);
  const [taxItemEditData, setTaxItemEditData] = useState<Partial<OrderTaxItem>>({});
  const [isTaxSubmitting, setIsTaxSubmitting] = useState(false);
  const [taxItemEditError, setTaxItemEditError] = useState<string | null>(null);
  const [isDeleteTaxItemModalOpen, setIsDeleteTaxItemModalOpen] = useState(false);
  const [taxItemToDelete, setTaxItemToDelete] = useState<OrderTaxItem | null>(null);
  const [deleteTaxItemError, setDeleteTaxItemError] = useState<string | null>(null);
  const [isDeletingTaxItem, setIsDeletingTaxItem] = useState(false);
  const [taxes, setTaxes] = useState<TaxSummary[]>([]);
  const [loadingTaxes, setLoadingTaxes] = useState(false);
  const [taxesError, setTaxesError] = useState<string | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<OrderDocument | null>(null);
  const [documentEditData, setDocumentEditData] = useState<Partial<OrderDocument>>({});
  const [isDocumentSubmitting, setIsDocumentSubmitting] = useState(false);
  const [documentEditError, setDocumentEditError] = useState<string | null>(null);
  const [isDeleteDocumentModalOpen, setIsDeleteDocumentModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<OrderDocument | null>(null);
  const [deleteDocumentError, setDeleteDocumentError] = useState<string | null>(null);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<number | null>(
    null
  );
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const isApproved = order?.status === "approved";

  useEffect(() => {
    if (!router.isReady || !orderId || !accessToken) return;

    const controller = new AbortController();

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/orders/${orderId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data = await resp.json();

        if (!resp.ok) {
          addToast(data?.message || "Failed to load order details", "error");
          return;
        }

        const orderData = data.data || data;
        setOrder(orderData as OrderDetail);
        setEditData(orderData as OrderDetail);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch order error", err);
        addToast("Error loading order. Please refresh the page.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    return () => controller.abort();
  }, [orderId, accessToken, router.isReady, addToast]);

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
        // eslint-disable-next-line no-console
        console.error("fetch taxes error", err);
        setTaxesError("Error loading taxes");
      } finally {
        setLoadingTaxes(false);
      }
    };

    fetchTaxes();

    return () => controller.abort();
  }, [accessToken, addToast]);
  
  // When editing a tax item, ensure tax dropdown is prefilled once taxes load
  useEffect(() => {
    if (!editingTaxItem || !taxes.length) return;

    const currentTaxId = (taxItemEditData as any).tax_id;
    if (currentTaxId != null) return;

    const matchedTax = taxes.find((t) => t.name === editingTaxItem.item_name);
    if (!matchedTax) return;

    setTaxItemEditData((prev) => ({
      ...prev,
      tax_id: matchedTax.id,
      item_name: matchedTax.name,
    }));
  }, [editingTaxItem, taxes, taxItemEditData]);

  const hasTaxItems = useMemo(() => {
    return !!order && Array.isArray(order.taxitems) && order.taxitems.length > 0;
  }, [order]);

  const computedTax = useMemo(() => {
    if (!order || !hasTaxItems) {
      return {
        taxLines: [] as { name: string; type: string; value: number | null; amount: number }[],
        totalTaxAmount: order ? order.tax_amount : 0,
        effectiveTotal: order ? order.total_amount : 0,
      };
    }

    const subtotal = Number(order.subtotal_amount || 0);
    const discount = Number(order.discount_amount || 0);

    const taxLines = (order.taxitems || []).map((taxItem) => {
      const baseValue = taxItem.item_value != null ? Number(taxItem.item_value) : 0;
      let amount = 0;

      if (taxItem.item_type === "fixed") {
        amount = baseValue;
      } else if (taxItem.item_type === "percent") {
        amount = subtotal * (baseValue / 100);
      }

      return {
        name: taxItem.item_name,
        type: taxItem.item_type,
        value: taxItem.item_value,
        amount,
      };
    });

    const totalTaxAmount = taxLines.reduce((sum, line) => sum + line.amount, 0);
    const effectiveTotal = subtotal + totalTaxAmount - discount;

    return {
      taxLines,
      totalTaxAmount,
      effectiveTotal,
    };
  }, [order, hasTaxItems]);

  const previewTaxAmount = useMemo(() => {
    if (!order) return null;

    const value = taxItemEditData.item_value;
    if (value == null) return null;

    const type = (taxItemEditData.item_type || "fixed").toString();
    const baseAmount = (order.orderItems || []).reduce((sum, item) => {
      const lineTotal =
        (item as any).total ?? item.order_amount * item.quantity;
      return sum + Number(lineTotal || 0);
    }, 0);

    if (type === "fixed") {
      return Number(value);
    }

    if (type === "percent") {
      return baseAmount * (Number(value) / 100);
    }

    return null;
  }, [order, taxItemEditData.item_type, taxItemEditData.item_value]);

  const reloadOrder = async () => {
    if (!orderId || !accessToken) return;

    try {
      const resp = await fetch(`/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        addToast(data?.message || "Failed to reload order", "error");
        return;
      }

      const orderData = data.data || data;
      setOrder(orderData as OrderDetail);
      setEditData(orderData as OrderDetail);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("reload order error", err);
      addToast("Error reloading order. Please refresh the page.", "error");
    }
  };

  const handleSendEmail = async () => {
    if (!order || isSendingEmail) return;

    try {
      setIsSendingEmail(true);

      const response = await fetch("/api/orders/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: order.id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Failed to send order email";
        addToast(message, "error");
        return;
      }

      addToast(
        data?.message || "Order emailed to customer successfully.",
        "success"
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error sending order email:", err);
      addToast("Failed to send order email. Please try again.", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleGenerateCustInvoice = async () => {
    if (!order || isGeneratingInvoice) return;

    try {
      setIsGeneratingInvoice(true);

      const bodyData = {
        title: (order.title || "").toString(),
        description: (order.description ?? "").toString(),
        status: "approved",
        currency: (order.currency || "").toString(),
        payment_terms: (order.payment_terms ?? "").toString(),
        notes_to_customer: (order.notes_to_customer ?? "").toString(),
      };

      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Failed to generate customer invoice";
        addToast(message, "error");
        return;
      }

      addToast(
        data?.message ||
          "Order approved and customer invoice generated successfully.",
        "success"
      );

      await reloadOrder();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error generating customer invoice:", err);
      addToast(
        "Failed to generate customer invoice. Please try again.",
        "error"
      );
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!order || isDownloadingPdf) return;

    setIsDownloadingPdf(true);

    try {
      const response = await fetch(`/api/orders/download-pdf?id=${order.id}`, {
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
      link.download = `${order.order_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error downloading PDF:", err);
      addToast("Error downloading PDF", "error");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadDocument = async (doc: OrderDocument) => {
    if (!order || downloadingDocumentId === doc.id) return;

    try {
      setDownloadingDocumentId(doc.id);

      const response = await fetch(
        `/api/order-documents/${doc.id}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.message || "Failed to download document";
        addToast(message, "error");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const path = doc.document_path || "";
      const inferredName = path.split("/").pop();
      const fallbackName = `${doc.document_type || "document"}-${
        order.order_number
      }`;

      link.href = url;
      link.download = inferredName || fallbackName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error downloading document:", err);
      addToast("Error downloading document", "error");
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    if (Number.isNaN(value)) return "-";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const getStatusBadgeClass = (status: string): string => {
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

  const openEditModal = () => {
    if (!order) return;
    if (order.status === "approved") {
      addToast(
        "Approved orders are locked. Unapprove the order before editing.",
        "error"
      );
      return;
    }
    setEditError(null);
    setEditData({ ...order });
    setIsEditing(true);
  };

  const closeEditModal = () => {
    if (isEditSubmitting) return;
    setIsEditing(false);
    setEditError(null);
  };

  const handleEditFieldChange = (field: keyof OrderDetail, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsEditSubmitting(true);
    setEditError(null);

    try {
      const bodyData = {
        title: (editData.title || order.title || "").toString(),
        description: (editData.description ?? order.description ?? "").toString(),
        status: (editData.status || order.status || "").toString(),
        currency: (editData.currency || order.currency || "").toString(),
        payment_terms: (editData.payment_terms ?? order.payment_terms ?? "").toString(),
        notes_to_customer: (editData.notes_to_customer ?? order.notes_to_customer ?? "").toString(),
      };

      const resp = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const message = data?.message || "Failed to update order";
        setEditError(message);
        addToast(message, "error");
        return;
      }

      const updated = (data.data || data) as OrderDetail;
      setOrder(updated);
      setEditData(updated);
      setIsEditing(false);
      addToast("Order updated successfully", "success");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error updating order:", err);
      setEditError("An error occurred while updating the order.");
      addToast("Error updating order", "error");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const openEditItemModal = (item: OrderItem) => {
    setItemEditError(null);
    setEditingItem(item);
    setItemEditData({
      item_name: item.item_name,
      item_description: item.item_description ?? "",
      order_amount: item.order_amount,
      quantity: item.quantity,
      custom_note: item.custom_note ?? "",
      is_taxable: item.is_taxable,
    });
  };

  const closeEditItemModal = () => {
    if (isItemSubmitting) return;
    setEditingItem(null);
    setItemEditError(null);
    setItemEditData({});
  };

  const handleItemFieldChange = (field: keyof OrderItem, value: any) => {
    setItemEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !order) return;

    setIsItemSubmitting(true);
    setItemEditError(null);

    try {
      const bodyData = {
        item_name: (itemEditData.item_name ?? editingItem.item_name).toString(),
        item_description:
          (itemEditData.item_description ?? editingItem.item_description ?? "").toString(),
        order_amount: Number(
          itemEditData.order_amount ?? editingItem.order_amount ?? 0
        ),
        quantity: Number(itemEditData.quantity ?? editingItem.quantity ?? 1),
        custom_note: (itemEditData.custom_note ?? editingItem.custom_note ?? "").toString(),
        is_taxable: Boolean(itemEditData.is_taxable ?? editingItem.is_taxable),
      };

      const resp = await fetch(`/api/order-items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const message = data?.message || "Failed to update order item";
        setItemEditError(message);
        addToast(message, "error");
        return;
      }

      const updatedItem = (data.data || data) as OrderItem;
      setOrder({
        ...order,
        orderItems: (order.orderItems || []).map((oi) =>
          oi.id === updatedItem.id ? updatedItem : oi
        ),
      });

      setEditingItem(null);
      setItemEditData({});
      addToast("Order item updated successfully", "success");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error updating order item:", err);
      setItemEditError("An error occurred while updating the order item.");
      addToast("Error updating order item", "error");
    } finally {
      setIsItemSubmitting(false);
    }
  };
  const openDeleteItemModal = (item: OrderItem) => {
    if (!order) return;
    if (order.status === "approved") {
      addToast(
        "Cannot delete items on an approved order. Unapprove the order first.",
        "error"
      );
      return;
    }

    setOrderItemToDelete(item);
    setDeleteOrderItemError(null);
    setIsDeleteOrderItemModalOpen(true);
  };

  const closeDeleteOrderItemModal = () => {
    if (isDeletingOrderItem) return;
    setIsDeleteOrderItemModalOpen(false);
    setOrderItemToDelete(null);
    setDeleteOrderItemError(null);
  };

  const handleDeleteItem = async () => {
    if (!order || !orderItemToDelete) return;

    setIsDeletingOrderItem(true);
    setDeleteOrderItemError(null);

    try {
      const resp = await fetch(`/api/order-items/${orderItemToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (resp.status !== 204 && !resp.ok) {
        const data = await resp.json().catch(() => null);
        const message = data?.message || "Failed to delete order item";
        setDeleteOrderItemError(message);
        addToast(message, "error");
        return;
      }

      setOrder({
        ...order,
        orderItems: (order.orderItems || []).filter(
          (oi) => oi.id !== orderItemToDelete.id
        ),
      });

      addToast("Order item deleted successfully", "success");
      setIsDeleteOrderItemModalOpen(false);
      setOrderItemToDelete(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting order item:", err);
      setDeleteOrderItemError("Error deleting order item");
      addToast("Error deleting order item", "error");
    } finally {
      setIsDeletingOrderItem(false);
    }
  };
  const openAddTaxItemModal = () => {
    if (!order) return;
    if (order.status === "approved") {
      addToast(
        "Cannot add tax items to an approved order. Unapprove the order first.",
        "error"
      );
      return;
    }
    setTaxItemEditError(null);
    setEditingTaxItem(null);
    setTaxItemEditData({
      item_name: "",
      item_type: "percent",
      item_value: 0,
    });
    setIsTaxModalOpen(true);
  };

  const openEditTaxItemModal = (item: OrderTaxItem) => {
    setTaxItemEditError(null);
    const matchedTax = taxes.find((t) => t.name === item.item_name) || null;
    setEditingTaxItem(item);
    setTaxItemEditData({
      item_name: item.item_name,
      item_type: item.item_type,
      item_value: item.item_value ?? 0,
      // @ts-expect-error extend with tax_id for editing state only
      tax_id: matchedTax ? matchedTax.id : undefined,
    });
    setIsTaxModalOpen(true);
  };

  const closeTaxItemModal = () => {
    if (isTaxSubmitting) return;
    setIsTaxModalOpen(false);
    setEditingTaxItem(null);
    setTaxItemEditError(null);
    setTaxItemEditData({});
  };

  const handleTaxItemFieldChange = (field: keyof OrderTaxItem, value: any) => {
    setTaxItemEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitTaxItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsTaxSubmitting(true);
    setTaxItemEditError(null);

    try {
      const payload: any = {
        order_id: order.id,
        item_name: (taxItemEditData.item_name || "").toString(),
        item_type: (taxItemEditData.item_type || "fixed").toString(),
        item_value: Number(taxItemEditData.item_value ?? 0),
      };

      if ((taxItemEditData as any).tax_id != null) {
        payload.tax_id = Number((taxItemEditData as any).tax_id);
      }

      const url = editingTaxItem
        ? `/api/order-tax-items/${editingTaxItem.id}`
        : "/api/order-tax-items";

      const method = editingTaxItem ? "PUT" : "POST";

      const resp = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        const message = data?.message || "Failed to save tax item";
        setTaxItemEditError(message);
        addToast(message, "error");
        return;
      }

      await reloadOrder();

      setIsTaxModalOpen(false);
      setEditingTaxItem(null);
      setTaxItemEditData({});
      addToast(
        editingTaxItem
          ? "Tax item updated successfully"
          : "Tax item added successfully",
        "success"
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving tax item:", err);
      setTaxItemEditError("An error occurred while saving the tax item.");
      addToast("Error saving tax item", "error");
    } finally {
      setIsTaxSubmitting(false);
    }
  };
  const openDeleteTaxItemModal = (item: OrderTaxItem) => {
    if (!order) return;
    if (order.status === "approved") {
      addToast(
        "Cannot delete tax items on an approved order. Unapprove the order first.",
        "error"
      );
      return;
    }

    setTaxItemToDelete(item);
    setDeleteTaxItemError(null);
    setIsDeleteTaxItemModalOpen(true);
  };

  const closeDeleteTaxItemModal = () => {
    if (isDeletingTaxItem) return;
    setIsDeleteTaxItemModalOpen(false);
    setTaxItemToDelete(null);
    setDeleteTaxItemError(null);
  };

  const handleDeleteTaxItem = async () => {
    if (!order || !taxItemToDelete) return;

    setIsDeletingTaxItem(true);
    setDeleteTaxItemError(null);

    try {
      const resp = await fetch(`/api/order-tax-items/${taxItemToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (resp.status !== 204 && !resp.ok) {
        const data = await resp.json().catch(() => null);
        const message = data?.message || "Failed to delete tax item";
        setDeleteTaxItemError(message);
        addToast(message, "error");
        return;
      }

      await reloadOrder();

      addToast("Tax item deleted successfully", "success");
      setIsDeleteTaxItemModalOpen(false);
      setTaxItemToDelete(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting tax item:", err);
      setDeleteTaxItemError("Error deleting tax item");
      addToast("Error deleting tax item", "error");
    } finally {
      setIsDeletingTaxItem(false);
    }
  };

  const openAddDocumentModal = () => {
    if (!order) return;
    if (order.status === "approved") {
      addToast(
        "Cannot add documents to an approved order. Unapprove the order first.",
        "error"
      );
      return;
    }
    setDocumentEditError(null);
    setEditingDocument(null);
    setDocumentEditData({
      document_type: "attachments",
    });
    setDocumentFile(null);
    setIsDocumentModalOpen(true);
  };

  const openEditDocumentModal = (doc: OrderDocument) => {
    setDocumentEditError(null);
    setEditingDocument(doc);
    setDocumentEditData({
      document_type: doc.document_type,
    });
    setDocumentFile(null);
    setIsDocumentModalOpen(true);
  };

  const closeDocumentModal = () => {
    if (isDocumentSubmitting) return;
    setIsDocumentModalOpen(false);
    setEditingDocument(null);
    setDocumentEditError(null);
    setDocumentEditData({});
    setDocumentFile(null);
  };

  const handleDocumentFieldChange = (
    field: keyof OrderDocument,
    value: any
  ) => {
    setDocumentEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsDocumentSubmitting(true);
    setDocumentEditError(null);

    try {
      const documentType = (documentEditData.document_type || "attachments").toString();

      const url = editingDocument
        ? `/api/order-documents/${editingDocument.id}`
        : "/api/order-documents";

      const method = editingDocument ? "PUT" : "POST";

      let resp: Response;

      if (!documentFile) {
        setDocumentEditError("Please choose a document file to upload.");
        setIsDocumentSubmitting(false);
        return;
      }

      // Always send multipart/form-data to the Next.js proxy,
      // which will stream it directly to Laravel.
      const formData = new FormData();
      formData.append("order_id", String(order.id));
      formData.append("document_type", documentType);
      formData.append("document_file", documentFile);

      resp = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        const message = data?.message || "Failed to save document";
        setDocumentEditError(message);
        addToast(message, "error");
        return;
      }

      const updatedDoc = (data.data || data) as OrderDocument;

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              documents: editingDocument
                ? (prev.documents || []).map((d) =>
                    d.id === updatedDoc.id ? updatedDoc : d
                  )
                : [...(prev.documents || []), updatedDoc],
            }
          : prev
      );

      setIsDocumentModalOpen(false);
      setEditingDocument(null);
      setDocumentEditData({});
      addToast(
        editingDocument
          ? "Document updated successfully"
          : "Document added successfully",
        "success"
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving document:", err);
      setDocumentEditError("An error occurred while saving the document.");
      addToast("Error saving document", "error");
    } finally {
      setIsDocumentSubmitting(false);
    }
  };
  const openDeleteDocumentModal = (doc: OrderDocument) => {
    if (!order) return;
    if (order.status === "approved") {
      addToast(
        "Cannot delete documents from an approved order. Unapprove the order first.",
        "error"
      );
      return;
    }

    setDocumentToDelete(doc);
    setDeleteDocumentError(null);
    setIsDeleteDocumentModalOpen(true);
  };

  const closeDeleteDocumentModal = () => {
    if (isDeletingDocument) return;
    setIsDeleteDocumentModalOpen(false);
    setDocumentToDelete(null);
    setDeleteDocumentError(null);
  };

  const handleDeleteDocument = async () => {
    if (!order || !documentToDelete) return;

    setIsDeletingDocument(true);
    setDeleteDocumentError(null);

    try {
      const resp = await fetch(`/api/order-documents/${documentToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (resp.status !== 204 && !resp.ok) {
        const data = await resp.json().catch(() => null);
        const message = data?.message || "Failed to delete document";
        setDeleteDocumentError(message);
        addToast(message, "error");
        return;
      }

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              documents: (prev.documents || []).filter(
                (d) => d.id !== documentToDelete.id
              ),
            }
          : prev
      );

      addToast("Document deleted successfully", "success");
      setIsDeleteDocumentModalOpen(false);
      setDocumentToDelete(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting document:", err);
      setDeleteDocumentError("Error deleting document");
      addToast("Error deleting document", "error");
    } finally {
      setIsDeletingDocument(false);
    }
  };
  if (loading && !order) {
    return (
      <AuthenticatedLayout>
        <div className="p-[20px] md:p-[25px]">
          <div className="space-y-[10px]">
            {[...Array(5)].map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div
                key={index}
                className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!loading && !order) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-[60px]">
          <p className="text-gray-500 dark:text-gray-400 mb-[20px]">Order not found</p>
          <Link
            href="/orders/order-list"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600"
          >
            Back to Orders
          </Link>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <DeleteConfirmationModal
        isOpen={isDeleteOrderItemModalOpen}
        title="Delete Order Item"
        message="Are you sure you want to delete this order item? This action cannot be undone."
        itemName={orderItemToDelete?.item_name || ""}
        isDeleting={isDeletingOrderItem}
        error={deleteOrderItemError}
        onConfirm={handleDeleteItem}
        onCancel={closeDeleteOrderItemModal}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteTaxItemModalOpen}
        title="Delete Tax Item"
        message="Are you sure you want to delete this tax item? This action cannot be undone."
        itemName={taxItemToDelete?.item_name || "Tax item"}
        isDeleting={isDeletingTaxItem}
        error={deleteTaxItemError}
        onConfirm={handleDeleteTaxItem}
        onCancel={closeDeleteTaxItemModal}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteDocumentModalOpen}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        itemName={documentToDelete?.document_type || "Document"}
        isDeleting={isDeletingDocument}
        error={deleteDocumentError}
        onConfirm={handleDeleteDocument}
        onCancel={closeDeleteDocumentModal}
      />

      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-1">Order Details</h5>
          <p className="text-sm text-gray-500">Order #{order.order_number}</p>
        </div>

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
            <Link href="/orders/order-list" className="hover:text-primary-500">
              Orders
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            {order.order_number}
          </li>
        </ol>
      </div>

      {/* Header Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[20px]">
          <div>
            <h4 className="text-black dark:text-white text-xl font-semibold mb-[10px]">
              {order.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Order #:{" "}
              <span className="font-semibold">{order.order_number}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-[10px]">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
            >
              Back
            </button>
            {order.quotation_id && (
              <Link
                href={`/quotation/${order.quotation_id}`}
                target="_blank"
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              >
                View Parent Quotation
              </Link>
            )}
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
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 0
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
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 1
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">list_alt</i>
                  Order Items
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 2
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">percent</i>
                  Tax Items
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 3
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">description</i>
                  Documents
                </button>
              </li>
            </ul>
          </div>

          {/* Overview Tab */}
          {activeTab === 0 && (
            <div className="pt-[20px]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Basic Info */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Basic Information
                    </h6>

                    <div className="space-y-[15px]">
                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span
                          className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {order.currency}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      {order.description && (
                        <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                            Description:
                          </span>
                          <p className="text-black dark:text-white text-sm">
                            {order.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Line Items */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Order Line Items
                    </h6>

                    {(!order.orderItems || order.orderItems.length === 0) && (
                      <p className="text-xs text-gray-500">
                        No items on this order.
                      </p>
                    )}

                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md mb-[10px]">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-[#15203c]">
                            <tr>
                              <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                Item
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Unit
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Qty
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.orderItems ?? []).map((item) => (
                              <tr
                                key={item.id}
                                className="border-b border-gray-100 dark:border-[#172036] align-middle"
                              >
                                <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                  <div className="font-medium">{item.item_name}</div>
                                  {item.item_description && (
                                    <div className="text-xs text-gray-500">
                                      {item.item_description}
                                    </div>
                                  )}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {formatCurrency(item.order_amount, order.currency)}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {item.quantity}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {formatCurrency(
                                    item.total ?? item.order_amount * item.quantity,
                                    order.currency
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Financial Summary
                    </h6>

                    <div className="space-y-[15px] text-sm">
                      <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(order.subtotal_amount, order.currency)}
                        </span>
                      </div>

                      {hasTaxItems ? (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">
                            Tax (from items)
                          </span>
                          <span className="font-medium">
                            {formatCurrency(
                              computedTax.totalTaxAmount,
                              order.currency
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pb-[15px] border-gray-100 dark:border-[#172036] border-b">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="font-medium">
                            {formatCurrency(order.tax_amount, order.currency)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                        <span className="font-medium">
                          {formatCurrency(order.discount_amount || 0, order.currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-[15px] border-t-2 border-gray-200 dark:border-[#172036] text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold text-primary-500 text-lg">
                          {formatCurrency(
                            hasTaxItems
                              ? computedTax.effectiveTotal
                              : order.total_amount,
                            order.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(order.payment_terms || order.notes_to_customer) && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Additional Information
                      </h6>

                      <div className="space-y-[15px]">
                        {order.payment_terms && (
                          <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                            <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                              Payment Terms:
                            </span>
                            <p className="text-black dark:text-white text-sm">
                              {order.payment_terms}
                            </p>
                          </div>
                        )}

                        {order.notes_to_customer && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                              Notes to Customer:
                            </span>
                            <p className="text-black dark:text-white text-sm">
                              {order.notes_to_customer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Order Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Order Summary
                    </h6>

                    <div className="space-y-[10px] text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Order #
                        </span>
                        <span className="text-black dark:text-white font-medium">
                          {order.order_number}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Currency
                        </span>
                        <span className="text-black dark:text-white font-medium">
                          {order.currency}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Created
                        </span>
                        <span className="text-black dark:text-white font-medium">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Updated
                        </span>
                        <span className="text-black dark:text-white font-medium">
                          {order.updated_at
                            ? new Date(order.updated_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer */}
                  {order.customer && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Customer
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/customer/${order.customer.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {order.customer.name}
                            </Link>
                          </span>
                        </div>

                        {order.customer.contact_person_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Contact
                            </span>
                            <span className="text-black dark:text-white">
                              {order.customer.contact_person_name}
                            </span>
                          </div>
                        )}

                        {order.customer.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email</span>
                            <span className="text-black dark:text-white">
                              {order.customer.email}
                            </span>
                          </div>
                        )}

                        {order.customer.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phone</span>
                            <span className="text-black dark:text-white">
                              {order.customer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  {order.project && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Project
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/project/${order.project.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {order.project.name}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Code</span>
                          <span className="text-black dark:text-white">
                            {order.project.code}
                          </span>
                        </div>

                        {order.project.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                            <span className="text-black dark:text-white capitalize">
                              {order.project.status}
                            </span>
                          </div>
                        )}

                        {order.project.progress && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Progress
                            </span>
                            <span className="text-black dark:text-white">
                              {Number(order.project.progress).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Actions
                    </h6>

                    <div className="space-y-[10px]">
                      {!isApproved && (
                        <button
                          type="button"
                          onClick={handleGenerateCustInvoice}
                          disabled={isGeneratingInvoice}
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-info-50 dark:bg-info-950 text-info-500 hover:bg-info-100 dark:hover:bg-info-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                            receipt_long
                          </i>
                          {isGeneratingInvoice
                            ? "Generating Invoice..."
                            : "Approve (Generates Invoice)"}
                        </button>
                      )}

                      {!isApproved && (
                        <button
                          type="button"
                          onClick={openEditModal}
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                            edit
                          </i>
                          Edit Order
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-info-50 dark:bg-info-950 text-info-500 hover:bg-info-100 dark:hover:bg-info-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                          download
                        </i>
                        {isDownloadingPdf ? "Downloading..." : "Download PDF"}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-success-50 dark:bg-success-950 text-success-500 hover:bg-success-100 dark:hover:bg-success-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                          mail
                        </i>
                        {isSendingEmail ? "Sending..." : "Send Email"}
                      </button>

                      {isApproved && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!order) return;
                            try {
                              const resp = await fetch("/api/orders/unapprove", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify({ id: order.id }),
                              });

                              const data: any = await resp.json().catch(() => null);

                              if (!resp.ok) {
                                addToast(
                                  data?.message || "Failed to unapprove order",
                                  "error"
                                );
                                return;
                              }

                              const updated = (data.data || data) as OrderDetail;
                              setOrder(updated);
                              setEditData(updated);
                              addToast(
                                "Order status changed back to sent and related draft customer invoices without payments were removed.",
                                "success"
                              );
                            } catch (err) {
                              // eslint-disable-next-line no-console
                              console.error("unapprove order error", err);
                              addToast(
                                "Error unapproving order. Please try again.",
                                "error"
                              );
                            }
                          }}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-warning-50 dark:bg-[#3b2a14] text-warning-600 hover:bg-warning-100 dark:hover:bg-[#4a3419]"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                            undo
                          </i>
                          Unapprove Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items Tab */}
          {activeTab === 1 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                  Order Items
                </h6>

                {(!order.orderItems || order.orderItems.length === 0) && (
                  <p className="text-xs text-gray-500">No items on this order.</p>
                )}

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Item
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Unit
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Qty
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Total
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.orderItems ?? []).map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              <div className="font-medium">{item.item_name}</div>
                              {item.item_description && (
                                <div className="text-xs text-gray-500">
                                  {item.item_description}
                                </div>
                              )}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(item.order_amount, order.currency)}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {item.quantity}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(
                                item.total ?? item.order_amount * item.quantity,
                                order.currency
                              )}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px] whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => openEditItemModal(item)}
                                disabled={isApproved}
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 mr-[6px] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteItemModal(item)}
                                disabled={
                                  isApproved ||
                                  (isDeletingOrderItem &&
                                    orderItemToDelete?.id === item.id)
                                }
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-danger-50 dark:bg-danger-950 text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeletingOrderItem && orderItemToDelete?.id === item.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tax Items Tab */}
          {activeTab === 2 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Tax Items
                  </h6>
                  <button
                    type="button"
                    onClick={openAddTaxItemModal}
                    disabled={isApproved}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-500 text-white hover:bg-primary-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="material-symbols-outlined mr-[6px] !text-[18px]">
                      add
                    </i>
                    Add Tax Item
                  </button>
                </div>

                {(!order.taxitems || order.taxitems.length === 0) && (
                  <p className="text-xs text-gray-500">No tax items on this order.</p>
                )}

                {order.taxitems && order.taxitems.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Name
                          </th>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Type
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Value
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Amount
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.taxitems || []).map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {item.item_name}
                            </td>
                            <td className="text-sm capitalize ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {item.item_type}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {item.item_value != null
                                ? item.item_type === "percent"
                                  ? `${item.item_value.toFixed(2)}%`
                                  : formatCurrency(item.item_value, order.currency)
                                : "-"}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(
                                item.item_amount ?? 0,
                                order.currency
                              )}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px] whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => openEditTaxItemModal(item)}
                                disabled={isApproved}
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 mr-[6px] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteTaxItemModal(item)}
                                disabled={
                                  isApproved ||
                                  (isDeletingTaxItem &&
                                    taxItemToDelete?.id === item.id)
                                }
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-danger-50 dark:bg-danger-950 text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeletingTaxItem && taxItemToDelete?.id === item.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 3 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Documents
                  </h6>
                  <button
                    type="button"
                    onClick={openAddDocumentModal}
                    disabled={isApproved}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-500 text-white hover:bg-primary-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="material-symbols-outlined mr-[6px] !text-[18px]">
                      add
                    </i>
                    Add Document
                  </button>
                </div>

                {(!order.documents || order.documents.length === 0) && (
                  <p className="text-xs text-gray-500">
                    No documents attached to this order.
                  </p>
                )}

                {order.documents && order.documents.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Type
                          </th>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Path
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Created
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.documents.map((doc) => (
                          <tr
                            key={doc.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px] capitalize">
                              {doc.document_type || "Document"}
                            </td>
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px] font-mono break-all">
                              {doc.document_path}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {doc.created_at
                                ? new Date(doc.created_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px] whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDocument(doc)}
                                  disabled={downloadingDocumentId === doc.id}
                                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-info-50 dark:bg-info-950 text-info-500 hover:bg-info-100 dark:hover:bg-info-900 disabled:opacity-50 disabled:cursor-not-allowed mr-[6px]"
                                >
                                  {downloadingDocumentId === doc.id
                                    ? "Downloading..."
                                    : "Download"}
                                </button>
                              <button
                                type="button"
                                onClick={() => openEditDocumentModal(doc)}
                                disabled={isApproved}
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 mr-[6px] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteDocumentModal(doc)}
                                disabled={
                                  isApproved ||
                                  (isDeletingDocument &&
                                    documentToDelete?.id === doc.id)
                                }
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[4px] text-xs bg-danger-50 dark:bg-danger-950 text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeletingDocument && documentToDelete?.id === doc.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Order Modal */}
      {isEditing && order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h6 className="font-semibold text-black dark:text-white">Edit Order</h6>
              {isEditSubmitting && (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Saving...</span>
                </div>
              )}
            </div>

            {editError && (
              <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                <div className="flex gap-[10px]">
                  <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                  <div>
                    <p className="text-sm font-medium text-danger-700 dark:text-danger-400 whitespace-pre-wrap">
                      {editError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitEdit} className="space-y-[20px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Title <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={editData.title ?? order.title}
                  onChange={(e) => handleEditFieldChange("title", e.target.value)}
                  disabled={isEditSubmitting}
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Order title"
                />
              </div>

              <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Status
                  </label>
                  <select
                    value={editData.status ?? order.status}
                    onChange={(e) => handleEditFieldChange("status", e.target.value)}
                    disabled={isEditSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <p
                    className={`mt-[6px] text-[11px] ${
                      (editData.status ?? order.status) === "approved"
                        ? "text-primary-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Note: When status is set to
                    {" "}
                    <span className="font-semibold">Approved</span>, a draft customer
                    invoice will be generated automatically if one does not already
                    exist.
                  </p>
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={editData.currency ?? order.currency}
                    onChange={(e) => handleEditFieldChange("currency", e.target.value)}
                    disabled={isEditSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. USD"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={editData.payment_terms ?? order.payment_terms ?? ""}
                  onChange={(e) => handleEditFieldChange("payment_terms", e.target.value)}
                  disabled={isEditSubmitting}
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g. 30 days from invoice date"
                />
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Description
                </label>
                <textarea
                  value={editData.description ?? order.description ?? ""}
                  onChange={(e) => handleEditFieldChange("description", e.target.value)}
                  disabled={isEditSubmitting}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Short description of this order"
                />
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Notes to Customer
                </label>
                <textarea
                  value={editData.notes_to_customer ?? order.notes_to_customer ?? ""}
                  onChange={(e) => handleEditFieldChange("notes_to_customer", e.target.value)}
                  disabled={isEditSubmitting}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Any additional notes that will appear on the order"
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

      {/* Edit Order Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[650px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h6 className="font-semibold text-black dark:text-white">Edit Order Item</h6>
              {isItemSubmitting && (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Saving...</span>
                </div>
              )}
            </div>

            {itemEditError && (
              <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                <div className="flex gap-[10px]">
                  <i className="material-symbols-outlined text-danger-500 !text-[20px]">error</i>
                  <div>
                    <p className="text-sm font-medium text-danger-700 dark:text-danger-400 whitespace-pre-wrap">
                      {itemEditError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitItemEdit} className="space-y-[20px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Item Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemEditData.item_name ?? editingItem.item_name}
                  onChange={(e) => handleItemFieldChange("item_name", e.target.value)}
                  disabled={isItemSubmitting}
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Description
                </label>
                <textarea
                  value={itemEditData.item_description ?? editingItem.item_description ?? ""}
                  onChange={(e) => handleItemFieldChange("item_description", e.target.value)}
                  disabled={isItemSubmitting}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Short description of this item"
                />
              </div>

              <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Unit Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={
                      itemEditData.order_amount ?? editingItem.order_amount ?? 0
                    }
                    onChange={(e) =>
                      handleItemFieldChange("order_amount", Number(e.target.value))
                    }
                    disabled={isItemSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={itemEditData.quantity ?? editingItem.quantity ?? 1}
                    onChange={(e) =>
                      handleItemFieldChange("quantity", Number(e.target.value))
                    }
                    disabled={isItemSubmitting}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Custom Note
                </label>
                <textarea
                  value={itemEditData.custom_note ?? editingItem.custom_note ?? ""}
                  onChange={(e) => handleItemFieldChange("custom_note", e.target.value)}
                  disabled={isItemSubmitting}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={2}
                  placeholder="Any notes for this item"
                />
              </div>

              <div className="flex items-center gap-[10px]">
                <input
                  id="edit-item-taxable"
                  type="checkbox"
                  checked={Boolean(itemEditData.is_taxable ?? editingItem.is_taxable)}
                  onChange={(e) => handleItemFieldChange("is_taxable", e.target.checked)}
                  disabled={isItemSubmitting}
                  className="w-[16px] h-[16px] rounded border border-gray-300 dark:border-[#172036] text-primary-500 focus:ring-primary-500"
                />
                <label
                  htmlFor="edit-item-taxable"
                  className="text-sm text-black dark:text-white cursor-pointer"
                >
                  Taxable
                </label>
              </div>

              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={closeEditItemModal}
                  disabled={isItemSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isItemSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Item Modal */}
      {isTaxModalOpen && order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto shadow-xl shadow-black/10 dark:shadow-black/40">
            <h5 className="mb-[8px] text-black dark:text-white font-semibold">
              {editingTaxItem ? "Edit Tax Item" : "Add Tax Item"}
            </h5>
            <p className="mb-[16px] text-xs text-gray-500 dark:text-gray-400">
              Configure an additional tax line that will be applied on top
              of your current order items.
            </p>

            {taxItemEditError && (
              <div className="mb-[15px] text-sm font-medium text-danger-500 bg-danger-50 dark:bg-danger-500/10 border border-danger-100 dark:border-danger-500/40 rounded-md px-[12px] py-[8px]">
                {taxItemEditError}
              </div>
            )}

            <form onSubmit={handleSubmitTaxItem} className="space-y-[20px] mt-[5px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Tax Name <span className="text-danger-500">*</span>
                </label>
                <select
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                  value={(taxItemEditData as any).tax_id ?? ""}
                  onChange={(e) => {
                    const selectedId = e.target.value ? Number(e.target.value) : undefined;
                    const selectedTax = taxes.find((t) => t.id === selectedId) || null;
                    handleTaxItemFieldChange("item_name", selectedTax ? selectedTax.name : "");
                    // @ts-expect-error extend with tax_id for editing state only
                    handleTaxItemFieldChange("tax_id", selectedId ?? null);
                  }}
                  required
                  disabled={loadingTaxes || taxes.length === 0}
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

              <div className="sm:grid sm:grid-cols-2 sm:gap-[15px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Type <span className="text-danger-500">*</span>
                  </label>
                  <select
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                    value={taxItemEditData.item_type || "fixed"}
                    onChange={(e) =>
                      handleTaxItemFieldChange("item_type", e.target.value)
                    }
                    required
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percent">Percentage</option>
                  </select>
                  <p className="mt-[6px] text-[11px] text-gray-500 dark:text-gray-400">
                    Fixed adds a flat amount; Percentage applies on the
                    total of order items.
                  </p>
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Value{" "}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      { (taxItemEditData.item_type || "fixed") === "percent"
                        ? "as % of items total"
                        : `in ${order.currency}` }
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={taxItemEditData.item_value ?? ""}
                    onChange={(e) =>
                      handleTaxItemFieldChange(
                        "item_value",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    required
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  />

                  {previewTaxAmount != null && (
                    <div className="mt-[6px] rounded-md border border-dashed border-primary-200 dark:border-primary-500/40 bg-primary-50/70 dark:bg-primary-500/10 px-[12px] py-[8px] text-xs">
                      <p className="text-gray-800 dark:text-gray-100">
                        Estimated tax on current items:{" "}
                        <span className="font-semibold">
                          {formatCurrency(previewTaxAmount, order.currency)}
                        </span>
                      </p>
                      {(taxItemEditData.item_type || "fixed") === "percent" && (
                        <p className="mt-[2px] text-[11px] text-gray-600 dark:text-gray-300">
                          Calculated from the sum of all order line items.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={closeTaxItemModal}
                  disabled={isTaxSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTaxSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTaxSubmitting
                    ? "Saving..."
                    : editingTaxItem
                    ? "Update Tax Item"
                    : "Add Tax Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {isDocumentModalOpen && order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto shadow-xl shadow-black/10 dark:shadow-black/40">
            <h5 className="mb-[8px] text-black dark:text-white font-semibold">
              {editingDocument ? "Edit Document" : "Add Document"}
            </h5>
            <p className="mb-[16px] text-xs text-gray-500 dark:text-gray-400">
              Attach supporting files such as proposals, signed terms, or
              other documents to this order record.
            </p>

            {documentEditError && (
              <div className="mb-[15px] text-sm font-medium text-danger-500 bg-danger-50 dark:bg-danger-500/10 border border-danger-100 dark:border-danger-500/40 rounded-md px-[12px] py-[8px]">
                {documentEditError}
              </div>
            )}

            <form onSubmit={handleSubmitDocument} className="space-y-[20px] mt-[5px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Document Type <span className="text-danger-500">*</span>
                </label>
                <select
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                  value={documentEditData.document_type || "attachments"}
                  onChange={(e) =>
                    handleDocumentFieldChange("document_type", e.target.value)
                  }
                  required
                >
                  <option value="proposal">Proposal</option>
                  <option value="terms">Terms</option>
                  <option value="attachments">Attachments</option>
                </select>
                <p className="mt-[6px] text-[11px] text-gray-500 dark:text-gray-400">
                  Use a descriptive type so collaborators can quickly
                  identify what this document represents.
                </p>
              </div>

              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Choose file <span className="text-danger-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setDocumentFile(
                      e.target.files && e.target.files[0] ? e.target.files[0] : null
                    )
                  }
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer"
                  required
                />
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  The file will be uploaded and its stored path will be
                  saved automatically.
                </p>
              </div>

              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={closeDocumentModal}
                  disabled={isDocumentSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDocumentSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDocumentSubmitting
                    ? "Saving..."
                    : editingDocument
                    ? "Update Document"
                    : "Add Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default OrderDetailPage;
