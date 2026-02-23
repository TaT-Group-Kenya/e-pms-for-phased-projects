import AgentAvgEarnings from "@/components/Dashboard/CallCenter/AgentAvgEarnings";
import AgentsPerformanceOverview from "@/components/Dashboard/CallCenter/AgentsPerformanceOverview";
import CallCenterGeography from "@/components/Dashboard/CallCenter/CallCenterGeography";
import InboundCalls from "@/components/Dashboard/CallCenter/InboundCalls";
import OutboundCalls from "@/components/Dashboard/CallCenter/OutboundCalls";
import Overview from "@/components/Dashboard/CallCenter/Overview";
import RecentCalls from "@/components/Dashboard/CallCenter/RecentCalls";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <Overview />
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[25px]">
            <InboundCalls />

            <OutboundCalls />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <AgentsPerformanceOverview />

        <CallCenterGeography />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <AgentAvgEarnings />
        </div>

        <div className="lg:col-span-2">
          <RecentCalls />
        </div>
      </div>
    </>
  );
}
