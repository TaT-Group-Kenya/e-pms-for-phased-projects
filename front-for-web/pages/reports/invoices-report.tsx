import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatDateTime } from '../../utils/format';

export default function InvoicesReportPage() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    currency_code: '',
    status: '',
    type: 'customer', // Preselect customer
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/currencies/list', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.data)) setCurrencies(data.data);
      });
  }, [accessToken]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      // Always send type=customer if not set
      const filtersToSend = { ...filters, type: filters.type || 'customer' };
      Object.entries(filtersToSend).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = `/api/reports/invoices${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        setData(Array.isArray(result.data) ? result.data : []);
      } else {
        const msg = result.error || 'Failed to fetch report';
        setError(msg);
        addToast(msg, 'error');
      }
    } catch (err) {
      setError('Network error');
      addToast('Network error', 'error');
    }
    setLoading(false);
  };

  const exportCsv = () => {
    if (!data.length) {
      addToast('No data to export', 'warning');
      return;
    }
    const headers = [
      'Invoice Number',
      filters.type === 'company' ? 'Company' : 'Customer',
      'Status',
      'Total Amount',
      'Currency',
      'Created At',
    ];
    const rows = data.map(row => [
      row.invoice_number,
      filters.type === 'company' ? row.company_name : row.customer_name,
      row.status,
      row.total_amount,
      row.currency,
      row.created_at ? formatDateTime(row.created_at) : '',
    ]);
    const csvContent = [headers, ...rows]
      .map(r => r.map(val => '"' + String(val).replace(/"/g, '""') + '"').join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('CSV export successful', 'success');
  };

  const exportPdf = async () => {
    try {
      const filtersToSend = { ...filters, type: filters.type || 'customer' };
      const params = new URLSearchParams();
      params.append('filters', JSON.stringify(filtersToSend));
      params.append('reportType', 'invoicesReport');
      const url = `/api/reports/export-pdf?${params.toString()}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!resp.ok) {
        let message = 'Failed to export PDF';
        try {
          const data = await resp.json();
          message = data?.message || message;
        } catch {}
        addToast(message, 'error');
        return;
      }
      const blob = await resp.blob();
      const urlObj = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObj;
      a.download = 'invoices_report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlObj);
      addToast('PDF export successful', 'success');
    } catch (err) {
      addToast('Error exporting PDF', 'error');
    }
  };

  const handleExport = async (type: 'pdf' | 'csv') => {
    if (type === 'csv') {
      exportCsv();
    } else if (type === 'pdf') {
      await exportPdf();
    } else {
      addToast('Export ' + type + ' not implemented yet', 'info');
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_COMPANY_INVOICE", "ROLE_VIEW_CUST_INVOICE"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Invoices Report</h5>
              <div className="flex gap-2">
                <button
                  className="rounded-full bg-transparent text-primary-500 px-4 py-2 flex items-center gap-2 hover:bg-primary-50 transition"
                  onClick={() => handleExport('pdf')}
                >
                  <i className="material-symbols-outlined !text-xl text-primary-500">picture_as_pdf</i> Export PDF
                </button>
                <button
                  className="rounded-full bg-transparent text-success-500 px-4 py-2 flex items-center gap-2 hover:bg-success-50 transition"
                  onClick={() => handleExport('csv')}
                >
                  <i className="material-symbols-outlined !text-xl text-success-500">table</i> Export CSV
                </button>
              </div>
            </div>
          </div>
          {/* Card 2: Filters */}
          <div className="bg-white rounded-lg shadow p-5 mb-6">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div className="flex flex-col">
                <label htmlFor="currency_code" className="mb-1 text-sm text-gray-600">Currency</label>
                <select
                  id="currency_code"
                  name="currency_code"
                  value={filters.currency_code}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">All</option>
                  {currencies.map((c: any) => (
                    <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>
                      {c.name || c.code || c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="status" className="mb-1 text-sm text-gray-600">Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">All</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="partial-paid">Partial Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="type" className="mb-1 text-sm text-gray-600">Type</label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">All</option>
                  <option value="customer">Customer</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex items-end">
                <button
                  className="rounded-md bg-primary-500 text-white px-6 py-3 flex items-center gap-2 shadow hover:bg-primary-600 transition"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <i className="material-symbols-outlined !text-xl">play_circle</i> Run Report
                </button>
              </div>
            </div>
          </div>
          {/* Card 3: Report Data Section */}
          <div className="bg-white rounded-lg shadow p-5 mb-[25px]">
            {!hasRun ? (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="material-symbols-outlined text-6xl text-primary-300 mb-4">hourglass_empty</i>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Run report to see data</h3>
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your invoices report.</p>
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
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Invoice Number</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{filters.type === 'company' ? 'Company' : 'Customer'}</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Status</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Total Amount</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : data.length === 0 ? (
                      <tr><td colSpan={6} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      data.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.invoice_number}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.customer_name || row.company_name}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.status}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.total_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.currency}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.created_at ? formatDateTime(row.created_at) : ''}</td>
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
