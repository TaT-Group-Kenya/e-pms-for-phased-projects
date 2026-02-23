import CryptocurrencyWatchlist from "@/components/Dashboard/Crypto/CryptocurrencyWatchlist";
import CryptoRankings from "@/components/Dashboard/Crypto/CryptoRankings";
import Exchange from "@/components/Dashboard/Crypto/Exchange";
import MarketPriceStatistics from "@/components/Dashboard/Crypto/MarketPriceStatistics";
import Portfolio from "@/components/Dashboard/Crypto/Portfolio";
import TransactionHistory from "@/components/Dashboard/Crypto/TransactionHistory";

export default function Page() {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] !pb-0 rounded-md">
        <div className="trezo-card-content">
          <CryptocurrencyWatchlist />

          <div className="lg:grid lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-2">
              <MarketPriceStatistics />
            </div>

            <div className="lg:col-span-1">
              <Exchange />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <TransactionHistory />
        </div>

        <div className="lg:col-span-2">
          <Portfolio />
        </div>
      </div>

      <CryptoRankings />
    </>
  );
}
