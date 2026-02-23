"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Define types for social links and team member data
interface SocialLink {
  icon: string;
  url: string;
  bgColor: string;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  socialLinks: SocialLink[];
}

const agents: Agent[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@trezo.com",
    phone: "(123) 456-7890",
    location: "74 Grim Avenue San Diego",
    image: "/images/users/user1.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 2,
    name: "Pauline Knott",
    email: "pauline@trezo.com",
    phone: "(987) 654-3210",
    location: "9 Paul Wayne Haggerty Road",
    image: "/images/users/user2.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 3,
    name: "James Combs",
    email: "james@trezo.com",
    phone: "(555) 258-1598",
    location: "61 Ottis Street Oklahoma City",
    image: "/images/users/user3.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 4,
    name: "Margaret Wade",
    email: "margaret@trezo.com",
    phone: "(431) 335-2321",
    location: "69 Leverton Cove Road Springfield",
    image: "/images/users/user4.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 5,
    name: "Mike Harris",
    email: "harris@trezo.com",
    phone: "(605) 823-8868",
    location: "30 Hartway Street Mclaughlin",
    image: "/images/users/user5.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 6,
    name: "Emily Jones",
    email: "emily@trezo.com",
    phone: "(617) 756-9911",
    location: "1654 Valley View Drive Brighton",
    image: "/images/users/user61.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 7,
    name: "Trent Heiser",
    email: "heiser@trezo.com",
    phone: "(507) 646-1869",
    location: "46 Trymore Road Northfield",
    image: "/images/users/user62.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 8,
    name: "Amiee Brown",
    email: "brown@trezo.com",
    phone: "(602) 525-5444",
    location: "79 Hall Street Las Vegas",
    image: "/images/users/user63.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 9,
    name: "Edward Lebouef",
    email: "lebouef@trezo.com",
    phone: "(337) 456-7858",
    location: "05 Sherwood Circle Lafayette",
    image: "/images/users/user64.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 10,
    name: "Marilyn Kelly",
    email: "marilyn@trezo.com",
    phone: "(864) 933-2339",
    location: "46 Brown Avenue Anderson",
    image: "/images/users/user65.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 11,
    name: "Gary Manes",
    email: "manes@trezo.com",
    phone: "(603) 258-7598",
    location: "75 Wildrose Lane Southfield",
    image: "/images/users/user66.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
  {
    id: 12,
    name: "Francis Berg",
    email: "francis@trezo.com",
    phone: "(651) 778-2290",
    location: "93 Park Boulevard Ottumwa",
    image: "/images/users/user67.jpg",
    socialLinks: [
      {
        icon: "ri-facebook-fill",
        url: "https://linkedin.com/",
        bgColor: "#3a559f",
      },
      {
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/",
        bgColor: "#03a9f4",
      },
      {
        icon: "ri-linkedin-fill",
        url: "https://facebook.com/",
        bgColor: "#007ab9",
      },
      {
        icon: "ri-whatsapp-line",
        url: "https://www.whatsapp.com/",
        bgColor: "#25d366",
      },
    ],
  },
];

const AgentsContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agents);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const agentsPerPage = 9;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.location.toLowerCase().includes(query)
    );
    setFilteredAgents(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * agentsPerPage,
    currentPage * agentsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search agent here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/real-estate/add-agent/"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add Agent
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
        {paginatedAgents.map((agent) => (
          <div
            key={agent.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content relative -mt-[7px]">
              <div className="absolute -top-[18px] ltr:-left-[20px] rtl:-right-[20px] ltr:md:-left-[25px] rtl:md:-right-[25px] w-[90px] bg-gray-50 dark:bg-[#0a0e19] border-b-[10px] ltr:border-r-[10px] rtl:border-l-[10px] border-gray-50 dark:border-[#0a0e19] ltr:rounded-br-md rtl:rounded-bl-md">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  className="rounded-md"
                  width={80}
                  height={80}
                />
              </div>

              <div className="mb-[40px] ltr:pl-[88px] rtl:pr-[88px]">
                <span className="font-medium text-black dark:text-white block text-md mb-[2px]">
                  {agent.name}
                </span>
                <span className="block">{agent.email}</span>
              </div>

              <ul>
                <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                  <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                    Phone:
                  </span>
                  {agent.phone}
                </li>

                <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                  <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                    Location:
                  </span>
                  {agent.location}
                </li>
              </ul>

              <div className="my-[15px] md:my-[20px] flex items-center gap-[7px]">
                {agent.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={`inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[${link.bgColor}]`}
                    target="_blank"
                  >
                    <i
                      className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 ${link.icon}`}
                    ></i>
                  </a>
                ))}
              </div>

              <a
                href={`mailto:${agent.email}`}
                className="inline-block rounded-md font-medium border border-primary-500 text-white bg-primary-500 py-[4.5px] px-[15.5px] transition-all hover:bg-primary-400 hover:border-primary-400 ltr:mr-[10px] rtl:ml-[10px]"
              >
                Message
              </a>
              <a
                href="#"
                className="inline-block rounded-md font-medium border border-primary-500 text-primary-500 py-[4.5px] px-[15.5px] transition-all hover:bg-primary-500 hover:text-white"
              >
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              {" "}
              Showing{" "}
              {Math.min(
                currentPage * agentsPerPage,
                filteredAgents.length
              )} of {filteredAgents.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] text-center rounded-md border ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentsContent;
