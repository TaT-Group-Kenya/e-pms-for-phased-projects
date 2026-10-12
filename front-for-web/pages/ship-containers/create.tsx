import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../store/hooks'
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout'
import ShipContainerForm from '../../components/shipContainers/ShipContainerForm'
import Can from '../../components/auth/Can'
import type { ShipContainerType } from '../../constants/shipContainers'
import { SHIP_CONTAINER_TYPES } from '../../constants/shipContainers'

const CreateShipContainerPage: NextPage = () => {
  const router = useRouter()
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const [authReady, setAuthReady] = useState(false)

  const typeParam = typeof router.query.type === 'string' ? (router.query.type as ShipContainerType) : null
  const defaultType = typeParam && SHIP_CONTAINER_TYPES.includes(typeParam) ? typeParam : null

  useEffect(() => {
    if (!accessToken) {
      void router.replace('/sign-in')
    } else {
      setAuthReady(true)
    }
  }, [accessToken, router])

  return (
    <AuthenticatedLayout>
      <Can any={['ROLE_ADD_SHIP_CONTAINER']} fallback={<div>You do not have permission to register ship containers.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <div className="mb-[8px] md:mb-0">
            <h1 className="mb-0 text-[20px] font-semibold text-black dark:text-white">Register Shipment</h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
              Capture the container or unit details. Quotations can reference these listings later.
            </p>
          </div>
        </div>

        {authReady && <ShipContainerForm defaultType={defaultType} />}
      </Can>
    </AuthenticatedLayout>
  )
}

export default CreateShipContainerPage