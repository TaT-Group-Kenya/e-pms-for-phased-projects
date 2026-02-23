"use client";

import React from "react";

const PrivacyPolicyContent: React.FC = () => {
  return (
    <div>
      <h5 className="!text-lg !mb-[20px]">Security :</h5>

      <span className="block text-black dark:text-white font-semibold mb-[10px] mt-[20px]">
        Two-factor Authentication
      </span>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry standard dummy text ever
        since the 1500s, when an unknown printer took a galley of.
      </p>

      <span className="block text-black dark:text-white font-semibold mb-[10px] mt-[20px]">
        Secondary Verification
      </span>
      <p>
        It has survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged. It was
        popularised in the 1960s with the release of Letraset sheets containing.
      </p>

      <span className="block text-black dark:text-white font-semibold mb-[10px] mt-[20px]">
        Backup Codes
      </span>
      <p>
        Lorem Ipsum passages, and more recently with desktop publishing software
        like Aldus PageMaker including versions of lorem ipsum.
      </p>
      <span className="block text-black dark:text-white font-semibold mb-[10px] mt-[20px]">
        Desktop, Email, Chat, Purchase Notifications
      </span>
      <p>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters.
      </p>

      <span className="block text-black dark:text-white font-semibold mb-[10px] mt-[20px]">
        Delete This Account :
      </span>
      <p>
        There are many variations of passages of Lorem Ipsum available, but the
        majority have suffered alteration in some form, by injected humour, or
        randomised words which do not look even slightly believable.
      </p>

      <div className="mt-[20px]">
        <button
          type="button"
          className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
        >
          <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
            <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
              close
            </i>
            Close & Delete This Account
          </span>
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
