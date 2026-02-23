"use client";

import React from "react";
import Image from "next/image";

const CreatePost: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px] last:mb-0">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Create Post</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <textarea
            className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
            placeholder="It makes me feel..."
          ></textarea>

          <div className="sm:flex items-center mt-[20px] md:mt-[25px] gap-[25px]">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[27px] bg-primary-500 text-white hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 !text-[20px]">
                  send
                </i>
                Publish Post
              </span>
            </button>
            <div className="flex items-center gap-[15px] mt-[15px] sm:mt-0">
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  sentiment_satisfied
                </i>
              </button>
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  attach_file
                </i>
              </button>
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  mic_none
                </i>
              </button>
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">image</i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px] last:mb-0">
        <div className="trezo-card-header pb-[18px] mb-[20px] flex items-center justify-between border-b border-gray-100 dark:border-[#172036]">
          <div className="trezo-card-title flex items-center">
            <Image
              src="/images/users/user6.jpg"
              alt="user-image"
              className="rounded-full w-[50px]"
              width={50}
              height={50}
            />
            <div className="ltr:ml-[12px] rtl:mr-[12px]">
              <span className="block text-black dark:text-white font-semibold">
                Cynthia Baggett
              </span>
              <span className="block mt-[2px]">05 mins ago</span>
            </div>
          </div>

          <div className="trezo-card-subtitle">
            <div className="trezo-card-dropdown relative">
              <button
                type="button"
                className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500"
                id="dropdownToggleBtn"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Save Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Hide Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Report Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Block Cynthia
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <p>
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions.
          </p>

          <div className="sm:flex items-center gap-[30px] mt-[20px] py-[15px] border-y border-gray-100 dark:border-[#172036]">
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                thumb_up
              </i>
              10 Likes
            </button>
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                chat_bubble_outline
              </i>
              0 Comments
            </button>
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                share
              </i>
              0 Share
            </button>
          </div>

          <div className="mt-[20px] md:flex items-center gap-[20px]">
            <div className="w-[55px]">
              <Image
                src="/images/profile.jpg"
                alt="profile-image"
                className="rounded-full"
                width={55}
                height={55}
              />
            </div>
            <div className="relative mt-[15px] md:mt-0 md:ltr:pr-[70px] md:rtl:pl-[70px] flex-auto">
              <input
                type="text"
                className="block w-full rounded-md bg-white dark:bg-[#0c1427] px-[17px] h-[55px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0 border border-gray-200 dark:border-[#172036]"
                placeholder="Type something...."
              />
              <button
                type="submit"
                className="md:absolute flex items-center justify-center ltr:right-0 rtl:left-0 rounded-sm transition-all bg-primary-500 text-white hover:bg-primary-400 md:top-1/2 md:-translate-y-1/2 w-[55px] h-[55px] mt-[15px] md:mt-0"
              >
                <i className="material-symbols-outlined">send</i>
              </button>
            </div>
            <div className="flex items-center gap-[15px] mt-[15px] sm:mt-0">
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  sentiment_satisfied
                </i>
              </button>
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  attach_file
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px] last:mb-0">
        <div className="trezo-card-header pb-[18px] mb-[20px] flex items-center justify-between border-b border-gray-100 dark:border-[#172036]">
          <div className="trezo-card-title flex items-center">
            <Image
              src="/images/users/user7.jpg"
              alt="user-image"
              className="rounded-full w-[50px]"
              width={50}
              height={50}
            />
            <div className="ltr:ml-[12px] rtl:mr-[12px]">
              <span className="block text-black dark:text-white font-semibold">
                Douglas Hairston
              </span>
              <span className="block mt-[2px]">1 hour ago</span>
            </div>
          </div>

          <div className="trezo-card-subtitle">
            <div className="trezo-card-dropdown relative">
              <button
                type="button"
                className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500"
                id="dropdownToggleBtn"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Save Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Hide Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Report Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Block Douglas
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          <p>
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of lorem
            ipsum.
          </p>
          <div className="sm:flex items-center gap-[30px] mt-[20px] py-[15px] border-y border-gray-100 dark:border-[#172036]">
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                thumb_up
              </i>
              42 Likes
            </button>
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                chat_bubble_outline
              </i>
              2 Comments
            </button>
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                share
              </i>
              1 Share
            </button>
          </div>

          <div className="mt-[20px] md:flex items-center gap-[20px]">
            <div className="w-[55px]">
              <Image
                src="/images/profile.jpg"
                alt="profile-image"
                className="rounded-full"
                width={55}
                height={55}
              />
            </div>
            <div className="relative mt-[15px] md:mt-0 md:ltr:pr-[70px] md:rtl:pl-[70px] flex-auto">
              <input
                type="text"
                className="block w-full rounded-md bg-white dark:bg-[#0c1427] px-[17px] h-[55px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0 border border-gray-200 dark:border-[#172036]"
                placeholder="Type something...."
              />
              <button
                type="submit"
                className="md:absolute flex items-center justify-center ltr:right-0 rtl:left-0 rounded-sm transition-all bg-primary-500 text-white hover:bg-primary-400 md:top-1/2 md:-translate-y-1/2 w-[55px] h-[55px] mt-[15px] md:mt-0"
              >
                <i className="material-symbols-outlined">send</i>
              </button>
            </div>
            <div className="flex items-center gap-[15px] mt-[15px] sm:mt-0">
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  sentiment_satisfied
                </i>
              </button>
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  attach_file
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px] last:mb-0">
        <div className="trezo-card-header pb-[18px] mb-[20px] flex items-center justify-between border-b border-gray-100 dark:border-[#172036]">
          <div className="trezo-card-title flex items-center">
            <Image
              src="/images/users/user8.jpg"
              alt="user-image"
              className="rounded-full w-[50px]"
              width={50}
              height={50}
            />
            <div className="ltr:ml-[12px] rtl:mr-[12px]">
              <span className="block text-black dark:text-white font-semibold">
                Olivia John
              </span>
              <span className="block mt-[2px]">1 day ago</span>
            </div>
          </div>
          <div className="trezo-card-subtitle">
            <div className="trezo-card-dropdown relative">
              <button
                type="button"
                className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500"
                id="dropdownToggleBtn"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Save Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Hide Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Report Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Block Olivia
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
          <div className="sm:flex items-center gap-[30px] mt-[20px] py-[15px] border-y border-gray-100 dark:border-[#172036]">
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                thumb_up
              </i>
              100 Likes
            </button>
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                chat_bubble_outline
              </i>
              16 Comments
            </button>
            <button
              type="button"
              className="block relative ltr:pl-[25px] rtl:pr-[25px] transition-all hover:text-primary-500 mt-[10px] first:mt-0 sm:mt-0"
            >
              <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                share
              </i>
              5 Share
            </button>
          </div>

          <div className="mt-[20px] md:flex items-center gap-[20px]">
            <div className="w-[55px]">
              <Image
                src="/images/profile.jpg"
                alt="profile-image"
                className="rounded-full"
                width={55}
                height={55}
              />
            </div>
            <div className="relative mt-[15px] md:mt-0 md:ltr:pr-[70px] md:rtl:pl-[70px] flex-auto">
              <input
                type="text"
                className="block w-full rounded-md bg-white dark:bg-[#0c1427] px-[17px] h-[55px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0 border border-gray-200 dark:border-[#172036]"
                placeholder="Type something...."
              />
              <button
                type="submit"
                className="md:absolute flex items-center justify-center ltr:right-0 rtl:left-0 rounded-sm transition-all bg-primary-500 text-white hover:bg-primary-400 md:top-1/2 md:-translate-y-1/2 w-[55px] h-[55px] mt-[15px] md:mt-0"
              >
                <i className="material-symbols-outlined">send</i>
              </button>
            </div>

            <div className="flex items-center gap-[15px] mt-[15px] sm:mt-0">
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  sentiment_satisfied
                </i>
              </button>
              <button
                type="button"
                className="transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  attach_file
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
