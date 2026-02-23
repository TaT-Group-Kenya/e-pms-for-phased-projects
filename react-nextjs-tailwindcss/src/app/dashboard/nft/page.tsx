import DownloadMobileApp from "@/components/Dashboard/NFT/DownloadMobileApp";
import ActiveAuctions from "@/components/Dashboard/NFT/ActiveAuctions";
import AllNft from "@/components/Dashboard/NFT/AllNft";
import EthereumRate from "@/components/Dashboard/NFT/EthereumRate";
import FeaturedNFTArtworks from "@/components/Dashboard/NFT/FeaturedNFTArtworks";
import MostPopularSellers from "@/components/Dashboard/NFT/MostPopularSellers";
import WorldwideTopCreators from "@/components/Dashboard/NFT/WorldwideTopCreators";
import TopCollections from "@/components/Dashboard/NFT/TopCollections";
import TopNFTs from "@/components/Dashboard/NFT/TopNFTs";
import HistoryOfBids from "@/components/Dashboard/NFT/HistoryOfBids";

export default function Page() {
  return (
    <>
      <AllNft />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <EthereumRate />
        </div>

        <div className="lg:col-span-2">
          <ActiveAuctions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="lg:col-span-3">
          <FeaturedNFTArtworks />
        </div>

        <div className="lg:col-span-1">
          <DownloadMobileApp />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <MostPopularSellers />
        </div>

        <div className="lg:col-span-1">
          <WorldwideTopCreators />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="2xl:col-span-1 md:order-1 2xl:order-1">
          <TopCollections />
        </div>

        <div className="md:col-span-2 2xl:col-span-2 md:order-3 2xl:order-2">
          <TopNFTs />
        </div>

        <div className="2xl:col-span-1 md:order-2 2xl:order-2">
          <HistoryOfBids />
        </div>
      </div>
    </>
  );
}
