// Remove static currencies, fetch from API instead
// ...existing code...

import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../components/authenticated/AuthenticatedLayout";
import Can from "../../components/auth/Can";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/auth/selectors";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/common/Toast";

const currencies = ["KES", "USD", "EUR"];

export default function PaymentsToCompaniesReportPage() {
    const [currencies, setCurrencies] = useState<any[]>([]);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [filters, setFilters] = useState({
    company_id: "",
    currency_code: "",
    from: "",
    to: "",
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
        if (!accessToken) return;
        fetch('/api/currencies/list', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data.data)) setCurrencies(data.data);
          });
    // Fetch companies for dropdown
    fetch(`/api/companies/list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data.data || []));
  }, [accessToken]);


  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = `/api/reports/payments-to-companies${params.toString() ? `?${params.toString()}` : ""}`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        setPayments(Array.isArray(result.data) ? result.data : []);
      } else {
        const msg = result.error || "Failed to fetch report";
        setError(msg);
        addToast(msg, "error");
      }
    } catch (err) {
      setError("Network error");
      addToast("Network error", "error");
    }
    setLoading(false);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const exportCsv = () => {
    if (!payments.length) return;
    const header = [
      "Payment #",
      "Company",
      "Invoice #",
      "Amount",
      "Tax",
      "Net",
      "Currency",
      "Date",
    ];
    const rows = payments.map((p: any) => [
      p.transaction_number,
      p.company_name,
      p.invoice_number,
      p.total_amount,
      p.tax_amount,
      p.net_amount,
      p.currency,
      p.created_at ? new Date(p.created_at).toLocaleDateString() : "",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments-to-companies.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append("reportType", "paymentsToCompanies");
    const url = `/api/reports/export-pdf?${params.toString()}`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("PDF export failed");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "payments-to-companies.pdf";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => addToast("PDF export failed", "error"));
  };


  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_COMPANY_PAYMENT"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Payments to Companies Report</h5>
              <div className="flex gap-2">
                <button
                  className="rounded-full bg-transparent text-primary-500 px-4 py-2 flex items-center gap-2 hover:bg-primary-50 transition"
                  onClick={exportPdf}
                >
                  <i className="material-symbols-outlined !text-xl text-primary-500">picture_as_pdf</i> Export PDF
                </button>
                <button
                  className="rounded-full bg-transparent text-success-500 px-4 py-2 flex items-center gap-2 hover:bg-success-50 transition"
                  onClick={exportCsv}
                >
                  <i className="material-symbols-outlined !text-xl text-success-500">table</i> Export CSV
                </button>
              </div>
            </div>
          </div>
          {/* Card 2: Filters */}
          <div className="bg-white rounded-lg shadow p-5 mb-6">
            <form className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={handleFilterSubmit}>
              <div className="flex flex-col">
                <label htmlFor="company_id" className="mb-1 text-sm text-gray-600">Company</label>
                <select
                  id="company_id"
                  name="company_id"
                  value={filters.company_id}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">All Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="currency_code" className="mb-1 text-sm text-gray-600">Currency</label>
                <select
                  id="currency_code"
                  name="currency_code"
                  value={filters.currency_code}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">All Currencies</option>
                  {currencies.map((c: any) => (
                    <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>
                      {c.name || c.code || c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="from" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from"
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  placeholder="From date"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="to" className="mb-1 text-sm text-gray-600">To</label>
                <input
                  id="to"
                  type="date"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  placeholder="To date"
                />
              </div>
              <div className="flex items-end">
                <button
                  className="rounded-md bg-primary-500 text-white px-6 py-3 flex items-center gap-2 shadow hover:bg-primary-600 transition"
                  type="submit"
                  disabled={loading}
                >
                  <i className="material-symbols-outlined !text-xl">play_circle</i> Run Report
                </button>
              </div>
            </form>
          </div>
          {/* Card 3: Report Data Section */}
          <div className="bg-white rounded-lg shadow p-5 mb-[25px]">
            {!hasRun ? (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="material-symbols-outlined text-6xl text-primary-300 mb-4">hourglass_empty</i>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Run report to see data</h3>
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your payments to companies report.</p>
                <div className="flex items-center gap-2">
                  <i className="material-symbols-outlined text-2xl text-primary-500">play_circle</i>
                  <span className="text-primary-500 font-medium">Ready to run your report?</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-bordered table-sm min-w-max w-full">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Payment #</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Company</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Invoice #</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Amount</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Tax</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Net</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : payments.length === 0 ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      payments.map((p: any, idx: number) => (
                        <tr key={p.transaction_number} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.transaction_number}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.company_name}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.invoice_number}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.total_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.tax_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.net_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.currency}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
