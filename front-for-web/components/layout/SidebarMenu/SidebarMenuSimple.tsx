import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "../../../store/hooks";
import { clearAuth } from "../../../store/auth/slice";

interface SidebarMenuSimpleProps {
  dashboardHref: string;
}

const SidebarMenuSimple: React.FC<SidebarMenuSimpleProps> = ({ dashboardHref }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const normalizedPath = pathname?.replace(/\/$/, "") || "";
  const isDashboardActive = normalizedPath === dashboardHref;
  const isSettingsActive = normalizedPath.startsWith("/settings");
  const isLogoutActive = normalizedPath === "" || normalizedPath === "/";

  const handleLogout = React.useCallback(() => {
    try {
      dispatch(clearAuth());
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("auth");
        } catch {}
      }
    } finally {
      router.replace("/sign-in");
    }
  }, [dispatch, router]);

  return (
    <div className="sidebar-area bg-white dark:bg-[#0c1427] fixed z-[7] top-0 h-screen transition-all rounded-r-md">
      <div className="logo bg-white dark:bg-[#0c1427] border-b border-gray-100 dark:border-[#172036] px-[25px] pt-[19px] pb-[15px] absolute z-[2] right-0 top-0 left-0 flex items-center justify-between">
        <Link
          href={dashboardHref}
          className="transition-none relative flex items-center outline-none"
        >
          <Image src="/logo-ls.png" alt="logo-icon" width={100} height={26} />
        </Link>
        <button
          type="button"
          className="burger-menu inline-flex items-center justify-center rounded-full h-8 w-8 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-[#172036] transition-all"
          onClick={() => {}}
        >
          <i className="material-symbols-outlined text-[22px] leading-none">close</i>
        </button>
      </div>
      <div className="pt-[89px] px-[22px] pb-[20px] h-screen overflow-y-scroll sidebar-custom-scrollbar">
        <div className="accordion space-y-2">
            <div className="accordion-item rounded-md text-black dark:text-white mb-[3px] whitespace-nowrap">
                <Link
                href={dashboardHref}
                className={`accordion-button flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left hover:bg-gray-50 dark:hover:bg-[#15203c]
                    ${isDashboardActive ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c] border-l-4 border-primary-500 shadow-sm" : "text-gray-700 dark:text-gray-200 border-l-4 border-transparent"}
                `}
                >
                <i className="material-symbols-outlined transition-all mr-[7px] text-[22px] leading-none -top-px relative text-gray-500 dark:text-gray-400">
                    space_dashboard
                </i>
                <span className="title leading-none flex-1 truncate">Dashboard</span>
                </Link>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[3px] whitespace-nowrap">
                <Link
                href="/settings/"
                className={`accordion-button flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left hover:bg-gray-50 dark:hover:bg-[#15203c]
                    ${isSettingsActive ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c] border-l-4 border-primary-500 shadow-sm" : "text-gray-700 dark:text-gray-200 border-l-4 border-transparent"}
                `}
                >
                <i className="material-symbols-outlined transition-all mr-[7px] text-[22px] leading-none -top-px relative text-gray-500 dark:text-gray-400">
                    settings
                </i>
                <span className="title leading-none flex-1 truncate">Settings</span>
                </Link>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mt-[10px] whitespace-nowrap">
                <Link
                href="/sign-in"
                onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                }}
                className={`accordion-button flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left hover:bg-gray-50 dark:hover:bg-[#15203c]
                    ${isLogoutActive ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c]" : "text-gray-700 dark:text-gray-200"}
                `}
                >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 mr-[7px] text-[22px] leading-none -top-px relative">
                    logout
                </i>
                <span className="title leading-none">Logout</span>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenuSimple;
