import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../store/hooks'
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout'
import ShipContainerTypeTable from '../../components/shipContainers/ShipContainerTypeTable'
import TransitNotificationsPanel from '../../components/shipContainers/TransitNotificationsPanel'
import Can from '../../components/auth/Can'
import {
  SHIP_CONTAINER_TYPES,
  SHIP_CONTAINER_TYPE_CONFIGS,
  type ShipContainerType,
} from '../../constants/shipContainers'

const TABS: Array<{ id: ShipContainerType; label: string; icon: string }> = SHIP_CONTAINER_TYPES.map(
  (type) => ({
    id: type,
    label: SHIP_CONTAINER_TYPE_CONFIGS[type].label,
    icon: 'sailing',
  })
)

const ShipContainersPage: NextPage = () => {
  const router = useRouter()
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const [authReady, setAuthReady] = useState(false)
  const [activeTab, setActiveTab] = useState<ShipContainerType>(TABS[0].id)

  // Deep-link support: /ship-containers?type=container_transit opens that tab
  useEffect(() => {
    const requested = router.query.type
    if (typeof requested === 'string' && SHIP_CONTAINER_TYPES.includes(requested as ShipContainerType)) {
      setActiveTab(requested as ShipContainerType)
    }
  }, [router.query.type, router.isReady])

  useEffect(() => {
    if (!accessToken) {
      void router.replace('/sign-in')
    } else {
      setAuthReady(true)
    }
  }, [accessToken, router])

  const selectTab = (type: ShipContainerType) => {
    setActiveTab(type)
    // Keep the URL shareable without a full navigation
    void router.replace({ pathname: '/ship-containers', query: { type } }, undefined, { shallow: true })
  }

  return (
    <AuthenticatedLayout>
      <Can any={['ROLE_VIEW_SHIP_CONTAINER']} fallback={<div>You do not have permission to view ship containers.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <div className="mb-[8px] md:mb-0">
            <h1 className="mb-0 text-[20px] font-semibold text-black dark:text-white">Container List</h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
              Register and track shipment containers and loose units across imports, exports and transit.
            </p>
          </div>
        </div>

        {authReady && <TransitNotificationsPanel />}

        <div className="trezo-tabs mb-[20px] md:mb-[25px]">
          <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
            {TABS.map((tab) => (
              <li key={tab.id} className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">{tab.icon}</i>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {authReady && <ShipContainerTypeTable key={activeTab} containerType={activeTab} />}
      </Can>
    </AuthenticatedLayout>
  )
}

export default ShipContainersPage