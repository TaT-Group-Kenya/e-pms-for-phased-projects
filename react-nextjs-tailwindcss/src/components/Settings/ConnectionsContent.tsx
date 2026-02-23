"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Account {
  id: string;
  name: string;
  description?: string;
  icon: string;
  isConnected: boolean;
}

const initialConnectedAccounts: Account[] = [
  {
    id: "google",
    name: "Google",
    description: "Calendar and Contacts",
    icon: "/images/socials/google.svg",
    isConnected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Communications",
    icon: "/images/socials/slack.svg",
    isConnected: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Manage your Git repositories",
    icon: "/images/socials/github.svg",
    isConnected: true,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing service",
    icon: "/images/socials/mailchimp.svg",
    isConnected: true,
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design",
    icon: "/images/socials/figma.svg",
    isConnected: true,
  },
];

const initialSocialAccounts: Account[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "/images/socials/facebook.svg",
    isConnected: true,
  },
  {
    id: "twitter",
    name: "X",
    icon: "/images/socials/twitter.svg",
    isConnected: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/images/socials/instagram.svg",
    isConnected: false, // Not Connected
  },
  {
    id: "dribbble",
    name: "Dribbble",
    icon: "/images/socials/dribbble.svg",
    isConnected: true,
  },
  {
    id: "behance",
    name: "Behance",
    icon: "/images/socials/behance.svg",
    isConnected: true,
  },
];

const ConnectionsContent: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState(
    initialConnectedAccounts
  );
  const [socialAccounts, setSocialAccounts] = useState(initialSocialAccounts);

  const handleDisconnect = (id: string) => {
    setConnectedAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, isConnected: false } : account
      )
    );
    setSocialAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, isConnected: false } : account
      )
    );
  };

  return (
    <>
      <h5 className="!mb-[22px]">Connected Accounts</h5>
      <ul>
        {connectedAccounts.map((account) => (
          <li
            key={account.id}
            className="flex items-center justify-between mb-[20px] last:mb-0"
          >
            <div className="flex items-center gap-[15px]">
              <Image
                src={account.icon}
                width={40}
                height={40}
                alt={account.name}
              />
              <div>
                <span className="block text-black dark:text-white font-semibold">
                  {account.name}
                </span>
                <span className="block mt-[3px]">{account.description}</span>
              </div>
            </div>

            {account.isConnected ? (
              <button
                type="button"
                onClick={() => handleDisconnect(account.id)}
                className="inline-block transition-all text-primary-500 hover:underline"
              >
                Click to Disconnect
              </button>
            ) : (
              <span className="text-gray-500">Disconnected</span>
            )}
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-100 dark:border-[#172036] my-[20px] md:my-[25px]"></div>

      <h5 className="!mb-[22px]">Social Accounts</h5>
      <ul>
        {socialAccounts.map((account) => (
          <li
            key={account.id}
            className="flex items-center justify-between mb-[20px] last:mb-0"
          >
            <div className="flex items-center gap-[15px]">
              <Image
                src={account.icon}
                width={40}
                height={40}
                alt={account.name}
              />
              <span className="block text-black dark:text-white font-semibold">
                {account.name}
              </span>
            </div>

            {account.isConnected ? (
              <button
                type="button"
                onClick={() => handleDisconnect(account.id)}
                className="inline-block transition-all text-primary-500 hover:underline"
              >
                Click to Disconnect
              </button>
            ) : (
              <span className="text-gray-500">Not Connected</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ConnectionsContent;
