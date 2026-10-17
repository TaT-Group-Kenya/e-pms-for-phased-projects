import Link from "next/link";
import type { FC } from "react";

export interface LinkedShipContainer {
  id?: number;
  reference_number?: string | null;
  container_type?: string | null;
  client_name?: string | null;
  container_numbers?: string[] | null;
  container_number_details?: Array<{
    id?: number;
    container_no: string;
    size?: number | null;
    size_unit?: string | null;
    goods_description?: string | null;
    entry_number?: string | null;
  }> | null;
  port_in?: string | null;
  port_out?: string | null;
  get_in?: string | null;
  eta?: string | null;
  etd?: string | null;
  bl_no?: string | null;
  bol_no?: string | null;
  status?: string | null;
}

type LinkedContainerNumber = NonNullable<LinkedShipContainer["container_number_details"]>[number]

interface LinkedShipContainerCardProps {
  container?: LinkedShipContainer | null;
  title?: string;
}

const LinkedShipContainerCard: FC<LinkedShipContainerCardProps> = ({
  container,
  title = "Linked Ship Container",
}) => {
  if (!container) return null;

  const usesBol = container.container_type === "container_transit" || container.container_type === "unit_transit";
  const documentNumber = usesBol ? container.bol_no : container.bl_no;
  const movementDate = container.get_in || container.eta || container.etd;
  const port = container.port_in || container.port_out;
  const numberDetails: LinkedContainerNumber[] =
    container.container_number_details ??
    (container.container_numbers ?? []).map((container_no) => ({ container_no }));

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px]">
      <div className="flex flex-wrap items-center justify-between gap-[10px] mb-[15px]">
        <h6 className="text-black dark:text-white font-semibold flex items-center gap-2">
          <i className="material-symbols-outlined !text-[20px] text-primary-500">sailing</i>
          {title}
        </h6>
        {container.id && (
          <Link
            href={`/ship-containers/${container.id}`}
            className="text-[13px] text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
          >
            Open container entry
            <i className="material-symbols-outlined !text-[16px]">arrow_forward</i>
          </Link>
        )}
      </div>

      <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-2">
        <div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-[4px]">Reference</p>
          <p className="text-black dark:text-white text-sm font-medium">{container.reference_number || "—"}</p>
        </div>
        <div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-[4px]">Client / Consignee</p>
          <p className="text-black dark:text-white text-sm">{container.client_name || "—"}</p>
        </div>
      </div>


      <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-2">
        <div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-[4px]">Port</p>
          <p className="text-black dark:text-white text-sm">{port || "—"}</p>
        </div>
        <div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-[4px]">BL / BOL</p>
          <p className="text-black dark:text-white text-sm">{documentNumber || "—"}</p>
        </div>
      </div>

      <div className="mt-[15px] pt-[15px] border-t border-gray-50 dark:border-[#15203c]">
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-[4px]">Container numbers</p>
        {numberDetails.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-[12px]">
              <thead className="text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-1 pr-3 font-medium">Container No</th>
                  <th className="py-1 pr-3 font-medium">Size</th>
                  <th className="py-1 pr-3 font-medium">Goods Description</th>
                  <th className="py-1 pr-3 font-medium">Entry Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#15203c]">
                {numberDetails.map((number, index) => (
                  <tr key={number.id ?? `${number.container_no}-${index}`} className="text-black dark:text-white">
                    <td className="py-1 pr-3 whitespace-nowrap">{number.container_no}</td>
                    <td className="py-1 pr-3 whitespace-nowrap">
                      {number.size != null ? `${number.size} ${number.size_unit || "feet"}` : "—"}
                    </td>
                    <td className="py-1 pr-3">{number.goods_description || "—"}</td>
                    <td className="py-1 pr-3 whitespace-nowrap">{number.entry_number || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-black dark:text-white text-sm">—</p>}
        <div className="flex justify-end gap-[15px] text-[13px] mt-2">
          {container.container_type && (
            <span className="text-gray-600 dark:text-gray-300">
              {container.container_type.replace(/_/g, " ")}
            </span>
          )}
          {movementDate && (
            <span className="text-gray-600 dark:text-gray-300">
              {movementDate.replace("T", " ").slice(0, 10)}
            </span>
          )}
          {container.status && (
            <span className="text-gray-600 dark:text-gray-300">{container.status}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedShipContainerCard;
