
// --- Overview Interface ---
interface CompanyOverviewData {
  counts: {
    invoices: number;
    credit_notes: number;
    projects: number;
  };
  totals: {
    invoiced: number;
    paid: number;
  };
}

// --- Entity Interfaces ---
export interface CompanyInvoice {
  id: number;
  invoice_number: string;
  company_id: number;
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
  notes_to_company: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: number;
}

export interface CompanyCreditNote {
  id: number;
  credit_note_number: string;
  company_id: number;
  title: string;
  status: string;
  total_amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
}


export interface CompanyProjectPhase {
  id: number;
  code: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  progress_percentage: number | null;
}

export interface CompanyProject {
  id: number;
  project_id: number;
  phase_id: number | null;
  company_id: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  project: {
    id: number;
    code: string;
    name: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    currency: string;
    created_at: string;
    updated_at: string;
    phases?: CompanyProjectPhase[];
  };
  phase?: CompanyProjectPhase | null;
}

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import AuthenticatedSimpleLayout from '../components/authenticated/AuthenticatedSimpleLayout';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectAccessToken } from '../store/auth/selectors';
import { JSON_HEADERS } from '../constants/headers';

const TABS = [
  { label: 'Overview', key: 'overview' },
  { label: 'Invoices', key: 'invoices' },
  { label: 'Projects', key: 'projects' },
];


const CompanyUserDashboard: NextPage = () => {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState<CompanyOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<CompanyInvoice[] | null>(null);
  const [creditNotes, setCreditNotes] = useState<CompanyCreditNote[] | null>(null);
  const [projects, setProjects] = useState<CompanyProject[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
            headers: accessToken ? { ...JSON_HEADERS, Authorization: `Bearer ${accessToken}` } : { ...JSON_HEADERS },
          });
        };
        const extractArray = (data: any) => {
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.data)) return data.data;
          return [];
        };
        switch (activeTab) {
          case 'invoices':
            res = await fetchWithAuth('/api/external-company/invoices');
            data = await res.json();
            if (!ignore) setInvoices(extractArray(data));
            break;
          case 'credit-notes':
            res = await fetchWithAuth('/api/external-company/credit-notes');
            data = await res.json();
            if (!ignore) setCreditNotes(extractArray(data));
            break;
          case 'projects':
            res = await fetchWithAuth('/api/external-company/projects');
            data = await res.json();
            if (!ignore) setProjects(extractArray(data));
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
        const res = await fetch('/api/external-company/overview', {
          headers: accessToken ? { ...JSON_HEADERS, Authorization: `Bearer ${accessToken}` } : { ...JSON_HEADERS },
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
    <AuthenticatedSimpleLayout dashboardHref="/company-user-dashboard">
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
                <h2 className="text-lg font-semibold mb-5 mt-5">Company Overview</h2>
                {overviewLoading ? (
                  <div className="text-gray-400 py-8 text-center">Loading overview...</div>
                ) : overviewError ? (
                  <div className="text-red-400 py-8 text-center">{overviewError}</div>
                ) : overview ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    {/* Total Invoiced */}
                    <div className="bg-orange-50 dark:bg-orange-900 rounded p-4 shadow flex flex-col items-center">
                      <span className="material-symbols-outlined text-orange-400 text-4xl mb-2">trending_up</span>
                      <div className="text-3xl font-bold text-orange-700 dark:text-orange-200">KES {overview?.totals?.invoiced !== undefined ? Number(overview.totals.invoiced).toLocaleString() : '0'}</div>
                      <div className="text-sm text-orange-700 dark:text-orange-200">Total Invoiced</div>
                    </div>
                    
                  </div>
                ) : (
                  <div className="text-gray-400 py-8 text-center">No overview data.</div>
                )}
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
                        'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_company','created_at'
                      ], search),
                      [
                        'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_company','created_at'
                      ],
                      'company_invoices.csv'
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
                        <th className="px-4 py-2 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        (invoices && filterRows(invoices, [
                          'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_company','created_at'
                        ], search).length > 0 ?
                          filterRows(invoices, [
                            'invoice_number','title','description','status','subtotal_amount','tax_amount','discount_percentage','discount_amount','total_amount','currency','payment_terms','notes_to_company','created_at'
                          ], search).map(inv => (
                            <tr key={inv.id} className="whitespace-nowrap">
                              <td className="px-4 py-2">{inv.invoice_number}</td>
                              <td className="px-4 py-2">{inv.title}</td>
                              <td className="px-4 py-2">{inv.description}</td>
                              <td className="px-4 py-2">{inv.status}</td>
                              <td className="px-4 py-2">{inv.subtotal_amount}</td>
                              <td className="px-4 py-2">{inv.tax_amount}</td>
                              <td className="px-4 py-2">{inv.discount_percentage}</td>
                              <td className="px-4 py-2">{inv.discount_amount}</td>
                              <td className="px-4 py-2">{inv.total_amount}</td>
                              <td className="px-4 py-2">{inv.currency}</td>
                              <td className="px-4 py-2">{inv.payment_terms}</td>
                              <td className="px-4 py-2">{inv.notes_to_company}</td>
                              <td className="px-4 py-2">{inv.created_at}</td>
                            </tr>
                          )) :
                          <tr><td colSpan={24} className="text-center py-6 text-gray-400">No invoices found.</td></tr>
                        )}
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
                        'project.name','project.status','project.start_date','project.end_date','created_at','is_complete'
                      ], search),
                      [
                        'project.name','project.status','project.start_date','project.end_date','created_at','is_complete'
                      ],
                      'company_projects.csv'
                    )}
                  >Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50 dark:bg-[#111827]">
                      <tr>
                        <th className="px-4 py-2 text-left">Project Name</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Start Date</th>
                        <th className="px-4 py-2 text-left">End Date</th>
                        <th className="px-4 py-2 text-left">Assigned Phase(s)</th>
                        <th className="px-4 py-2 text-left">Progress</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Complete?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={24} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                        (projects && projects.length > 0 ?
                          projects.map(proj => (
                            <tr key={proj.id} className="whitespace-nowrap">
                              <td className="px-4 py-2">{proj.project?.name}</td>
                              <td className="px-4 py-2">{proj.project?.status}</td>
                              <td className="px-4 py-2">{proj.project?.start_date}</td>
                              <td className="px-4 py-2">{proj.project?.end_date}</td>
                              <td className="px-4 py-2">
                                {proj.phase ? (
                                  <span>{proj.phase.name} ({proj.phase.status})</span>
                                ) : (
                                  proj.project?.phases && proj.project.phases.length > 0 ?
                                    proj.project.phases.map(phase => (
                                      <span key={phase.id} className="block">{phase.name} ({phase.status})</span>
                                    )) : <span>-</span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {proj.phase && proj.phase.progress_percentage !== null ? (
                                  <span>{proj.phase.progress_percentage}%</span>
                                ) : (
                                  proj.project?.phases && proj.project.phases.length > 0 ?
                                    proj.project.phases.map(phase => (
                                      <span key={phase.id} className="block">{phase.progress_percentage ?? 0}%</span>
                                    )) : <span>-</span>
                                )}
                              </td>
                              <td className="px-4 py-2">{proj.created_at}</td>
                              <td className="px-4 py-2">{proj.is_complete ? 'Yes' : 'No'}</td>
                            </tr>
                          )) :
                          <tr><td colSpan={24} className="text-center py-6 text-gray-400">No projects found.</td></tr>
                        )}
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
};

export default CompanyUserDashboard;
