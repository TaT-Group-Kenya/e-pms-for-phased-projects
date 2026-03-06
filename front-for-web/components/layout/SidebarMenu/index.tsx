"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "../../../store/hooks";
import { clearAuth } from "../../../store/auth/slice";

interface SidebarMenuProps {
  toggleActive: () => void;
}

type MatchStrategy = "exact" | "startsWith" | "entity";

interface SidebarSubItem {
  label: string;
  href: string;
  /** How to determine if this item is active for a given pathname */
  matchStrategy?: MatchStrategy;
}

type SidebarSectionGroup = "main" | "others";

interface SidebarSection {
  id: string;
  label: string;
  icon: string; // Material Symbols icon name
  group: SidebarSectionGroup;
  items: SidebarSubItem[];
}

const SECTIONS: SidebarSection[] = [
  {
    id: "customers",
    label: "Customers",
    icon: "family_group",
    group: "main",
    items: [
      {
        label: "All Customers",
        href: "/customer/customer-list",
        matchStrategy: "entity",
      },
      { label: "Add Customer", href: "/customer/create-customer" },
      { label: "Reports", href: "/customer/report" },
    ],
  },
  {
    id: "companies",
    label: "Companies",
    icon: "corporate_fare",
    group: "main",
    items: [
      {
        label: "All Companies",
        href: "/company/company-list",
        matchStrategy: "entity",
      },
      { label: "Add Company", href: "/company/create-company" },
      { label: "Reports", href: "/company/report" },
    ],
  },
  {
    id: "quotations",
    label: "Quotations",
    icon: "request_quote",
    group: "main",
    items: [
      {
        label: "All Quotations",
        href: "/quotation/quotation-list",
        matchStrategy: "entity",
      },
      { label: "Create Quotation", href: "/quotation/create-quotation" },
      { label: "Reports", href: "/quotation/report" },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: "receipt_long",
    group: "main",
    items: [
      {
        label: "All Orders",
        href: "/orders/order-list",
        matchStrategy: "entity",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: "description",
    group: "main",
    items: [
      {
        label: "All Projects",
        href: "/project/project-list",
        matchStrategy: "entity",
      },
      { label: "Add Project", href: "/project/create-project" },
      { label: "Reports", href: "/project/report" },
      { label: "Categories", href: "/project/category" },
      { label: "Sources", href: "/project/source-origins" },
      { label: "Locations", href: "/project/locations" },
    ],
  },
  {
    id: "customer-invoices",
    label: "Customer Invoices",
    icon: "content_paste",
    group: "main",
    items: [
      {
        label: "All Invoices",
        href: "/cust-invoices/invoice-list",
        matchStrategy: "entity",
      },
      {
        label: "Credit Notes",
        href: "/cust/credit-notes",
        matchStrategy: "entity",
      },
    ],
  },
  {
    id: "company-invoices",
    label: "Company Invoices",
    icon: "domain",
    group: "main",
    items: [
      {
        label: "All Invoices",
        href: "/company/invoices",
        matchStrategy: "entity",
      },
      {
        label: "Credit Notes",
        href: "/company/credit-notes",
        matchStrategy: "entity",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "calculate",
    group: "main",
    items: [
      {
        label: "Accounts",
        href: "/finance/accounts/",
        matchStrategy: "startsWith",
      },
      {
        label: "Payments",
        href: "/finance/payments/",
        matchStrategy: "startsWith",
      },
      {
        label: "Customer Trxns Ledger",
        href: "/finance/customer-ledger/",
        matchStrategy: "startsWith",
      },
      {
        label: "Company Trxns Ledger",
        href: "/finance/company-ledger/",
        matchStrategy: "startsWith",
      },
      {
        label: "Internal Transactions",
        href: "/finance/expenses-and-others/",
        matchStrategy: "startsWith",
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    icon: "person",
    group: "main",
    items: [
      {
        label: "Users Management",
        href: "/users/users-list/",
        matchStrategy: "startsWith",
      },
    ],
  },
  {
    id: "system-setup",
    label: "System Setup",
    icon: "dashboard_customize",
    group: "main",
    items: [
      { label: "Departments", href: "/setup/departments" },
      { label: "Configurations", href: "/setup/configurations" },
      { label: "Account Types", href: "/setup/account-types" },
      { label: "Account Groups", href: "/setup/account-groups" },
      { label: "Currencies", href: "/setup/currencies" },
      { label: "Countries", href: "/setup/countries" },
      { label: "Taxes", href: "/setup/taxes" },
      { label: "Languages", href: "/setup/languages" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    group: "others",
    items: [
      {
        label: "Account Settings",
        href: "/settings/",
        matchStrategy: "startsWith",
      }
    ],
  },
];

const normalizePath = (path: string | null): string => {
  if (!path) return "";
  // Remove trailing slash except for root
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
};

const isEntityDetailMatch = (baseListPath: string, pathname: string): boolean => {
  // Handle two patterns:
  // 1) List pages like "/project/project-list" -> detail "/project/:id"
  //    We treat the first segment ("project") as the entity root.
  // 2) Nested resources like "/company/invoices" -> detail "/company/invoices/:id"
  //    We treat the full path ("company/invoices") as the entity root.
  const segments = baseListPath.split("/").filter(Boolean);
  if (segments.length === 0) return false;

  const lastSegment = segments[segments.length - 1];
  const endsWithList = /list$/i.test(lastSegment);

  // If the last segment ends with "list" (e.g. "project-list", "invoice-list"),
  // we assume detail pages live at "/<first-segment>/:id".
  // Otherwise, we assume detail pages live directly under the full base path,
  // e.g. base "/company/invoices" -> detail "/company/invoices/:id".
  const entityRootPath = endsWithList ? `/${segments[0]}` : `/${segments.join("/")}`;

  const entityDetailPattern = new RegExp(`^${entityRootPath}/\\d+/?$`);
  return entityDetailPattern.test(pathname);
};

const isSubItemActive = (
  item: SidebarSubItem,
  pathname: string | null
): boolean => {
  if (!pathname) return false;

  const current = normalizePath(pathname);
  const target = normalizePath(item.href);
  const strategy: MatchStrategy = item.matchStrategy ?? "exact";

  if (strategy === "exact") {
    return current === target;
  }

  if (strategy === "startsWith") {
    return current === target || current.startsWith(target);
  }

  // "entity" strategy: list path and its entity detail pages
  if (strategy === "entity") {
    return current === target || isEntityDetailMatch(target, current);
  }

  return false;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleActive }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [openSectionId, setOpenSectionId] = React.useState<string | null>(null);
  const [shouldScrollToActive, setShouldScrollToActive] = React.useState(false);
  const activeItemRef = React.useRef<HTMLLIElement | null>(null);

  const activeSectionId = React.useMemo(() => {
    if (!pathname) return null;

    for (const section of SECTIONS) {
      if (section.items.some((item) => isSubItemActive(item, pathname))) {
        return section.id;
      }
    }

    return null;
  }, [pathname]);

  // Keep accordion in sync with current route
  React.useEffect(() => {
    if (activeSectionId) {
      setOpenSectionId(activeSectionId);
    }
    if (shouldScrollToActive && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
      setShouldScrollToActive(false);
    }
  }, [activeSectionId, shouldScrollToActive]);

  const handleSectionToggle = (section: SidebarSection) => {
    setOpenSectionId((prev) => {
      const isOpening = prev !== section.id;

      if (isOpening) {
        const firstItem = section.items[0];
        if (firstItem && pathname !== firstItem.href) {
          setShouldScrollToActive(true);
          router.push(firstItem.href);
        }
        return section.id;
      }

      return null; // collapse when clicking the already open section
    });
  };

  const mainSections = SECTIONS.filter((s) => s.group === "main");
  const otherSections = SECTIONS.filter((s) => s.group === "others");

  const normalizedPath = normalizePath(pathname);
  const isDashboardActive =
    normalizedPath === "/dashboard" || normalizedPath.startsWith("/dashboard/");
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
          href="/dashboard/ecommerce/"
          className="transition-none relative flex items-center outline-none"
        >
          <Image src="/logo-ls.png" alt="logo-icon" width={100} height={26} />
        </Link>

        <button
          type="button"
          className="burger-menu inline-flex items-center justify-center rounded-full h-8 w-8 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-[#172036] transition-all"
          onClick={toggleActive}
        >
          <i className="material-symbols-outlined text-[22px] leading-none">close</i>
        </button>
      </div>

      <div className="pt-[89px] px-[22px] pb-[20px] h-screen overflow-y-scroll sidebar-custom-scrollbar">
        <div className="accordion space-y-2">
          <div className="accordion-item rounded-md text-black dark:text-white mb-[3px] whitespace-nowrap">
            <Link
              href="/dashboard"
              className={`accordion-button flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left hover:bg-gray-50 dark:hover:bg-[#15203c]
                ${
                  isDashboardActive
                    ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c] border-l-4 border-primary-500 shadow-sm"
                    : "text-gray-700 dark:text-gray-200 border-l-4 border-transparent"
                }
              `}
            >
              <i className="material-symbols-outlined transition-all mr-[7px] text-[22px] leading-none -top-px relative text-gray-500 dark:text-gray-400">
                space_dashboard
              </i>
              <span className="title leading-none flex-1 truncate">Dashboard</span>
            </Link>
          </div>

          <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs">
            Navigation
          </span>

          {mainSections.map((section) => {
            const isOpen = openSectionId === section.id;
            const isActive = activeSectionId === section.id;

            return (
              <div
                key={section.id}
                className="accordion-item rounded-md text-black dark:text-white mb-[3px] whitespace-nowrap"
              >
                <button
                  type="button"
                  onClick={() => handleSectionToggle(section)}
                  className={`accordion-button toggle flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left${
                    isOpen ? " open" : ""
                  }
                    ${
                      isOpen
                        ? "bg-primary-50 text-primary-600 dark:text-primary-400 dark:bg-[#15203c]"
                        : "hover:bg-gray-50 dark:hover:bg-[#15203c] text-gray-700 dark:text-gray-200"
                    }
                    ${
                      isActive
                        ? " border-l-4 border-primary-500 shadow-sm"
                        : " border-l-4 border-transparent"
                    }
                  `}
                >
                  <i
                    className={`material-symbols-outlined transition-all mr-[7px] text-[22px] leading-none -top-px relative
                      ${isActive ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}
                    `}
                  >
                    {section.icon}
                  </i>
                  <span className="title leading-none flex-1 truncate">{section.label}</span>
                </button>

                <div className={`accordion-collapse ${isOpen ? "block" : "hidden"}`}>
                  <div className="pt-[4px]">
                    <ul className="sidebar-sub-menu">
                      {section.items.map((item) => {
                        const isItemActive = isSubItemActive(item, pathname);

                        return (
                          <li
                            ref={isItemActive ? activeItemRef : undefined}
                            key={item.href + item.label}
                            className="sidemenu-item mb-[4px] last:mb-0"
                          >
                            <Link
                              href={item.href}
                              onClick={() => setShouldScrollToActive(true)}
                              className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium py-[9px] pl-[38px] pr-[30px] w-full text-left
                                ${
                                  isItemActive
                                    ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c]"
                                    : "text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-[#15203c]"
                                }
                              `}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          {otherSections.length > 0 && (
            <span className="block relative font-medium uppercase text-gray-400 mb-[8px] mt-[22px] text-xs">
              Others
            </span>
          )}

          {otherSections.map((section) => {
            const isOpen = openSectionId === section.id;
            const isActive = activeSectionId === section.id;

            return (
              <div
                key={section.id}
                className="accordion-item rounded-md text-black dark:text-white mb-[3px] whitespace-nowrap"
              >
                <button
                  type="button"
                  onClick={() => handleSectionToggle(section)}
                  className={`accordion-button toggle flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left${
                    isOpen ? " open" : ""
                  }
                    ${
                      isOpen
                        ? "bg-primary-50 text-primary-600 dark:text-primary-400 dark:bg-[#15203c]"
                        : "hover:bg-gray-50 dark:hover:bg-[#15203c] text-gray-700 dark:text-gray-200"
                    }
                    ${
                      isActive
                        ? " border-l-4 border-primary-500 shadow-sm"
                        : " border-l-4 border-transparent"
                    }
                  `}
                >
                  <i
                    className={`material-symbols-outlined transition-all mr-[7px] text-[22px] leading-none -top-px relative
                      ${isActive ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}
                    `}
                  >
                    {section.icon}
                  </i>
                  <span className="title leading-none flex-1 truncate">{section.label}</span>
                </button>

                <div className={`accordion-collapse ${isOpen ? "block" : "hidden"}`}>
                  <div className="pt-[4px]">
                    <ul className="sidebar-sub-menu">
                      {section.items.map((item) => {
                        const isItemActive = isSubItemActive(item, pathname);

                        return (
                          <li
                            ref={isItemActive ? activeItemRef : undefined}
                            key={item.href + item.label}
                            className="sidemenu-item mb-[4px] last:mb-0"
                          >
                            <Link
                              href={item.href}
                              onClick={() => setShouldScrollToActive(true)}
                              className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium py-[9px] pl-[38px] pr-[30px] w-full text-left
                                ${
                                  isItemActive
                                    ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c]"
                                    : "text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-[#15203c]"
                                }
                              `}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="accordion-item rounded-md text-black dark:text-white mt-[10px] whitespace-nowrap">
            <Link
              href="/sign-in"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className={`accordion-button flex items-center transition-all py-[9px] pl-[14px] pr-[30px] rounded-md font-medium w-full relative text-left hover:bg-gray-50 dark:hover:bg-[#15203c]
                ${
                  isLogoutActive
                    ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-[#15203c]"
                    : "text-gray-700 dark:text-gray-200"
                }
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

export default SidebarMenu;
