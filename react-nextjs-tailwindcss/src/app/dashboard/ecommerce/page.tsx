import OrderSummary from "@/components/Dashboard/eCommerce/OrderSummary";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import RecentTransaction from "@/components/Dashboard/eCommerce/RecentTransaction";
import ReturningCustomerRate from "@/components/Dashboard/eCommerce/ReturningCustomerRate";
import SalesByLocations from "@/components/Dashboard/eCommerce/SalesByLocations";
import TopSellingProducts from "@/components/Dashboard/eCommerce/TopSellingProducts";
import TotalCustomers from "@/components/Dashboard/eCommerce/TotalCustomers";
import TotalOrders from "@/components/Dashboard/eCommerce/TotalOrders";
import TotalRevenue from "@/components/Dashboard/eCommerce/TotalRevenue";
import TotalSales from "@/components/Dashboard/eCommerce/TotalSales";
import Welcome from "@/components/Dashboard/eCommerce/Welcome";

export default function Page() {
  return (
    <>
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <Welcome />

          <TotalSales />
        </div>

        <div className="lg:col-span-1">
          <TotalOrders />

          <TotalCustomers />

          <TotalRevenue />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">
          <SalesByLocations />
        </div>

        <div className="lg:col-span-3">
          <TopSellingProducts />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <RecentTransaction />
        </div>

        <div className="lg:col-span-2">
          <ReturningCustomerRate />
        </div>
      </div>
    </>
  );
}
