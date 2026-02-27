"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface Quotation {
  id: number;
  quotation_number: string;
  title: string;
  status: string;
  total_amount: number;
  currency: string;
  customer?: { name: string };
  valid_until_date: string;
  created_at: string;
}

interface PaginationData {
  data: Quotation[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

const QuotationReport: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    approved: 0,
    rejected: 0,
    revised: 0,
    totalAmount: 0,
  });

  // Fetch all quotations for report
  useEffect(() => {
    const controller = new AbortController();

    const fetchQuotations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/quotations/list?per_page=1000", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data: PaginationData = await response.json();

        if (!response.ok) {
          addToast("Failed to load quotations", "error");
          setQuotations([]);
          return;
        }

        const quotationList = data.data || data;
        const list = Array.isArray(quotationList) ? quotationList : [];
        setQuotations(list);

        // Calculate statistics
        const calculatedStats = {
          total: list.length,
          draft: list.filter((q) => q.status === "draft").length,
          sent: list.filter((q) => q.status === "sent").length,
          approved: list.filter((q) => q.status === "approved").length,
          rejected: list.filter((q) => q.status === "rejected").length,
          revised: list.filter((q) => q.status === "revised").length,
          totalAmount: list.reduce((sum, q) => sum + (q.total_amount || 0), 0),
        };

        setStats(calculatedStats);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching quotations:", err);
        addToast("Error loading quotations.", "error");
        setQuotations([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchQuotations();
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [accessToken, addToast]);

  const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px]">
      <div className="flex items-center gap-[15px]">
        <div className={`flex-shrink-0 w-[60px] h-[60px] rounded-full flex items-center justify-center ${color}`}>
          <i className="material-symbols-outlined text-white !text-[28px]">assessment</i>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-[5px]">{label}</p>
          <h5 className="text-black dark:text-white text-2xl font-bold">{value}</h5>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-[20px] md:p-[25px]">
        <div className="space-y-[10px]">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] mb-[25px]">
        <StatCard
          label="Total Quotations"
          value={stats.total}
          color="bg-primary-500"
        />
        <StatCard
          label="Draft"
          value={stats.draft}
          color="bg-warning-500"
        />
        <StatCard
          label="Sent"
          value={stats.sent}
          color="bg-info-500"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          color="bg-success-500"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          color="bg-danger-500"
        />
        <StatCard
          label="Revised"
          value={stats.revised}
          color="bg-primary-500"
        />
      </div>

      {/* Report Table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="p-[20px] md:p-[25px] border-b border-gray-100 dark:border-[#172036]">
          <h5 className="text-black dark:text-white text-lg font-semibold">Quotation Details</h5>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Quotation #
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Title
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Customer
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Amount
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Status
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Valid Until
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Date Created
                </th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {quotations.length > 0 ? (
                quotations.map((quotation) => {
                  const getStatusBg = (status: string) => {
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

                  return (
                    <tr key={quotation.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                        <span className="font-medium text-sm text-primary-500">{quotation.quotation_number}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px]">
                        <span className="font-medium">{quotation.title}</span>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                        {quotation.customer?.name || "N/A"}
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                        <span className="font-semibold">
                          {quotation.currency} {quotation.total_amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                        <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusBg(quotation.status)}`}>
                          {quotation.status}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                        {quotation.valid_until_date ? new Date(quotation.valid_until_date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                        {quotation.created_at ? new Date(quotation.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default QuotationReport;
