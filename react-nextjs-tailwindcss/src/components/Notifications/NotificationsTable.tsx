"use client";

import React from "react";

interface Notification {
  id: string;
  timestamp: string;
  type: string;
  content: string;
  status: "Unread" | "Read";
}

const notifications: Notification[] = [
  {
    id: "#JAN-854",
    timestamp: "01 Dec 2024 09:30 AM",
    type: "Information",
    content: "New software update available. Click here to download.",
    status: "Unread",
  },
  {
    id: "#JAN-853",
    timestamp: "30 Nov 2024 09:30 AM",
    type: "Alert",
    content: "Urgent: Server maintenance scheduled for tomorrow at 10:00 PM.",
    status: "Read",
  },
  {
    id: "#JAN-852",
    timestamp: "28 Nov 2024 09:30 AM",
    type: "Announcement",
    content: "Welcome to our new team member, Jane Smith, as Head of Sales.",
    status: "Read",
  },
  {
    id: "#JAN-851",
    timestamp: "27 Nov 2024 03:45 PM",
    type: "Warning",
    content: "Your password will expire in 3 days. Please update it.",
    status: "Unread",
  },
  {
    id: "#JAN-850",
    timestamp: "25 Nov 2024 01:00 PM",
    type: "Information",
    content: "New blog post: Tips for increasing productivity at work.",
    status: "Read",
  },
  {
    id: "#JAN-849",
    timestamp: "24 Nov 2024 08:15 AM",
    type: "Alert",
    content: "System downtime expected due to scheduled maintenance.",
    status: "Unread",
  },
  {
    id: "#JAN-848",
    timestamp: "23 Nov 2024 06:20 PM",
    type: "Announcement",
    content: "New company policies have been updated. Please review.",
    status: "Read",
  },
  {
    id: "#JAN-847",
    timestamp: "22 Nov 2024 10:30 AM",
    type: "Warning",
    content: "Reminder: Security training deadline is approaching.",
    status: "Unread",
  },
  {
    id: "#JAN-846",
    timestamp: "20 Nov 2024 07:55 AM",
    type: "Information",
    content: "Office holiday schedule for December has been published.",
    status: "Read",
  },
  {
    id: "#JAN-845",
    timestamp: "18 Nov 2024 05:10 PM",
    type: "Alert",
    content: "A critical security update is available. Please install now.",
    status: "Unread",
  },
];

const NotificationsTable: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "ID",
                    "Timestamp",
                    "Type",
                    "Content",
                    "Status",
                    "Action",
                  ].map((heading, index) => (
                    <th
                      key={index}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {notifications.map((notification, index) => (
                  <tr key={index}>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {notification.id}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {notification.timestamp}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {notification.type}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {notification.content}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          notification.status === "Unread"
                            ? "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                            : "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <button
                        type="button"
                        className="text-primary-500 leading-none"
                      >
                        <i className="material-symbols-outlined !text-md">
                          visibility
                        </i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsTable;
