import CardsWithAmount from "@/components/Dashboard/CreditCard/CardsWithAmount";
import CreditUtilizationRatio from "@/components/Dashboard/CreditCard/CreditUtilizationRatio";
import DailyLimit from "@/components/Dashboard/CreditCard/DailyLimit";
import InterestChargeFees from "@/components/Dashboard/CreditCard/InterestChargeFees";
import MonthlySpending from "@/components/Dashboard/CreditCard/MonthlySpending";
import MyCards from "@/components/Dashboard/CreditCard/MyCards";
import QuickTransfer from "@/components/Dashboard/CreditCard/QuickTransfer";
import RecentTransactions from "@/components/Dashboard/CreditCard/RecentTransactions";
import SpendingBreakdown from "@/components/Dashboard/CreditCard/SpendingBreakdown";
import Statistics from "@/components/Dashboard/CreditCard/Statistics";
import TotalBalance from "@/components/Dashboard/CreditCard/TotalBalance";
import TotalExpense from "@/components/Dashboard/CreditCard/TotalExpense";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <MyCards />
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[25px]">
            <TotalBalance />

            <TotalExpense />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-[25px]">
            <CardsWithAmount />

            <DailyLimit />
          </div>
        </div>

        <div className="lg:col-span-1">
          <QuickTransfer />
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="2xl:col-span-3">
          <RecentTransactions />
        </div>

        <div className="2xl:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-[25px]">
            <CreditUtilizationRatio />

            <MonthlySpending />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="2xl:col-span-1">
          <SpendingBreakdown />
        </div>

        <div className="2xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">
            <InterestChargeFees />

            <Statistics />
          </div>
        </div>
      </div>
    </>
  );
}
