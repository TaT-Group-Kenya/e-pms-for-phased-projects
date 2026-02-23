import Congratulations from "@/components/Dashboard/HelpDesk/Congratulations";
import CustomerSatisfaction from "@/components/Dashboard/HelpDesk/CustomerSatisfaction";
import NewTicketsVSSolvedTickets from "@/components/Dashboard/HelpDesk/NewTicketsVSSolvedTickets";
import PerformanceOfAgents from "@/components/Dashboard/HelpDesk/PerformanceOfAgents";
import RecentCustomerRatings from "@/components/Dashboard/HelpDesk/RecentCustomerRatings";
import ResponseTime from "@/components/Dashboard/HelpDesk/ResponseTime";
import TasksOverview from "@/components/Dashboard/HelpDesk/TasksOverview";
import TicketsDue from "@/components/Dashboard/HelpDesk/TicketsDue";
import TicketsInProgress from "@/components/Dashboard/HelpDesk/TicketsInProgress";
import TicketsNewOpen from "@/components/Dashboard/HelpDesk/TicketsNewOpen";
import TicketsResolved from "@/components/Dashboard/HelpDesk/TicketsResolved";
import TicketsStatus from "@/components/Dashboard/HelpDesk/TicketsStatus";
import ToDoList from "@/components/Dashboard/HelpDesk/ToDoList";

export default function Page() {
  return (
    <>
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <Congratulations />

          <div className="sm:grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-[25px]">
            <div>
              <TicketsResolved />
            </div>

            <div>
              <TicketsInProgress />
            </div>

            <div>
              <TicketsDue />
            </div>

            <div>
              <TicketsNewOpen />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <TicketsStatus />

          <div className="lg:grid xl:grid-cols-2 gap-x-[25px]">
            <div>
              <CustomerSatisfaction />
            </div>
            <div>
              <ResponseTime />
            </div>
          </div>
        </div>
      </div>

      <PerformanceOfAgents />

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <NewTicketsVSSolvedTickets />
        </div>

        <div className="lg:col-span-2">
          <RecentCustomerRatings />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <ToDoList />
        </div>

        <div className="lg:col-span-1">
          <TasksOverview />
        </div>
      </div>
    </>
  );
}
