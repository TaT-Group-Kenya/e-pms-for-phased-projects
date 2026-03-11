import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout';
import { ToastContainer } from '../../../components/common/Toast';
import { useToast } from '../../../hooks/useToast';
import Can from '../../../components/auth/Can';
import OfficeExpenseDetailTabs from '../../../components/finance/OfficeExpenses/OfficeExpenseDetailTabs';

export default function OfficeExpenseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/finance/office-expenses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setExpense(data);
        setLoading(false);
      })
      .catch(() => {
        addToast('Failed to load expense details', 'error');
        setLoading(false);
      });
  }, [id, addToast]);

  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_OFFICE_EXPENSE"]} fallback={<div>You do not have permission to view this expense.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Office Expense Details</h5>
          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              <Link href="/dashboard" className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">home</i>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              Finance
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              <Link href="/finance/office-expenses" className="hover:text-primary-500">Office Expenses</Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              Details
            </li>
          </ol>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="rounded-md bg-white dark:bg-[#0c1427] p-6 shadow-sm mb-[25px]">
          {loading ? (
            <div>Loading...</div>
          ) : expense ? (
            <OfficeExpenseDetailTabs expenseId={id as string} />
          ) : (
            <div>Expense not found.</div>
          )}
        </div>
      </Can>
    </AuthenticatedLayout>
  );
}
