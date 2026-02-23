import AverageOrderValue from "@/components/Dashboard/PosSystem/AverageOrderValue";
import Categories from "@/components/Dashboard/PosSystem/Categories";
import CustomerSegmentation from "@/components/Dashboard/PosSystem/CustomerSegmentation";
import OrderDetails from "@/components/Dashboard/PosSystem/OrderDetails";
import SalesAnalytics from "@/components/Dashboard/PosSystem/SalesAnalytics";
import TotalDiscount from "@/components/Dashboard/PosSystem/TotalDiscount";
import TotalSales from "@/components/Dashboard/PosSystem/TotalSales";
import TotalTransactions from "@/components/Dashboard/PosSystem/TotalTransactions";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px] lg:gap-[20px] xl:gap-[25px] mb-[25px]">
        <TotalSales />

        <TotalTransactions />

        <AverageOrderValue />

        <TotalDiscount />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <SalesAnalytics />
        </div>

        <div className="lg:col-span-1">
          <CustomerSegmentation />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <Categories />
        </div>

        <div className="lg:col-span-1">
          <OrderDetails />
        </div>
      </div>
    </>
  );
}
