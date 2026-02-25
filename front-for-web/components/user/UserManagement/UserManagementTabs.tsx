"use client";

import React, { useState } from "react";
import UsersTable from "../UsersList/UsersTable";
import UserGroupsTable from "../UserGroups/UserGroupsTable";
import RolesTable from "../Roles/RolesTable";

const tabs = [
  { id: "users", label: "Users", icon: "person" },
  { id: "groups", label: "Groups", icon: "group" },
  { id: "roles", label: "Roles", icon: "shield_person" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const UserManagementTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 bg-white dark:bg-[#020617] rounded-md border border-gray-100 dark:border-[#1f2937] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#020617]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "users" && <UsersTable />}
      {activeTab === "groups" && <UserGroupsTable />}
      {activeTab === "roles" && <RolesTable />}
    </div>
  );
};

export default UserManagementTabs;
