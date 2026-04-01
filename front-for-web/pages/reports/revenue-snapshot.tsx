import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency } from '../../utils/format';




const RevenueSnapshotPage: React.FC = () => {
  // State declarations
  const { toasts, addToast, removeToast } = useToast();
  const accessToken = useSelector(selectAccessToken);
  const [filters, setFilters] = useState({
    currency_code: 'KES',
    from: '',
    to: '',
  });
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);

  // Effects
  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/currencies/list', {
      headers: { Authorization: `Bearer ${accessToken}` },
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
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = `/api/reports/revenue${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      const result = await resp.json();
      if (!resp.ok) {
        const msg = result.error || 'Failed to fetch report';
        setError(msg);
        addToast(msg, 'error');
        setData(null);
      } else {
        setData(result.data || null);
      }
    } catch (err) {
      setError('Network error');
      addToast('Network error', 'error');
      setData(null);
    }
    setLoading(false);
  };

  const handleExport = (type: 'pdf' | 'csv') => {
    if (!data) return;
    if (type === 'csv') {
      const columns = [
        'Total Invoices Issued',
        'Total Payments Received',
        'Outstanding Invoices',
        'Currency',
      ];
      const row = [
        data.total_invoices_issued,
        data.total_payments_received,
        data.outstanding_invoices,
        data.currency,
      ];
      const csv = [columns.join(','), row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'revenue-snapshot.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    if (type === 'pdf') {
      const params = new URLSearchParams();
      params.append('filters', JSON.stringify(filters));
      params.append('reportType', 'revenueSnapshot');
      const url = `/api/reports/export-pdf?${params.toString()}`;
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(async resp => {
          if (!resp.ok) {
            const error = await resp.json();
            addToast(error.message || 'Failed to export PDF', 'error');
            return;
          }
          const blob = await resp.blob();
          const pdfUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = 'revenue-snapshot.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pdfUrl);
        })
        .catch(() => {
          addToast('Network error during PDF export', 'error');
        });
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_ORDER", "ROLE_VIEW_COMPANY_PAYMENT", "ROLE_VIEW_CUST_PAYMENT"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Revenue Snapshot Report</h5>
              <div className="flex gap-2">
                <button
                  className="rounded-full bg-transparent text-primary-500 px-4 py-2 flex items-center gap-2 hover:bg-primary-50 transition"
                  onClick={() => handleExport('pdf')}
                  disabled={!data}
                >
                  <i className="material-symbols-outlined !text-xl text-primary-500">picture_as_pdf</i> Export PDF
                </button>
                <button
                  className="rounded-full bg-transparent text-success-500 px-4 py-2 flex items-center gap-2 hover:bg-success-50 transition"
                  onClick={() => handleExport('csv')}
                  disabled={!data}
                >
                  <i className="material-symbols-outlined !text-xl text-success-500">table</i> Export CSV
                </button>
              </div>
            </div>
          </div>
          {/* Card 2: Filters */}
          <div className="bg-white rounded-lg shadow p-5 mb-6">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                name="currency_code"
                value={filters.currency_code}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 h-[42px] mt-6"
              >
                {currencies.map((c: any) => (
                  <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>
                    {c.name || c.code || c.label}
                  </option>
                ))}
              </select>
              <div className="flex flex-col">
                <label htmlFor="from" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from"
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg h-[42px] border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                  className="form-input rounded-lg h-[42px] border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                  placeholder="To date"
                />
              </div>
              <div className="flex items-end md:col-span-1">
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your revenue snapshot.</p>
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
                      <th className="whitespace-nowrap min-w-[180px] text-left px-4 py-2">Total Invoices Issued</th>
                      <th className="whitespace-nowrap min-w-[180px] text-left px-4 py-2">Total Payments Received</th>
                      <th className="whitespace-nowrap min-w-[180px] text-left px-4 py-2">Outstanding Invoices</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={4} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={4} className="whitespace-nowrap px-4 py-2 text-red-600">{error}</td></tr>
                    ) : !data ? (
                      <tr><td colSpan={4} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td className="whitespace-nowrap min-w-[180px] text-left px-4 py-2">{formatCurrency(data.total_invoices_issued, data.currency)}</td>
                        <td className="whitespace-nowrap min-w-[180px] text-left px-4 py-2">{formatCurrency(data.total_payments_received, data.currency)}</td>
                        <td className="whitespace-nowrap min-w-[180px] text-left px-4 py-2">{formatCurrency(data.outstanding_invoices, data.currency)}</td>
                        <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{data.currency}</td>
                      </tr>
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
};

export default RevenueSnapshotPage;
