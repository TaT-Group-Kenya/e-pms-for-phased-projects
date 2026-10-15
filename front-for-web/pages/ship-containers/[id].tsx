import React, { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '../../store/auth/selectors'
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout'
import ShipContainerDetail, { type ContainerDetail } from '../../components/shipContainers/ShipContainerDetail'
import Can from '../../components/auth/Can'
import { useToast } from '../../hooks/useToast'
import { ToastContainer } from '../../components/common/Toast'
import ShipContainerForm from '../../components/shipContainers/ShipContainerForm'

type Mode = 'view' | 'edit'

const ShipContainerDetailPage: NextPage = () => {
  const router = useRouter()
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const id = typeof router.query.id === 'string' ? router.query.id : null
  const [mode, setMode] = useState<Mode>('view')
  const [container, setContainer] = useState<ContainerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken || !id) return
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch(`/api/ship-containers/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await resp.json().catch(() => null)
      if (!resp.ok) throw new Error(json?.message || 'Failed to load container')
      setContainer(json?.data ?? null)
    } catch (err: any) {
      setError(err?.message || 'Failed to load container')
    } finally {
      setLoading(false)
    }
  }, [accessToken, id])

  useEffect(() => {
    if (!accessToken) {
      void router.replace('/sign-in')
      return
    }
    void load()
  }, [accessToken, id, load, router])

  return (
    <AuthenticatedLayout>
      <Can any={['ROLE_VIEW_SHIP_CONTAINER']} fallback={<div>You do not have permission to view ship containers.</div>}>
        <ToastContainer toasts={toasts} onClose={removeToast} />

        {loading ? (
          <div className="p-[40px] text-center text-gray-500">Loading…</div>
        ) : error ? (
          <div className="p-[25px] bg-danger-50 text-danger-500 rounded-md">{error}</div>
        ) : container && mode === 'view' ? (
          <div>
            <div className="flex justify-end mb-2">
              <Can any={['ROLE_EDIT_SHIP_CONTAINER']}>
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className="inline-flex items-center gap-1 text-[13px] text-white bg-primary-500 hover:bg-primary-600 py-[9px] px-[15px] rounded-md"
                >
                  <i className="material-symbols-outlined !text-[16px]">edit</i>
                  Edit details
                </button>
              </Can>
            </div>
            <ShipContainerDetail container={container} />
          </div>
        ) : container ? (
          <ShipContainerForm
            containerId={container.id}
            initial={{
              ...Object.fromEntries(
                (container.type_fields ?? []).map((field) => [field.attribute, field.value ?? ''])
              ),
              container_type: container.container_type,
              allocation: container.allocation ?? '',
              cfs: container.cfs ?? '',
              customer_id: container.customer_id ?? '',
              project_owner_id: container.project_owner_id ?? '',
              container_numbers: container.container_numbers ?? [],
            }}
          />
        ) : (
          <div className="p-[40px] text-center text-gray-500">Container not found.</div>
        )}
      </Can>
    </AuthenticatedLayout>
  )
}

export default ShipContainerDetailPage