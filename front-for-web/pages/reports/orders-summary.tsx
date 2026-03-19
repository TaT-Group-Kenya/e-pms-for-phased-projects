// Format date as 'MMM D, YYYY h:mm AM/PM' using native JS
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
    hours = hours ? hours : 12; // 0 should be 12
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${month} ${day}, ${year} ${hours}:${paddedMinutes} ${ampm}`;
}
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/auth/selectors';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import Can from '../../components/auth/Can';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'sent', label: 'Sent' },
    { value: 'revised', label: 'Revised' },
];

export default function OrdersSummaryReportPage() {
    const [filters, setFilters] = useState({
        currency_code: '',
        status: '',
        project_id: '',
        customer_id: '',
        from_date: '',
        to_date: '',
    });
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasRun, setHasRun] = useState(false);
    const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
    const [projectOptions, setProjectOptions] = useState<any[]>([]);
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
            fetch('/api/projects/list', { headers: { Authorization: `Bearer ${accessToken}` } })
                .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
                .catch(() => ({ ok: false, data: null, error: 'Error loading projects' })),
            fetch('/api/customers/list', { headers: { Authorization: `Bearer ${accessToken}` } })
                .then(res => res.json().then(json => ({ ok: res.ok, data: Array.isArray(json.data) ? json.data : json })))
                .catch(() => ({ ok: false, data: null, error: 'Error loading customers' })),
        ]).then(([currencies, projects, customers]) => {
            if (!isMounted) return;
            if (currencies.ok && Array.isArray(currencies.data)) setCurrencyOptions(currencies.data);
            else addToast('Failed to load currencies', 'error');
            if (projects.ok && Array.isArray(projects.data)) setProjectOptions(projects.data);
            else addToast('Failed to load projects', 'error');
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
            // Build query string from filters, omitting empty values
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const url = `/api/reports/orders-summary${params.toString() ? `?${params.toString()}` : ''}`;
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
            // Send filters and reportType as query parameters
            const params = new URLSearchParams();
            params.append('filters', JSON.stringify(filters));
            params.append('reportType', 'ordersSummary');
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
            a.download = 'orders-summary.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(urlObj);
        } catch (err) {
            addToast('Network error exporting PDF', 'error');
        }
    }

    function exportCsv() {
        // Define columns as shown in the table
        const columns = [
            'Order #',
            'Project', // Uncomment if project column is visible
            'Customer',
            'Job Ref',
            'Quotation',
            'Title',
            'Status',
            'Total Amount',
            'Currency',
            'Created At',
        ];
        // Map data to CSV rows
        const rows = data.map(row => [
            row.order_number,
            row.project, // Uncomment if project column is visible
            row.customer_name,
            row.job_reference_id,
            row.quotation_title,
            row.title,
            row.status,
            row.total_amount,
            row.currency,
            row.created_at ? formatDateTime(row.created_at) : '',
        ]);
        // Build CSV string
        const csv = [columns.join(','), ...rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))].join('\n');
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders-summary.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <AuthenticatedLayout>
                <Can any={["ROLE_VIEW_ORDER"]} fallback={<div>You do not have permission to view this report.</div>}>
                    {/* Card 1: Title & Export */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
                            <h5 className="!mb-0">Orders Summary Report</h5>
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
                                name="project_id"
                                value={filters.project_id}
                                onChange={handleFilterChange}
                                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
                            >
                                <option value="">All Projects</option>
                                {projectOptions.map((p: any) => (
                                    <option key={p.id || p.value} value={p.id || p.value}>
                                        {p.name || p.title || p.label}
                                    </option>
                                ))}
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
                        </div>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="from_date" className="mb-1 text-sm text-gray-600">From</label>
                                <input
                                    id="from_date"
                                    type="date"
                                    name="from_date"
                                    value={filters.from_date}
                                    onChange={handleFilterChange}
                                    className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                                    className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 py-3 px-4"
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
                                <p className="text-gray-500 mb-4 text-center">No data has been requested yet.<br />Set your filters and click <span className='font-semibold text-primary-500'>Run Report</span> to generate your orders summary.</p>
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
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Order #</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Project</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Customer</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Job Ref</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Quotation</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Title</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Status</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Total Amount</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Currency</th>
                                            <th className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">Created At</th>
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
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.order_number}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.project}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.customer_name}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.job_reference_id}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.quotation_title}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.title}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.status}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.total_amount}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">{row.currency}</td>
                                                    <td className="whitespace-nowrap min-w-[120px] text-left px-4 py-2">
                                                        {row.created_at ? formatDateTime(row.created_at) : ''}
                                                    </td>
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
