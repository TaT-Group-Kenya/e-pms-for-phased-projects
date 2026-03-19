// ...existing code...

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function MarginPerProjectReportPage() {
  const [filters, setFilters] = useState({
    project_id: '',
    currency_code: '',
    forex_to_kes: '',
    from: '',
    to: '',
  });
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
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
    ]).then(([currencies, projects]) => {
      if (!isMounted) return;
      if (currencies.ok && Array.isArray(currencies.data)) setCurrencyOptions(currencies.data);
      else addToast('Failed to load currencies', 'error');
      if (projects.ok && Array.isArray(projects.data)) setProjectOptions(projects.data);
      else addToast('Failed to load projects', 'error');
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
      const url = `/api/reports/margin-per-project${params.toString() ? `?${params.toString()}` : ''}`;
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
        setTotals(result.totals || {});
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
      params.append('reportType', 'marginPerProject');
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
      a.download = 'margin-per-project.pdf';
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
      'Project',
      'Currency',
      'Forex to KES',
      'Revenue',
      'Cost',
      'Margin',
    ];
    const rows = data.map(row => [
      row.project_name || '',
      'KES',
      row.forex_to_kes || '',
      formatCurrency(Number(row.revenue_kes ?? row.revenue), 'KES'),
      formatCurrency(Number(row.cost_kes ?? row.cost), 'KES'),
      formatCurrency(Number(row.margin_kes ?? row.margin), 'KES'),
      formatDateTime(row.created_at || row.date || ''),
    ]);
    // Add totals row if available
    const totalsRows: string[][] = [];
    if (totals && (typeof totals.margin !== 'undefined' || typeof totals.revenue !== 'undefined' || typeof totals.cost !== 'undefined')) {
      totalsRows.push([
        'TOTAL',
        '',
        '',
        formatCurrency(totals.revenue, 'KES'),
        formatCurrency(totals.cost, 'KES'),
        formatCurrency(totals.margin, 'KES'),
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
    a.download = 'margin-per-project.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_PROJECT", "ROLE_VIEW_COMPANY_PAYMENT", "ROLE_VIEW_CUST_PAYMENT"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Margin Per Project Report</h5>
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
                <label htmlFor="forex_to_kes" className="mb-1 text-sm text-gray-600">Forex to KES</label>
                <input
                  id="forex_to_kes"
                  type="number"
                  name="forex_to_kes"
                  value={filters.forex_to_kes}
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your margin per project report.</p>
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
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Project</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Forex to KES</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Revenue</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Cost</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Margin</th>

                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : data.length === 0 ? (
                      <tr><td colSpan={8} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      data.map((row: any, idx: number) => (
                        <tr key={row.id || row.project_id || idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.project_name || row.project || ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">KES</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.forex_to_kes}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(Number(row.revenue_kes ?? row.revenue), 'KES')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(Number(row.cost_kes ?? row.cost), 'KES')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(Number(row.margin_kes ?? row.margin), 'KES')}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatDateTime(row.created_at || row.date || '')}</td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals Card */}
          {totals && (typeof totals.margin !== 'undefined' || typeof totals.revenue !== 'undefined' || typeof totals.cost !== 'undefined') && (
            <div className="bg-white rounded-lg shadow p-5 mt-6 max-w-full mb-[25px]">
              <h6 className="mb-2 font-semibold text-gray-700">Totals</h6>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Margin:</span>
                  <span className="font-bold">{formatCurrency(totals.margin, filters.currency_code)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-bold">{formatCurrency(totals.revenue, filters.currency_code)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-bold">{formatCurrency(totals.cost, filters.currency_code)}</span>
                </div>
              </div>
            </div>
          )}
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
