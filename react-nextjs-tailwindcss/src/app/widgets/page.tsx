import RevenueGrowth from "@/components/Widgets/RevenueGrowth";
import LeadConversion from "@/components/Widgets/LeadConversion";
import TotalOrders from "@/components/Widgets/TotalOrders";
import AnnualProfit from "@/components/Widgets/AnnualProfit";
import Link from "next/link";
import TicketsResolved from "@/components/Widgets/TicketsResolved";
import TicketsInProgress from "@/components/Widgets/TicketsInProgress";
import TicketsDue from "@/components/Widgets/TicketsDue";
import TicketsNewOpen from "@/components/Widgets/TicketsNewOpen";
import Welcome from "@/components/Widgets/Welcome";
import TotalCourses from "@/components/Widgets/TotalCourses";
import TotalEnrolled from "@/components/Widgets/TotalEnrolled";
import TotalMentors from "@/components/Widgets/TotalMentors";
import TotalOrders2 from "@/components/Widgets/TotalOrders2";
import TotalCustomers from "@/components/Widgets/TotalCustomers";
import TotalRevenue from "@/components/Widgets/TotalRevenue";
import ProjectsOverview from "@/components/Widgets/ProjectsOverview";
import ProjectsRoadmap from "@/components/Widgets/ProjectsRoadmap";
import CoursesSales from "@/components/Widgets/CoursesSales";
import TimeSpent from "@/components/Widgets/TimeSpent";
import OurTopCourses from "@/components/Widgets/OurTopCourses";
import ProjectsAnalysis from "@/components/Widgets/ProjectsAnalysis";
import TeamMembers from "@/components/Widgets/TeamMembers";
import WorkingSchedule from "@/components/Widgets/WorkingSchedule";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Widgets</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Widgets
          </li>
        </ol>
      </div>

      <div className="sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:gap-x-[25px] xl:gap-[25px]">
        <div>
          <RevenueGrowth />
        </div>

        <div>
          <LeadConversion />
        </div>

        <div>
          <TotalOrders />
        </div>

        <div>
          <AnnualProfit />
        </div>
      </div>

      <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-[25px] lg:gap-[25px]">
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

      <div className="2xl:grid 2xl:grid-cols-2 gap-[25px]">
        <div>
          <Welcome />
        </div>

        <div className="sm:grid sm:grid-cols-3 gap-[25px]">
          <div>
            <TotalCourses />
          </div> 

          <div>
            <TotalEnrolled />
          </div> 

          <div>
            <TotalMentors />
          </div> 
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 gap-[25px]">
        <div>
          <TotalOrders2 />
        </div>
        <div>
          <TotalCustomers />
        </div>
        <div>
          <TotalRevenue />
        </div>
      </div>

      <div className="2xl:grid 2xl:grid-cols-2 gap-[25px]">
        <div>
          <ProjectsOverview />
        </div>
        <div>
          <ProjectsRoadmap />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div>
          <CoursesSales />
        </div>

        <div>
          <TimeSpent />
        </div>

        <div>
          <OurTopCourses />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div>
          <ProjectsAnalysis />
        </div>

        <div>
          <TeamMembers />
        </div>

        <div>
          <WorkingSchedule />
        </div>
      </div>
    </>
  );
}
