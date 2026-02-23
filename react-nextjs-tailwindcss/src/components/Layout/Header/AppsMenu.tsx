"use client";

import React from "react";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import Image from "next/image";

type App = {
  name: string;
  url: string;
  icon: string;
};

const apps: App[] = [
  {
    name: "Figma",
    url: "https://www.figma.com/",
    icon: "/images/icons/figma.svg",
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/",
    icon: "/images/icons/dribbble.svg",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/",
    icon: "/images/icons/spotify.svg",
  },
  {
    name: "Gitlab",
    url: "https://gitlab.com/",
    icon: "/images/icons/gitlab.svg",
  },
  {
    name: "GDrive",
    url: "https://drive.google.com/",
    icon: "/images/icons/google-drive.svg",
  },
  {
    name: "Trello",
    url: "https://trello.com/",
    icon: "/images/icons/trello.svg",
  },
  { name: "Slack", url: "https://slack.com/", icon: "/images/icons/slack.svg" },
  {
    name: "Pinterest",
    url: "https://www.pinterest.com/",
    icon: "/images/icons/pinterest.svg",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
    icon: "/images/icons/facebook.svg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    icon: "/images/icons/linkedin.svg",
  },
];

const AppsMenu: React.FC = () => {
  return (
    <div className="connected-apps-menu relative ltr:ml-[13px] ltr:md:ml-[18px] ltr:lg:ml-[25px] rtl:ml-[r3px] rtl:md:mr-[18px] rtl:lg:mr-[25px]">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="transition-all relative top-[2px] hover:text-primary-500">
          <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
            apps
          </i>
        </MenuButton>
        <MenuItems
          transition
          className="bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none pt-[20px] md:pt-[25px] px-[10px] md:px-[15px] pb-[5px] md:pb-[8px] absolute mt-[9px] md:mt-[20px] w-[240px] z-[1] top-full right-0 rounded-md data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <ul className="grid grid-cols-3 text-center gap-[5px]">
            {apps.map((app) => (
              <li key={app.name}>
                <a
                  href={app.url}
                  className="block text-xs mb-[15px] text-black transition-all hover:text-primary-500 dark:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={app.icon}
                    className="inline-block"
                    alt={app.name.toLowerCase()}
                    width={30}
                    height={30}
                    style={{ height: "30px", width: "30px" }}
                  />
                  <span className="block mt-[7px]">{app.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default AppsMenu;
