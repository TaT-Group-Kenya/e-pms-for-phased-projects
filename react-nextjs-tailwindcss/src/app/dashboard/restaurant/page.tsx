import CustomerRatings from "@/components/Dashboard/Restaurant/CustomerRatings";
import Expense from "@/components/Dashboard/Restaurant/Expense";
import LowStockAlerts from "@/components/Dashboard/Restaurant/LowStockAlerts";
import OrderSummary from "@/components/Dashboard/Restaurant/OrderSummary";
import PendingOrders from "@/components/Dashboard/Restaurant/PendingOrders";
import RecentOrdersList from "@/components/Dashboard/Restaurant/RecentOrdersList";
import Revenue from "@/components/Dashboard/Restaurant/Revenue";
import RevenueByBranches from "@/components/Dashboard/Restaurant/RevenueByBranches";
import RevenueVSExpense from "@/components/Dashboard/Restaurant/RevenueVSExpense";
import StaffPerformanceScores from "@/components/Dashboard/Restaurant/StaffPerformanceScores";
import Tickets from "@/components/Dashboard/Restaurant/Tickets";
import TopSellingItems from "@/components/Dashboard/Restaurant/TopSellingItems";
import TotalOrders from "@/components/Dashboard/Restaurant/TotalOrders";
import Welcome from "@/components/Dashboard/Restaurant/Welcome";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[25px] mb-[25px]">
        <div>
          <Welcome />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
            <TotalOrders />

            <PendingOrders />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px] mb-[25px]">
            <Revenue />

            <Expense />
          </div>

          <TopSellingItems />
        </div>
      </div>

      <RecentOrdersList />

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="2xl:col-span-1 md:order-1 2xl:order-1">
          <OrderSummary />
        </div>

        <div className="md:col-span-2 2xl:col-span-2 md:order-3 2xl:order-2">
          <RevenueVSExpense />
        </div>

        <div className="2xl:col-span-1 md:order-2 2xl:order-2">
          <LowStockAlerts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <StaffPerformanceScores />

        <RevenueByBranches />

        <Tickets />
      </div>

      <CustomerRatings />
    </>
  );
}
