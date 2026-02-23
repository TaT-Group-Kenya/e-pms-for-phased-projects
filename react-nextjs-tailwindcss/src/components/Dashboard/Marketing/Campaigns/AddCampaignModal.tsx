"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import CampaignDetails from "./CampaignDetails";
import CreativeUploads from "./CreativeUploads";
import ConfigureAudiences from "./ConfigureAudiences";
import BudgetsEstimates from "./BudgetsEstimates";
import Conpleted from "./Conpleted";

const AddCampaignModal: React.FC = () => {
  // Modal state
  const [open, setOpen] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState(0);

  // Total number of tabs
  const totalTabs = 5;

  // Handle tab navigation
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // Handle Back button click
  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  // Handle Continue button click
  const handleContinue = () => {
    if (activeTab < totalTabs - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  return (
    <>
      <button
        type="button"
        className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
          <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
            add
          </i>
          Add Campaign
        </span>
      </button>

      {/* Add New Task Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1320px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] lg:p-[50px]">
                <div className="trezo-card-header mb-[20px] md:mb-[25px] lg:mb-[56px] flex items-center justify-between">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0 lg:!text-xl">Create Campaign</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[28px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content mx-auto lg:max-w-[835px]">
                  <div className="trezo-tabs" id="trezo-tabs">
                    <ul className="navs mb-[20px] md:mb-[30px] lg:mb-[50px] text-center">
                      {[...Array(totalTabs)].map((_, index) => (
                        <li
                          key={index}
                          className="nav-item inline-block mb-[10px] md:mb-0 mx-[10px] md:mx-[15px] lg:mx-[23px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
                        >
                          <button
                            onClick={() => handleTabClick(index)}
                            className={`nav-link block lg:tracking-[2px] text-xs uppercase font-medium pb-[5px] md:pb-[10px] transition-all relative ${
                              activeTab === index ? "active" : ""
                            }`}
                          >
                            {
                              [
                                "CAMPAIGN DETAILS",
                                "CREATIVE UPLOADS",
                                "AUDIENCES",
                                "BUDGET ESTIMATES",
                                "COMPLETED",
                              ][index]
                            }
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="md:px-[16px] lg:px-[85px]">
                      {activeTab === 0 && <CampaignDetails />}
                      {activeTab === 1 && <CreativeUploads />}
                      {activeTab === 2 && <ConfigureAudiences />}
                      {activeTab === 3 && <BudgetsEstimates />}
                      {activeTab === 4 && <Conpleted />}

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={activeTab === 0}
                          className={`inline-block md:text-md font-medium bg-gray-600 text-white rounded-[7px] py-[8px] px-[19px] transition-all ${
                            activeTab === 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-[5px]">
                            <i className="ri-arrow-left-line"></i>
                            Back
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleContinue}
                          disabled={activeTab === totalTabs - 1}
                          className={`inline-block md:text-md font-medium bg-primary-500 text-white rounded-[7px] py-[8px] px-[19px] transition-all ${
                            activeTab === totalTabs - 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-primary-400"
                          }`}
                        >
                          <span className="flex items-center gap-[5px]">
                            Continue
                            <i className="ri-arrow-right-line"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddCampaignModal;
