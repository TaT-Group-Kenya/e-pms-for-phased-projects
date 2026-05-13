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

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ProjectsSummaryReportPage() {
  const [filters, setFilters] = useState({
    currency_code: '',
    status: '',
    customer_id: '',
    project_category_id: '',
    project_source_origin_id: '',
    project_location_id: '',
    job_reference_id: '',
    from_date: '',
    to_date: '',
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [originOptions, setOriginOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);

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
      fetch('/api/projects/categories/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading categories' })),
      fetch('/api/projects/source-origins/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading origins' })),
      fetch('/api/projects/locations/list', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
        .catch(() => ({ ok: false, data: null, error: 'Error loading locations' })),
    ]).then(([currencies, customers, categories, origins, locations]) => {
      if (!isMounted) return;
      if (currencies.ok && Array.isArray(currencies.data)) setCurrencyOptions(currencies.data);
      else addToast('Failed to load currencies', 'error');
      if (customers.ok && Array.isArray(customers.data)) setCustomerOptions(customers.data);
      else addToast('Failed to load customers', 'error');
      if (categories.ok && Array.isArray(categories.data)) setCategoryOptions(categories.data);
      else addToast('Failed to load categories', 'error');
      if (origins.ok && Array.isArray(origins.data)) setOriginOptions(origins.data);
      else addToast('Failed to load origins', 'error');
      if (locations.ok && Array.isArray(locations.data)) setLocationOptions(locations.data);
      else addToast('Failed to load locations', 'error');
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
      const url = `/api/reports/projects-summary${params.toString() ? `?${params.toString()}` : ''}`;
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
      params.append('reportType', 'projectsSummary');
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
      a.download = 'projects-summary.pdf';
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
      'Job Reference ID',
      'Customer',
      'Project Name',
      'Category',
      'Source Origin',
      'Location',
      'Currency',
      'Amount',
      'Created By',
    ];
    const rows = data.map(row => [
      row.start_date ? formatDateTime(row.start_date) : '',
      row.job_reference_id ?? '',
      row.customer_name ?? '',
      row.name ?? '',
      row.project_category ?? '',
      row.project_source_origin ?? '',
      row.project_location ?? '',
      row.currency ?? '',
      formatCurrency(row.budget_estimate, row.currency) ?? '',
      row.created_by_name ?? '',
    ]);
    const csv = [columns.join(','), ...rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects-summary.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_PROJECT"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Projects Summary Report</h5>
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
                name="currency_code"
                value={filters.currency_code}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              >
                <option value="">All Currencies</option>
                {currencyOptions.map((c: any) => (
                  <option key={c.code || c.id || c.value} value={c.code || c.id || c.value}>
                    {c.name || c.code || c.label}
                  </option>
                ))}
              </select>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              >
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <select
                name="customer_id"
                value={filters.customer_id}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              >
                <option value="">All Customers</option>
                {customerOptions.map((c: any) => (
                  <option key={c.id || c.value} value={c.id || c.value}>
                    {c.name || c.label}
                  </option>
                ))}
              </select>
              <select
                name="project_category_id"
                value={filters.project_category_id}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((cat: any) => (
                  <option key={cat.id || cat.value} value={cat.id || cat.value}>
                    {cat.name || cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                name="project_source_origin_id"
                value={filters.project_source_origin_id}
                onChange={handleFilterChange}
                className="form-select rounded-lg h-[42px] border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 mt-6 md:mt-6"
              >
                <option value="">All Origins</option>
                {originOptions.map((o: any) => (
                  <option key={o.id || o.value} value={o.id || o.value}>
                    {o.name || o.label}
                  </option>
                ))}
              </select>
              <select
                name="project_location_id"
                value={filters.project_location_id}
                onChange={handleFilterChange}
                className="form-select rounded-lg h-[42px] border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 mt-6 md:mt-6"
              >
                <option value="">All Locations</option>
                {locationOptions.map((l: any) => (
                  <option key={l.id || l.value} value={l.id || l.value}>
                    {l.name || l.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="job_reference_id"
                value={filters.job_reference_id}
                onChange={handleFilterChange}
                className="form-input rounded-lg h-[42px] border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 mt-6 md:mt-6"
                placeholder="Job Reference ID"
              />
              <div className="flex flex-col">
                <label htmlFor="from_date" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from_date"
                  type="date"
                  name="from_date"
                  value={filters.from_date}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg h-[42px] border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your projects summary.</p>
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
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Customer</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Project Name</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Category</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Source Origin</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Location</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Amount</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Created By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={10} className="whitespace-nowrap px-4 py-2">Loading...</td></tr>
                    ) : data.length === 0 ? (
                      <tr><td colSpan={10} className="whitespace-nowrap px-4 py-2">No data found</td></tr>
                    ) : (
                      data.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.start_date ? formatDateTime(row.start_date) : ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.job_reference_id ?? ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.customer_name}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.name}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.project_category ?? ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.project_source_origin ?? ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.project_location ?? ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.currency ?? ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{formatCurrency(row.budget_estimate, row.currency) ?? ''}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.created_by_name ?? ''}</td>
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
