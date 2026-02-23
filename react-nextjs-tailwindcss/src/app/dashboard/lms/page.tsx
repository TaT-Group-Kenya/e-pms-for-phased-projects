import Courses from "@/components/Dashboard/LMS/Courses";
import CoursesSales from "@/components/Dashboard/LMS/CoursesSales";
import EnrolledByCountries from "@/components/Dashboard/LMS/EnrolledByCountries";
import GroupLessons from "@/components/Dashboard/LMS/GroupLessons";
import OurTopCourses from "@/components/Dashboard/LMS/OurTopCourses";
import StudentsInterestedTopics from "@/components/Dashboard/LMS/StudentsInterestedTopics";
import StudentsProgress from "@/components/Dashboard/LMS/StudentsProgress";
import TimeSpent from "@/components/Dashboard/LMS/TimeSpent";
import TopInstructors from "@/components/Dashboard/LMS/TopInstructors";
import TotalCourses from "@/components/Dashboard/LMS/TotalCourses";
import TotalEnrolled from "@/components/Dashboard/LMS/TotalEnrolled";
import TotalMentors from "@/components/Dashboard/LMS/TotalMentors";
import Welcome from "@/components/Dashboard/LMS/Welcome";

export default function Page() {
  return (
    <>
      <div className="2xl:grid 2xl:grid-cols-2 gap-[25px]">
        <div>
          <Welcome />
        </div>

        <div>
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
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <StudentsInterestedTopics />
        </div>

        <div className="lg:col-span-2">
          <TopInstructors />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div>
          <StudentsProgress />
        </div>

        <div>
          <GroupLessons />
        </div>

        <div>
          <EnrolledByCountries />
        </div>
      </div>

      <Courses />

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
    </>
  );
}
