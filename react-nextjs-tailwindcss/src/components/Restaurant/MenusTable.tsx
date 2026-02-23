"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MenuItem {
  id: string;
  code: string;
  name: string;
  image: string;
  price: string;
  ingredients: string;
}

const MenusTable: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API or use mock data
  useEffect(() => {
    // In a real app, you would fetch from an API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockData: MenuItem[] = [
          {
            id: "1",
            code: "#001",
            name: "Fish Cutlet",
            image: "/images/restaurant/menu1.png",
            price: "$16.00",
            ingredients:
              "pan-seared chicken, lemon zest, garlic butter, parsley",
          },
          {
            id: "2",
            code: "#002",
            name: "Spicy Ramen",
            image: "/images/restaurant/menu2.png",
            price: "$14.00",
            ingredients: "noodles, boiled egg, chili oil, scallions",
          },
          {
            id: "3",
            code: "#003",
            name: "Grilled Steak",
            image: "/images/restaurant/menu3.png",
            price: "$25.00",
            ingredients: "sirloin steak, rosemary, garlic, olive oil",
          },
          {
            id: "4",
            code: "#004",
            name: "Caesar Salad",
            image: "/images/restaurant/menu4.png",
            price: "$12.00",
            ingredients: "romaine lettuce, croutons, parmesan, Caesar dressing",
          },
          {
            id: "5",
            code: "#005",
            name: "Margherita Pizza",
            image: "/images/restaurant/menu5.png",
            price: "$18.00",
            ingredients: "tomato sauce, mozzarella, fresh basil",
          },
          {
            id: "6",
            code: "#006",
            name: "Veggie Burger",
            image: "/images/restaurant/menu6.png",
            price: "$13.00",
            ingredients: "black bean patty, avocado, tomato, lettuce",
          },
          {
            id: "7",
            code: "#007",
            name: "Butter Chicken",
            image: "/images/restaurant/menu7.png",
            price: "$19.00",
            ingredients: "chicken, tomato cream sauce, butter, spices",
          },
          {
            id: "8",
            code: "#008",
            name: "Penne Alfredo",
            image: "/images/restaurant/menu8.png",
            price: "$15.00",
            ingredients: "penne pasta, Alfredo sauce, mushrooms, parmesan",
          },
          {
            id: "9",
            code: "#009",
            name: "Beef Tacos",
            image: "/images/restaurant/menu9.png",
            price: "$11.00",
            ingredients: "ground beef, cheddar, lettuce, sour cream",
          },
          {
            id: "10",
            code: "#010",
            name: "Chicken Biryani",
            image: "/images/restaurant/menu10.png",
            price: "$17.00",
            ingredients: "basmati rice, chicken, saffron, fried onions",
          },
          {
            id: "11",
            code: "#011",
            name: "Sushi Platter",
            image: "/images/restaurant/menu1.png",
            price: "$28.00",
            ingredients: "tuna, salmon, avocado, rice, nori",
          },
          {
            id: "12",
            code: "#012",
            name: "Pad Thai",
            image: "/images/restaurant/menu2.png",
            price: "$16.00",
            ingredients: "rice noodles, peanuts, shrimp, lime",
          },
          {
            id: "13",
            code: "#013",
            name: "Greek Salad",
            image: "/images/restaurant/menu3.png",
            price: "$10.00",
            ingredients: "cucumber, olives, feta, tomatoes, red onion",
          },
          {
            id: "14",
            code: "#014",
            name: "Chicken Wings",
            image: "/images/restaurant/menu4.png",
            price: "$12.00",
            ingredients: "buffalo sauce, celery, ranch dressing",
          },
          {
            id: "15",
            code: "#015",
            name: "Lamb Gyro",
            image: "/images/restaurant/menu5.png",
            price: "$14.00",
            ingredients: "lamb, tzatziki, pita bread, onions",
          },
          {
            id: "16",
            code: "#016",
            name: "Mushroom Risotto",
            image: "/images/restaurant/menu6.png",
            price: "$17.00",
            ingredients: "arborio rice, mushrooms, parmesan, white wine",
          },
          {
            id: "17",
            code: "#017",
            name: "Avocado Toast",
            image: "/images/restaurant/menu7.png",
            price: "$9.00",
            ingredients: "sourdough, avocado, chili flakes, poached egg",
          },
          {
            id: "18",
            code: "#018",
            name: "Pancake Stack",
            image: "/images/restaurant/menu8.png",
            price: "$11.00",
            ingredients: "pancakes, maple syrup, berries, whipped cream",
          },
          {
            id: "19",
            code: "#019",
            name: "Eggplant Parmesan",
            image: "/images/restaurant/menu9.png",
            price: "$15.00",
            ingredients: "breaded eggplant, marinara sauce, mozzarella",
          },
          {
            id: "20",
            code: "#020",
            name: "Chocolate Lava Cake",
            image: "/images/restaurant/menu10.png",
            price: "$8.00",
            ingredients: "dark chocolate, flour, sugar, molten center",
          },
        ];

        setMenuItems(mockData);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on search term
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (isLoading) {
    return <div className="trezo-card p-[25px] text-center">Loading...</div>;
  }

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
        <div className="trezo-card-title">
          <form className="relative sm:w-[265px]">
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
        <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
          <button
            type="button"
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            id="add-new-popup-toggle"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                add
              </i>
              Add New Dish
            </span>
          </button>
        </div>
      </div>
      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[14px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  <div className="flex items-center gap-[10px]">
                    <div className="form-check relative top-[1.2px]">
                      <input type="checkbox" className="cursor-pointer" />
                    </div>
                    Code
                  </div>
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[14px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Item
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[14px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Price
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[14px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Ingredients
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[14px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="form-check relative top-[1.2px]">
                          <input type="checkbox" className="cursor-pointer" />
                        </div>
                        <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {item.code}
                        </span>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[30px]">
                          <Image
                            src={item.image}
                            width={30}
                            height={30}
                            className="inline-block rounded-full"
                            alt={item.name}
                          />
                        </div>
                        <a
                          href="dish-details.html"
                          className="font-semibold inline-block transition-all hover:text-primary-500"
                        >
                          {item.name}
                        </a>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {item.price}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {item.ingredients}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[9px]">
                        <button
                          type="button"
                          className="text-primary-500 leading-none custom-tooltip"
                          id="customTooltip"
                          data-text="View"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>
                        <button
                          type="button"
                          className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                          id="customTooltip"
                          data-text="Edit"
                        >
                          <i className="material-symbols-outlined !text-md">
                            edit
                          </i>
                        </button>
                        <button
                          type="button"
                          className="text-danger-500 leading-none custom-tooltip"
                          id="customTooltip"
                          data-text="Delete"
                        >
                          <i className="material-symbols-outlined !text-md">
                            delete
                          </i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-[14px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-xs">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
            {filteredItems.length} results
          </p>
          <ol className="mt-[10px] sm:mt-0">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === 1
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show limited page numbers with ellipsis for many pages
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <li
                  key={pageNum}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => paginate(pageNum)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                      currentPage === pageNum
                        ? "border border-primary-500 bg-primary-500 text-white"
                        : "border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <li className="inline-block mx-[2px]">
                <span className="w-[31px] h-[31px] block leading-[29px] relative text-center">
                  ...
                </span>
              </li>
            )}

            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === totalPages
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}
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
  );
};

export default MenusTable;
