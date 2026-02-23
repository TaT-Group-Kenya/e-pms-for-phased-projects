import Appointments from "@/components/Dashboard/Doctor/Appointments";
import Earnings from "@/components/Dashboard/Doctor/Earnings";
import IncomeVSExpense from "@/components/Dashboard/Doctor/IncomeVSExpense";
import MyRecentPatients from "@/components/Dashboard/Doctor/MyRecentPatients";
import Operations from "@/components/Dashboard/Doctor/Operations";
import PatientDistribution from "@/components/Dashboard/Doctor/PatientDistribution";
import PatientRetention from "@/components/Dashboard/Doctor/PatientRetention";
import Patients from "@/components/Dashboard/Doctor/Patients";
import RecentLabReports from "@/components/Dashboard/Doctor/RecentLabReports";
import TodaysSchedule from "@/components/Dashboard/Doctor/TodaysSchedule";
import UpgradePlan from "@/components/Dashboard/Doctor/UpgradePlan";
import Welcome from "@/components/Dashboard/Doctor/Welcome";

export default function Page() {
  return (
    <>
      <Welcome />

      <div className="lg:px-[30px] 2xl:px-[80px] mt-[25px] lg:-mt-[25px] relative z-[1]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-[25px]">
          <Appointments />

          <Patients />

          <Operations />

          <Earnings />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mb-[25px]">
              <PatientRetention />

              <PatientDistribution />
            </div>

            <UpgradePlan />

            <IncomeVSExpense />
          </div>

          <div className="lg:col-span-1">
            <TodaysSchedule />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[25px] mb-[25px]">
          <div className="lg:col-span-3">
            <MyRecentPatients />
          </div>

          <div className="lg:col-span-1">
            <RecentLabReports />
          </div>
        </div>
      </div>
    </>
  );
}
