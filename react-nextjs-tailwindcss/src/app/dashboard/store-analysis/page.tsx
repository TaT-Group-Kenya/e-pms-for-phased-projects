import CustomerVisits from "@/components/Dashboard/StoreAnalysis/CustomerVisits";
import GrossRevenue from "@/components/Dashboard/StoreAnalysis/GrossRevenue";
import RecentSales from "@/components/Dashboard/StoreAnalysis/RecentSales";
import SalesByCategory from "@/components/Dashboard/StoreAnalysis/SalesByCategory";
import SalesByGender from "@/components/Dashboard/StoreAnalysis/SalesByGender";
import SalesThisMonth from "@/components/Dashboard/StoreAnalysis/SalesThisMonth";
import Stats from "@/components/Dashboard/StoreAnalysis/Stats";
import StockAlerts from "@/components/Dashboard/StoreAnalysis/StockAlerts";
import TopSellingProducts from "@/components/Dashboard/StoreAnalysis/TopSellingProducts";
import Welcome from "@/components/Dashboard/StoreAnalysis/Welcome";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="xl:col-span-3">
          <Welcome />

          <Stats />
        </div>

        <div className="lg:col-span-1">
          <CustomerVisits />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <TopSellingProducts />
        </div>

        <div className="lg:col-span-2">
          <GrossRevenue />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="xl:col-span-3">
          <RecentSales />
        </div>

        <div className="xl:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-[25px]">
            <SalesByGender />

            <SalesThisMonth />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <SalesByCategory />
        </div>

        <div className="lg:col-span-2">
          <StockAlerts />
        </div>
      </div>
    </>
  );
}
