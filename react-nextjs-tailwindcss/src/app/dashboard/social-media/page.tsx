import FacebookCampaignOverview from "@/components/Dashboard/SocialMedia/FacebookCampaignOverview";
import FacebookFollowers from "@/components/Dashboard/SocialMedia/FacebookFollowers";
import FollowersByGender from "@/components/Dashboard/SocialMedia/FollowersByGender";
import InstagramFollowers from "@/components/Dashboard/SocialMedia/InstagramFollowers";
import LinkedInFollowers from "@/components/Dashboard/SocialMedia/LinkedInFollowers";
import LinkedInNetFollowers from "@/components/Dashboard/SocialMedia/LinkedInNetFollowers";
import RecentInstagramFollowers from "@/components/Dashboard/SocialMedia/RecentInstagramFollowers";
import Suggestions from "@/components/Dashboard/SocialMedia/Suggestions";
import TikTokFollowers from "@/components/Dashboard/SocialMedia/TikTokFollowers";
import TwitterFollowers from "@/components/Dashboard/SocialMedia/TwitterFollowers";
import UpgradeYourPlan from "@/components/Dashboard/SocialMedia/UpgradeYourPlan";
import YoutubeSubscribers from "@/components/Dashboard/SocialMedia/YoutubeSubscribers";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[25px] mb-[25px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[25px]">
          <InstagramFollowers />

          <LinkedInFollowers />

          <TikTokFollowers />

          <FacebookFollowers />

          <TwitterFollowers />

          <YoutubeSubscribers />
        </div>

        <LinkedInNetFollowers />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <Suggestions />

        <FollowersByGender />

        <RecentInstagramFollowers />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <FacebookCampaignOverview />
        </div>

        <div className="lg:col-span-1">
          <UpgradeYourPlan />
        </div>
      </div>
    </>
  );
}
