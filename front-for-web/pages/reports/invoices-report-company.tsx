import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency, formatDate } from '../../utils/format';

export default function InvoicesReportCompanyPage() {
  const [filters, setFilters] = useState({
    currency_code: '',
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
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    fetch('/api/currencies/list', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
      .catch(() => ({ ok: false, data: null, error: 'Error loading currencies' }))
      .then(result => {
        if (!isMounted) return;
        if (result.ok && Array.isArray(result.data)) {
          const kesCurrencies = result.data.filter((c: any) => c.code === 'KES' || c.id === 'KES' || c.value === 'KES');
          setCurrencyOptions(kesCurrencies);
          if (!filters.currency_code && kesCurrencies.length > 0) {
            const first = kesCurrencies[0];
            const firstCode = first.code || first.id || first.value;
            if (firstCode) {
              setFilters(prev => ({ ...prev, currency_code: firstCode }));
            }
          }
        } else {
          addToast('Failed to load currencies', 'error');
        }
      });
    return () => { isMounted = false; };
  }, [accessToken, addToast]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    if (!filters.currency_code) {
      setError('Currency is required');
      addToast('Currency is required', 'error');
      setHasRun(false);
      return;
    }
    setLoading(true);
    setError('');
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      const url = `/api/reports/invoices-company${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        if (Array.isArray(result.invoices)) {
          setData(result.invoices);
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

  const exportPdf = async () => {
    try {
      if (!filters.currency_code) {
        addToast('Currency is required', 'error');
        return;
      }
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      params.append('reportType', 'invoicesReportCompany');
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
      a.download = 'invoices-report-company.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlObj);
    } catch (err) {
      addToast('Network error exporting PDF', 'error');
    }
  };

  const exportCsv = () => {
    if (!data.length) {
      addToast('No data to export', 'warning');
      return;
    }
    const columns = [
      'Date',
      'Job Reference ID',
      'Company',
      'Invoice #',
      'Project Name',
      'Currency',
      'Amount',
      'Paid',
      'Balance',
      'Status',
      'Created By',
    ];
    const rows = data.map((row: any) => [
      formatDate(row.date || row.created_at || ''),
      row.job_reference_id || '',
      row.company || row.company_name || '',
      row.invoice_number || row.id || '',
      row.project_name || row.project || '',
      row.currency || '',
      formatCurrency(Number(row.amount ?? row.total_amount ?? 0), filters.currency_code || 'KES'),
      formatCurrency(Number(row.paid || 0), filters.currency_code || 'KES'),
      formatCurrency(Number(row.balance || 0), filters.currency_code || 'KES'),
      row.status || '',
      row.created_by_name || '',
    ]);

    const totalsRows: string[][] = [];
    if (totals && typeof totals.amount !== 'undefined') {
      totalsRows.push([
        'TOTALS',
        '',
        '',
        '',
        '',
        '',
        formatCurrency(Number(totals.amount || 0), filters.currency_code || 'KES'),
        formatCurrency(Number(totals.total_paid || 0), filters.currency_code || 'KES'),
        formatCurrency(Number(totals.total_balance || 0), filters.currency_code || 'KES'),
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
    a.download = 'invoices-report-company.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type: 'pdf' | 'csv') => {
    if (type === 'pdf') await exportPdf();
    if (type === 'csv') exportCsv();
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_COMPANY_INVOICE", "ROLE_VIEW_CUST_INVOICE"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Invoices Report Company</h5>
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
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label htmlFor="from" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from"
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
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
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="currency_code" className="mb-1 text-sm text-gray-600">Currency (KES only)</label>
                <select
                  id="currency_code"
                  name="currency_code"
                  value={filters.currency_code}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">Select KES</option>
                  {currencyOptions.map((c: any) => (
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
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="partial-paid">Partial Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
          <div className="bg-white rounded-lg shadow p-5 mb-[25px]">
            {!hasRun ? (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="material-symbols-outlined text-6xl text-primary-300 mb-4">hourglass_empty</i>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Run report to see data</h3>
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your invoices company report.</p>
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
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Date</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Job Reference ID</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Company</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Invoice #</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Project Name</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Amount</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Paid</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Balance</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Status</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Created By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={11} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : data.length === 0 ? (
                      <tr><td colSpan={11} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      data.map((row: any, idx: number) => (
                        <tr key={row.id || row.invoice_number || idx} className={idx % 2 === 0 ? 'bg-gray-50 border-b border-gray-200' : 'bg-white border-b border-gray-200'}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatDate(row.date || row.created_at || '')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.job_reference_id || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.company || row.company_name || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.invoice_number || row.id || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.project_name || row.project || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.currency || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(Number(row.amount ?? row.total_amount ?? 0), filters.currency_code || 'KES')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(Number(row.paid || 0), filters.currency_code || 'KES')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(Number(row.balance || 0), filters.currency_code || 'KES')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.status || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.created_by_name || ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {totals && typeof totals.amount !== 'undefined' && (
            <div className="bg-white rounded-lg shadow p-5 mt-6 max-w-full mb-[25px]">
              <h6 className="mb-2 font-semibold text-gray-700">Totals</h6>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold">{formatCurrency(Number(totals.amount || 0), filters.currency_code || 'KES')}</span>

                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-bold">{formatCurrency(Number(totals.total_paid || 0), filters.currency_code || 'KES')}</span>

                  <span className="text-gray-600">Total Balance:</span>
                  <span className="font-bold">{formatCurrency(Number(totals.total_balance || 0), filters.currency_code || 'KES')}</span>
                </div>
              </div>
            </div>
          )}
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
