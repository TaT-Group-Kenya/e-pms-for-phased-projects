import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../store/hooks'
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout'
import ProjectsOverview from '../../components/dashboard/ProjectsOverview'
import ProjectsRoadmap from '../../components/dashboard/ProjectsRoadmap'
import ProjectsProgress from '../../components/dashboard/ProjectsProgress'
import MyTasks from '../../components/dashboard/MyTasks'
import AllProjects from '../../components/dashboard/AllProjects'
import ProjectsAnalysis from '../../components/dashboard/ProjectsAnalysis'
import TeamMembers from '../../components/dashboard/TeamMembers'
import WorkingSchedule from '../../components/dashboard/WorkingSchedule'
import ToDoList from '../../components/dashboard/ToDoList'
import TasksOverview from '../../components/dashboard/TasksOverview'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const accessToken = useAppSelector((s) => s.auth.accessToken)

  useEffect(() => {
    if (!accessToken) {
      void router.replace('/sign-in')
    }
  }, [accessToken, router])

  return (
    <AuthenticatedLayout>
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
    </AuthenticatedLayout>
  )
}

export default Dashboard
