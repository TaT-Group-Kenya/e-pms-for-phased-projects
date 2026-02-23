import AllProjects from "@/components/Dashboard/ProjectManagement/AllProjects";
import MyTasks from "@/components/Dashboard/ProjectManagement/MyTasks";
import ProjectsAnalysis from "@/components/Dashboard/ProjectManagement/ProjectsAnalysis";
import ProjectsOverview from "@/components/Dashboard/ProjectManagement/ProjectsOverview";
import ProjectsProgress from "@/components/Dashboard/ProjectManagement/ProjectsProgress";
import ProjectsRoadmap from "@/components/Dashboard/ProjectManagement/ProjectsRoadmap";
import TasksOverview from "@/components/Dashboard/ProjectManagement/TasksOverview";
import TeamMembers from "@/components/Dashboard/ProjectManagement/TeamMembers";
import ToDoList from "@/components/Dashboard/ProjectManagement/ToDoList";
import WorkingSchedule from "@/components/Dashboard/ProjectManagement/WorkingSchedule";

export default function Page() {
  return (
    <>
      <div className="2xl:grid 2xl:grid-cols-2 gap-[25px]">
        <div>
          <ProjectsOverview />
        </div>

        <div>
          <ProjectsRoadmap />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <ProjectsProgress />
        </div>

        <div className="lg:col-span-2">
          <MyTasks />
        </div>
      </div>

      <AllProjects />

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
