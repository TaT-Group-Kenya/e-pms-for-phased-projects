// ...existing code...

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import Can from '../../components/auth/Can';
import { formatCurrency } from '../../utils/format';
import { formatDateTime } from '../../utils/format';

export default function GeneralLedgerReportPage() {
  const [filters, setFilters] = useState({
    project_id: '',
    company_id: '',
    customer_id: '',
    currency_code: '',
    forex: '',
    from: '',
    to: '',
  });
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [data, setData] = useState<{ forex?: number; receivables: any[]; payables: any[]; totals?: any }>({ receivables: [], payables: [] });
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    Promise.all([
      fetch('/api/currencies/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading currencies' })),
      fetch('/api/projects/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading projects' })),
      fetch('/api/companies/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading companies' })),
      fetch('/api/customers/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading customers' })),
    ]).then(([currencies, projects, companies, customers]) => {
      if (!isMounted) return;
      if (currencies.ok && Array.isArray(currencies.data)) setCurrencyOptions(currencies.data);
      else addToast('Failed to load currencies', 'error');
      if (projects.ok && Array.isArray(projects.data)) setProjectOptions(projects.data);
      else addToast('Failed to load projects', 'error');
      if (companies.ok && Array.isArray(companies.data)) setCompanyOptions(companies.data);
      else addToast('Failed to load companies', 'error');
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
        if (value) params.append(key, value);
      });
      const url = `/api/reports/general-ledger${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        // Accept both {data: ...} and flat structure
        const payload = result.data || result;
        setData({
          forex: payload.forex,
          receivables: Array.isArray(payload.receivables) ? payload.receivables : [],
          payables: Array.isArray(payload.payables) ? payload.payables : [],
          totals: payload.totals || {},
        });
        setTotals(payload.totals || {});
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
        if (value) params.append(key, value);
      });
      params.append('reportType', 'generalLedger');
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
      a.download = 'general-ledger.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlObj);
    } catch (err) {
      addToast('Network error exporting PDF', 'error');
    }
  }

  function exportCsv() {
    // Totals section (for CSV only, not rendered twice in UI)
    const totalsSection = [
      ['Forex', data.forex ?? ''],
      ['Receivables Total', formatCurrency(totals?.receivables?.total ?? 0, filters.currency_code)],
      ['Receivables Tax', formatCurrency(totals?.receivables?.taxes ?? 0, filters.currency_code)],
      ['Receivables Net', formatCurrency(totals?.receivables?.net ?? 0, filters.currency_code)],
      ['Payables Total', formatCurrency(totals?.payables?.total ?? 0, 'KES')],
      ['Payables Tax', formatCurrency(totals?.payables?.taxes ?? 0, 'KES')],
      ['Payables Net', formatCurrency(totals?.payables?.net ?? 0, 'KES')],
    ];
    // Receivables table
        const receivableColumns = ['Transaction #', 'Project', 'Customer', 'Amount', 'Currency', 'Tax', 'Net', 'Date'];
    const receivableRows = (data.receivables || []).map(row => [
          row.transaction_number ?? '',
          row.project_name ?? '',
          row.customer_name ?? '',
      formatCurrency(Number(row.amount ?? 0), row.currency ?? 'KES'),
      row.currency ?? 'KES',
      formatCurrency(Number(row.tax_amount ?? 0), row.currency ?? 'KES'),
      formatCurrency(Number(row.net_amount ?? 0), row.currency ?? 'KES'),
      formatDateTime(row.created_at || row.date || ''),
    ]);
    // Payables table
        const payableColumns = ['Transaction #', 'Project', 'Company', 'Amount', 'Currency', 'Tax', 'Net', 'Date'];
    const payableRows = (data.payables || []).map(row => [
          row.transaction_number ?? '',
          row.project_name ?? '',
          row.company_name ?? '',
      formatCurrency(Number(row.amount ?? 0), row.currency ?? 'KES'),
      row.currency ?? 'KES',
      formatCurrency(Number(row.tax_amount ?? 0), row.currency ?? 'KES'),
      formatCurrency(Number(row.net_amount ?? 0), row.currency ?? 'KES'),
      formatDateTime(row.created_at || row.date || ''),
    ]);
    // CSV assembly
    const csv = [
      'Totals',
      ...totalsSection.map(r => r.map(cell => '"' + String(cell ?? '').replace(/"/g, '""') + '"').join(',')),
      '',
      'Receivables',
      receivableColumns.join(','),
      ...receivableRows.map(r => r.map(cell => '"' + String(cell ?? '').replace(/"/g, '""') + '"').join(',')),
      '',
      'Payables',
      payableColumns.join(','),
      ...payableRows.map(r => r.map(cell => '"' + String(cell ?? '').replace(/"/g, '""') + '"').join(',')),
    ].filter(Boolean).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'general-ledger.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_COMPANY_TRANSACTIONS_LEDGER", "ROLE_VIEW_CUSTOMER_TRANSACTIONS_LEDGER"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">General Ledger Report</h5>
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
                <label htmlFor="project_id" className="mb-1 text-sm text-gray-600">Project</label>
                <select
                  id="project_id"
                  name="project_id"
                  value={filters.project_id}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Projects</option>
                  {projectOptions.map((p: any) => (
                    <option key={p.id || p.value} value={p.id || p.value}>{p.name || p.label || p.code}</option>
                  ))}
                </select>
              </div>
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
                    <option key={c.id || c.value} value={c.id || c.value}>{c.name || c.label}</option>
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
                    <option key={c.id || c.value} value={c.id || c.value}>{c.name || c.label}</option>
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
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                >
                  <option value="">All Currencies</option>
                  {currencyOptions.map((c: any) => (
                    <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>{c.name || c.code || c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label htmlFor="forex" className="mb-1 text-sm text-gray-600">Forex</label>
                <input
                  id="forex"
                  type="number"
                  name="forex"
                  value={filters.forex}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
                  placeholder="Forex to KES"
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
          
          {/* Card 3: Receivables Table */}
          {hasRun && (
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h6 className="mb-2 font-semibold text-gray-700">Receivables</h6>
              <div className="overflow-x-auto">
                <table className="table table-bordered table-sm min-w-max w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Transaction #</th>
                      <th className="text-left">Project</th>
                      <th className="text-left">Customer</th>
                      <th className="text-left">Amount</th>
                      <th className="text-left">Currency</th>
                      <th className="text-left">Tax</th>
                      <th className="text-left">Net</th>
                      <th className="text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8}>Loading...</td></tr>
                    ) : (data.receivables.length === 0 ? (
                      <tr><td colSpan={8}>No data found</td></tr>
                    ) : (
                      data.receivables.map((row: any, idx: number) => (
                        <tr key={row.transaction_number || idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td>{row.transaction_number ?? ''}</td>
                          <td>{row.project_name ?? ''}</td>
                          <td>{row.customer_name ?? ''}</td>
                          <td>{formatCurrency(Number(row.amount ?? 0), row.currency ?? 'KES')}</td>
                          <td>{row.currency ?? 'KES'}</td>
                          <td>{formatCurrency(Number(row.tax_amount ?? 0), row.currency ?? 'KES')}</td>
                          <td>{formatCurrency(Number(row.net_amount ?? 0), row.currency ?? 'KES')}</td>
                          <td>{formatDateTime(row.created_at || row.date || '')}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Card 4: Payables Table */}
          {hasRun && (
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h6 className="mb-2 font-semibold text-gray-700">Payables</h6>
              <div className="overflow-x-auto">
                <table className="table table-bordered table-sm min-w-max w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Transaction #</th>
                      <th className="text-left">Project</th>
                      <th className="text-left">Company</th>
                      <th className="text-left">Amount</th>
                      <th className="text-left">Currency</th>
                      <th className="text-left">Tax</th>
                      <th className="text-left">Net</th>
                      <th className="text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8}>Loading...</td></tr>
                    ) : (data.payables.length === 0 ? (
                      <tr><td colSpan={8}>No data found</td></tr>
                    ) : (
                      data.payables.map((row: any, idx: number) => (
                        <tr key={row.transaction_number || idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td>{row.transaction_number ?? ''}</td>
                          <td>{row.project_name ?? ''}</td>
                          <td>{row.company_name ?? ''}</td>
                          <td>{formatCurrency(Number(row.amount ?? 0), row.currency ?? 'KES')}</td>
                          <td>{row.currency ?? 'KES'}</td>
                          <td>{formatCurrency(Number(row.tax_amount ?? 0), row.currency ?? 'KES')}</td>
                          <td>{formatCurrency(Number(row.net_amount ?? 0), row.currency ?? 'KES')}</td>
                          <td>{formatDateTime(row.created_at || row.date || '')}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Card 5: Totals Section */}
          {hasRun && (
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h6 className="mb-2 font-semibold text-gray-700">Totals</h6>
              <table className="table table-bordered table-sm min-w-max w-full mb-4">
                <tbody>
                  {[
                    ['Forex', data.forex ?? ''],
                    ['Receivables Total', `${formatCurrency(totals?.receivables?.total ?? 0, filters.currency_code)} (${formatCurrency((data.forex ?? 0) * (totals?.receivables?.total ?? 0), 'KES')})`],
                    ['Receivables Tax', `${formatCurrency(totals?.receivables?.taxes ?? 0, filters.currency_code)} (${formatCurrency((data.forex ?? 0) * (totals?.receivables?.taxes ?? 0), 'KES')})`],
                    ['Receivables Net', `${formatCurrency(totals?.receivables?.net ?? 0, filters.currency_code)} (${formatCurrency((data.forex ?? 0) * (totals?.receivables?.net ?? 0), 'KES')})`],
                    ['Payables Total', formatCurrency(totals?.payables?.total ?? 0, 'KES')],
                    ['Payables Tax', formatCurrency(totals?.payables?.taxes ?? 0, 'KES')],
                    ['Payables Net', formatCurrency(totals?.payables?.net ?? 0, 'KES')],
                  ].map((row, idx) => (
                    <tr key={row[0]} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className={"font-semibold text-gray-700 px-4 py-2"}>{row[0]}</td>
                      <td className={"px-4 py-2 text-primary-700"}>{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
