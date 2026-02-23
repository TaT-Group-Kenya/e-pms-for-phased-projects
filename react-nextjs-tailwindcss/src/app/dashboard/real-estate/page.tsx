import ActiveTotalProperty from "@/components/Dashboard/RealEstate/ActiveTotalProperty";
import CustomerReviews from "@/components/Dashboard/RealEstate/CustomerReviews";
import MostSalesLocation from "@/components/Dashboard/RealEstate/MostSalesLocation";
import NewCustomersThisMonth from "@/components/Dashboard/RealEstate/NewCustomersThisMonth";
import NewListingsVSSoldProperties from "@/components/Dashboard/RealEstate/NewListingsVSSoldProperties";
import PropertiesForRent from "@/components/Dashboard/RealEstate/PropertiesForRent";
import PropertiesForSale from "@/components/Dashboard/RealEstate/PropertiesForSale";
import RentalIncome from "@/components/Dashboard/RealEstate/RentalIncome";
import Revenue from "@/components/Dashboard/RealEstate/Revenue";
import SocialSearch from "@/components/Dashboard/RealEstate/SocialSearch";
import RecentProperty from "@/components/Dashboard/RealEstate/RecentProperty";
import TopProperty from "@/components/Dashboard/RealEstate/TopProperty";
import LatestTransactions from "@/components/Dashboard/RealEstate/LatestTransactions";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-[25px]">
            <ActiveTotalProperty />

            <Revenue />
          </div>
        </div>

        <div className="lg:col-span-2">
          <NewListingsVSSoldProperties />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <PropertiesForSale />

        <PropertiesForRent />

        <NewCustomersThisMonth />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <MostSalesLocation />
        </div>

        <div className="lg:col-span-2">
          <RentalIncome />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
            <SocialSearch />

            <RecentProperty />
          </div>
        </div>

        <div className="lg:col-span-2">
          <CustomerReviews />
        </div>

        <div className="lg:col-span-1">
          <TopProperty />
        </div>
      </div>

      <LatestTransactions />
    </>
  );
}
