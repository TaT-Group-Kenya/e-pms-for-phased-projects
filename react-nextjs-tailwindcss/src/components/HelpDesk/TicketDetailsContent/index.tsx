"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Editor,
  EditorProvider,
  ContentEditableEvent,
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import Attachments from "./Attachments";

const TicketDetailsContent: React.FC = () => {
  // Text Editor
  const [value, setValue] = useState<string>("Type your message here...");

  function onChange(e: ContentEditableEvent) {
    setValue(e.target.value);
  }

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Ticket Title
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Requester
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Assigned To
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Created Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Due Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Priority
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                <tr>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      #JAN-854
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <div className="inline-block font-medium transition-all text-gray-500 dark:text-gray-400 hover:text-primary-500">
                      Network Infrastructure
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    Walter Frazier
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    Oliver Clark
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      20 Apr 2024
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      30 Apr 2024
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      High
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="px-[8px] py-[3px] inline-block bg-primary-50 dark:bg-[#15203c] text-primary-500 rounded-sm font-medium text-xs">
                      Finished
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                    >
                      <i className="material-symbols-outlined !text-md">edit</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content">
              <h6 className="!text-[15px] [&:not(:first-child)]:!mt-[20px]">
                Ticket Description
              </h6>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>

              <h6 className="!text-[15px] [&:not(:first-child)]:!mt-[20px]">
                Network Infrastructure for Trezo
              </h6>

              <ul className="list-disc my-[15px] ltr:pl-[32px] rtl:pr-[32px]">
                <li className="leading-[1.8] mb-[5px] last:mb-0">
                  Login Issues
                </li>
                <li className="leading-[1.8] mb-[5px] last:mb-0">
                  Cloud Migration
                </li>
                <li className="leading-[1.8] mb-[5px] last:mb-0">
                  Website Revamp
                </li>
                <li className="leading-[1.8] mb-[5px] last:mb-0">
                  Mobile Application
                </li>
                <li className="leading-[1.8] mb-[5px] last:mb-0">
                  System Deployment
                </li>
              </ul>

              <h6 className="!text-[15px] [&:not(:first-child)]:!mt-[20px]">
                Here is the Code:
              </h6>

              <code className="p-[15px] md:p-[20px] block mt-[15px] bg-[#f5f2f0] dark:bg-[#15203c] text-[.875em] break-words text-[#d63384]">
                &lt;
                <span className="text-[#905] ltr:mr-[5px] rtl:ml-[5px]">
                  span
                </span>
                <span className="text-[#690]">class</span>=
                <span className="text-[#07a]">
                  &quot;material-symbols-outlined&quot;
                </span>
                &gt;search&lt;/<span className="text-[#905]">span</span>&gt;
              </code>
            </div>
          </div>

          {/* Comments */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content">
              <ul>
                <li className="border-b border-gray-100 dark:border-[#172036] mb-[20px] md:mb-[25px] pb-[20px] md:pb-[25px] ltr:pl-[20px] rtl:pr-[20px] ltr:md:pl-[25px] rtl:md:pr-[25px] ltr:first:pl-0 rtl:first:pr-0 first:border-primary-500 last:border-0 last:pb-0 last:mb-0">
                  <div className="sm:flex items-center gap-[15px] mb-[12px]">
                    <div className="flex items-center">
                      <Image
                        src="/images/users/user6.jpg"
                        width={30}
                        height={30}
                        alt="user-image"
                        className="rounded-full ltr:mr-[10px] rtl:ml-[10px]"
                      />
                      <span className="block font-medium text-primary-500">
                        Ponsiano
                      </span>
                    </div>
                    <span className="block my-[10px] sm:my-0">a day ago</span>
                    <span className="inline-block bg-primary-500 text-white rounded-[4px] py-[2px] px-[8px] font-medium text-xs">
                      #BD0JL0G6
                    </span>
                  </div>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                  <h6 className="!text-[15px] !mb-[12px]">Screenshots</h6>
                  <div className="-mb-[15px]">
                    <Image
                      src="/images/courses/course1.jpg"
                      alt="screenshot-image"
                      className="rounded-md inline-block w-[80px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px] ltr:last:mr-0 rtl:last:ml-0"
                      width={80}
                      height={80}
                    />
                  </div>
                </li>
        
                <li className="border-b border-gray-100 dark:border-[#172036] mb-[20px] md:mb-[25px] pb-[20px] md:pb-[25px] ltr:pl-[20px] rtl:pr-[20px] ltr:md:pl-[25px] rtl:md:pr-[25px] ltr:first:pl-0 rtl:first:pr-0 first:border-primary-500 last:border-0 last:pb-0 last:mb-0">
                  <div className="sm:flex items-center gap-[15px] mb-[12px]">
                    <div className="flex items-center">
                      <Image
                        src="/images/users/user7.jpg"
                        width={30}
                        height={30}
                        alt="user-image"
                        className="rounded-full ltr:mr-[10px] rtl:ml-[10px]"
                      />
                      <span className="block font-medium text-danger-500">
                        Zelxa
                      </span>
                    </div>
                    <span className="block my-[10px] sm:my-0">
                      18 hours ago
                    </span>
                    <span className="inline-block bg-secondary-500 text-white rounded-[4px] py-[2px] px-[8px] font-medium text-xs">
                      Support Staff
                    </span>
                  </div>
                  <p>
                    It was popularised in the 1960s with the release of Letraset
                    sheets containing Lorem Ipsum passages, and more recently
                    with desktop publishing software like Aldus PageMaker
                    including versions of Lorem Ipsum.
                  </p>

                  <h6 className="!text-[15px] !mb-[12px]">Screenshots</h6>
                  <div className="-mb-[15px]">
                    <Image
                      src="/images/products/product1.jpg"
                      alt="screenshot-image"
                      className="rounded-md inline-block w-[80px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px] ltr:last:mr-0 rtl:last:ml-0"
                      width={80}
                      height={80}
                    />
                    <Image
                      src="/images/products/product2.jpg"
                      alt="screenshot-image"
                      className="rounded-md inline-block w-[80px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px] ltr:last:mr-0 rtl:last:ml-0"
                      width={80}
                      height={80}
                    />
                  </div>
                </li>
                <li className="border-b border-gray-100 dark:border-[#172036] mb-[20px] md:mb-[25px] pb-[20px] md:pb-[25px] ltr:pl-[20px] rtl:pr-[20px] ltr:md:pl-[25px] rtl:md:pr-[25px] ltr:first:pl-0 rtl:first:pr-0 first:border-primary-500 last:border-0 last:pb-0 last:mb-0">
                  <div className="sm:flex items-center gap-[15px] mb-[12px]">
                    <div className="flex items-center">
                      <Image
                        src="/images/users/user6.jpg"
                        width={30}
                        height={30}
                        alt="user-image"
                        className="rounded-full ltr:mr-[10px] rtl:ml-[10px]"
                      />
                      <span className="block font-medium text-primary-500">
                        Ponsiano
                      </span>
                    </div>
                    <span className="block my-[10px] sm:my-0">
                      12 hours ago
                    </span>
                  </div>
                  <p>
                    It has survived not only five centuries, but also the leap
                    into electronic typesetting, remaining essentially
                    unchanged.
                  </p>
                </li>
                <li className="border-b border-gray-100 dark:border-[#172036] mb-[20px] md:mb-[25px] pb-[20px] md:pb-[25px] ltr:pl-[20px] rtl:pr-[20px] ltr:md:pl-[25px] rtl:md:pr-[25px] ltr:first:pl-0 rtl:first:pr-0 first:border-primary-500 last:border-0 last:pb-0 last:mb-0">
                  <div className="sm:flex items-center gap-[15px] mb-[12px]">
                    <div className="flex items-center">
                      <Image
                        src="/images/users/user7.jpg"
                        width={30}
                        height={30}
                        alt="user-image"
                        className="rounded-full ltr:mr-[10px] rtl:ml-[10px]"
                      />
                      <span className="block font-medium text-danger-500">
                        Zelxa
                      </span>
                    </div>
                    <span className="block my-[10px] sm:my-0">
                      05 hours ago
                    </span>
                    <span className="inline-block bg-secondary-500 text-white rounded-[4px] py-[2px] px-[8px] font-medium text-xs">
                      Support Staff
                    </span>
                  </div>
                  <p>
                    The standard chunk of Lorem Ipsum used since the 1500s is
                    reproduced below for those interested. Sections 1.10.32 and
                    1.10.33 from de Finibus Bonorum et Malorum by Cicero are
                    also reproduced in their exact original form, accompanied by
                    English versions from the 1914 translation.
                  </p>
                </li>
              </ul>

              <form className="mt-[20px] md:mt-[25px]">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Post A Reply
                </label>

                <EditorProvider>
                  <Editor
                    value={value}
                    onChange={onChange}
                    style={{ minHeight: "200px" }}
                    className="rsw-editor"
                  >
                    <Toolbar>
                      <BtnUndo />
                      <BtnRedo />
                      <Separator />
                      <BtnBold />
                      <BtnItalic />
                      <BtnUnderline />
                      <BtnStrikeThrough />
                      <Separator />
                      <BtnNumberedList />
                      <BtnBulletList />
                      <Separator />
                      <BtnLink />
                      <BtnClearFormatting />
                      <HtmlButton />
                      <Separator />
                      <BtnStyles />
                    </Toolbar>
                  </Editor>
                </EditorProvider>

                <div className="mt-[20px] md:mt-[25px]">
                  <button
                    type="button"
                    className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400 ltr:mr-[15px] rtl:ml-[15px]"
                  >
                    Save As Draft
                  </button>

                  <button
                    type="button"
                    className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
                  >
                    <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                      <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                        send
                      </i>
                      Submit Now
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Attachments />
        </div>
      </div>
    </>
  );
};

export default TicketDetailsContent;
