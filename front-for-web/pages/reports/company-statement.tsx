import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function CompanyStatementReportPage() {
  const [filters, setFilters] = useState({
    company_id: '',
    currency_code: '',
    from: '',
    to: '',
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState('');
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;

    Promise.all([
      fetch('/api/companies/list?per_page=1000', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(res => res.json()),
      fetch('/api/currencies/list', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(res => res.json()),
    ])
      .then(([companiesRes, currenciesRes]) => {
        if (!isMounted) return;
        const companyList = Array.isArray(companiesRes.data) ? companiesRes.data : Array.isArray(companiesRes) ? companiesRes : [];
        const currencyList = Array.isArray(currenciesRes.data) ? currenciesRes.data : Array.isArray(currenciesRes) ? currenciesRes : [];
        setCompanies(companyList);
        setCurrencyOptions(currencyList);
      })
      .catch(() => {
        if (!isMounted) return;
        addToast('Failed to load lookup data', 'error');
      });

    return () => { isMounted = false; };
  }, [accessToken, addToast]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const validateFilters = (): boolean => {
    if (!filters.company_id || !filters.currency_code || !filters.from || !filters.to) {
      const msg = 'Company, currency, from and to date filters are required.';
      setError(msg);
      addToast(msg, 'error');
      return false;
    }
    setError('');
    return true;
  };

  const fetchData = async () => {
    if (!validateFilters()) {
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
      const url = `/api/reports/company-statement${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await resp.json();
      if (resp.ok) {
        setData(Array.isArray(result.rows) ? result.rows : []);
        setTotals(result.totals || {});
      } else {
        const msg = result.error || 'Failed to fetch company statement';
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
    if (!validateFilters()) {
      return;
    }

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      params.append('reportType', 'companyStatement');
      const url = `/api/reports/export-pdf?${params.toString()}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!resp.ok) {
        const errorBody = await resp.json();
        addToast(errorBody.message || 'Failed to export PDF', 'error');
        return;
      }
      const blob = await resp.blob();
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObj;
      a.download = 'company-statement.pdf';
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
    const columns = ['Date', 'Job Ref', 'Document #', 'Company', 'Description', 'Debit', 'Credit', 'Balance'];
    const rows = data.map(row => [
      row.date || row.created_at || '',
      row.job_reference || '',
      row.document_number || '',
      row.company_name || '',
      row.description || '',
      row.debit_amount?.toFixed(2) || '0.00',
      row.credit_amount?.toFixed(2) || '0.00',
      row.balance?.toFixed(2) || row.running_balance_base?.toFixed(2) || '0.00',
    ]);
    const totalsRow = [
      'TOTAL', '', '', '', '',
      totals.total_debit?.toFixed(2) || '0.00',
      totals.total_credit?.toFixed(2) || '0.00',
      totals.balance?.toFixed(2) || totals.closing_balance_base?.toFixed(2) || '0.00',
    ];
    const csv = [
      columns.join(','),
      ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
      totalsRow.join(','),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company-statement.csv';
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
        <Can any={["ROLE_VIEW_COMPANY_TRANSACTIONS_LEDGER"]} fallback={<div>You do not have permission to view this report.</div>}>
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <div>
                <h5 className="!mb-0">Company Statement</h5>
                <p className="text-sm text-gray-500">Generate account statements for companies with CSV and PDF export.</p>
              </div>
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

          <div className="bg-white rounded-lg shadow p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="company_id" className="mb-1 text-sm text-gray-600">Company</label>
                <select
                  id="company_id"
                  name="company_id"
                  value={filters.company_id}
                  onChange={handleFilterChange}
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">Select company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name || `#${company.id}`}
                    </option>
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
                  className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                >
                  <option value="">Select currency</option>
                  {currencyOptions.map(currency => (
                    <option key={currency.code || currency.id || currency.value} value={currency.code || currency.id || currency.value}>
                      {currency.code || currency.name || currency.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="from" className="mb-1 text-sm text-gray-600">From</label>
                  <input
                    id="from"
                    type="date"
                    name="from"
                    value={filters.from}
                    onChange={handleFilterChange}
                    className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="rounded-md bg-primary-500 text-white px-6 py-3 flex items-center gap-2 shadow hover:bg-primary-600 transition"
                onClick={fetchData}
                disabled={loading}
              >
                <i className="material-symbols-outlined !text-xl">play_circle</i> Run Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            {!hasRun && <div className="text-sm text-gray-500">Use the filters above and click run report.</div>}
            {hasRun && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Job Ref</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Document #</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Company</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">Debit</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">Credit</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-gray-500">No transactions found.</td>
                      </tr>
                    )}
                    {data.map((row, index) => (
                      <tr key={`${row.document_number || row.transaction_number || index}-${index}`}>
                        <td className="px-4 py-3">{formatDateTime(row.date || row.created_at)}</td>
                        <td className="px-4 py-3">{row.job_reference || '-'}</td>
                        <td className="px-4 py-3">{row.document_number || '-'}</td>
                        <td className="px-4 py-3">{row.company_name || '-'}</td>
                        <td className="px-4 py-3">{row.description || '-'}</td>
                        <td className="px-4 py-3 text-right">{row.debit_amount ? formatCurrency(Number(row.debit_amount), filters.currency_code || 'KES') : '-'}</td>
                        <td className="px-4 py-3 text-right">{row.credit_amount ? formatCurrency(Number(row.credit_amount), filters.currency_code || 'KES') : '-'}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(Number(row.balance ?? row.running_balance_base ?? 0), filters.currency_code || 'KES')}</td>
                      </tr>
                    ))}
                  </tbody>
                  {data.length > 0 && (
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-3 font-semibold text-gray-700">Totals</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">{formatCurrency(Number(totals.total_debit ?? 0), filters.currency_code || 'KES')}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">{formatCurrency(Number(totals.total_credit ?? 0), filters.currency_code || 'KES')}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">{formatCurrency(Number(totals.closing_balance_base ?? 0), filters.currency_code || 'KES')}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        </Can>
      </AuthenticatedLayout>
    </>
  );
}
