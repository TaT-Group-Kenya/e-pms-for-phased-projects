"use client";

import React, { useState, useEffect } from "react";

interface Attachment {
  id: number;
  name: string;
  size: string;
}

const Attachments: React.FC = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulated API call (replace with actual API fetch)
    setTimeout(() => {
      setAttachments([
        {
          id: 1,
          name: "Project_attachment_1.zip",
          size: "3.25 MB",
        },
        {
          id: 2,
          name: "Project_attachment_2.zip",
          size: "5.12 MB",
        },
        {
          id: 3,
          name: "Project_attachment_3.zip",
          size: "4.75 MB",
        },
        {
          id: 4,
          name: "Project_attachment_4.zip",
          size: "3.43 MB",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Attachments</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Loading attachments...
            </p>
          ) : (
            <ul>
              {attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="rounded-md flex justify-between items-center bg-gray-50 dark:bg-[#15203c] p-[15px] mb-[10px] last:mb-0"
                >
                  <div className="flex items-center">
                    <div className="bg-white dark:bg-[#0c1427] text-primary-500 rounded-full text-center leading-[40px] text-[22px] w-[40px] h-[40px]">
                      <i className="ri-file-warning-line"></i>
                    </div>
                    <div className="ltr:ml-[12px] rtl:mr-[12px]">
                      <h6 className="!text-base !mb-[3px] !font-medium">
                        {attachment.name}
                      </h6>
                      <span className="block text-sm">{attachment.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="leading-none text-primary-500 text-[22px]"
                  >
                    <i className="ri-download-2-line"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Attachments;
