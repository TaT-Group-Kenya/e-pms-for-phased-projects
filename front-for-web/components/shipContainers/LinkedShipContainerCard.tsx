import Link from "next/link";
import type { FC } from "react";

export interface LinkedShipContainer {
  id?: number;
  reference_number?: string | null;
  container_type?: string | null;
  client_name?: string | null;
  container_numbers?: string[] | null;
  port_in?: string | null;
  port_out?: string | null;
  get_in?: string | null;
  eta?: string | null;
  etd?: string | null;
  bl_no?: string | null;
  bol_no?: string | null;
  status?: string | null;
}

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

      <div className="mt-[15px] pt-[15px] border-t border-gray-50 dark:border-[#15203c] flex flex-wrap items-center justify-between gap-[10px]">
        <div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-[4px]">Container numbers</p>
          <p className="text-black dark:text-white text-sm">
            {container.container_numbers?.length ? container.container_numbers.join(", ") : "—"}
          </p>
        </div>
        <div className="flex gap-[15px] text-[13px]">
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
