"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Define the structure of a chat message
interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isSender: boolean; // To differentiate between sender and receiver
}

// Chat Component
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: "Olivia",
      avatar: "/images/users/user31.jpg",
      message:
        "Hey Olivia, have you had a chance to check out the new admin dashboard?",
      time: "09:10 AM",
      isSender: false,
    },
    {
      id: 2,
      user: "You",
      avatar: "",
      message: "Oh, you mean the one for project?",
      time: "09:20 AM",
      isSender: true,
    },
    {
      id: 3,
      user: "Olivia",
      avatar: "/images/users/user31.jpg",
      message:
        "Yeah, that's the one! It's got a sleek Material Design, and the features are pretty robust.",
      time: "09:20 AM",
      isSender: false,
    },
    {
      id: 4,
      user: "You",
      avatar: "",
      message: "Nice! What features are you finding?",
      time: "09:21 AM",
      isSender: true,
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        user: "You",
        avatar: "",
        message: inputValue,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSender: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const dropdownOptions = ["View", "Delete", "Block", "Report"];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Chat</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
              <i className="ri-more-fill"></i>
            </MenuButton>

            <MenuItems
              transition
              className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {dropdownOptions.map((option) => (
                <MenuItem
                  key={option}
                  as="div"
                  className="block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  onClick={() => console.log(`Selected option: ${option}`)}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>

      <div className="trezo-card-content">
        <div className="chat-body h-[199px] overflow-y-scroll ltr:-mr-[25px] rtl:-ml-[25px] rotate-180">
          <ul className="flex-col-reverse flex ltr:pl-[25px] rtl:pr-[25px] justify-end">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`relative rotate-180 ${
                  msg.isSender
                    ? "w-full md:w-[90%] ltr:text-right md:rtl:text-left md:ltr:mr-auto rtl:ml-auto"
                    : "ltr:pl-[45px] rtl:pr-[45px] w-full md:w-[90%]"
                }`}
              >
                {!msg.isSender && (
                  <Image
                    src={msg.avatar}
                    width={35}
                    height={35}
                    alt={msg.user}
                    className="rounded-full top-0 ltr:left-0 rtl:right-0 absolute"
                  />
                )}
                <div
                  className={
                    msg.isSender
                      ? "ltr:text-right rtl:text-left"
                      : "ltr:text-left rtl:text-right"
                  }
                >
                  <div className="mb-[5px] last:mb-0">
                    <p
                      className={`py-[8px] px-[15px] inline-block ${
                        msg.isSender
                          ? "bg-primary-500 text-white ltr:rounded-l-md rtl:rounded-l-md"
                          : "bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md"
                      } text-sm`}
                    >
                      {msg.message}
                    </p>
                  </div>
                </div>
                <span
                  className={`block text-xs ${
                    msg.isSender
                      ? "ltr:text-right rtl:text-left"
                      : "ltr:text-left rtl:text-right"
                  } mb-[13px] mt-[6px]`}
                >
                  {msg.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:flex gap-[15px]">
          <div className="relative flex gap-[8px] items-center top-[2px]">
            <button
              className="inline-block transition-all hover:text-primary-500"
              type="button"
            >
              <i className="material-symbols-outlined !text-md">
                sentiment_satisfied
              </i>
            </button>
            <button
              className="inline-block transition-all hover:text-primary-500"
              type="button"
            >
              <i className="material-symbols-outlined !text-md">attach_file</i>
            </button>
          </div>
          <div className="relative mt-[15px] md:mt-0 flex-auto">
            <input
              type="text"
              className="block text-sm w-full rounded-md bg-gray-50 dark:bg-[#15203c] px-[15px] h-[45px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
              placeholder="Write your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              type="submit"
              className="absolute ltr:right-[15px] rtl:left-[15px] transition-all hover:text-primary-500 top-1/2 -translate-y-1/2 mt-[2px]"
              onClick={handleSendMessage}
            >
              <i className="material-symbols-outlined !text-[20px]">send</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
