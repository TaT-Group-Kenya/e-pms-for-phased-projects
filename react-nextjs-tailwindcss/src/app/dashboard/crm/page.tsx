import AnnualProfit from "@/components/Dashboard/CRM/AnnualProfit";
import BalanceOverview from "@/components/Dashboard/CRM/BalanceOverview";
import LeadConversion from "@/components/Dashboard/CRM/LeadConversion";
import LeadsBySource from "@/components/Dashboard/CRM/LeadsBySource";
import RecentLeads from "@/components/Dashboard/CRM/RecentLeads";
import RevenueGrowth from "@/components/Dashboard/CRM/RevenueGrowth";
import SalesReport from "@/components/Dashboard/CRM/SalesReport";
import TopPerformers from "@/components/Dashboard/CRM/TopPerformers";
import TopProductsBySales from "@/components/Dashboard/CRM/TopProductsBySales";
import TotalOrders from "@/components/Dashboard/CRM/TotalOrders";

export default function Page() {
  return (
    <>
      <div className="sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:gap-x-[25px] xl:gap-[25px]">
        <RevenueGrowth />

        <LeadConversion />

        <TotalOrders />

        <AnnualProfit />
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <BalanceOverview />
        </div>

        <div className="lg:col-span-1">
          <LeadsBySource />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <TopPerformers />
        </div>

        <div className="lg:col-span-2">
          <RecentLeads />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <SalesReport />
        </div>

        <div className="lg:col-span-1">
          <TopProductsBySales />
        </div>
      </div>
    </>
  );
}
