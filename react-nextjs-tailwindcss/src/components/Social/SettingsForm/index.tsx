"use client";

import { useState } from "react";
import Image from "next/image";

const SettingsForm: React.FC = () => {
  // Separate states for profile picture and cover photo
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleCoverPhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setCoverPhoto(event.target.files[0]);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
  };

  return (
    <>
      <form>
        <div className="xl:grid xl:grid-cols-5 2xl:grid-cols-3 gap-[25px]">
          <div className="xl:col-span-3 2xl:col-span-2">
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">Profile Settings</h5>
                </div>
              </div>
              <div className="trezo-card-content">
                <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="Alice"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="Johnson"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Email Address
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="johnson@trezo.com"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="+1 444 555 6699"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Password
                    </label>
                    <input
                      type="password"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Address
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="84 S. Arrowhead Court Branford"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Country
                    </label>
                    <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                      <option value="0">Select</option>
                      <option value="1">Switzerland</option>
                      <option value="2">New Zealand</option>
                      <option value="3">Germany</option>
                      <option value="4">United States</option>
                      <option value="5">Japan</option>
                      <option value="6">Netherlands</option>
                      <option value="7">Sweden</option>
                      <option value="8">Canada</option>
                      <option value="9">United Kingdom</option>
                      <option value="10">Australia</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Add Your Bio
                    </label>
                    <textarea
                      className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder=" It makes me feel..."
                    ></textarea>
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Who will be able to see your profile?
                    </label>
                    <div className="flex items-center gap-[15px]">
                      <div className="form-radio flex items-center gap-[5px]">
                        <input
                          type="radio"
                          className="cursor-pointer"
                          name="whoWillSeeMyProfile"
                          id="onlyMe"
                        />
                        <label
                          className="inline-block cursor-pointer"
                          htmlFor="onlyMe"
                        >
                          Only me
                        </label>
                      </div>
                      <div className="form-radio flex items-center gap-[5px]">
                        <input
                          type="radio"
                          className="cursor-pointer"
                          name="whoWillSeeMyProfile"
                          id="myFollowers"
                        />
                        <label
                          className="inline-block cursor-pointer"
                          htmlFor="myFollowers"
                        >
                          My followers
                        </label>
                      </div>
                      <div className="form-radio flex items-center gap-[5px]">
                        <input
                          type="radio"
                          className="cursor-pointer"
                          name="whoWillSeeMyProfile"
                          id="everyone"
                        />
                        <label
                          className="inline-block cursor-pointer"
                          htmlFor="everyone"
                        >
                          Everyone
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Your Skills
                    </label>
                    <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                      <option value="0">Select</option>
                      <option value="1">Leadership</option>
                      <option value="2">Project Management</option>
                      <option value="3">Data Analysis</option>
                      <option value="4">Teamwork</option>
                      <option value="5">Web Development</option>
                    </select>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Your Profession
                    </label>
                    <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                      <option value="0">Select</option>
                      <option value="1">Financial Manager</option>
                      <option value="2">IT Manager</option>
                      <option value="3">Software Developer</option>
                      <option value="4">Physician Assistant</option>
                      <option value="5">Data Scientist</option>
                    </select>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="Trezo Admin"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Company Website
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="http://website.com/"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Facebook
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="https://www.facebook.com/"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      X
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="https://x.com/"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Linkedin
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="https://www.linkedin.com/"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      YouTube
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      defaultValue="https://www.youtube.com/"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Profile Picture
                    </label>
                    <div id="fileUploader">
                      <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                        <div className="flex items-center justify-center">
                          <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                            <i className="ri-upload-2-line"></i>
                          </div>
                          <p className="leading-[1.5]">
                            <strong className="text-black dark:text-white">
                              Click to upload
                            </strong>
                            <br /> you file here
                          </p>
                        </div>
                        <input
                          type="file"
                          id="fileInput"
                          accept="image/*"
                          className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                          onChange={handleProfilePictureChange}
                        />
                      </div>

                      {/* Profile Picture Preview */}
                      {profilePicture && (
                        <div className="mt-[10px]">
                          <div className="relative w-[80px] h-[80px]">
                            <Image
                              src={URL.createObjectURL(profilePicture)}
                              alt="profile-preview"
                              width={80}
                              height={80}
                              className="rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                              onClick={handleRemoveProfilePicture}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      Cover Photo
                    </label>
                    <div id="fileUploader2">
                      <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                        <div className="flex items-center justify-center">
                          <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                            <i className="ri-upload-2-line"></i>
                          </div>
                          <p className="leading-[1.5]">
                            <strong className="text-black dark:text-white">
                              Click to upload
                            </strong>
                            <br /> you file here
                          </p>
                        </div>
                        <input
                          type="file"
                          id="fileInput2"
                          accept="image/*"
                          className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                          onChange={handleCoverPhotoChange}
                        />
                      </div>

                      {/* Cover Photo Preview */}
                      {coverPhoto && (
                        <div className="mt-[10px]">
                          <div className="relative w-[80px] h-[80px]">
                            <Image
                              src={URL.createObjectURL(coverPhoto)}
                              alt="cover-preview"
                              width={80}
                              height={80}
                              className="rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                              onClick={handleRemoveCoverPhoto}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-[20px] sm:mt-[25px]">
                  <button
                    type="button"
                    className="font-medium inline-block transition-all rounded-md 2xl:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="font-medium inline-block transition-all rounded-md 2xl:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
                  >
                    <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                      <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                        add
                      </i>
                      Save Information
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 2xl:col-span-1">
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">Privacy Policy</h5>
                </div>
              </div>
              <div className="trezo-card-content">
                <div className="mb-[20px] sm:mb-[25px]">
                  <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      id="allowUsersToShowYourEmail"
                    />
                    <label
                      htmlFor="allowUsersToShowYourEmail"
                      className="cursor-pointer"
                    >
                      Allow users to show your email
                    </label>
                  </div>

                  <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      id="allowUsersToShowYourExperiences"
                    />
                    <label
                      htmlFor="allowUsersToShowYourExperiences"
                      className="cursor-pointer"
                    >
                      Allow users to show your experiences
                    </label>
                  </div>

                  <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      id="allowUsersToShowYourFollowers"
                    />
                    <label
                      htmlFor="allowUsersToShowYourFollowers"
                      className="cursor-pointer"
                    >
                      Allow users to show your followers
                    </label>
                  </div>
                </div>

                <div className="mb-[20px] sm:mb-[25px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Who can tag you?
                  </label>
                  <div className="flex items-center gap-[15px]">
                    <div className="form-radio flex items-center gap-[5px]">
                      <input
                        type="radio"
                        className="cursor-pointer"
                        name="whoCanTagYou"
                        id="wctyOnlyMe"
                      />
                      <label
                        className="inline-block cursor-pointer"
                        htmlFor="wctyOnlyMe"
                      >
                        Everyone
                      </label>
                    </div>

                    <div className="form-radio flex items-center gap-[5px]">
                      <input
                        type="radio"
                        className="cursor-pointer"
                        name="whoCanTagYou"
                        id="wctyMyFollowers"
                      />
                      <label
                        className="inline-block cursor-pointer"
                        htmlFor="wctyMyFollowers"
                      >
                        Group Member
                      </label>
                    </div>
                  </div>
                </div>

                <span className="block font-medium mb-[7px] text-black dark:text-white">
                  Account Deletion Or Transfer
                </span>
                <p>
                  Transfer this account to another person or to a company
                  repositories.
                </p>

                <div className="mt-[20px] sm:mt-[25px]">
                  <button
                    type="button"
                    className="font-medium inline-block transition-all rounded-md 2xl:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
                  >
                    Delete Account
                  </button>

                  <button
                    type="button"
                    className="font-medium inline-block transition-all rounded-md 2xl:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
                  >
                    <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                      <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                        swap_horiz
                      </i>
                      Transfer Account
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SettingsForm;
