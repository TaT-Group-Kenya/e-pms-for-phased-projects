"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Client {
  id: number;
  name: string;
  email: string;
  contactName: string;
  phone: string;
  projects: number;
  image: string;
}

const clients: Client[] = [
  {
    id: 1,
    name: "CodeCraft",
    email: "info@codecraft.com",
    contactName: "Olivia Taylor",
    phone: "(555) 555-5555",
    projects: 12,
    image: "/images/clients/client1.jpg",
  },
  {
    id: 2,
    name: "ByteSavvy",
    email: "info@bytesavvy.com",
    contactName: "David Smith",
    phone: "(555) 123-4567",
    projects: 16,
    image: "/images/clients/client2.jpg",
  },
  {
    id: 3,
    name: "TechSolutions",
    email: "info@techsolutions.com",
    contactName: "John Doe",
    phone: "(555) 987-6543",
    projects: 8,
    image: "/images/clients/client3.jpg",
  },
  {
    id: 4,
    name: "GreenTech",
    email: "info@greentech.com",
    contactName: "Jane Doe",
    phone: "(555) 321-6549",
    projects: 20,
    image: "/images/clients/client4.jpg",
  },
  {
    id: 5,
    name: "InnovateHub",
    email: "info@innovatehub.com",
    contactName: "Emma Johnson",
    phone: "(555) 678-1234",
    projects: 25,
    image: "/images/clients/client5.jpg",
  },
  {
    id: 6,
    name: "CyberNet",
    email: "info@cybernet.com",
    contactName: "Noah Wilson",
    phone: "(555) 345-7890",
    projects: 18,
    image: "/images/clients/client6.jpg",
  },
  {
    id: 7,
    name: "NextGen Solutions",
    email: "info@nextgensolutions.com",
    contactName: "Sophia Lee",
    phone: "(555) 890-5671",
    projects: 14,
    image: "/images/clients/client7.jpg",
  },
  {
    id: 8,
    name: "CloudWave",
    email: "info@cloudwave.com",
    contactName: "Ethan Brown",
    phone: "(555) 456-7890",
    projects: 22,
    image: "/images/clients/client8.jpg",
  },
  {
    id: 9,
    name: "DataBridge",
    email: "info@databridge.com",
    contactName: "Ava Martinez",
    phone: "(555) 567-8901",
    projects: 19,
    image: "/images/clients/client9.jpg",
  },
  {
    id: 10,
    name: "SmartNet",
    email: "info@smartnet.com",
    contactName: "Liam Anderson",
    phone: "(555) 234-5678",
    projects: 11,
    image: "/images/clients/client10.jpg",
  },
  {
    id: 11,
    name: "NeuralTech",
    email: "info@neuraltech.com",
    contactName: "Mason Thomas",
    phone: "(555) 678-9012",
    projects: 17,
    image: "/images/clients/client11.jpg",
  },
  {
    id: 12,
    name: "EcoSystems",
    email: "info@ecosystems.com",
    contactName: "Charlotte Roberts",
    phone: "(555) 345-6789",
    projects: 9,
    image: "/images/clients/client12.jpg",
  },
  {
    id: 13,
    name: "CodeFusion",
    email: "info@codefusion.com",
    contactName: "Lucas Scott",
    phone: "(555) 890-1234",
    projects: 13,
    image: "/images/clients/client1.jpg",
  },
  {
    id: 14,
    name: "SwiftSolutions",
    email: "info@swiftsolutions.com",
    contactName: "Isabella Parker",
    phone: "(555) 901-2345",
    projects: 15,
    image: "/images/clients/client2.jpg",
  },
  {
    id: 15,
    name: "QuantumSoft",
    email: "info@quantumsoft.com",
    contactName: "James Collins",
    phone: "(555) 567-1234",
    projects: 10,
    image: "/images/clients/client3.jpg",
  },
  {
    id: 16,
    name: "FutureLab",
    email: "info@futurelab.com",
    contactName: "Emily Turner",
    phone: "(555) 678-4567",
    projects: 21,
    image: "/images/clients/client4.jpg",
  },
  {
    id: 17,
    name: "DigitalHorizon",
    email: "info@digitalhorizon.com",
    contactName: "Benjamin Reed",
    phone: "(555) 890-7890",
    projects: 23,
    image: "/images/clients/client5.jpg",
  },
  {
    id: 18,
    name: "BlueEdge",
    email: "info@blueedge.com",
    contactName: "Mia Clark",
    phone: "(555) 123-3456",
    projects: 12,
    image: "/images/clients/client6.jpg",
  },
  {
    id: 19,
    name: "ApexSoft",
    email: "info@apexsoft.com",
    contactName: "Logan Hall",
    phone: "(555) 234-4567",
    projects: 16,
    image: "/images/clients/client7.jpg",
  },
  {
    id: 20,
    name: "Nexus Solutions",
    email: "info@nexussolutions.com",
    contactName: "Harper Lewis",
    phone: "(555) 345-6780",
    projects: 8,
    image: "/images/clients/client8.jpg",
  },
  {
    id: 21,
    name: "CyberSec Labs",
    email: "info@cyberseclabs.com",
    contactName: "Elijah Nelson",
    phone: "(555) 456-7891",
    projects: 14,
    image: "/images/clients/client9.jpg",
  },
  {
    id: 22,
    name: "InfinityTech",
    email: "info@infinitytech.com",
    contactName: "Abigail Foster",
    phone: "(555) 567-8902",
    projects: 19,
    image: "/images/clients/client10.jpg",
  },
  {
    id: 23,
    name: "AI Innovations",
    email: "info@aiinnovations.com",
    contactName: "William Carter",
    phone: "(555) 678-9013",
    projects: 10,
    image: "/images/clients/client11.jpg",
  },
  {
    id: 24,
    name: "Visionary Labs",
    email: "info@visionarylabs.com",
    contactName: "Ella Bennett",
    phone: "(555) 789-0124",
    projects: 22,
    image: "/images/clients/client12.jpg",
  },
];

const ClientsList: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 12;

  // Calculate total pages
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  // Get current clients to display based on the current page
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  // Handle page change
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        {currentClients.map((client) => (
          <div
            key={client.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content relative -mt-[7px]">
              <div className="absolute -top-[18px] ltr:-left-[20px] rtl:-right-[20px] ltr:md:-left-[25px] rtl:md:-right-[25px] w-[90px] bg-gray-50 dark:bg-[#0a0e19] border-b-[10px] ltr:border-r-[10px] rtl:border-l-[10px] border-gray-50 dark:border-[#0a0e19] ltr:rounded-br-md rtl:rounded-bl-md">
                <Image
                  src={client.image}
                  alt="client-image"
                  className="rounded-md"
                  width={80}
                  height={60}
                />
              </div>

              <div className="mb-[20px] md:mb-[25px] ltr:pl-[88px] rtl:pr-[88px]">
                <span className="font-medium text-black dark:text-white block text-md mb-[2px]">
                  {client.name}
                </span>
                <span className="block">{client.email}</span>
              </div>

              <ul>
                <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                  <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                    Name:
                  </span>
                  {client.contactName}
                </li>

                <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                  <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                    Phone:
                  </span>
                  {client.phone}
                </li>

                <li className="text-black dark:text-white font-medium mb-[5px] last:mb-0">
                  <span className="ltr:mr-[7px] rtl:ml-[7px] text-gray-500 dark:text-gray-400 font-normal">
                    Projects:
                  </span>
                  {client.projects}
                </li>
              </ul>

              <div className="mt-[17px]">
                <a
                  href={`mailto:${client.email}`}
                  className="inline-block rounded-md font-medium border border-primary-500 text-white bg-primary-500 py-[4.5px] px-[15.5px] transition-all hover:bg-primary-400 hover:border-primary-400 ltr:mr-[10px] rtl:ml-[10px]"
                >
                  Message
                </a>

                <Link
                  href="#"
                  className="inline-block rounded-md font-medium border border-primary-500 text-primary-500 py-[4.5px] px-[15.5px] transition-all hover:bg-primary-500 hover:text-white"
                >
                  View Project
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {indexOfFirstClient + 1} to {indexOfLastClient} of{" "}
              {clients.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className="inline-block mx-[2px]">
                  <button
                    onClick={() => handlePageClick(index + 1)}
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

              <li className="inline-block mx-[2px]">
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

export default ClientsList;
