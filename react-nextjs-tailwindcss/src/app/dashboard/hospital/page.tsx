import BedOccupancyRate from "@/components/Dashboard/Hospital/BedOccupancyRate";
import CriticalPatients from "@/components/Dashboard/Hospital/CriticalPatients";
import EmergencyRoomVisits from "@/components/Dashboard/Hospital/EmergencyRoomVisits";
import HospitalEarnings from "@/components/Dashboard/Hospital/HospitalEarnings";
import OverallVisitors from "@/components/Dashboard/Hospital/OverallVisitors";
import PatientAdmissionsDischarges from "@/components/Dashboard/Hospital/PatientAdmissionsDischarges";
import PatientAppointments from "@/components/Dashboard/Hospital/PatientAppointments";
import PatientByAge from "@/components/Dashboard/Hospital/PatientByAge";
import PatientsLast7Days from "@/components/Dashboard/Hospital/PatientsLast7Days";
import ScheduleAppointment from "@/components/Dashboard/Hospital/ScheduleAppointment";
import Welcome from "@/components/Dashboard/Hospital/Welcome";

export default function Page() {
  return (
    <>
      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">
          <Welcome />

          <div className="sm:grid sm:grid-cols-2 gap-[25px]">
            <div>
              <OverallVisitors />
            </div>
            <div>
              <PatientsLast7Days />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <PatientAdmissionsDischarges />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-2">
          <EmergencyRoomVisits />
        </div>

        <div className="lg:col-span-3">
          <div className="lg:grid lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-1">
              <CriticalPatients />
            </div>

            <div className="lg:col-span-2">
              <BedOccupancyRate />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <PatientAppointments />
        </div>

        <div className="lg:col-span-1">
          <ScheduleAppointment />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-1">
          <PatientByAge />
        </div>

        <div className="lg:col-span-2">
          <HospitalEarnings />
        </div>
      </div>
    </>
  );
}
