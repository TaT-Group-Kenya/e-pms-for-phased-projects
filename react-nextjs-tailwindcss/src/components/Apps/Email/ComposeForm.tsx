"use client";

import { useState } from "react";
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

const ComposeForm: React.FC = () => {
  const [value, setValue] = useState<string>("Type your message here...");

  function onChange(e: ContentEditableEvent) {
    setValue(e.target.value);
  }

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[15px] md:pb-[20px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-md !font-semibold">New Message</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <form>
            <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  To
                </label>
                <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                  <option value="0">Select</option>
                  <option value="1">james&#64;trezo.com</option>
                  <option value="2">andy&#64;trezo.com</option>
                  <option value="3">mateo&#64;trezo.com</option>
                  <option value="4">luca&#64;trezo.com</option>
                  <option value="5">tomato&#64;trezo.com</option>
                </select>
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Cc
                </label>
                <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                  <option value="0">Select</option>
                  <option value="1">james&#64;trezo.com</option>
                  <option value="2">andy&#64;trezo.com</option>
                  <option value="3">mateo&#64;trezo.com</option>
                  <option value="4">luca&#64;trezo.com</option>
                  <option value="5">tomato&#64;trezo.com</option>
                </select>
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Bcc
                </label>
                <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                  <option value="0">Select</option>
                  <option value="1">james&#64;trezo.com</option>
                  <option value="2">andy&#64;trezo.com</option>
                  <option value="3">mateo&#64;trezo.com</option>
                  <option value="4">luca&#64;trezo.com</option>
                  <option value="5">tomato&#64;trezo.com</option>
                </select>
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Subject
                </label>
                <input
                  type="text"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Write your subject..."
                />
              </div>

              <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Your Email
                </label>

                <EditorProvider>
                  <Editor
                    value={value}
                    onChange={onChange}
                    style={{ minHeight: "255px" }}
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
              </div>
            </div>

            <div className="mt-[20px] md:mt-[25px] sm:flex items-center justify-between">
              <div className="flex items-center gap-[10px] md:gap-[15px]">
                <button
                  type="submit"
                  className="inline-block font-semibold md:text-md bg-primary-500 text-white transition-all hover:bg-primary-600 rounded-md py-[8px] px-[15px] md:px-[25px] md:mr-[4px]"
                >
                  Send
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    text_fields_alt
                  </i>
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    attach_file
                  </i>
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    link
                  </i>
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    mood
                  </i>
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    add_to_drive
                  </i>
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    add_photo_alternate
                  </i>
                </button>
                <button
                  type="button"
                  className="inline-block relative top-[2px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined !text-[18px] md:!text-[20px]">
                    ink_pen
                  </i>
                </button>
              </div>

              <button className="inline-block relative text-danger-500 mt-[12px] sm:mt-0">
                <i className="material-symbols-outlined !text-[20px]">delete</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ComposeForm;
