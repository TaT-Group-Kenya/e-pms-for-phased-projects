"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  joinedDate: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const initialMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ava Turner",
    role: "Business Analyst",
    image: "/images/users/user11.jpg",
    joinedDate: "01 Jan 2024",
    email: "turner@trezo.com",
    phone: "+1 555-445-4455",
    location: "Washington D.C",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 2,
    name: "Ethan Parker",
    role: "Project Manager",
    image: "/images/users/user12.jpg",
    joinedDate: "10 Jan 2024",
    email: "parker@trezo.com",
    phone: "+1 555-445-7788",
    location: "San Diego",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 3,
    name: "Isabella Lee",
    role: "Team Leader",
    image: "/images/users/user13.jpg",
    joinedDate: "20 Jan 2024",
    email: "lee@trezo.com",
    phone: "+1 555-333-2288",
    location: "Los Angeles",
    socialLinks: {
      facebook: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 4,
    name: "Olivia Smith",
    role: "Software Engineer",
    image: "/images/users/user14.jpg",
    joinedDate: "15 Jan 2024",
    email: "olivia@trezo.com",
    phone: "+1 555-111-2233",
    location: "New York",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 5,
    name: "James Johnson",
    role: "UX Designer",
    image: "/images/users/user15.jpg",
    joinedDate: "18 Jan 2024",
    email: "james@trezo.com",
    phone: "+1 555-678-9123",
    location: "Chicago",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 6,
    name: "Sophia Brown",
    role: "Data Scientist",
    image: "/images/users/user16.jpg",
    joinedDate: "25 Jan 2024",
    email: "sophia@trezo.com",
    phone: "+1 555-234-2345",
    location: "San Francisco",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 7,
    name: "Liam Williams",
    role: "Product Manager",
    image: "/images/users/user17.jpg",
    joinedDate: "28 Jan 2024",
    email: "liam@trezo.com",
    phone: "+1 555-334-4455",
    location: "Austin",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 8,
    name: "Mason Jones",
    role: "HR Specialist",
    image: "/images/users/user18.jpg",
    joinedDate: "30 Jan 2024",
    email: "mason@trezo.com",
    phone: "+1 555-445-5566",
    location: "Seattle",
    socialLinks: {
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: 9,
    name: "Charlotte Garcia",
    role: "Marketing Manager",
    image: "/images/users/user19.jpg",
    joinedDate: "05 Feb 2024",
    email: "charlotte@trezo.com",
    phone: "+1 555-556-6677",
    location: "Boston",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 10,
    name: "Amelia Martinez",
    role: "SEO Specialist",
    image: "/images/users/user20.jpg",
    joinedDate: "06 Feb 2024",
    email: "amelia@trezo.com",
    phone: "+1 555-667-7788",
    location: "Miami",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 11,
    name: "Benjamin Rodriguez",
    role: "Content Writer",
    image: "/images/users/user21.jpg",
    joinedDate: "07 Feb 2024",
    email: "benjamin@trezo.com",
    phone: "+1 555-778-8899",
    location: "Denver",
    socialLinks: {
      facebook: "#",
      twitter: "#",
    },
  },
  {
    id: 12,
    name: "Ella Perez",
    role: "Graphic Designer",
    image: "/images/users/user22.jpg",
    joinedDate: "10 Feb 2024",
    email: "ella@trezo.com",
    phone: "+1 555-889-9900",
    location: "Los Angeles",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 13,
    name: "Lucas Wilson",
    role: "Full Stack Developer",
    image: "/images/users/user23.jpg",
    joinedDate: "12 Feb 2024",
    email: "lucas@trezo.com",
    phone: "+1 555-990-0011",
    location: "Houston",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 14,
    name: "Mia Anderson",
    role: "Product Designer",
    image: "/images/users/user24.jpg",
    joinedDate: "14 Feb 2024",
    email: "mia@trezo.com",
    phone: "+1 555-123-3344",
    location: "Dallas",
    socialLinks: {
      linkedin: "#",
    },
  },
  {
    id: 15,
    name: "Alexander Thomas",
    role: "Software Architect",
    image: "/images/users/user25.jpg",
    joinedDate: "16 Feb 2024",
    email: "alexander@trezo.com",
    phone: "+1 555-234-4455",
    location: "Portland",
    socialLinks: {
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: 16,
    name: "Zoe Jackson",
    role: "Business Consultant",
    image: "/images/users/user26.jpg",
    joinedDate: "18 Feb 2024",
    email: "zoe@trezo.com",
    phone: "+1 555-345-5566",
    location: "Chicago",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 17,
    name: "Henry White",
    role: "Lead Developer",
    image: "/images/users/user27.jpg",
    joinedDate: "20 Feb 2024",
    email: "henry@trezo.com",
    phone: "+1 555-456-6677",
    location: "San Francisco",
    socialLinks: {
      linkedin: "#",
    },
  },
  {
    id: 18,
    name: "Grace Harris",
    role: "Sales Manager",
    image: "/images/users/user28.jpg",
    joinedDate: "22 Feb 2024",
    email: "grace@trezo.com",
    phone: "+1 555-567-7788",
    location: "Austin",
    socialLinks: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 19,
    name: "Jack Clark",
    role: "QA Engineer",
    image: "/images/users/user29.jpg",
    joinedDate: "24 Feb 2024",
    email: "jack@trezo.com",
    phone: "+1 555-678-8899",
    location: "Miami",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 20,
    name: "Lily Lewis",
    role: "Operations Manager",
    image: "/images/users/user30.jpg",
    joinedDate: "26 Feb 2024",
    email: "lily@trezo.com",
    phone: "+1 555-789-9900",
    location: "New York",
    socialLinks: {
      facebook: "#",
      linkedin: "#",
    },
  },
];

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const handleDelete = (id: number) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id)
    );
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(members.length / itemsPerPage);

  // Get the members for the current page
  const currentMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
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
                placeholder="Search member here....."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/users/add-user"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Member
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        {currentMembers.map((member) => (
          <div
            key={member.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={member.image}
                    alt="user-image"
                    className="rounded-full w-[65px] border-[2px] border-gray-100 dark:border-[#172036]"
                    width={65}
                    height={65}
                  />
                  <div className="ltr:ml-[12px] rtl:mr-[12px]">
                    <span className="block text-md mb-[2px] font-medium text-black dark:text-white">
                      {member.name}
                    </span>
                    <span className="block">{member.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-[9px]">
                  <button
                    type="button"
                    className="text-primary-500 leading-none custom-tooltip"
                  >
                    <i className="material-symbols-outlined !text-md">
                      visibility
                    </i>
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                  >
                    <i className="material-symbols-outlined !text-md">edit</i>
                  </button>
                  <button
                    type="button"
                    className="text-danger-500 leading-none custom-tooltip"
                    onClick={() => handleDelete(member.id)} // Call delete handler
                  >
                    <i className="material-symbols-outlined !text-md">delete</i>
                  </button>
                </div>
              </div>

              <ul className="mt-[17px]">
                <li className="mb-[9px] last:mb-0">
                  <span className="text-black dark:text-white">
                    Joined Date: {' '}
                  </span>
                  {member.joinedDate}
                </li>
                <li className="mb-[9px] last:mb-0">
                  <span className="text-black dark:text-white">
                    Email Address: {' '}
                  </span>
                  {member.email}
                </li>
                <li className="mb-[9px] last:mb-0">
                  <span className="text-black dark:text-white">
                    Phone Number: {' '}
                  </span>
                  {member.phone}
                </li>
                <li className="mb-[9px] last:mb-0">
                  <span className="text-black dark:text-white">Location:</span> {' '}
                  {member.location}
                </li>
              </ul>

              <div className="flex items-center gap-[10px] mt-[18px]">
                {member.socialLinks.facebook && (
                  <a
                    href={member.socialLinks.facebook}
                    className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#3a559f]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-facebook-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
                  </a>
                )}
                {member.socialLinks.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#03a9f4]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-twitter-x-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
                  </a>
                )}
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#007ab9]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-linkedin-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
                  </a>
                )}
                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ri-github-line absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, members.length)} of{" "}
              {members.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-"
                >
                  <button
                    onClick={() => goToPage(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : ""
                    } `}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => goToPage(currentPage + 1)}
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

export default TeamMembers;
