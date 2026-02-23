"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  viewLink: string;
};

const OrderDetails: React.FC = () => {
  // Product data
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Maybelline Lash",
      image: "/images/products/product15.jpg",
      price: 29,
      viewLink: "/ecommerce/product-details/",
    },
    {
      id: 2,
      name: "Apple iPhone 16",
      image: "/images/products/product16.jpg",
      price: 799,
      viewLink: "/ecommerce/product-details/",
    },
    {
      id: 3,
      name: "Adidas Woman",
      image: "/images/products/product17.jpg",
      price: 85,
      viewLink: "/ecommerce/product-details/",
    },
  ]);

  // Quantity state for each product
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({
    1: 1,
    2: 2,
    3: 1,
  });

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("card");

  // Handle quantity increase
  const handleIncrease = (productId: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  // Handle quantity decrease
  const handleDecrease = (productId: number) => {
    if (quantities[productId] > 1) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
    }
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  // Calculate subtotal
  const subtotal = products.reduce(
    (total, product) => total + product.price * quantities[product.id],
    0
  );

  // Calculate tax (10%)
  const tax = subtotal * 0.1;

  // Calculate total
  const total = subtotal + tax;

  return (
    <div className="trezo-card bg-gray-50 dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#172036]">
      <div className="trezo-card-header py-[15px] px-[20px] md:px-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0 !text-md md:!text-[20px] !font-medium">
            Order Details
          </h5>
        </div>
        <div className="trezo-card-subtitle">
          <button
            type="button"
            className="block leading-none text-primary-500 transition-all hover:rotate-90"
          >
            <i className="material-symbols-outlined">autorenew</i>
          </button>
        </div>
      </div>

      <div className="trezo-card-content bg-white dark:bg-dark p-[20px] md:p-[25px] rounded-md border-t border-gray-100 dark:border-[#172036]">
        {/* Dynamically render products */}
        {products.map((product) => (
          <div
            key={product.id}
            className="sm:flex items-center justify-between border-t border-gray-100 dark:border-[#172036] first:border-t-0 pt-[17px] first:pt-0 mt-[17px] first:mt-0"
          >
            <Link
              href={product.viewLink}
              className="flex items-center gap-[10px] text-black dark:text-white transition-all hover:text-primary-500"
            >
              <Image
                src={product.image}
                className="w-[40px] rounded-md"
                alt="product-image"
                width={40}
                height={40}
              />
              <span className="block font-medium leading-[1.2] lg:max-w-[80px]">
                {product.name}
              </span>
            </Link>
            <div className="mt-[12px] sm:mt-0 flex items-center gap-[15px]">
              <div
                className="counter-container relative w-[90px]"
                id="inputCounter"
              >
                <button
                  className="decrease-btn top-1/2 -translate-y-1/2 absolute text-[20px] ltr:left-[12px] rtl:right-[12px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                  onClick={() => handleDecrease(product.id)}
                >
                  -
                </button>
                <input
                  type="text"
                  className="counter text-base h-[34px] rounded-md text-center block w-full bg-gray-50 dark:bg-[#15203c] text-black outline-0 font-medium dark:text-white"
                  value={quantities[product.id]}
                  readOnly
                />
                <button
                  className="increase-btn top-1/2 -translate-y-1/2 absolute text-[20px] ltr:right-[12px] rtl:left-[12px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                  onClick={() => handleIncrease(product.id)}
                >
                  +
                </button>
              </div>
              <div className="leading-none font-medium sm:w-[45px] text-lg text-primary-500">
                ${product.price * quantities[product.id]}
              </div>
            </div>
          </div>
        ))}
 
        {/* Order summary */}
        <div className="bg-gray-50 dark:bg-dark rounded-md mt-[20px] md:mt-[25px] p-[15px] md:p-[20px]">
          <div className="flex items-center justify-between mb-[5px]">
            <span className="block">Total:</span>
            <span className="block">
              {products.reduce(
                (total, product) => total + quantities[product.id],
                0
              )}{" "}
              Items
            </span>
          </div>
          <div className="flex items-center justify-between mb-[5px]">
            <span className="block text-black dark:text-white font-medium">
              Subtotal:
            </span>
            <span className="block text-black dark:text-white font-medium">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-[5px]">
            <span className="block text-black dark:text-white font-medium">
              Shipping:
            </span>
            <span className="block text-black dark:text-white font-medium">
              $0.00
            </span>
          </div>
          <div className="flex items-center justify-between mb-[5px]">
            <span className="block text-black dark:text-white font-medium">
              Tax (10%):
            </span>
            <span className="block text-black dark:text-white font-medium">
              ${tax.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-[18px]">
            <span className="block text-lg md:text-[20px] text-black dark:text-white font-medium">
              Payable Total:
            </span>
            <span className="block text-lg md:text-[20px] text-black dark:text-white font-medium">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment method */}
        <h4 className="!font-medium !mb-[15px] !text-[20px] !mt-[25px]">
          Payment Method
        </h4>
        <div className="payment-method flex items-center gap-[20px] md:gap-[25px]">
          {["cash", "card", "eWallet"].map((method) => (
            <div
              key={method}
              className={`text-center relative w-[82px] h-[66px] pt-[7px] rounded-md bg-gray-50 dark:bg-dark border ${
                selectedPaymentMethod === method
                  ? "border-primary-500"
                  : "border-primary-100 dark:border-[#172036]"
              } transition-all`}
              onClick={() => handlePaymentMethodChange(method)}
            >
              <i className="material-symbols-outlined !text-2xl text-primary-500">
                {method === "cash"
                  ? "paid"
                  : method === "card"
                  ? "credit_card"
                  : "wallet"}
              </i>
              <span className="block -mt-[2px] md:-mt-[4px]">
                {method === "eWallet"
                  ? "E-Wallet"
                  : method.charAt(0).toUpperCase() + method.slice(1)}
              </span>
              <input
                type="radio"
                name="paymentMethod"
                id={`${method}Type`}
                defaultChecked={selectedPaymentMethod === method}
                className="top-0 left-0 z-[1] w-full h-full m-0 absolute cursor-pointer opacity-0"
              />
            </div>
          ))}
        </div>

        {/* Place order button */}
        <button
          type="button"
          className="mt-[20px] md:mt-[25px] font-medium block w-full transition-all rounded-md md:text-md py-[10px] md:py-[11px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
