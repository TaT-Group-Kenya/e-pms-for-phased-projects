import AnalyticsOverview from "@/components/Dashboard/Analytics/AnalyticsOverview";
import AnalyticsStats from "@/components/Dashboard/Analytics";
import BrowserUsedByUsers from "@/components/Dashboard/Analytics/BrowserUsedByUsers";
import Clicks from "@/components/Dashboard/Analytics/Clicks";
import DeviceSessions from "@/components/Dashboard/Analytics/DeviceSessions";
import Impressions from "@/components/Dashboard/Analytics/Impressions";
import RealtimeActiveUsers from "@/components/Dashboard/Analytics/RealtimeActiveUsers";
import Sessions from "@/components/Dashboard/Analytics/Sessions";
import SessionsByChannel from "@/components/Dashboard/Analytics/SessionsByChannel";
import ClicksImpressionsByKeywords from "@/components/Dashboard/Analytics/ClicksImpressionsByKeywords";
import TopBrowsingPagesToday from "@/components/Dashboard/Analytics/TopBrowsingPagesToday";
import UsersByCountry from "@/components/Dashboard/Analytics/UsersByCountry";

export default function Page() {
  return (
    <>
      <div className="xl:grid xl:grid-cols-3 gap-[25px]">
        <div className="xl:col-span-2">
          <AnalyticsOverview />

          <AnalyticsStats />
        </div>

        <div className="xl:col-span-1">
          <RealtimeActiveUsers />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <BrowserUsedByUsers />
        </div>

        <div className="lg:col-span-2">
          <DeviceSessions />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div>
          <Clicks />
        </div>

        <div>
          <Impressions />
        </div>

        <div>
          <Sessions />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">
          <SessionsByChannel />
        </div>

        <div className="lg:col-span-3">
          <ClicksImpressionsByKeywords />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <TopBrowsingPagesToday />
        </div>

        <div className="lg:col-span-1">
          <UsersByCountry />
        </div>
      </div>
    </>
  );
}
