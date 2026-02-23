import Featured from "@/components/Dashboard/Podcast/Featured";
import ListenerAnalytics from "@/components/Dashboard/Podcast/ListenerAnalytics";
import MostPopular from "@/components/Dashboard/Podcast/MostPopular";
import Player from "@/components/Dashboard/Podcast/Player";
import PopularHosts from "@/components/Dashboard/Podcast/PopularHosts";
import RecentlyPlayed from "@/components/Dashboard/Podcast/RecentlyPlayed";
import TodaysEarnings from "@/components/Dashboard/Podcast/TodaysEarnings";
import TopPodcasters from "@/components/Dashboard/Podcast/TopPodcasters";
import UpcomingEpisodes from "@/components/Dashboard/Podcast/UpcomingEpisodes";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <Featured />
        </div>

        <div className="lg:col-span-1">
          <PopularHosts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <RecentlyPlayed />
        </div>

        <div className="lg:col-span-1">
          <Player />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <MostPopular />
        </div>

        <div className="lg:col-span-1">
          <UpcomingEpisodes />

          <TodaysEarnings />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <ListenerAnalytics />

        <TopPodcasters />
      </div>
    </>
  );
}
