// ...existing code...

import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../components/authenticated/AuthenticatedLayout";
import Can from "../../components/auth/Can";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/auth/selectors";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/common/Toast";
import { formatCurrency } from "../../utils/format";

// Remove hardcoded currencies

export default function TaxPaymentsCompanyReportPage() {
  const [totals, setTotals] = useState<any>({});
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [type, setType] = useState('customer');
  const [customers, setCustomers] = useState<any[]>([]);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [filters, setFilters] = useState({
    company_id: "",
    customer_id: "",
    currency_code: "",
    from: "",
    to: "",
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    // Fetch companies, customers, and currencies for dropdowns
    fetch(`/api/companies/list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data.data || []));

    fetch(`/api/customers/list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data.data || []));

    fetch(`/api/currencies/list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setCurrencies(data.data);
      });
  }, [accessToken]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = `/api/reports/tax-payments-company${params.toString() ? `?${params.toString()}` : ""}`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        setTransactions(Array.isArray(result.transactions) ? result.transactions : []);
        // Store totals in state
        setTotals(result.totals || {});
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
    fetchTransactions();
  };

  const exportCsv = () => {
    if (!transactions.length) return;
    const header = [
      "Transaction #",
      "Company",
      "Invoice #",
      "Tax",
      "Currency",
      "Date",
    ];
    const rows = transactions.map((t: any) => [
      t.transaction_number,
      t.company_name,
      t.invoice_number,
      t.tax_amount,
      t.currency,
      t.created_at ? new Date(t.created_at).toLocaleDateString() : "",
    ]);
    // Add totals row
    let totalsRow: string[] = [];
    if (totals && typeof totals.taxes !== "undefined") {
      totalsRow = ["", "", "", totals.taxes, "", ""];
    }
    const csv = [header, ...rows, totalsRow.length ? ["", "", "", "Total Taxes", "", ""] : [], totalsRow.length ? totalsRow : []].filter(r => r.length).map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tax-payments-company.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append("reportType", "taxPaymentsCompany");
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
        a.download = "tax-payments-company.pdf";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => addToast("PDF export failed", "error"));
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_COMPANY_PAYMENT", "ROLE_VIEW_TAX"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Tax Payments (Company) Report</h5>
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
            <form className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4" onSubmit={handleFilterSubmit}>
              <div className="flex flex-col">
                <label htmlFor="type" className="mb-1 text-sm text-gray-600">Type</label>
                <select
                  id="type"
                  name="type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="customer">Customer</option>
                  <option value="company">Company</option>
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
              {type === 'customer' && (
                <div className="flex flex-col">
                  <label htmlFor="customer_id" className="mb-1 text-sm text-gray-600">Customer</label>
                  <select
                    id="customer_id"
                    name="customer_id"
                    value={filters.customer_id}
                    onChange={handleFilterChange}
                    className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  >
                    <option value="">All Customers</option>
                    {customers.map((c: any) => (
                      <option key={c.id || c.value} value={c.id || c.value}>
                        {c.name || c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {type === 'company' && (
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
              )}
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
          <div className="bg-white rounded-lg shadow p-5 mb-[5px]">
            {!hasRun ? (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="material-symbols-outlined text-6xl text-primary-300 mb-4">hourglass_empty</i>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Run report to see data</h3>
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your tax payments (company) report.</p>
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
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Transaction #</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Company</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Invoice #</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Tax</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : transactions.length === 0 ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      transactions.map((t: any, idx: number) => (
                        <tr key={t.id} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{t.transaction_number}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{t.company_name}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{t.invoice_number}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{t.tax_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{t.currency}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals Card */}
            {totals && typeof totals.taxes !== "undefined" && (
              <div className="bg-white rounded-lg shadow p-5 mt-6 max-w-full mb-[25px]">
                <h6 className="mb-2 font-semibold text-gray-700">Totals</h6>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Taxes:</span>
                  <span className="font-bold">{ formatCurrency(totals.taxes, filters?.currency_code || 'KES')}</span>
                </div>
              </div>
          )}
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
