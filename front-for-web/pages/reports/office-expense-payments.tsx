import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function OfficeExpensePaymentsReportPage() {
  const [filters, setFilters] = useState({
    currency_code: '',
    category: '',
    source_account: '',
    status: '',
    from: '',
    to: '',
  });
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [sourceAccountOptions, setSourceAccountOptions] = useState<any[]>([]);
  const [statusOptions] = useState([
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
  ]);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    Promise.all([
      fetch('/api/currencies/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading currencies' })),
      fetch('/api/finance/office-expense-categories/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading categories' })),
      fetch('/api/accounts/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading accounts' })),
    ]).then(([currencies, categories, accounts]) => {
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
      if (categories.ok && Array.isArray(categories.data)) setCategoryOptions(categories.data);
      else addToast('Failed to load categories', 'error');
      if (accounts.ok && Array.isArray(accounts.data)) setSourceAccountOptions(accounts.data);
      else addToast('Failed to load accounts', 'error');
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
      const url = `/api/reports/office-expense-payments${params.toString() ? `?${params.toString()}` : ''}`;
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
      params.append('reportType', 'expensePayments');
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
      a.download = 'office-expense-payments.pdf';
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
      'Date',
      'Category',
      'Cost Center',
      'Source Account',
      'Status',
      'Transaction #',
      'Amount',
      'Narration',
    ];
    const rows = data.map(row => [
      row.created_at ? row.created_at.split('T')[0] : '',
      row.category_name ?? '',
      row.cost_center_name ?? '',
      row.source_account_name ?? '',
      row.expense_status ?? '',
      row.transaction_number ?? '',
      formatCurrency(row.amount, row.currency) ?? '',
      row.narration ?? '',
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
    a.download = 'office-expense-payments.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_OFFICE_EXPENSE"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Office Expense Payments Report</h5>
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
                  {currencyOptions.filter(c => c.code === 'KES').map((c: any) => (
                    <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>
                      {c.name || c.code || c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-1 text-sm text-gray-600">Category</label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((c: any) => (
                    <option key={c.id || c.value} value={c.id || c.value}>
                      {c.name || c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="source_account" className="mb-1 text-sm text-gray-600">Source Account</label>
                <select
                  id="source_account"
                  name="source_account"
                  value={filters.source_account}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Accounts</option>
                  {sourceAccountOptions.map((c: any) => (
                    <option key={c.id || c.value} value={c.id || c.value}>
                      {c.name || c.label}
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
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your office expense payments report.</p>
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
                      <th className="whitespace-nowrap min-w-[140px] text-left px-4 py-2">Date</th>
                      <th className="whitespace-nowrap min-w-[160px] text-left px-4 py-2">Category</th>
                      <th className="whitespace-nowrap min-w-[160px] text-left px-4 py-2">Cost Center</th>
                      <th className="whitespace-nowrap min-w-[160px] text-left px-4 py-2">Source Account</th>
                      <th className="whitespace-nowrap min-w-[100px] text-left px-4 py-2">Status</th>
                      <th className="whitespace-nowrap min-w-[140px] text-left px-4 py-2">Transaction #</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Amount</th>
                      <th className="whitespace-nowrap min-w-[200px] text-left px-4 py-2">Narration</th>
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
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.created_at ? row.created_at.split('T')[0] : ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.category_name ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.cost_center_name ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.source_account_name ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.expense_status ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.transaction_number ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{formatCurrency(row.amount, row.currency) ?? ''}</td>
                          <td className="whitespace-nowrap text-left px-4 py-2">{row.narration ?? ''}</td>
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
