
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';

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

export default function CustomerHistoryReportPage() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setHasRun(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = `/api/reports/customer-history${params.toString() ? `?${params.toString()}` : ''}`;
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
      params.append('filters', JSON.stringify(filters));
      params.append('reportType', 'customerHistory');
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
      a.download = 'customer-history.pdf';
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
      'Customer Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'Country',
      'KRA PIN',
      'Created At',
    ];
    const rows = data.map(row => [
      row.customer_name,
      row.email,
      row.phone,
      row.address,
      row.city,
      row.state,
      row.country,
      row.kra_pin,
      row.created_at ? formatDateTime(row.created_at) : '',
    ]);
    const csv = [columns.join(','), ...rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthenticatedLayout>
        <Can any={["ROLE_VIEW_CUSTOMER"]} fallback={<div>You do not have permission to view this report.</div>}>
          {/* Card 1: Title & Export */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <h5 className="!mb-0">Customer History Report</h5>
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
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="from" className="mb-1 text-sm text-gray-600">From</label>
                <input
                  id="from"
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                  className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your customer history report.</p>
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
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Customer Name</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Email</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Phone</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Address</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">City</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">State</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Country</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">KRA PIN</th>
                      <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Created At</th>
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
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.customer_name}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.email}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.phone}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.address}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.city}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.state}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.country}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.kra_pin}</td>
                          <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.created_at ? formatDateTime(row.created_at) : ''}</td>
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
