import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../common/Toast"
import Can from "../../auth/Can"

type ShipContainerNumber = {
  id: number
  container_no: string
  size?: number | null
  size_unit?: string | null
  goods_description?: string | null
  entry_number?: string | null
}

type LinkedShipContainer = {
  id: number
  reference_number?: string | null
  bl_no?: string | null
  bol_no?: string | null
  container_number_details?: ShipContainerNumber[]
}

interface ProjectShipContainerNumbersCardProps {
  containers: LinkedShipContainer[]
}

const ProjectShipContainerNumbersCard: React.FC<ProjectShipContainerNumbersCardProps> = ({ containers }) => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()
  const allNumbers = containers.flatMap((container) =>
    (container.container_number_details ?? []).map((number) => ({
      ...number,
      shipContainer: container,
    }))
  )
  const [entryNumbers, setEntryNumbers] = useState<Record<number, string>>({})
  const [savedEntryNumbers, setSavedEntryNumbers] = useState<Record<number, string>>({})
  const [savingNumberId, setSavingNumberId] = useState<number | null>(null)

  useEffect(() => {
    const values = Object.fromEntries(
      containers.flatMap((container) =>
        (container.container_number_details ?? []).map((number) => [number.id, number.entry_number ?? ""])
      )
    )
    setEntryNumbers(values)
    setSavedEntryNumbers(values)
  }, [containers])

  const saveEntryNumber = async (numberId: number) => {
    if (!accessToken) {
      addToast("Please sign in before updating an entry number.", "error")
      return
    }

    setSavingNumberId(numberId)
    try {
      const response = await fetch(`/api/ship-container-numbers/${numberId}/entry-number`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ entry_number: (entryNumbers[numberId] ?? "").trim() || null }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update the entry number.")
      }

      const savedValue = data?.data?.entry_number ?? ""
      setEntryNumbers((current) => ({ ...current, [numberId]: savedValue }))
      setSavedEntryNumbers((current) => ({ ...current, [numberId]: savedValue }))
      addToast("Entry number updated.", "success")
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Failed to update the entry number.", "error")
    } finally {
      setSavingNumberId(null)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <section className="trezo-card mt-[20px] overflow-hidden rounded-md bg-white dark:bg-[#0c1427]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-[20px] dark:border-[#172036] md:px-[25px]">
          <div>
            <h5 className="font-semibold text-black dark:text-white">Shipment Container Details</h5>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
              Containers linked to this consignment by its BL/BOL number.
            </p>
          </div>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-[12px] font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
            {allNumbers.length} {allNumbers.length === 1 ? "container" : "containers"}
          </span>
        </div>

        {allNumbers.length ? (
          <div className="overflow-x-auto p-[15px] md:p-[20px]">
            <table className="w-full min-w-[850px] text-left text-[13px]">
              <thead className="bg-gray-50 text-gray-500 dark:bg-[#15203c] dark:text-gray-400">
                <tr>
                  <th className="p-3 font-medium">Shipment / BOL</th>
                  <th className="p-3 font-medium">Container Number</th>
                  <th className="p-3 font-medium">Size</th>
                  <th className="p-3 font-medium">Goods Description</th>
                  <th className="p-3 font-medium">Entry Number</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#172036]">
                {allNumbers.map((number) => {
                  const entryNumber = entryNumbers[number.id] ?? ""
                  const unchanged = entryNumber === (savedEntryNumbers[number.id] ?? "")

                  return (
                    <tr key={number.id} className="text-black dark:text-white">
                      <td className="p-3 align-top">
                        <span className="block font-medium">{number.shipContainer.reference_number || "—"}</span>
                        <span className="mt-1 block text-[11px] text-gray-500 dark:text-gray-400">
                          {number.shipContainer.bl_no || number.shipContainer.bol_no || "—"}
                        </span>
                      </td>
                      <td className="p-3 align-top font-medium">{number.container_no}</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        {number.size != null ? `${number.size} ${number.size_unit || "feet"}` : "—"}
                      </td>
                      <td className="p-3 align-top">{number.goods_description || "—"}</td>
                      <td className="p-3 align-top">
                        <Can any={["ROLE_EDIT_SHIP_CONTAINER"]} fallback={<span>{number.entry_number || "—"}</span>}>
                          <input
                            type="text"
                            value={entryNumber}
                            onChange={(event) =>
                              setEntryNumbers((current) => ({ ...current, [number.id]: event.target.value }))
                            }
                            aria-label={`Entry number for ${number.container_no}`}
                            className="h-[38px] min-w-[180px] rounded-md border border-gray-100 bg-gray-50 px-3 text-black outline-none focus:border-primary-500 dark:border-[#172036] dark:bg-[#15203c] dark:text-white"
                          />
                        </Can>
                      </td>
                      <td className="p-3 align-top">
                        <Can any={["ROLE_EDIT_SHIP_CONTAINER"]}>
                          <button
                            type="button"
                            onClick={() => void saveEntryNumber(number.id)}
                            disabled={unchanged || savingNumberId === number.id}
                            className="rounded-md bg-primary-500 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {savingNumberId === number.id ? "Saving…" : "Save"}
                          </button>
                        </Can>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-[25px] text-[13px] text-gray-500 dark:text-gray-400">
            No ship containers are linked to this consignment yet.
          </div>
        )}
      </section>
    </>
  )
}

export default ProjectShipContainerNumbersCard
