"use client";

import React from "react";
import Image from "next/image";

interface LabReport {
  id: number;
  fileName: string;
  fileType: "pdf" | "jpg" | "doc" | "png";
  submittedBy: string;
}

const RecentLabReports: React.FC = () => {
  const labReports: LabReport[] = [
    {
      id: 1,
      fileName: "Blood Report.pdf",
      fileType: "pdf",
      submittedBy: "Andrew",
    },
    {
      id: 2,
      fileName: "X-ray Report.jpg",
      fileType: "jpg",
      submittedBy: "Joanna",
    },
    {
      id: 3,
      fileName: "Creatinine Report.pdf",
      fileType: "pdf",
      submittedBy: "David",
    },
    {
      id: 4,
      fileName: "Blood Report.pdf",
      fileType: "pdf",
      submittedBy: "Zinia",
    },
    {
      id: 5,
      fileName: "ECG Report.doc",
      fileType: "doc",
      submittedBy: "Bella",
    },
    {
      id: 6,
      fileName: "Blood Report.pdf",
      fileType: "pdf",
      submittedBy: "Jonathon",
    },
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "/images/icons/pdf.png";
      case "jpg":
      case "png":
        return "/images/icons/jpg.png";
      case "doc":
        return "/images/icons/doc.png";
      default:
        return "/images/icons/doc.png";
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Recent Lab Reports</h5>
        </div>
      </div>
      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <tbody className="text-black dark:text-white">
              {labReports.map((report) => (
                <tr key={report.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.4px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[28px]">
                        <Image
                          src={getFileIcon(report.fileType)}
                          className="inline-block"
                          alt="file-icon"
                          width={28}
                          height={28}
                        />
                      </div>
                      <div>
                        <span className="font-semibold inline-block mb-px">
                          {report.fileName}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          submitted by{" "}
                          <span className="text-black dark:text-white">
                            {report.submittedBy}
                          </span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <button
                      type="button"
                      className="lh-1 inline-block text-primary-500 text-[20px]"
                    >
                      <i className="ri-download-2-line"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentLabReports;
