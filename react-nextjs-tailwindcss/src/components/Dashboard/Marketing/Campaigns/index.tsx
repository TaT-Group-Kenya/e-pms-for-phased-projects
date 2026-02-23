"use client";

import React, { useState } from "react";
import Image from "next/image";
import AddCampaignModal from "./AddCampaignModal";

// Data for campaigns
const campaignsData = {
  all: [
    {
      id: 1,
      name: "Christmas Eve",
      dateRange: "From 10 Oct - 15 Oct, 24",
      color: "orange",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/instagram2.svg", alt: "instagram" },
        { icon: "/images/icons/google3.svg", alt: "google" },
        { icon: "/images/icons/linkedin2.svg", alt: "linkedin" },
      ],
      status: { text: "Live Now", color: "orange" },
      users: [
        "/images/users/user53.jpg",
        "/images/users/user54.jpg",
        "/images/users/user56.jpg",
        "/images/users/user57.jpg",
      ],
      extraUsers: 3,
    },
    {
      id: 2,
      name: "Teacher’s Day",
      dateRange: "From 08 Oct - 12 Oct, 24",
      color: "primary",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/instagram2.svg", alt: "instagram" },
      ],
      status: { text: "Reviewing", color: "success" },
      users: [
        "/images/users/user52.jpg",
        "/images/users/user51.jpg",
        "/images/users/user50.jpg",
      ],
    },
    {
      id: 3,
      name: "ThanksGiving",
      dateRange: "From 01 Oct - 05 Oct, 24",
      color: "purple",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/google3.svg", alt: "google" },
        { icon: "/images/icons/linkedin2.svg", alt: "linkedin" },
      ],
      status: { text: "Paused", color: "secondary" },
      users: ["/images/users/user1.jpg", "/images/users/user2.jpg"],
    },
    {
      id: 4,
      name: "Team Gateway",
      dateRange: "From 05 Oct - 17 Oct, 24",
      color: "secondary",
      platforms: [{ icon: "/images/icons/google3.svg", alt: "google" }],
      status: { text: "Live Now", color: "orange" },
      users: [
        "/images/users/user3.jpg",
        "/images/users/user4.jpg",
        "/images/users/user5.jpg",
      ],
    },
    {
      id: 5,
      name: "Halloween",
      dateRange: "From 20 Oct - 31 Oct, 24",
      color: "success",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/instagram2.svg", alt: "instagram" },
        { icon: "/images/icons/google3.svg", alt: "google" },
        { icon: "/images/icons/linkedin2.svg", alt: "linkedin" },
      ],
      status: { text: "Reviewing", color: "success" },
      users: [
        "/images/users/user45.jpg",
        "/images/users/user46.jpg",
        "/images/users/user47.jpg",
      ],
    },
  ],

  pending: [
    {
      id: 1,
      name: "Halloween",
      dateRange: "From 20 Oct - 31 Oct, 24",
      color: "success",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/instagram2.svg", alt: "instagram" },
        { icon: "/images/icons/google3.svg", alt: "google" },
        { icon: "/images/icons/linkedin2.svg", alt: "linkedin" },
      ],
      status: { text: "Reviewing", color: "success" },
      users: [
        "/images/users/user45.jpg",
        "/images/users/user46.jpg",
        "/images/users/user47.jpg",
      ],
    },
    {
      id: 2,
      name: "ThanksGiving",
      dateRange: "From 01 Oct - 05 Oct, 24",
      color: "purple",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/google3.svg", alt: "google" },
        { icon: "/images/icons/linkedin2.svg", alt: "linkedin" },
      ],
      status: { text: "Paused", color: "secondary" },
      users: ["/images/users/user1.jpg", "/images/users/user2.jpg"],
    },
    {
      id: 3,
      name: "Teacher’s Day",
      dateRange: "From 08 Oct - 12 Oct, 24",
      color: "primary",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/instagram2.svg", alt: "instagram" },
      ],
      status: { text: "Reviewing", color: "success" },
      users: [
        "/images/users/user52.jpg",
        "/images/users/user51.jpg",
        "/images/users/user50.jpg",
      ],
    },
  ],

  completed: [
    {
      id: 1,
      name: "Christmas Eve",
      dateRange: "From 10 Oct - 15 Oct, 24",
      color: "orange",
      platforms: [
        { icon: "/images/icons/facebook3.svg", alt: "facebook" },
        { icon: "/images/icons/instagram2.svg", alt: "instagram" },
        { icon: "/images/icons/google3.svg", alt: "google" },
        { icon: "/images/icons/linkedin2.svg", alt: "linkedin" },
      ],
      status: { text: "Live Now", color: "orange" },
      users: [
        "/images/users/user53.jpg",
        "/images/users/user54.jpg",
        "/images/users/user56.jpg",
        "/images/users/user57.jpg",
      ],
      extraUsers: 3,
    },
    {
      id: 2,
      name: "Team Gateway",
      dateRange: "From 05 Oct - 17 Oct, 24",
      color: "secondary",
      platforms: [{ icon: "/images/icons/google3.svg", alt: "google" }],
      status: { text: "Live Now", color: "orange" },
      users: [
        "/images/users/user3.jpg",
        "/images/users/user4.jpg",
        "/images/users/user5.jpg",
      ],
    },
  ],
};

const Campaigns: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    "all"
  );

  const handleTabClick = (tab: "all" | "pending" | "completed") => {
    setActiveTab(tab);
  };

  const renderCampaigns = (campaigns: typeof campaignsData.all) => {
    return campaigns.map((campaign) => (
      <tr key={campaign.id}>
        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
          <div className="relative py-[3.5px] ltr:pl-[13px] rtl:pr-[13px]">
            <span className="block font-semibold mb-[3px]">
              {campaign.name}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {campaign.dateRange}
            </span>
            <div
              className={`absolute ltr:left-0 rtl:right-0 top-0 bottom-0 w-[2px] bg-${campaign.color}-500`}
            ></div>
          </div>
        </td>

        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
          <div className="flex items-center gap-[10px]">
            {campaign.platforms.map((platform, index) => (
              <a key={index} href="#" target="_blank" className="inline-block">
                <Image
                  src={platform.icon}
                  className="w-[18px]"
                  alt={platform.alt}
                  width={18}
                  height={18}
                />
              </a>
            ))}
          </div>
        </td>

        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
          <span
            className={`px-[8px] py-[3px] inline-block bg-${campaign.status.color}-100 dark:bg-[#15203c] text-${campaign.status.color}-700 rounded-sm font-medium text-xs`}
          >
            {campaign.status.text}
          </span>
        </td>

        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
          <div className="flex items-center">
            {campaign.users.map((user, index) => (
              <div
                key={index}
                className="w-[26px] h-[26px] rounded-full ltr:-mr-[7px] rtl:-ml-[7px] border border-white"
              >
                <Image
                  alt="user-image"
                  className="rounded-full"
                  src={user}
                  width={24}
                  height={24}
                />
              </div>
            ))}
            {campaign.extraUsers && (
              <div className="w-[26px] h-[26px] text-xs rounded-full border border-white bg-gray-700 text-white font-medium flex items-center justify-center">
                +{campaign.extraUsers}
              </div>
            )}
          </div>
        </td>

        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
          <button
            className="inline-block rounded-full w-[30px] h-[30px] bg-gray-100 dark:bg-[#172036] text-center leading-[30px] text-[18px] text-gray-400 transition-all hover:bg-primary-500 hover:text-white"
            type="button"
            id="scrollingLongContentModalToggle"
          >
            <i className="ri-arrow-right-line"></i>
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Campaigns</h5>
        </div>
        <div className="trezo-card-subtitle">
          <AddCampaignModal />
        </div>
      </div>

      <div className="trezo-card-content min-h-[377px]">
        <div className="trezo-tabs" id="trezo-tabs">
          <ul className="campaigns-navs mb-[15px]">
            <li className="nav-item inline-block ltr:mr-[35px] rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handleTabClick("all")}
                className={`nav-link text-xs block font-semibold text-gray-500 dark:text-gray-400 uppercase transition-all tracking-[2px] ${
                  activeTab === "all" ? "active" : ""
                }`}
              >
                All
              </button>
            </li>
            <li className="nav-item inline-block ltr:mr-[35px] rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handleTabClick("pending")}
                className={`nav-link text-xs block font-semibold text-gray-500 dark:text-gray-400 uppercase transition-all tracking-[2px] ${
                  activeTab === "pending" ? "active" : ""
                }`}
              >
                Pending
              </button>
            </li>
            <li className="nav-item inline-block ltr:mr-[35px] rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handleTabClick("completed")}
                className={`nav-link text-xs block font-semibold text-gray-500 dark:text-gray-400 uppercase transition-all tracking-[2px] ${
                  activeTab === "completed" ? "active" : ""
                }`}
              >
                Completed
              </button>
            </li>
          </ul>

          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <tbody className="text-black dark:text-white">
                {activeTab === "all" && renderCampaigns(campaignsData.all)}
                {activeTab === "pending" &&
                  renderCampaigns(campaignsData.pending)}
                {activeTab === "completed" &&
                  renderCampaigns(campaignsData.completed)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
