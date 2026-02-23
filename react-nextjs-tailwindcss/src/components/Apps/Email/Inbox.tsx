"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Define the structure of a message
interface Message {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  starred: boolean;
  read: boolean;
  viewLink: string;
}

const Inbox: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // State to store messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11); // Number of items per page

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchMessages = async () => {
      // Replace this with an actual API call
      const mockData: Message[] = [
        {
          id: 1,
          sender: "Google",
          subject: "2-Step Verification Turn Off",
          preview: "Integer nec arcu ac nisi...",
          timestamp: "3:36 PM",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 2,
          sender: "Facebook",
          subject: "Friend Request",
          preview: "Sed in libero eget lorem fermentum...",
          timestamp: "9:25 AM",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 3,
          sender: "LinkedIn",
          subject: "Travel Information",
          preview: "Vivamus vestibulum ligula in mauris...",
          timestamp: "Jun 25",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 4,
          sender: "Twitter",
          subject: "New Login from Unknown Device",
          preview: "Etiam placerat sapien sed...",
          timestamp: "Jul 14",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 5,
          sender: "Amazon",
          subject: "Your Order has Shipped",
          preview: "Mauris consequat ligula in arcu...",
          timestamp: "Jul 12",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 6,
          sender: "Slack",
          subject: "You Have 5 Unread Messages",
          preview: "Fusce vel nunc nec nisi tempor...",
          timestamp: "Jul 11",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 7,
          sender: "Zoom",
          subject: "Meeting Invitation",
          preview: "Suspendisse euismod lorem sit amet...",
          timestamp: "Jul 10",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 8,
          sender: "Microsoft",
          subject: "Password Change Notification",
          preview: "Quisque facilisis nisi at libero...",
          timestamp: "Jul 09",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 9,
          sender: "Netflix",
          subject: "Your Subscription Renewal",
          preview: "Aliquam ultricies sapien a ante...",
          timestamp: "Jul 08",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 10,
          sender: "Dropbox",
          subject: "Shared File Received",
          preview: "Vestibulum vitae ligula sed nisi...",
          timestamp: "Jul 07",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 11,
          sender: "Apple",
          subject: "New Device Login Detected",
          preview: "Praesent at erat vel felis...",
          timestamp: "Jul 06",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 12,
          sender: "Spotify",
          subject: "Weekly Playlist Recommendations",
          preview: "Curabitur id lorem quis urna...",
          timestamp: "Jul 05",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 13,
          sender: "GitHub",
          subject: "Pull Request Merged",
          preview: "Sed at metus non augue ultrices...",
          timestamp: "Jul 04",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 14,
          sender: "PayPal",
          subject: "Payment Received",
          preview: "Nullam eget nunc sed lacus...",
          timestamp: "Jul 03",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 15,
          sender: "Instagram",
          subject: "New Message Request",
          preview: "In eget metus quis elit pharetra...",
          timestamp: "Jul 02",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 16,
          sender: "YouTube",
          subject: "Your Video is Live",
          preview: "Proin vehicula nunc nec sapien...",
          timestamp: "Jul 01",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 17,
          sender: "Reddit",
          subject: "Top Posts from Your Subscriptions",
          preview: "Donec gravida felis a dui commodo...",
          timestamp: "Jun 30",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 18,
          sender: "Pinterest",
          subject: "New Pins in Your Board",
          preview: "Vivamus id mauris eu odio...",
          timestamp: "Jun 29",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 19,
          sender: "TikTok",
          subject: "Someone Liked Your Video",
          preview: "Nunc ut turpis non nulla facilisis...",
          timestamp: "Jun 28",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
        {
          id: 20,
          sender: "Quora",
          subject: "Answer Request for Your Expertise",
          preview: "Integer aliquet quam at libero...",
          timestamp: "Jun 27",
          starred: false,
          read: false,
          viewLink: "/apps/email/read/",
        },
      ];

      setMessages(mockData);
    };

    fetchMessages();
  }, []);

  // Handle starring a message
  const handleStar = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, starred: !message.starred } : message
      )
    );
  };

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = messages.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[15px] md:mb-[20px] flex items-center justify-between">
          <div className="trezo-card-subtitle flex items-center">
            <div className="form-check relative top-[1px]">
              <input type="checkbox" className="cursor-pointer" />
            </div>

            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:ml-[2px] rtl:mr-[2px] ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-[25px] rtl:md:ml-[25px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[25px] leading-none hover:text-primary-500">
                <i className="material-symbols-outlined !text-[18px]">
                  arrow_drop_down
                </i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["All", "None", "Read", "Unread", "Starred", "Unstarred"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>

            <button
              type="button"
              className="inline-block transition-all leading-none hover:text-primary-500 ltr:mr-[10px] rtl:ml-[10px]"
            >
              <i className="material-symbols-outlined !text-lg">archive</i>
            </button>

            <button
              type="button"
              className="inline-block transition-all leading-none hover:text-primary-500 ltr:mr-[10px] rtl:ml-[10px]"
            >
              <i className="material-symbols-outlined !text-lg">help_clinic</i>
            </button>

            <button
              type="button"
              className="inline-block transition-all leading-none hover:text-primary-500 ltr:mr-[10px] rtl:ml-[10px]"
            >
              <i className="material-symbols-outlined !text-lg">delete</i>
            </button>

            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[25px] leading-none hover:text-primary-500">
                <i className="material-symbols-outlined !text-[18px]">
                  more_vert
                </i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {[
                  "Mark as unread",
                  "Snooze",
                  "Add star",
                  "Mark as important",
                  "Mark as not important",
                  "Forward as attachment",
                  "Filter",
                  "Mute",
                ].map((option) => (
                  <MenuItem
                    key={option}
                    as="div"
                    className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                      selectedOption === option ? "font-semibold" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content relative">
          <ul>
            <li className="inline-block ltr:mr-[35px] rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
              <Link
                href="/apps/email/inbox/"
                className="relative inline-block font-medium pb-[9px] md:pb-[14px] transition-all text-primary-500"
              >
                <span className="inline-block relative ltr:pl-[27px] rtl:pr-[27px]">
                  <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px md:mt-0">
                    inbox
                  </i>
                  Primary
                </span>
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary-500"></span>
              </Link>
            </li>

            <li className="inline-block ltr:mr-[35px] rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
              <Link
                href="/apps/email/promotions/"
                className="relative inline-block font-medium pb-[9px] md:pb-[14px] transition-all hover:text-primary-500"
              >
                <span className="inline-block relative ltr:pl-[27px] rtl:pr-[27px]">
                  <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px md:mt-0">
                    shoppingmode
                  </i>
                  Promotions
                </span>
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary-500 hidden"></span>
              </Link>
            </li>
          </ul>

          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <tbody className="text-black dark:text-white">
                {currentMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:py-[15.5px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="form-check relative top-[2px]">
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={message.read}
                            onChange={() =>
                              setMessages((prevMessages) =>
                                prevMessages.map((msg) =>
                                  msg.id === message.id
                                    ? { ...msg, read: !msg.read }
                                    : msg
                                )
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          className="ltr:ml-[15px] rtl:mr-[15px] leading-none text-lg"
                          onClick={() => handleStar(message.id)}
                        >
                          <i
                            className={`ri-star-${
                              message.starred ? "fill" : "line"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </td>

                    <td className="font-medium text-black dark:text-white relative ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:py-[15.5px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {message.sender}
                      <Link
                        href={message.viewLink}
                        className="absolute top-0 left-0 right-0 bottom-0 z-[1]"
                      ></Link>
                    </td>

                    <td className="text-black dark:text-white relative ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:py-[15.5px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {message.subject}{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        - {message.preview}
                      </span>
                      <Link
                        href={message.viewLink}
                        className="absolute top-0 left-0 right-0 bottom-0 z-[1]"
                      ></Link>
                    </td>

                    <td className="relative ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[13px] md:py-[15.5px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {message.timestamp}
                      <Link
                        href={message.viewLink}
                        className="absolute top-0 left-0 right-0 bottom-0 z-[1]"
                      ></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center md:absolute -top-[48px] ltr:right-0 rtl:left-0 mt-[15px] md:mt-0">
            <p className="!mb-0 !text-sm">
              {indexOfFirstItem + 1} –{" "}
              {Math.min(indexOfLastItem, messages.length)} of {messages.length}
            </p>

            <ol className="ltr:ml-[10px] rtl:mr-[10px]">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(messages.length / itemsPerPage)
                  }
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inbox;
