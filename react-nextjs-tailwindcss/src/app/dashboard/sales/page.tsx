import GrossEarnings from "@/components/Dashboard/Sales/GrossEarnings";
import RealTimeSales from "@/components/Dashboard/Sales/RealTimeSales";
import RecentEarnings from "@/components/Dashboard/Sales/RecentEarnings";
import RecentOrders from "@/components/Dashboard/Sales/RecentOrders";
import SalesByLocations from "@/components/Dashboard/Sales/SalesByLocations";
import SalesOverview from "@/components/Dashboard/Sales/SalesOverview";
import Stats from "@/components/Dashboard/Sales/Stats";
import TransactionHistory from "@/components/Dashboard/Sales/TransactionHistory";

export default function Page() {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] !pb-0 rounded-md">
        <div className="trezo-card-content">
          <Stats />

          <div className="lg:grid lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-2">
              <RecentEarnings />
            </div>

            <div className="lg:col-span-1">
              <SalesByLocations />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <TransactionHistory />
        </div>

        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div>
          <RealTimeSales />
        </div>

        <div>
          <SalesOverview />
        </div>

        <div>
          <GrossEarnings />
        </div>
      </div>
    </>
  );
}
