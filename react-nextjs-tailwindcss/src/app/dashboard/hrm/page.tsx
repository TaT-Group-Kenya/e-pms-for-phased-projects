import EmployeeAttendanceTrends from "@/components/Dashboard/HRM/EmployeeAttendanceTrends";
import EmployeeLeaveRequest from "@/components/Dashboard/HRM/EmployeeLeaveRequest";
import EmployeeList from "@/components/Dashboard/HRM/EmployeeList";
import EmployeeSalary from "@/components/Dashboard/HRM/EmployeeSalary";
import EmployeeWorkFormat from "@/components/Dashboard/HRM/EmployeeWorkFormat";
import NewEmployees from "@/components/Dashboard/HRM/NewEmployees";
import ResignedEmployees from "@/components/Dashboard/HRM/ResignedEmployees";
import TotalEmployees from "@/components/Dashboard/HRM/TotalEmployees";
import Welcome from "@/components/Dashboard/HRM/Welcome";

export default function Page() {
  return (
    <>
      <Welcome />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <TotalEmployees />

        <ResignedEmployees />

        <NewEmployees />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <EmployeeAttendanceTrends />
        </div>

        <div className="lg:col-span-1">
          <EmployeeWorkFormat />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <EmployeeSalary />
        </div>

        <div className="lg:col-span-2">
          <EmployeeLeaveRequest />
        </div>
      </div>

      <EmployeeList />
    </>
  );
}
