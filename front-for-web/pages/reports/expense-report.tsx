// ...existing code...

import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import Can from '../../components/auth/Can';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';

interface ExpenseRow {
  id: number | string;
  amount: number;
  tax_amount: number;
  net_amount: number;
  currency: string;
  expense: string;
  category: string;
  cost_center: string;
  created_at: string;
}

export default function ExpenseReportPage() {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();
  const [filters, setFilters] = useState({
    currency: 'KES',
    category: '',
    cost_center: '',
    from: '',
    to: '',
  });
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]); // Office expense categories
  const [costCenterOptions, setCostCenterOptions] = useState<any[]>([]); // Departments
  const [data, setData] = useState<ExpenseRow[]>([]);
  const [totals, setTotals] = useState<{ total?: number; taxes?: number; net?: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);

  // Fetch filter options
  useEffect(() => {
    let isMounted = true;
    // Only KES for currency
    setCurrencyOptions([{ code: 'KES', name: 'Kenyan Shilling' }]);
    async function fetchOptions() {
      try {
        // Office Expense Categories
        const catResp = await fetch('/api/finance/office-expense-categories/list', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const catData = await catResp.json();
        if (catResp.ok && Array.isArray(catData.data)) setCategoryOptions(catData.data);
        else addToast('Failed to load office expense categories', 'error');

        // Departments (Cost Centers)
        const depResp = await fetch('/api/departments/list?per_page=1000', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const depData = await depResp.json();
        if (depResp.ok && Array.isArray(depData.data)) setCostCenterOptions(depData.data);
        else addToast('Failed to load departments', 'error');
      } catch (e) {
        addToast('Failed to load filter options', 'error');
      }
    }
    if (accessToken) fetchOptions();
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
      const url = `/api/reports/expense-report${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      // The backend returns { transactions: [...], totals: {...} }
      if (resp.ok) {
        setData(Array.isArray(result.transactions) ? result.transactions : []);
        setTotals(result.totals || {});
      } else {
        const msg = result.error || result.message || 'Failed to fetch report';
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
    let name = e.target.name;
    let value = e.target.value;
    // Always keep currency as KES
    if (name === 'currency') value = 'KES';
    setFilters({ ...filters, [name]: value, currency: 'KES' });
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
      params.append('filters', JSON.stringify(filters));
      params.append('reportType', 'expenseReport');
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
      a.download = 'expense-report.pdf';
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
      'Transaction #',
      'Expense',
      'Category',
      'Cost Center',
      'Amount',
      'Tax',
      'Net',
      'Currency',
      'Date',
    ];
    const rows = data.map(row => [
      row.id,
      row.expense ?? '',
      row.category ?? '',
      row.cost_center ?? '',
      row.amount ?? '',
      row.tax_amount ?? '',
      row.net_amount ?? '',
      'KES',
      row.created_at ? formatDate(row.created_at) : '',
    ]);
    // Add totals line
    const totalsLine = [
      'TOTALS', '', '', '',
      totals.total ?? '',
      totals.taxes ?? '',
      totals.net ?? '',
      'KES',
      '',
    ];
    const csv = [
      columns.join(','),
      ...rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')),
      totalsLine.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_OFFICE_EXPENSE"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Expense Report</h5>
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
              <select
                name="currency"
                value={filters.currency}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                disabled
              >
                <option value="KES">Kenyan Shilling (KES)</option>
              </select>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((cat: any) => (
                  <option key={cat.id || cat.value} value={cat.id || cat.value}>{cat.name || cat.label}</option>
                ))}
              </select>
              <select
                name="cost_center"
                value={filters.cost_center}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              >
                <option value="">All Departments</option>
                {costCenterOptions.map((dep: any) => (
                  <option key={dep.id || dep.value} value={dep.id || dep.value}>{dep.name || dep.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your expense report.</p>
                <div className="flex items-center gap-2">
                  <i className="material-symbols-outlined text-2xl text-primary-500">play_circle</i>
                  <span className="text-primary-500 font-medium">Ready to run your report?</span>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table table-bordered table-sm min-w-max w-full">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Transaction #</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Expense</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Category</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Cost Center</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Amount</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Tax</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Net</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                        <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={9} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                      ) : data.length === 0 ? (
                        <tr><td colSpan={9} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                      ) : (
                        data.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.id}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.expense}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.category}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.cost_center}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.amount}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.tax_amount}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.net_amount}</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">KES</td>
                            <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.created_at ? formatDate(row.created_at) : ''}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Totals Section */}
                <div className="mt-6 bg-primary-50 rounded-lg p-4 flex flex-col md:flex-row gap-6 justify-center items-center border border-primary-200">
                  <div className="text-lg font-semibold text-primary-700">Total Amount: <span className="font-bold">KES {totals.total?.toLocaleString() ?? '0'}</span></div>
                  <div className="text-lg font-semibold text-primary-700">Total Taxes: <span className="font-bold">KES {totals.taxes?.toLocaleString() ?? '0'}</span></div>
                  <div className="text-lg font-semibold text-primary-700">Total Net: <span className="font-bold">KES {totals.net?.toLocaleString() ?? '0'}</span></div>
                </div>
              </>
            )}
          </div>
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
