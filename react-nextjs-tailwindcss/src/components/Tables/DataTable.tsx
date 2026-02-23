"use client";

import React, { useState, useEffect } from "react";

// Define the data type for better code readability
interface Person {
  id: number;
  name: string;
  age: number;
  city: string;
  country: string;
}

const DataTable: React.FC = () => {
  // State for the table data
  const [data, setData] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Person;
    direction: "asc" | "desc";
  }>({
    key: "id", // default sorting key
    direction: "asc", // default sorting direction
  });

  // Simulate fetching dynamic data (replace with an actual API call)
  useEffect(() => {
    const fetchData = async () => {
      const dynamicData: Person[] = [
        { id: 1, name: "John Doe", age: 25, city: "New York", country: "USA" },
        { id: 2, name: "Jane Smith", age: 30, city: "London", country: "UK" },
        {
          id: 3,
          name: "Samuel Green",
          age: 22,
          city: "Toronto",
          country: "Canada",
        },
        {
          id: 4,
          name: "Emily Brown",
          age: 27,
          city: "Sydney",
          country: "Australia",
        },
        {
          id: 5,
          name: "Michael Johnson",
          age: 29,
          city: "Auckland",
          country: "New Zealand",
        },
        {
          id: 6,
          name: "Alice Williams",
          age: 35,
          city: "Paris",
          country: "France",
        },
        {
          id: 7,
          name: "David Lee",
          age: 40,
          city: "Berlin",
          country: "Germany",
        },
        {
          id: 8,
          name: "Sophia Davis",
          age: 33,
          city: "Los Angeles",
          country: "USA",
        },
        {
          id: 9,
          name: "Oliver Harris",
          age: 28,
          city: "Tokyo",
          country: "Japan",
        },
        { id: 10, name: "Mia Clark", age: 31, city: "Rome", country: "Italy" },
      ];
      setData(dynamicData);
    };

    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on the search term
  const filteredData = data.filter((person) => {
    return (
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting function
  const sortedData = React.useMemo(() => {
    const sortableData = [...filteredData];
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableData;
  }, [filteredData, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (key: keyof Person) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          ...prevConfig,
          direction: prevConfig.direction === "asc" ? "desc" : "asc", // Toggle sort direction
        };
      }
      return { key, direction: "asc" }; // Default to ascending for new column
    });
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex sm:items-center sm:justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Data Table</h5>
          </div>
          <div className="trezo-card-subtitle sm:flex sm:items-center">
            <form className="relative sm:w-[320px] mt-[13px] sm:mt-0">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here....."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>
        </div>

        <div className="trezo-card-content" id="dataTable">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md cursor-pointer relative">
                    <button type="button" onClick={() => handleSort("id")}>
                      ID
                      <i
                        className={`ri-expand-up-down-fill text-gray-500 dark:text-gray-400 ${
                          sortConfig.key === "id"
                            ? sortConfig.direction === "asc"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      ></i>
                    </button>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md cursor-pointer relative">
                    <button type="button" onClick={() => handleSort("name")}>
                      Name
                      <i
                        className={`ri-expand-up-down-fill text-gray-500 dark:text-gray-400 ${
                          sortConfig.key === "name"
                            ? sortConfig.direction === "asc"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      ></i>
                    </button>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md cursor-pointer relative">
                    <button type="button" onClick={() => handleSort("age")}>
                      Age
                      <i
                        className={`ri-expand-up-down-fill text-gray-500 dark:text-gray-400 ${
                          sortConfig.key === "age"
                            ? sortConfig.direction === "asc"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      ></i>
                    </button>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md cursor-pointer relative">
                    <button type="button" onClick={() => handleSort("city")}>
                      City
                      <i
                        className={`ri-expand-up-down-fill text-gray-500 dark:text-gray-400 ${
                          sortConfig.key === "city"
                            ? sortConfig.direction === "asc"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      ></i>
                    </button>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md cursor-pointer relative">
                    <button type="button" onClick={() => handleSort("country")}>
                      Country
                      <i
                        className={`ri-expand-up-down-fill text-gray-500 dark:text-gray-400 ${
                          sortConfig.key === "country"
                            ? sortConfig.direction === "asc"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      ></i>
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-[15px]">
                      No data available
                    </td>
                  </tr>
                ) : (
                  sortedData.map((person) => (
                    <tr key={person.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {person.id}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {person.name}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {person.age}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {person.city}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {person.country}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
