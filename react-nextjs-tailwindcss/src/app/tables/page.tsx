import AllProjects from "@/components/Tables/AllProjects";
import DataTable from "@/components/Tables/DataTable";
import GroupLessons from "@/components/Tables/GroupLessons";
import MyTasks from "@/components/Tables/MyTasks";
import PerformanceOfAgents from "@/components/Tables/PerformanceOfAgents";
import RecentCustomerRatings from "@/components/Tables/RecentCustomerRatings";
import RecentLeads from "@/components/Tables/RecentLeads";
import RecentOrders from "@/components/Tables/RecentOrders";
import StudentsProgress from "@/components/Tables/StudentsProgress";
import ToDoList from "@/components/Tables/ToDoList";
import TopPerformers from "@/components/Tables/TopPerformers";
import TopSellingProducts from "@/components/Tables/TopSellingProducts";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Tables</h5>

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
            Users
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Tables
          </li>
        </ol>
      </div>

      <DataTable />

      <div className="lg:grid lg:grid-cols-2 gap-[25px]">
        <div>
          <TopSellingProducts />
        </div>

        <div>
          <RecentOrders />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <TopPerformers />
        </div>

        <div className="lg:col-span-2">
          <RecentLeads />
        </div>
      </div>

      <AllProjects />

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div>
          <MyTasks />
        </div>

        <div>
          <StudentsProgress />
        </div>

        <div>
          <GroupLessons />
        </div>
      </div>

      <PerformanceOfAgents />

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">
          <RecentCustomerRatings />
        </div>

        <div className="lg:col-span-3">
          <ToDoList />
        </div>
      </div>
    </>
  );
}
