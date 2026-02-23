import AssetAllocation from "@/components/Dashboard/CryptoTrader/AssetAllocation";
import GainersLosers from "@/components/Dashboard/CryptoTrader/GainersLosers";
import LivePriceTracker from "@/components/Dashboard/CryptoTrader/LivePriceTracker";
import MarketSentimentIndicator from "@/components/Dashboard/CryptoTrader/MarketSentimentIndicator";
import PortfolioDistribution from "@/components/Dashboard/CryptoTrader/PortfolioDistribution";
import PriceMovement from "@/components/Dashboard/CryptoTrader/PriceMovement";
import ProfitLoss from "@/components/Dashboard/CryptoTrader/ProfitLoss";
import RecentTransactions from "@/components/Dashboard/CryptoTrader/RecentTransactions";
import RiskExposure from "@/components/Dashboard/CryptoTrader/RiskExposure";
import Stats from "@/components/Dashboard/CryptoTrader/Stats";
import TradesPerMonth from "@/components/Dashboard/CryptoTrader/TradesPerMonth";
import TradingVolume from "@/components/Dashboard/CryptoTrader/TradingVolume";

export default function Page() {
  return (
    <>
      <Stats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="xl:col-span-2">
          <PriceMovement />
        </div>

        <div className="xl:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-[25px]">
            <TradingVolume />

            <PortfolioDistribution />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mb-[25px]">
            <ProfitLoss />

            <RiskExposure />
          </div>

          <RecentTransactions />
        </div>

        <div className="lg:col-span-1">
          <LivePriceTracker />

          <TradesPerMonth />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <AssetAllocation />

        <GainersLosers />

        <MarketSentimentIndicator />
      </div>
    </>
  );
}
