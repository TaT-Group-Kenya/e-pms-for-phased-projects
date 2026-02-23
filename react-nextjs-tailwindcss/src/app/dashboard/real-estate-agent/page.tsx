import ClientRatings from "@/components/Dashboard/RealEstateAgent/ClientRatings";
import DownloadApp from "@/components/Dashboard/RealEstateAgent/DownloadApp";
import LatestTransactions from "@/components/Dashboard/RealEstateAgent/LatestTransactions";
import MyFeaturedListings from "@/components/Dashboard/RealEstateAgent/MyFeaturedListings";
import PropertiesByCountry from "@/components/Dashboard/RealEstateAgent/PropertiesByCountry";
import RecentClients from "@/components/Dashboard/RealEstateAgent/RecentClients";
import RevenueGoalProgress from "@/components/Dashboard/RealEstateAgent/RevenueGoalProgress";
import Stats from "@/components/Dashboard/RealEstateAgent/Stats";
import TopChannels from "@/components/Dashboard/RealEstateAgent/TopChannels";
import TotalRevenue from "@/components/Dashboard/RealEstateAgent/TotalRevenue";
import Welcome from "@/components/Dashboard/RealEstateAgent/Welcome";

export default function Page() {
  return (
    <>
      <Welcome />

      <div className="mt-[25px] xl:-mt-[67px]">
        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
          <div className="lg:col-span-2">
            <TotalRevenue />
          </div>

          <div className="lg:col-span-1">
            <TopChannels />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
          <div className="lg:col-span-1">
            <RecentClients />
          </div>

          <div className="lg:col-span-2">
            <MyFeaturedListings />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
          <div className="lg:col-span-2">
            <RevenueGoalProgress />
          </div>

          <div className="lg:col-span-1">
            <PropertiesByCountry />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
          <div className="lg:col-span-1">
            <DownloadApp />
          </div>

          <div className="lg:col-span-3">
            <LatestTransactions />
          </div>
        </div>

        <ClientRatings />
      </div>
    </>
  );
}
