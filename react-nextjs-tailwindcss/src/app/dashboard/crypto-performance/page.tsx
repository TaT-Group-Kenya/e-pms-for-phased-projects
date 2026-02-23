import Breadcrumb from "@/components/Dashboard/CryptoPerformance/Breadcrumb";
import ComparativeAnalysis from "@/components/Dashboard/CryptoPerformance/ComparativeAnalysis";
import CryptoMarketCap from "@/components/Dashboard/CryptoPerformance/CryptoMarketCap";
import IndividualAssetPerformance from "@/components/Dashboard/CryptoPerformance/IndividualAssetPerformance";
import MarketPerformance from "@/components/Dashboard/CryptoPerformance/MarketPerformance";
import PerformanceMetrics from "@/components/Dashboard/CryptoPerformance/PerformanceMetrics";
import PerformancePerInvestment from "@/components/Dashboard/CryptoPerformance/PerformancePerInvestment";
import PortfolioValue from "@/components/Dashboard/CryptoPerformance/PortfolioValue";
import RiskStabilityIndicators from "@/components/Dashboard/CryptoPerformance/RiskStabilityIndicators";
import TransactionsHistory from "@/components/Dashboard/CryptoPerformance/TransactionsHistory";

export default function Page() {
  return (
    <>
      <Breadcrumb />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <PerformancePerInvestment />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
          <div>
            <PortfolioValue />
          </div>

          <div>
            <CryptoMarketCap />
          </div>

          <div className="sm:col-span-2">
            <TransactionsHistory />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <MarketPerformance />
        </div>

        <div className="lg:col-span-3">
          <PerformanceMetrics />
        </div>
      </div>

      <IndividualAssetPerformance />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="xl:col-span-1">
          <RiskStabilityIndicators />
        </div>

        <div className="xl:col-span-2">
          <ComparativeAnalysis />
        </div>
      </div>
    </>
  );
}
