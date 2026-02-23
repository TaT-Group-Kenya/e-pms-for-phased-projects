"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

// Define the structure of a contact
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContacted: string;
  company: string;
  leadScore: number;
  status: string;
  image: string;
}

const Contacts: React.FC = () => {
  // Initialize state with an array of contacts
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "#854",
      name: "Oliver Khan",
      email: "oliver@trezo.com",
      phone: "+1 555-123-4567",
      lastContacted: "19 Jun 2024",
      company: "ABC Corporation",
      leadScore: 50,
      status: "Active",
      image: "/images/users/user6.jpg",
    },
    {
      id: "#853",
      name: "Carolyn Barnes",
      email: "carolyn@trezo.com",
      phone: "+1 555-987-6543",
      lastContacted: "18 Jun 2024",
      company: "XYZ Ltd",
      leadScore: 35,
      status: "Active",
      image: "/images/users/user7.jpg",
    },
    {
      id: "#852",
      name: "Donna Miller",
      email: "donna@trezo.com",
      phone: "+1 555-456-7890",
      lastContacted: "17 Jun 2024",
      company: "Tech Solutions",
      leadScore: 40,
      status: "Deactive",
      image: "/images/users/user8.jpg",
    },
    {
      id: "#851",
      name: "Rebecca Block",
      email: "rebecca@trezo.com",
      phone: "+1 555-658-4488",
      lastContacted: "15 Jun 2024",
      company: "Acma Industries",
      leadScore: 27,
      status: "Deactive",
      image: "/images/users/user10.jpg",
    },
    {
      id: "#850",
      name: "Ramiro McCarty",
      email: "ramiro@trezo.com",
      phone: "+1 555-558-9966",
      lastContacted: "14 Jun 2024",
      company: "Synergy Ltd",
      leadScore: 16,
      status: "Active",
      image: "/images/users/user11.jpg",
    },
    {
      id: "#849",
      name: "Robert Fairweather",
      email: "robert@trezo.com",
      phone: "+1 555-357-5888",
      lastContacted: "13 Jun 2024",
      company: "Summit Solutions",
      leadScore: 38,
      status: "Active",
      image: "/images/users/user12.jpg",
    },
    {
      id: "#848",
      name: "Marcelino Haddock",
      email: "marcelino@trezo.com",
      phone: "+1 555-456-8877",
      lastContacted: "12 Jun 2024",
      company: "Strategies Ltd",
      leadScore: 15,
      status: "Active",
      image: "/images/users/user13.jpg",
    },
    {
      id: "#847",
      name: "Thomas Wilson",
      email: "thomas@trezo.com",
      phone: "+1 555-622-4488",
      lastContacted: "11 Jun 2024",
      company: "Tech Enterprises",
      leadScore: 41,
      status: "Deactive",
      image: "/images/users/user14.jpg",
    },
    {
      id: "#846",
      name: "Nathaniel Hulsey",
      email: "nathaniel@trezo.com",
      phone: "+1 555-225-4488",
      lastContacted: "10 Jun 2024",
      company: "Synetic Solutions",
      leadScore: 29,
      status: "Active",
      image: "/images/users/user15.jpg",
    },
    {
      id: "#845",
      name: "Jasmine Cooper",
      email: "jasmine@trezo.com",
      phone: "+1 555-333-4444",
      lastContacted: "9 Jun 2024",
      company: "Horizon Inc",
      leadScore: 23,
      status: "Deactive",
      image: "/images/users/user16.jpg",
    },
    {
      id: "#844",
      name: "David Johnson",
      email: "david@trezo.com",
      phone: "+1 555-111-2222",
      lastContacted: "8 Jun 2024",
      company: "NextGen Tech",
      leadScore: 44,
      status: "Active",
      image: "/images/users/user17.jpg",
    },
    {
      id: "#843",
      name: "Sophia Williams",
      email: "sophia@trezo.com",
      phone: "+1 555-555-7777",
      lastContacted: "7 Jun 2024",
      company: "Future Vision",
      leadScore: 37,
      status: "Active",
      image: "/images/users/user18.jpg",
    },
    {
      id: "#842",
      name: "Michael Brown",
      email: "michael@trezo.com",
      phone: "+1 555-888-9999",
      lastContacted: "6 Jun 2024",
      company: "Global Networks",
      leadScore: 32,
      status: "Deactive",
      image: "/images/users/user19.jpg",
    },
    {
      id: "#841",
      name: "Emma Davis",
      email: "emma@trezo.com",
      phone: "+1 555-222-3333",
      lastContacted: "5 Jun 2024",
      company: "Dynamic Systems",
      leadScore: 30,
      status: "Active",
      image: "/images/users/user20.jpg",
    },
    {
      id: "#840",
      name: "Liam Taylor",
      email: "liam@trezo.com",
      phone: "+1 555-444-5555",
      lastContacted: "4 Jun 2024",
      company: "Core Solutions",
      leadScore: 28,
      status: "Deactive",
      image: "/images/users/user21.jpg",
    },
    {
      id: "#839",
      name: "Olivia Martinez",
      email: "olivia@trezo.com",
      phone: "+1 555-666-7777",
      lastContacted: "3 Jun 2024",
      company: "Alpha Innovations",
      leadScore: 34,
      status: "Active",
      image: "/images/users/user22.jpg",
    },
    {
      id: "#838",
      name: "Aiden Clark",
      email: "aiden@trezo.com",
      phone: "+1 555-888-1111",
      lastContacted: "2 Jun 2024",
      company: "Skyline Ventures",
      leadScore: 36,
      status: "Active",
      image: "/images/users/user23.jpg",
    },
    {
      id: "#837",
      name: "Ella Lewis",
      email: "ella@trezo.com",
      phone: "+1 555-999-2222",
      lastContacted: "1 Jun 2024",
      company: "Urban Analytics",
      leadScore: 20,
      status: "Deactive",
      image: "/images/users/user24.jpg",
    },
    {
      id: "#836",
      name: "Lucas Harris",
      email: "lucas@trezo.com",
      phone: "+1 555-777-6666",
      lastContacted: "31 May 2024",
      company: "Eco Systems",
      leadScore: 45,
      status: "Active",
      image: "/images/users/user25.jpg",
    },
    {
      id: "#835",
      name: "Mia Moore",
      email: "mia@trezo.com",
      phone: "+1 555-555-3333",
      lastContacted: "30 May 2024",
      company: "Nova Industries",
      leadScore: 31,
      status: "Deactive",
      image: "/images/users/user26.jpg",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("All");

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle status filter change
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Filter contacts based on search query and status
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearchByName = contact.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSearchById = contact.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedOption === "All" || contact.status === selectedOption;
    return (matchesSearchByName || matchesSearchById) && matchesStatus;
  });

  // Calculate the index range for the current page
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle contact deletion
  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter((contact) => contact.id !== contactId));
  };

  // Select checkbox
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((contact) => contact.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search contact here....."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["All", "Active", "Deactive"].map((option) => (
                  <MenuItem
                    key={option}
                    as="div"
                    className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                      selectedOption === option ? "font-semibold" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    <div className="form-check relative top-[2px]">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    User
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Phone
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Last Contacted
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Company
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Lead Score
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="form-check relative top-[2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleCheckboxChange(contact.id)}
                        />
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={contact.image}
                            className="inline-block rounded-full"
                            alt="user-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {contact.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {contact.email}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.phone}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.lastContacted}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.company}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.leadScore}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block ${
                          contact.status === "Active"
                            ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                            : "bg-orange-100 dark:bg-[#15203c] text-orange-600"
                        } rounded-sm font-medium text-xs`}
                      >
                        {contact.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <div className="relative group">
                          <button
                            type="button"
                            className="text-primary-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-gray-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              edit
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-danger-500 leading-none"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {currentContacts.length} of {contacts.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 space-x-1">
              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li className="inline-block" key={index}>
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default Contacts;
