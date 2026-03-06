"use client";

import { useState } from "react";
import type { UserProfile } from "../../store/auth/slice";

type AccountSettingsFormProps = {
  user: UserProfile | null;
  onSubmit?: (payload: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  }) => Promise<void> | void;
};

const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({ user, onSubmit }) => {
  const [firstName, setFirstName] = useState<string>(user?.first_name || "");
  const [middleName, setMiddleName] = useState<string>(user?.middle_name || "");
  const [lastName, setLastName] = useState<string>(user?.last_name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        first_name: firstName.trim(),
        middle_name: middleName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("update profile error", err);
      setError(err?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h5 className="!text-lg !mb-[6px]">Profile</h5>
        <p className="mb-[20px] md:mb-[25px]">
          Update your basic profile information below.
        </p>

        {error && (
          <div className="mb-[15px] text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="sm:grid sm:grid-cols-3 sm:gap-[25px]">
          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              First Name
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Middle Name
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Last Name
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-[20px]">
          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Email Address
            </label>
            <input
              type="email"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-[20px] md:mt-[25px] flex gap-[10px]">
          <button
            type="reset"
            disabled={submitting}
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-gray-200 text-black dark:bg-[#172036] dark:text-white hover:bg-gray-300 dark:hover:bg-[#1f2937] disabled:opacity-60"
            onClick={() => {
              setFirstName(user?.first_name || "");
              setMiddleName(user?.middle_name || "");
              setLastName(user?.last_name || "");
              setEmail(user?.email || "");
              setError(null);
            }}
          >
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-60"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                check
              </i>
              {submitting ? "Updating..." : "Update Profile"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsForm;
