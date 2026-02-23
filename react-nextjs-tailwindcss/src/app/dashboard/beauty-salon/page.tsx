import CustomerSatisfactionRate from "@/components/Dashboard/BeautySalon/CustomerSatisfactionRate";
import CustomersFromChannels from "@/components/Dashboard/BeautySalon/CustomersFromChannels";
import FeaturedServices from "@/components/Dashboard/BeautySalon/FeaturedServices";
import NewCustomersThisMonth from "@/components/Dashboard/BeautySalon/NewCustomersThisMonth";
import RecentAppointments from "@/components/Dashboard/BeautySalon/RecentAppointments";
import RevenueByServices from "@/components/Dashboard/BeautySalon/RevenueByServices";
import TopCustomers from "@/components/Dashboard/BeautySalon/TopCustomers";
import TopSellingProducts from "@/components/Dashboard/BeautySalon/TopSellingProducts";
import TopStylistPerformance from "@/components/Dashboard/BeautySalon/TopStylistPerformance";
import Welcome from "@/components/Dashboard/BeautySalon/Welcome";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <Welcome />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
          <CustomerSatisfactionRate />

          <NewCustomersThisMonth />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <TopSellingProducts />
        </div>

        <div className="lg:col-span-1">
          <CustomersFromChannels />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <FeaturedServices />
        </div>

        <div className="lg:col-span-2">
          <RecentAppointments />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <RevenueByServices />
        </div>

        <div className="lg:col-span-1">
          <TopStylistPerformance />
        </div>
      </div>

      <TopCustomers />
    </>
  );
}
