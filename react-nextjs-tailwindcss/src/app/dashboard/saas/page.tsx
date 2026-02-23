import ActiveUsers from "@/components/Dashboard/Saas/ActiveUsers";
import Conversion from "@/components/Dashboard/Saas/Conversion";
import GrossRevenue from "@/components/Dashboard/Saas/GrossRevenue";
import LatestTransactions from "@/components/Dashboard/Saas/LatestTransactions";
import ProductTradeConditions from "@/components/Dashboard/Saas/ProductTradeConditions";
import Revenue from "@/components/Dashboard/Saas/Revenue";
import SalesByCountry from "@/components/Dashboard/Saas/SalesByCountry";
import TodaysPayment from "@/components/Dashboard/Saas/TodaysPayment";
import TopRefers from "@/components/Dashboard/Saas/TopRefers";
import TotalUsers from "@/components/Dashboard/Saas/TotalUsers";
import UpgradePlans from "@/components/Dashboard/Saas/UpgradePlans";
import Users from "@/components/Dashboard/Saas/Users";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="lg:col-span-3">
          <TodaysPayment />
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-[25px]">
            <TotalUsers />

            <Revenue />

            <Conversion />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <TopRefers />
        </div>

        <div className="lg:col-span-2">
          <ActiveUsers />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="lg:col-span-3">
          <LatestTransactions />
        </div>

        <div className="lg:col-span-1">
          <UpgradePlans />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <Users />
        </div>

        <div className="lg:col-span-2">
          <ProductTradeConditions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <GrossRevenue />
        </div>

        <div className="lg:col-span-1">
          <SalesByCountry />
        </div>
      </div>
    </>
  );
}
