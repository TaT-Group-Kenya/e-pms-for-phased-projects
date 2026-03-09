import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../store/hooks'
import type { RoleName } from '../../store/auth/roles'
import Can from '../../components/auth/Can'
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout'
import ProjectsOverview from '../../components/dashboard/ProjectsOverview'
import ProjectsRoadmap from '../../components/dashboard/ProjectsRoadmap'
import ProjectsProgress from '../../components/dashboard/ProjectsProgress'
import MyTasks from '../../components/dashboard/MyTasks'
import AllProjects from '../../components/dashboard/AllProjects'
import ProjectsAnalysis from '../../components/dashboard/ProjectsAnalysis'
import TeamMembers from '../../components/dashboard/TeamMembers'
import ToDoList from '../../components/dashboard/ToDoList'
import TasksOverview from '../../components/dashboard/TasksOverview'
import { DashboardFiltersProvider, useDashboardFilters, DASHBOARD_RANGE_OPTIONS } from '../../components/dashboard/DashboardFiltersContext'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const ROLE_VIEW_PROJECT: RoleName = 'ROLE_VIEW_PROJECT'
const ROLE_VIEW_PROJECT_PROGRESS_UPDATE: RoleName = 'ROLE_VIEW_PROJECT_PROGRESS_UPDATE'
const ROLE_VIEW_COMPANY_PAYMENT: RoleName = 'ROLE_VIEW_COMPANY_PAYMENT'
const ROLE_VIEW_CUST_INVOICE: RoleName = 'ROLE_VIEW_CUST_INVOICE'
const ROLE_VIEW_CUSTOMER: RoleName = 'ROLE_VIEW_CUSTOMER'
const ROLE_VIEW_ORDER: RoleName = 'ROLE_VIEW_ORDER'
const ROLE_VIEW_QUOTATION: RoleName = 'ROLE_VIEW_QUOTATION'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const accessToken = useAppSelector((s) => s.auth.accessToken)

  useEffect(() => {
    if (!accessToken) {
      void router.replace('/sign-in')
    }
  }, [accessToken, router])

  const FiltersControl: React.FC = () => {
    const { selectedOption, setRange } = useDashboardFilters()

    return (
      <Menu as="div" className="trezo-card-dropdown relative">
        <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
          <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
            {selectedOption.label}
            <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
          </span>
        </MenuButton>

        <MenuItems
          transition
          className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
       >
          {DASHBOARD_RANGE_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              as="div"
              className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                selectedOption.value === option.value ? 'font-semibold' : ''
              }`}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    )
  }

  return (
    <AuthenticatedLayout>
      <DashboardFiltersProvider>
        <div className="mb-[20px] flex justify-end">
          <FiltersControl />
        </div>
        <div className="lg:grid lg:grid-cols-1 gap-[25px]">
          <Can any={[ROLE_VIEW_PROJECT]}>
            <div>
              <ProjectsOverview />
            </div>
          </Can>

          <Can any={[ROLE_VIEW_PROJECT]}>
            <div>
              <ProjectsRoadmap />
            </div>
          </Can>
        </div>

        <div className="lg:grid lg:grid-cols-2 gap-[25px]">
          <Can any={[ROLE_VIEW_PROJECT]}>
            <div>
              <ProjectsProgress />
            </div>
          </Can>

          <Can any={[ROLE_VIEW_PROJECT_PROGRESS_UPDATE]}>
            <div>
              <MyTasks />
            </div>
          </Can>
        </div>
        <Can any={[ROLE_VIEW_PROJECT]}>
          <AllProjects />
        </Can>

        <div className="lg:grid lg:grid-cols-2 gap-[25px]">
          <Can any={[ROLE_VIEW_PROJECT, ROLE_VIEW_COMPANY_PAYMENT, ROLE_VIEW_CUST_INVOICE]}>
            <div>
              <ProjectsAnalysis />
            </div>
          </Can>

          <Can any={[ROLE_VIEW_CUSTOMER, ROLE_VIEW_CUST_INVOICE]}>
            <div>
              <TeamMembers />
            </div>
          </Can>
        </div>
        <div className="lg:grid lg:grid-cols-2 gap-[25px]">
          <Can any={[ROLE_VIEW_ORDER]}>
            <div>
              <ToDoList />
            </div>
          </Can>

          <Can any={[ROLE_VIEW_QUOTATION]}>
            <div>
              <TasksOverview />
            </div>
          </Can>
        </div>
      </DashboardFiltersProvider>
    </AuthenticatedLayout>
  )
}

export default Dashboard
