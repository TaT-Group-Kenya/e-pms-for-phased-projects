"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Order {
  orderId: string;
  productName: string;
  productImage: string;
  items: number;
  price: string;
  total: string;
}

const RecentOrders: React.FC = () => {
  // Sample dynamic data
  const [orders] = useState<Order[]>([
    {
      orderId: "#JAN-2345",
      productName: "Smart Band",
      productImage: "/images/products/product1.jpg",
      items: 1,
      price: "$80.00",
      total: "$80.00",
    },
    {
      orderId: "#JAN-1323",
      productName: "Headphone",
      productImage: "/images/products/product2.jpg",
      items: 3,
      price: "$150.00",
      total: "$450.00",
    },
    {
      orderId: "#DEC-1234",
      productName: "iPhone 15 Plus",
      productImage: "/images/products/product3.jpg",
      items: 1,
      price: "$750.00",
      total: "$750.00",
    },
    {
      orderId: "#DEC-3567",
      productName: "Bluetooth Speaker",
      productImage: "/images/products/product4.jpg",
      items: 5,
      price: "$15.00",
      total: "$75.00",
    },
    {
      orderId: "#DEC-1098",
      productName: "Airbuds 2nd Gen",
      productImage: "/images/products/product5.jpg",
      items: 2,
      price: "$25.00",
      total: "$50.00",
    },
    // Add more orders as needed
  ]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Orders</h5>
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
                    Items
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
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.orderId}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="rounded-md w-[40px]">
                          <Image
                            src={order.productImage}
                            className="inline-block rounded-md"
                            alt="product-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <div className="block font-medium md:text-[15px]">
                            {order.productName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.items}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.price}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.total}
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

export default RecentOrders;
