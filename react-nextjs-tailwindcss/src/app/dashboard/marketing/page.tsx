import AdSpend from "@/components/Dashboard/Marketing/AdSpend";
import CostPerThousand from "@/components/Dashboard/Marketing/CostPerThousand";
import CostPerClick from "@/components/Dashboard/Marketing/CostPerClick";
import ClickThroughRate from "@/components/Dashboard/Marketing/ClickThroughRate";
import PerformanceOverview from "@/components/Dashboard/Marketing/PerformanceOverview";
import DownloadMobileApp from "@/components/Dashboard/Marketing/DownloadMobileApp";
import Highlights from "@/components/Dashboard/Marketing/Highlights";
import Channels from "@/components/Dashboard/Marketing/Channels";
import ExternalLinks from "@/components/Dashboard/Marketing/ExternalLinks";
import InstagramCampaigns from "@/components/Dashboard/Marketing/InstagramCampaigns";
import Cta from "@/components/Dashboard/Marketing/Cta";
import InstagramSubscriber from "@/components/Dashboard/Marketing/InstagramSubscriber";
import Campaigns from "@/components/Dashboard/Marketing/Campaigns";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[25px] mb-[25px]">
        <AdSpend />

        <CostPerThousand />

        <CostPerClick />

        <ClickThroughRate />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <PerformanceOverview />
        </div>

        <div className="lg:col-span-1">
          <DownloadMobileApp />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <Highlights />

          <Channels />
        </div>

        <div className="lg:col-span-2">
          <Campaigns />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
            <ExternalLinks />

            <InstagramCampaigns />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <Cta />
        </div>

        <div className="lg:col-span-3">
          <InstagramSubscriber />
        </div>
      </div>
    </>
  );
}
