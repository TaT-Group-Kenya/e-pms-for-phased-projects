"use client";

import React, { useMemo } from "react";

interface ProjectPhase {
  id: number;
  name: string;
  progress_percentage?: number;
  status?: string;
}

interface ProjectInvoice {
  id: number;
  amount?: number;
  status?: string;
}

interface ProjectDetailsData {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
  no_of_phases?: number;
  phases?: ProjectPhase[];
  customer_invoices?: ProjectInvoice[];
  company_invoices?: ProjectInvoice[];
}

interface ProjectOverviewProps {
  project?: ProjectDetailsData | null;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const overviewData = useMemo(() => {
    if (!project) {
      return {
        totalHours: "N/A",
        totalPhases: 0,
        customerInvoices: 0,
        companyInvoices: 0,
        totalInvoices: 0,
        totalDays: "N/A",
      };
    }

    // Calculate total days from start_date and end_date
    let totalDays = "N/A";
    if (project.start_date && project.end_date) {
      const daysCount = Math.ceil(
        (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
      );
      totalDays = daysCount.toString();
    }

    // Calculate total hours (24 hours per day as estimate)
    let totalHours = "N/A";
    if (totalDays !== "N/A") {
      totalHours = (parseInt(totalDays) * 24).toString();
    }

    // Get actual counts from arrays
    const totalPhases = project.phases ? project.phases.length : 0;
    const customerInvoices = project.customer_invoices ? project.customer_invoices.length : 0;
    const companyInvoices = project.company_invoices ? project.company_invoices.length : 0;
    const totalInvoices = customerInvoices + companyInvoices;

    return {
      totalHours,
      totalPhases,
      customerInvoices,
      companyInvoices,
      totalInvoices,
      totalDays,
    };
  }, [project]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Project Overview</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
            <div>
              <div className="bg-orange-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-orange-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">
                      local_cafe
                    </i>
                  </div>
                  <div>
                    <span className="block">Total Phases</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">{overviewData.totalPhases}</h5>
                  </div>
                </div>
                <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                  <span className="block text-sm">Number of project phases</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-success-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-success-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">
                      door_open
                    </i>
                  </div>
                  <div>
                    <span className="block">Total Days</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">{overviewData.totalDays}</h5>
                  </div>
                </div>
                <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                  <span className="block text-sm">Project duration in days</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-purple-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-purple-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">receipt_long</i>
                  </div>
                  <div>
                    <span className="block">Customer Invoices</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">{overviewData.customerInvoices}</h5>
                  </div>
                </div>
                
                <div className="mt-[14px] flex items-center justify-between">
                  <span className="block text-sm">To customers</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-indigo-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-indigo-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">business</i>
                  </div>
                  <div>
                    <span className="block">Company Invoices</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">{overviewData.companyInvoices}</h5>
                  </div>
                </div>
                
                <div className="mt-[14px] flex items-center justify-between">
                  <span className="block text-sm">From vendors/suppliers</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectOverview;
