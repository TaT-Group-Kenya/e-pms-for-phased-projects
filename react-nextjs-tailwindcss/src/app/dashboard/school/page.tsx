import Stats from "@/components/Dashboard/School/Stats";
import Overview from "@/components/Dashboard/School/Overview";
import UpcomingEvents from "@/components/Dashboard/School/UpcomingEvents";
import AttendanceAnalytics from "@/components/Dashboard/School/AttendanceAnalytics";
import Teachers from "@/components/Dashboard/School/Teachers";
import StudentsOverview from "@/components/Dashboard/School/StudentsOverview";
import NewAdmissions from "@/components/Dashboard/School/NewAdmissions";
import NoticeBoard from "@/components/Dashboard/School/NoticeBoard";
import StudentsList from "@/components/Dashboard/School/StudentsList";

export default function Page() {
  return (
    <>
      <Overview />

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <Stats />
        </div>

        <div className="lg:col-span-1">
          <UpcomingEvents />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <AttendanceAnalytics />
        </div>

        <div className="lg:col-span-1">
          <Teachers />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <StudentsOverview />

        <NewAdmissions />

        <NoticeBoard />
      </div>

      <StudentsList />
    </>
  );
}
