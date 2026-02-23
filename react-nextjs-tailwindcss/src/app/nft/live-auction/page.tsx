import DownloadMobileApp from "@/components/NFT/LiveAuction/DownloadMobileApp";
import HistoryOfBids from "@/components/NFT/LiveAuction/HistoryOfBids";
import LiveAuctionContent from "@/components/NFT/LiveAuction/LiveAuctionContent";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
        <div className="lg:col-span-3">
          <LiveAuctionContent />
        </div>

        <div className="lg:col-span-1">
          <DownloadMobileApp />

          <HistoryOfBids />
        </div>
      </div>
    </>
  );
}
