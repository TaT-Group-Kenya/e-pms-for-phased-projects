import Cards from "@/components/Dashboard/Finance/Cards";
import CashAtEndOfTheMonth from "@/components/Dashboard/Finance/CashAtEndOfTheMonth";
import ExpenseBreakdown from "@/components/Dashboard/Finance/ExpenseBreakdown";
import IncomeSource from "@/components/Dashboard/Finance/IncomeSource";
import NetProfit from "@/components/Dashboard/Finance/NetProfit";
import Statistics from "@/components/Dashboard/Finance/Statistics";
import Stats from "@/components/Dashboard/Finance/Stats";
import TransactionHistory from "@/components/Dashboard/Finance/TransactionHistory";
import WeeklyExpenses from "@/components/Dashboard/Finance/WeeklyExpenses";

export default function Page() {
  return (
    <>
      <Stats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <Statistics />
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[25px]">
            <CashAtEndOfTheMonth />

            <WeeklyExpenses />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[25px]">
            <IncomeSource />

            <NetProfit />
          </div>
        </div>

        <div className="lg:col-span-2">
          <TransactionHistory />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <Cards />
        </div>

        <div className="lg:col-span-1">
          <ExpenseBreakdown />
        </div>
      </div>
    </>
  );
}
