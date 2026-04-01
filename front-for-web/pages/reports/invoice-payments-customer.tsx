import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function InvoicePaymentsCustomerReportPage() {
  const [filters, setFilters] = useState({
    currency_code: '',
    customer_id: '',
    from: '',
    to: '',
    job_reference_id: '',
    invoice_number: '',
  });
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    Promise.all([
      fetch('/api/currencies/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading currencies' })),
      fetch('/api/customers/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading customers' })),
    ]).then(([currencies, customers]) => {
      if (!isMounted) return;
      if (currencies.ok && Array.isArray(currencies.data)) {
        setCurrencyOptions(currencies.data);
        if (!filters.currency_code && currencies.data.length > 0) {
          const first = currencies.data[0];
          const firstCode = first.code || first.id || first.value;
          if (firstCode) {
            setFilters(prev => ({ ...prev, currency_code: firstCode }));
          }
        }
      } else {
        addToast('Failed to load currencies', 'error');
      }
      if (customers.ok && Array.isArray(customers.data)) setCustomerOptions(customers.data);
      else addToast('Failed to load customers', 'error');
    });
    return () => { isMounted = false; };
  }, [accessToken, addToast]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      const url = `/api/reports/invoice-payments-customer${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        if (Array.isArray(result.payments)) {
          setData(result.payments);
          setTotals(result.totals || {});
        } else if (Array.isArray(result.data)) {
          setData(result.data);
          setTotals(result.totals || {});
        } else {
          setData([]);
          setTotals({});
        }
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = async (type: 'pdf' | 'csv') => {
    if (type === 'csv') {
      exportCsv();
      return;
    }
    if (type === 'pdf') {
      await exportPdf();
      return;
    }
  };

  async function exportPdf() {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      params.append('reportType', 'invoicePaymentsCustomer');
      const url = `/api/reports/export-pdf?${params.toString()}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!resp.ok) {
        const error = await resp.json();
        addToast(error.message || 'Failed to export PDF', 'error');
        return;
      }
      const blob = await resp.blob();
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObj;
      a.download = 'invoice-payments-customer.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlObj);
    } catch (err) {
      addToast('Network error exporting PDF', 'error');
    }
  }

  function exportCsv() {
    const columns = [
      'ID',
      'Date',
      'Customer',
      'Job Reference ID',
      'Invoice #',
      'Currency',
      'Amount',
      'Transacted By',
    ];
    const rows = data.map(row => [
      row.id,
      formatDateTime(row.created_at || row.date || ''),
      row.customer_name ?? '',
      row.job_reference_id ?? '',
      row.invoice_number ?? '',
      row.currency ?? '',
      formatCurrency(row.amount, row.currency) ?? '',
      row.transacted_by_name ?? '',
    ]);
    const totalsRows: string[][] = [];
    if (totals && (typeof totals.total !== 'undefined' || typeof totals.taxes !== 'undefined' || typeof totals.net !== 'undefined')) {
      totalsRows.push([
        '',
        'Total Amount',
        '',
        '',
        '',
        '',
        formatCurrency(totals.total, filters.currency_code),
        '',
      ]);
    }
    const csv = [
      columns.join(','),
      ...rows.map(r => r.map(cell => '"' + String(cell ?? '').replace(/"/g, '""') + '"').join(',')),
      ...totalsRows.map(r => r.map(cell => '"' + String(cell ?? '').replace(/"/g, '""') + '"').join(',')),
    ].filter(Boolean).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice-payments-customer.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_COMPANY_INVOICE", "ROLE_VIEW_COMPANY_PAYMENT", "ROLE_VIEW_CUST_INVOICE", "ROLE_VIEW_CUST_PAYMENT"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Invoice Payments Customer Report</h5>
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
            <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="flex flex-col">
                <label htmlFor="currency_code" className="mb-1 text-sm text-gray-600">Currency</label>
                <select
                  id="currency_code"
                  name="currency_code"
                  value={filters.currency_code}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Currencies</option>
                  {currencyOptions.map((c: any) => (
                    <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>
                      {c.name || c.code || c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="customer_id" className="mb-1 text-sm text-gray-600">Customer</label>
                <select
                  id="customer_id"
                  name="customer_id"
                  value={filters.customer_id}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Customers</option>
                  {customerOptions.map((c: any) => (
                    <option key={c.id || c.value} value={c.id || c.value}>
                      {c.name || c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="job_reference_id" className="mb-1 text-sm text-gray-600">Job Reference ID</label>
                <input
                  id="job_reference_id"
                  type="text"
                  name="job_reference_id"
                  value={filters.job_reference_id}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  placeholder="Job Reference ID"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="invoice_number" className="mb-1 text-sm text-gray-600">Invoice #</label>
                <input
                  id="invoice_number"
                  type="text"
                  name="invoice_number"
                  value={filters.invoice_number}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  placeholder="Invoice Number"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="from" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from"
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
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
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  placeholder="To date"
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-end md:col-span-2">
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your invoice payments customer report.</p>
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
                      <th className="whitespace-nowrap min-w-[80px] text-left px-4 py-2">ID</th>
                      <th className="whitespace-nowrap min-w-[140px] text-left px-4 py-2">Date</th>
                      <th className="whitespace-nowrap min-w-[160px] text-left px-4 py-2">Customer</th>
                      <th className="whitespace-nowrap min-w-[160px] text-left px-4 py-2">Job Reference ID</th>
                      <th className="whitespace-nowrap min-w-[140px] text-left px-4 py-2">Invoice #</th>
                      <th className="whitespace-nowrap min-w-[100px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Amount</th>
                      <th className="whitespace-nowrap min-w-[160px] text-left px-4 py-2">Transacted By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : data.length === 0 ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      data.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 border-b border-gray-200' : 'bg-white border-b border-gray-200'}>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.id}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{formatDateTime(row.created_at || row.date || '')}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.customer_name ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.job_reference_id ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.invoice_number ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.currency ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{formatCurrency(row.amount, row.currency) ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.transacted_by_name ?? ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {totals && typeof totals.total !== 'undefined' && (
                  <div className="mt-4 text-right">
                    <div className="font-semibold">
                      Total Amount: {formatCurrency(totals.total, filters.currency_code)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
