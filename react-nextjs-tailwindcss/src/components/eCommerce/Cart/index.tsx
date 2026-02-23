"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderSummary from "./OrderSummary";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "#JAN-2345",
      name: "Smart Band",
      viewLink: "/ecommerce/product-details/",
      image: "/images/products/product1.jpg",
      price: 80,
      quantity: 1,
    },
    {
      id: "#JAN-1323",
      name: "Headphone",
      viewLink: "/ecommerce/product-details/",
      image: "/images/products/product2.jpg",
      price: 150,
      quantity: 7,
    },
    {
      id: "#DEC-1234",
      name: "iPhone 15 Plus",
      viewLink: "/ecommerce/product-details/",
      image: "/images/products/product3.jpg",
      price: 750,
      quantity: 1,
    },
    {
      id: "#DEC-3567",
      name: "Bluetooth Speaker",
      viewLink: "/ecommerce/product-details/",
      image: "/images/products/product4.jpg",
      price: 15,
      quantity: 5,
    },
    {
      id: "#DEC-1098",
      name: "Airbuds 2nd Gen",
      viewLink: "/ecommerce/product-details/",
      image: "/images/products/product5.jpg",
      price: 25,
      quantity: 2,
    },
  ]);

  const updateQuantity = (index: number, amount: number) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = Math.max(
        1,
        updatedItems[index].quantity + amount
      );
      return updatedItems;
    });
  };

  return (
    <>
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Your Order</h5>
              </div>
              <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
                <h5 className="!mb-0">Customer ID : 357951</h5>
              </div>
            </div>

            <div className="trezo-card-content">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                        Order ID
                      </th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                        Product
                      </th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                        Quantity
                      </th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                        Price
                      </th>
                      <th className="font-medium text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tr-md">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white">
                    {cartItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {item.id}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex items-center">
                            <div className="rounded-md w-[40px]">
                              <Image
                                src={item.image}
                                alt={item.name}
                                className="inline-block rounded-md"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ltr:ml-[12px] rtl:mr-[12px]">
                              <Link
                                href={item.viewLink}
                                className="block font-medium md:text-[15px] transition-all hover:text-primary-500"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="counter-container relative w-[100px]">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="decrease-btn top-1/2 -translate-y-1/2 absolute text-[20px] ltr:left-[15px] rtl:right-[15px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                            >
                              -
                            </button>

                            <input
                              type="text"
                              className="counter text-[15px] h-[42px] rounded-md text-center block w-full bg-[#f6f7f9] dark:bg-[#15203c] text-black outline-0 font-medium dark:text-white"
                              value={item.quantity}
                              readOnly
                            />

                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="increase-btn top-1/2 -translate-y-1/2 absolute text-[20px] ltr:right-[15px] rtl:left-[15px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          ${item.price.toFixed(2)}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form className="max-w-[430px] mt-[20px] md:mt-[25px]">
                <input
                  type="text"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="E.g. #ARP1217"
                />

                <button
                  type="button"
                  className="mt-[15px] md:mt-[20px] font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
                >
                  <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                    <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                      done_all
                    </i>
                    Apply
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Cart;
