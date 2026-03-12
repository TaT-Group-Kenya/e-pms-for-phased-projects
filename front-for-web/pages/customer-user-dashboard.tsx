// --- Overview Interface ---
interface OverviewData {
  counts: {
    quotations: number;
    orders: number;
    invoices: number;
    projects: number;
    payments: number;
  };
  totals: {
    invoiced: number;
    paid: number;
  };
  recent: {
    quotations: Array<{
      id: number;
      quotation_number: string;
      title: string;
      created_at: string;
    }>;
    orders: Array<{
      id: number;
      order_number: string;
      title: string;
      created_at: string;
    }>;
    invoices: Array<{
      id: number;
      invoice_number: string;
      title: string;
      created_at: string;
    }>;
  };
}
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import AuthenticatedSimpleLayout from '../components/authenticated/AuthenticatedSimpleLayout';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectAccessToken } from '../store/auth/selectors';

// --- Entity Interfaces ---
export interface Quotation {
  id: number;
  quotation_number: string;
  job_reference_id: string;
  customer_id: number;
  title: string;
  description: string;
  status: string;
  valid_until_date: string | null;
  subtotal_amount: string;
  tax_amount: string;
  discount_percentage: string;
  discount_amount: string;
  total_amount: string;
  currency: string;
  payment_terms: string;
  min_approval_count: number;
  notes_to_customer: string | null;
  created_at: string;
  updated_at: string;
  updated_by: number | null;
  created_by: number;
  is_deleted: number;
  deleted_at: string | null;
  deleted_by: number | null;
}

export interface Order {
  id: number;
  order_number: string;
  job_reference_id: string;
  quotation_id: number;
  project_id: number;
  customer_id: number;
  title: string;
  description: string;
  status: string;
  subtotal_amount: string;
  tax_amount: string;
  discount_percentage: string;
  discount_amount: string;
  total_amount: string;
  currency: string;
  payment_terms: string;
  notes_to_customer: string | null;
  created_at: string;
  updated_at: string;
  updated_by: number | null;
  created_by: number;
  is_deleted: number;
  deleted_at: string | null;
  deleted_by: number | null;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  order_id: number;
  project_id: number;
  customer_id: number;
  title: string;
  description: string;
  status: string;
  subtotal_amount: string;
  tax_amount: string;
  discount_percentage: string;
  discount_amount: string;
  total_amount: string;
  currency: string;
  payment_terms: string;
  notes_to_customer: string | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
  updated_by: number | null;
  created_by: number;
  is_deleted: number;
  deleted_at: string | null;
  deleted_by: number | null;
}

export interface CreditNote {
  id: number;
  credit_note_number: string;
  job_reference_id?: string;
  customer_id?: number;
  title: string;
  description?: string;
  status: string;
  subtotal_amount?: string;
  tax_amount?: string;
  discount_percentage?: string;
  discount_amount?: string;
  total_amount: string;
  currency: string;
  payment_terms?: string;
  min_approval_count?: number;
  created_at: string;
  updated_at?: string;
  updated_by?: number | null;
  created_by?: number;
  is_deleted?: number;
  deleted_at?: string | null;
  deleted_by?: number | null;
  invoice_id: number;
  notes_to_customer: string;
}

export interface Project {
  id: number;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  budget_estimate: string;
  currency: string;
  description?: string;
  notes_to_customer?: string | null;
  updated_by?: number | null;
  created_by?: number;
  is_deleted?: number;
  deleted_at?: string | null;
  deleted_by?: number | null;
  order_id: number;
  created_at: string;
  updated_at: string;
  code: string;
  company_id: number | null;
  customer_id: number;
  project_category_id: number;
  project_source_origin_id: number;
  project_location_id: number;
  no_of_phases: string;
  priority: string;
  progress: string;
  tags: string;
}

export interface Payment {
  id: number;
  transaction_number: string;
  order_id?: number;
  amount_paid: string;
  payment_date: string | null;
  payment_method: string;
  payment_status: string;
  currency: string;
  transaction_reference?: string;
  description?: string;
  notes_to_customer?: string | null;
  created_at: string;
  updated_at?: string;
  updated_by?: number | null;
  created_by?: number;
  is_deleted?: number;
  deleted_at?: string | null;
  deleted_by?: number | null;
  transaction_id: string;
  direction: string;
  transaction_type: string;
  tax_amount: string;
  net_amount: string;
  bank_name: string | null;
  check_number: string | null;
  receipt_number: string;
  invoice_total_amount: string;
  exchange_rate: string;
  fee_or_charge: string;
  reconciled: number;
  reconciliation_date: string | null;
}

const TABS = [
  { label: 'Overview', key: 'overview' },
  { label: 'Quotations', key: 'quotations' },
  { label: 'Orders', key: 'orders' },
  { label: 'Invoices', key: 'invoices' },
  { label: 'Credit Notes', key: 'credit-notes' },
  { label: 'Projects', key: 'projects' },
  { label: 'Payments', key: 'payments' },
];

const CustomerUserDashboard: NextPage = () => {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const [activeTab, setActiveTab] = useState('overview');
  const [quotations, setQuotations] = useState<Quotation[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [creditNotes, setCreditNotes] = useState<CreditNote[] | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Overview state
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  // Search state for each tab
  const [search, setSearch] = useState<string>('');
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'User';

  // CSV export helper
  function exportToCSV(data: any[], columns: string[], filename: string) {
    if (!data || !data.length) return;
    const csvRows = [columns.join(",")];
    data.forEach(row => {
      const vals = columns.map(col => {
        let v = row[col];
        if (v === null || v === undefined) return '';
        v = String(v).replace(/"/g, '""');
        return `"${v}"`;
      });
      csvRows.push(vals.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Search filter helper
  function filterRows<T extends Record<string, any>>(rows: T[], columns: string[], search: string): T[] {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter(row =>
      columns.some(col => (row[col] !== undefined && String(row[col] ?? '').toLowerCase().includes(s)))
    );
  }

  // Fetch data for the active tab
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setError(null);
      setLoading(true);
      try {
        let res, data;
        const fetchWithAuth = async (url: string) => {
          return await fetch(url, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
          });
        };
        const extractArray = (data: any) => {
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.data)) return data.data;
          return [];
        };
        switch (activeTab) {
          case 'quotations':
            res = await fetchWithAuth('/api/external-customer/quotations');
            data = await res.json();
            if (!ignore) setQuotations(extractArray(data));
            break;
          case 'orders':
            res = await fetchWithAuth('/api/external-customer/orders');
            data = await res.json();
            if (!ignore) setOrders(extractArray(data));
            break;
          case 'invoices':
            res = await fetchWithAuth('/api/external-customer/invoices');
            data = await res.json();
            if (!ignore) setInvoices(extractArray(data));
            break;
          case 'credit-notes':
            res = await fetchWithAuth('/api/external-customer/credit-notes');
            data = await res.json();
            if (!ignore) setCreditNotes(extractArray(data));
            break;
          case 'projects':
            res = await fetchWithAuth('/api/external-customer/projects');
            data = await res.json();
            if (!ignore) setProjects(extractArray(data));
            break;
          case 'payments':
            res = await fetchWithAuth('/api/external-customer/payments');
            data = await res.json();
            if (!ignore) setPayments(extractArray(data));
            break;
        }
      } catch (e: any) {
        if (!ignore) setError('Failed to load data.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (activeTab !== 'overview' && accessToken) fetchData();
    return () => { ignore = true; };
  }, [activeTab, accessToken]);

  // Fetch overview data when overview tab is active
  useEffect(() => {
    let ignore = false;
    async function fetchOverview() {
      setOverviewError(null);
      setOverviewLoading(true);
      try {
        const res = await fetch('/api/external-customer/overview', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        const data = await res.json();
        if (!ignore) setOverview(data);
      } catch (e) {
        if (!ignore) setOverviewError('Failed to load overview data.');
      } finally {
        if (!ignore) setOverviewLoading(false);
      }
    }
    if (activeTab === 'overview' && accessToken) fetchOverview();
    return () => { ignore = true; };
  }, [activeTab, accessToken]);


  return (
    <AuthenticatedSimpleLayout dashboardHref="/customer-user-dashboard">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-12">Welcome, {fullName}!</h1>
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200 dark:border-[#172036] mb-4">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`pb-2 px-2 font-medium transition-all ${activeTab === tab.key ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>
            {activeTab === 'overview' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-5 mt-5">Customer Overview</h2>
                {overviewLoading ? (
                  <div className="text-gray-400 py-8 text-center">Loading overview...</div>
                ) : overviewError ? (
                  <div className="text-red-400 py-8 text-center">{overviewError}</div>
                ) : overview ? (
                  <>
                    {/* Stats cards with icons and varying colors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Quotations */}
                      <div className="bg-blue-50 dark:bg-blue-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-blue-400 text-4xl mb-2">description</span>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-200">{overview?.counts?.quotations ?? '-'}</div>
                        <div className="text-sm text-blue-700 dark:text-blue-200">Quotations</div>
                      </div>
                      {/* Orders */}
                      <div className="bg-green-50 dark:bg-green-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-green-400 text-4xl mb-2">shopping_cart</span>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-200">{overview?.counts?.orders ?? '-'}</div>
                        <div className="text-sm text-green-700 dark:text-green-200">Orders</div>
                      </div>
                      {/* Invoices */}
                      <div className="bg-yellow-50 dark:bg-yellow-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-yellow-400 text-4xl mb-2">receipt_long</span>
                        <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-200">{overview?.counts?.invoices ?? '-'}</div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-200">Invoices</div>
                      </div>
                      {/* Projects */}
                      <div className="bg-purple-50 dark:bg-purple-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-purple-400 text-4xl mb-2">workspaces</span>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-200">{overview?.counts?.projects ?? '-'}</div>
                        <div className="text-sm text-purple-700 dark:text-purple-200">Projects</div>
                      </div>
                      {/* Payments */}
                      <div className="bg-pink-50 dark:bg-pink-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-pink-400 text-4xl mb-2">payments</span>
                        <div className="text-3xl font-bold text-pink-700 dark:text-pink-200">{overview?.counts?.payments ?? '-'}</div>
                        <div className="text-sm text-pink-700 dark:text-pink-200">Payments</div>
                      </div>
                      {/* Total Invoiced */}
                      <div className="bg-orange-50 dark:bg-orange-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-orange-400 text-4xl mb-2">trending_up</span>
                        <div className="text-3xl font-bold text-orange-700 dark:text-orange-200">{overview?.totals?.invoiced !== undefined ? Number(overview.totals.invoiced).toLocaleString() : '0'}</div>
                        <div className="text-sm text-orange-700 dark:text-orange-200">Total Invoiced</div>
                      </div>
                      {/* Total Paid */}
                      {/* <div className="bg-teal-50 dark:bg-teal-900 rounded p-4 shadow flex flex-col items-center">
                        <span className="material-symbols-outlined text-teal-400 text-4xl mb-2">paid</span>
                        <div className="text-3xl font-bold text-teal-700 dark:text-teal-200">{overview?.totals?.paid !== undefined ? Number(overview.totals.paid).toLocaleString() : '0'}</div>
                        <div className="text-sm text-teal-700 dark:text-teal-200">Total Paid</div>
                      </div> */}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 py-8 text-center">No overview data.</div>
                )}
              </div>
            )}
            {activeTab === 'quotations' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-2">Quotations</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="ml-0 md:ml-2 px-3 py-1 bg-primary-500 text-white rounded text-sm"
                    onClick={() => exportToCSV(
                      filterRows(quotations || [], [
                        'quotation_number','title','description','status','valid_until_date','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','created_at'
                      ], search),
                      [
                        'quotation_number','title','description','status','valid_until_date','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','created_at'
                      ],
                      'quotations.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Quotation #</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Valid Until</th>
                        <th className="px-4 py-2 text-left">Subtotal</th>
                        <th className="px-4 py-2 text-left">Tax</th>
                        <th className="px-4 py-2 text-left">Discount %</th>
                        <th className="px-4 py-2 text-left">Discount Amt</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-left">Payment Terms</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                        <th className="px-4 py-2 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        error ? <tr><td colSpan={24} className="text-center py-6 text-red-400">{error}</td></tr> :
                        (!quotations || quotations.length === 0) ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">No quotations found.</td></tr> :
                        filterRows(quotations || [], [
                          'quotation_number','title','description','status','valid_until_date','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','created_at'
                        ], search).map((q) => (
                          <tr key={q.id}>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.quotation_number}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.title}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.status}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.valid_until_date ? new Date(q.valid_until_date).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.subtotal_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.tax_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.discount_percentage}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.discount_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.total_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.currency}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.payment_terms}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.notes_to_customer}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{q.created_at ? new Date(q.created_at).toLocaleDateString() : ''}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-2">Orders</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="ml-0 md:ml-2 px-3 py-1 bg-primary-500 text-white rounded text-sm"
                    onClick={() => exportToCSV(
                      filterRows(orders || [], [
                        'order_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','created_at','updated_at'
                      ], search),
                      [
                        'order_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','created_at','updated_at'
                      ],
                      'orders.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Order #</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Subtotal</th>
                        <th className="px-4 py-2 text-left">Tax</th>
                        <th className="px-4 py-2 text-left">Discount %</th>
                        <th className="px-4 py-2 text-left">Discount Amt</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-left">Payment Terms</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        error ? <tr><td colSpan={24} className="text-center py-6 text-red-400">{error}</td></tr> :
                        (!orders || orders.length === 0) ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">No orders found.</td></tr> :
                        filterRows(orders || [], [
                          'order_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','created_at','updated_at'
                        ], search).map((o) => (
                          <tr key={o.id}>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.order_number}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.title}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.status}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.subtotal_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.tax_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.discount_percentage}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.discount_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.total_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.currency}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.payment_terms}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.notes_to_customer}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{o.updated_at ? new Date(o.updated_at).toLocaleDateString() : ''}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'invoices' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-2">Invoices</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="ml-0 md:ml-2 px-3 py-1 bg-primary-500 text-white rounded text-sm"
                    onClick={() => exportToCSV(
                      filterRows(invoices || [], [
                        'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','valid_until','created_at','updated_at'
                      ], search),
                      [
                        'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','valid_until','created_at','updated_at'
                      ],
                      'invoices.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Invoice #</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Subtotal</th>
                        <th className="px-4 py-2 text-left">Tax</th>
                        <th className="px-4 py-2 text-left">Discount %</th>
                        <th className="px-4 py-2 text-left">Discount Amt</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-left">Payment Terms</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                        <th className="px-4 py-2 text-left">Valid Until</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        error ? <tr><td colSpan={24} className="text-center py-6 text-red-400">{error}</td></tr> :
                        (!invoices || invoices.length === 0) ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">No invoices found.</td></tr> :
                        filterRows(invoices || [], [
                          'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_customer','valid_until','created_at','updated_at'
                        ], search).map((inv) => (
                          <tr key={inv.id}>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.invoice_number}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.title}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.status}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.subtotal_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.tax_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.discount_percentage}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.discount_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.total_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.currency}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.payment_terms}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.notes_to_customer}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.valid_until ? new Date(inv.valid_until).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.created_at ? new Date(inv.created_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{inv.updated_at ? new Date(inv.updated_at).toLocaleDateString() : ''}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'credit-notes' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-2">Credit Notes</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="ml-0 md:ml-2 px-3 py-1 bg-primary-500 text-white rounded text-sm"
                    onClick={() => exportToCSV(
                      filterRows(creditNotes || [], [
                        'credit_note_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','min_approval_count','created_at','updated_at','notes_to_customer'
                      ], search),
                      [
                        'credit_note_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','min_approval_count','created_at','updated_at','notes_to_customer'
                      ],
                      'credit_notes.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Credit Note #</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Subtotal</th>
                        <th className="px-4 py-2 text-left">Tax</th>
                        <th className="px-4 py-2 text-left">Discount %</th>
                        <th className="px-4 py-2 text-left">Discount Amt</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-left">Payment Terms</th>
                        <th className="px-4 py-2 text-left">Min Approval</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Updated</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        error ? <tr><td colSpan={24} className="text-center py-6 text-red-400">{error}</td></tr> :
                        (!creditNotes || creditNotes.length === 0) ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">No credit notes found.</td></tr> :
                        filterRows(creditNotes || [], [
                          'credit_note_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','min_approval_count','created_at','updated_at','notes_to_customer'
                        ], search).map((c) => (
                          <tr key={c.id}>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.credit_note_number}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.title}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.status}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.subtotal_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.tax_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.discount_percentage}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.discount_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.total_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.currency}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.payment_terms}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.min_approval_count}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.updated_at ? new Date(c.updated_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{c.notes_to_customer}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'projects' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-2">Projects</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="ml-0 md:ml-2 px-3 py-1 bg-primary-500 text-white rounded text-sm"
                    onClick={() => exportToCSV(
                      filterRows(projects || [], [
                        'name','status','budget_estimate','currency','description','notes_to_customer','order_id','created_at','updated_at','code','no_of_phases','priority','progress'
                      ], search),
                      [
                        'name','status','budget_estimate','currency','description','notes_to_customer','order_id','created_at','updated_at','code','no_of_phases','priority','progress'
                      ],
                      'projects.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Budget</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Updated</th>
                        <th className="px-4 py-2 text-left">Code</th>
                        <th className="px-4 py-2 text-left">No. of Phases</th>
                        <th className="px-4 py-2 text-left">Priority</th>
                        <th className="px-4 py-2 text-left">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={26} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        error ? <tr><td colSpan={26} className="text-center py-6 text-red-400">{error}</td></tr> :
                        (!projects || projects.length === 0) ? <tr><td colSpan={26} className="text-center py-6 text-gray-400">No projects found.</td></tr> :
                        filterRows(projects || [], [
                          'name','status','budget_estimate','currency','description','notes_to_customer','order_id','created_at','updated_at','code','no_of_phases','priority','progress'
                        ], search).map((p) => (
                          <tr key={p.id}>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.status}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.budget_estimate}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.currency}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.notes_to_customer}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.order_id}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.code}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.no_of_phases}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.priority}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{p.progress}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="bg-white dark:bg-[#0c1427] rounded shadow p-6 mb-4">
                <h2 className="text-lg font-semibold mb-2">Payments</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="ml-0 md:ml-2 px-3 py-1 bg-primary-500 text-white rounded text-sm"
                    onClick={() => exportToCSV(
                      filterRows(payments || [], [
                        'transaction_number','amount_paid','payment_date','payment_method','payment_status','currency','transaction_reference','description','notes_to_customer','created_at','updated_at','tax_amount','net_amount','bank_name','receipt_number','invoice_total_amount'
                      ], search),
                      [
                        'transaction_number','amount_paid','payment_date','payment_method','payment_status','currency','transaction_reference','description','notes_to_customer','created_at','updated_at','tax_amount','net_amount','bank_name','receipt_number','invoice_total_amount'
                      ],
                      'payments.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Transaction #</th>
                        <th className="px-4 py-2 text-left">Amount Paid</th>
                        <th className="px-4 py-2 text-left">Payment Date</th>
                        <th className="px-4 py-2 text-left">Payment Method</th>
                        <th className="px-4 py-2 text-left">Payment Status</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-left">Transaction Reference</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Updated</th>
                        <th className="px-4 py-2 text-left">Tax Amount</th>
                        <th className="px-4 py-2 text-left">Net Amount</th>
                        <th className="px-4 py-2 text-left">Bank Name</th>
                        <th className="px-4 py-2 text-left">Receipt Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={30} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        error ? <tr><td colSpan={30} className="text-center py-6 text-red-400">{error}</td></tr> :
                        (!payments || payments.length === 0) ? <tr><td colSpan={30} className="text-center py-6 text-gray-400">No payments found.</td></tr> :
                        filterRows(payments || [], [
                          'transaction_number','amount_paid','payment_date','payment_method','payment_status','currency','transaction_reference','description','notes_to_customer','created_at','updated_at','tax_amount','net_amount','bank_name','receipt_number'
                        ], search).map((pay) => (
                          <tr key={pay.id}>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.transaction_number}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.amount_paid}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.payment_date ? new Date(pay.payment_date).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.payment_method}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.payment_status}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.currency}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.transaction_reference}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.notes_to_customer}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.created_at ? new Date(pay.created_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.updated_at ? new Date(pay.updated_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.tax_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.net_amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.bank_name}</td>
                            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{pay.receipt_number}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedSimpleLayout>
  );
}

export default CustomerUserDashboard;
