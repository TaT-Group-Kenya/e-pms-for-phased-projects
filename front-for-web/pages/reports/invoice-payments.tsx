import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency } from '../../utils/format';

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${month} ${day}, ${year} ${hours}:${paddedMinutes} ${ampm}`;
}

export default function InvoicePaymentsReportPage() {
  const [filters, setFilters] = useState({
    currency_code: '',
    customer_id: '',
    company_id: '',
    from_date: '',
    to_date: '',
  });
  const [type, setType] = useState('customer');
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
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
      fetch('/api/companies/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading companies' })),
    ]).then(([currencies, customers, companies]) => {
      if (!isMounted) return;
      if (currencies.ok && Array.isArray(currencies.data)) setCurrencyOptions(currencies.data);
      else addToast('Failed to load currencies', 'error');
      if (customers.ok && Array.isArray(customers.data)) setCustomerOptions(customers.data);
      else addToast('Failed to load customers', 'error');
      if (companies.ok && Array.isArray(companies.data)) setCompanyOptions(companies.data);
      else addToast('Failed to load companies', 'error');
    });
    return () => { isMounted = false; };
  }, [accessToken, addToast]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      // Include type and all filters if set
      if (type) params.append('type', type);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = `/api/reports/invoice-payments${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        // Accept both { payments, totals } and { data }
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
      params.append('filters', JSON.stringify({...filters, type }));
      params.append('reportType', 'invoicePayments');
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
      a.download = 'invoice-payments.pdf';
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
      'Payment #',
      'Invoice #',
      'Amount',
      'Tax',
      'Net',
      'Currency',
      'Date',
    ];
    const rows = data.map(row => [
      row.transaction_number,
      row.invoice_number,
      row.amount,
      row.tax_amount,
      row.net_amount,
      row.currency,
      row.created_at ? formatDateTime(row.created_at) : (row.date ? formatDateTime(row.date) : ''),
    ]);
    // Add totals rows matching HTML view
    const totalsRows: string[][] = [];
    if (totals && (typeof totals.total !== 'undefined' || typeof totals.taxes !== 'undefined' || typeof totals.net !== 'undefined')) {
      totalsRows.push([
        '',
        'Total Amount',
        formatCurrency(totals.total, filters.currency_code),
        '',
        '',
        '',
        '',
      ]);
      totalsRows.push([
        '',
        'Total Taxes',
        formatCurrency(totals.taxes, filters.currency_code),
        '',
        '',
        '',
        '',
      ]);
      totalsRows.push([
        '',
        'Total Net',
        formatCurrency(totals.net, filters.currency_code),
        '',
        '',
        '',
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
    a.download = 'invoice-payments.csv';
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
              <h5 className="!mb-0">Invoice Payments Report</h5>
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
                <label htmlFor="type" className="mb-1 text-sm text-gray-600">Type</label>
                <select
                  id="type"
                  name="type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
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
              {type === 'customer' && (
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
              )}
              {type === 'company' && (
                <div className="flex flex-col">
                  <label htmlFor="company_id" className="mb-1 text-sm text-gray-600">Company</label>
                  <select
                    id="company_id"
                    name="company_id"
                    value={filters.company_id}
                    onChange={handleFilterChange}
                    className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  >
                    <option value="">All Companies</option>
                    {companyOptions.map((c: any) => (
                      <option key={c.id || c.value} value={c.id || c.value}>
                        {c.name || c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-col">
                <label htmlFor="from_date" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from_date"
                  type="date"
                  name="from_date"
                  value={filters.from_date}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  placeholder="From date"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="to_date" className="mb-1 text-sm text-gray-600">To</label>
                <input
                  id="to_date"
                  type="date"
                  name="to_date"
                  value={filters.to_date}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  placeholder="To date"
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1">
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
          <div className="bg-white rounded-lg shadow p-5 mb-[5px]">
            {!hasRun ? (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="material-symbols-outlined text-6xl text-primary-300 mb-4">hourglass_empty</i>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Run report to see data</h3>
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your invoice payments report.</p>
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
                      <tr><td colSpan={7} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : data.length === 0 ? (
                      <tr><td colSpan={7} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      data.map((row: any, idx: number) => (
                        <tr key={row.id || row.transaction_number || idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.transaction_number }</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.invoice_number}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.tax_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.net_amount}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.currency}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.created_at ? formatDateTime(row.created_at) : (row.date ? formatDateTime(row.date) : '')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals Card */}
          {totals && (typeof totals.total !== 'undefined' || typeof totals.taxes !== 'undefined' || typeof totals.net !== 'undefined') && (
            <div className="bg-white rounded-lg shadow p-5 mt-6 max-w-full mb-[25px]">
              <h6 className="mb-2 font-semibold text-gray-700">Totals</h6>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold">{formatCurrency(totals.total, filters.currency_code)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Taxes:</span>
                  <span className="font-bold">{formatCurrency(totals.taxes, filters.currency_code)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Net:</span>
                  <span className="font-bold">{formatCurrency(totals.net, filters.currency_code)}</span>
                </div>
              </div>
            </div>
          )}
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
