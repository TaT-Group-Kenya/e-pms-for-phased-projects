"use client";

import React from "react";
import Image from "next/image";

// Speaker interface to define the type
interface Speaker {
  name: string;
  imageUrl: string;
  topic: string;
}

const speakersData: Speaker[] = [
  {
    name: "Sarah Johnson",
    imageUrl: "/images/users/user1.jpg",
    topic: "Opening Keynote",
  },
  {
    name: "Russell Colon",
    imageUrl: "/images/users/user2.jpg",
    topic: "Panel Discussion: Future Trends",
  },
  {
    name: "Cynthia Baggett",
    imageUrl: "/images/users/user3.jpg",
    topic: "Interactive Workshops",
  },
  {
    name: "Raymond Nguyen",
    imageUrl: "/images/users/user4.jpg",
    topic: "Networking Reception",
  },
];

const Speakers: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Speakers</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Speaker
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Topic
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {speakersData.map((speaker, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <Image
                          src={speaker.imageUrl}
                          className="rounded-md w-[40px]"
                          alt="user-image"
                          width={40}
                          height={40}
                        />
                        <span className="font-medium block ltr:ml-[12px] rtl:mr-[12px]">
                          {speaker.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {speaker.topic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Speakers;
