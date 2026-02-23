"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

const cryptocurrencies = [
  {
    name: "Ethereum",
    symbol: "ETH",
    image: "/images/cryptocurrencies/ethereum.svg",
    rate: 1750,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    image: "/images/cryptocurrencies/bitcoin.svg",
    rate: 35000,
  },
  {
    name: "Solana",
    symbol: "SOL",
    image: "/images/cryptocurrencies/solana.svg",
    rate: 35,
  },
  {
    name: "Cardano",
    symbol: "ADA",
    image: "/images/cryptocurrencies/cardano.png",
    rate: 0.5,
  },
  {
    name: "Binance",
    symbol: "BNB",
    image: "/images/cryptocurrencies/binance.svg",
    rate: 250,
  },
];

const Exchange: React.FC = () => {
  const [selling, setSelling] = useState(cryptocurrencies[0]);
  const [buying, setBuying] = useState(cryptocurrencies[2]);
  const [amount, setAmount] = useState(1);

  const handleSellingChange = (crypto: (typeof cryptocurrencies)[0]) =>
    setSelling(crypto);
  const handleBuyingChange = (crypto: (typeof cryptocurrencies)[0]) =>
    setBuying(crypto);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) setAmount(value);
  };

  const calculateEquivalent = () => {
    return ((amount * selling.rate) / buying.rate).toFixed(4);
  };

  return (
    <>
      <div className="trezo-card bg-purple-100 dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between border-b border-gray-200 dark:border-[#172036] pb-[8px] -mx-[20px] md:-mx-[25px] px-[20px] md:px-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Exchange</h5>
          </div>
          <div className="trezo-card-subtitle">
            <button
              type="button"
              className="inline-block leading-none text-black dark:text-white transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined">refresh</i>
            </button>
          </div>
        </div>

        <div className="trezo-card-content pb-[13px]">
          {/* Selling Section */}
          <div className="mb-[20px] md:mb-[25px]">
            <div className="flex items-center justify-between mb-[12px]">
              <span className="block uppercase">Selling</span>
              <span className="block uppercase">Max 4,238</span>
            </div>

            <Menu as="div" className="cryptocurrency-types relative">
              <MenuButton className="block w-full relative text-black dark:text-white uppercase font-medium text-sm md:text-base">
                <span className="flex items-center">
                  <Image
                    src={selling.image}
                    className="ltr:mr-[10px] rtl:ml-[10px]"
                    alt={selling.name}
                    width={42}
                    height={42}
                  />
                  {selling.name}
                  <span className="ltr:ml-[5px] rtl:mr-[5px] font-normal text-gray-500 dark:text-gray-400">
                    ({selling.symbol})
                  </span>
                </span>
                <i className="ri-arrow-down-s-line absolute ltr:-right-[4px] rtl:-left-[4px] text-[22px] top-1/2 -translate-y-1/2"></i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {cryptocurrencies.map((crypto) => (
                  <MenuItem
                    key={crypto.symbol}
                    as="div"
                    className={`flex items-center w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] cursor-pointer hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                      selling.symbol === crypto.symbol
                        ? "bg-gray-50 dark:bg-[#333]"
                        : ""
                    }`}
                    onClick={() => handleSellingChange(crypto)}
                  >
                    <Image
                      src={crypto.image}
                      className="w-[22px] ltr:mr-[8px] rtl:ml-[8px]"
                      alt={crypto.name}
                      width={22}
                      height={22}
                    />
                    {crypto.name}
                    <span className="font-normal ltr:ml-[3px] rtl:mr-[3px] text-gray-500 dark:text-gray-400">
                      ({crypto.symbol})
                    </span>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            <div className="relative mt-[15px]">
              <label className="absolute ltr:left-[20px] rtl:right-[20px] text-xs top-[8px]">
                {selling.symbol}
              </label>
              <input
                type="text"
                className="block w-full bg-white dark:bg-[#0c1427] border border-white dark:border-[#0c1427] rounded-md font-bold text-black dark:text-white px-[20px] h-[50px] pt-[16px] outline-0"
                value={amount}
                onChange={handleAmountChange}
              />
              <span className="absolute ltr:right-[20px] rtl:left-[20px] inline-block top-1/2 -translate-y-1/2">
                ${(amount * selling.rate).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buying Section */}
          <div className="mb-[20px] md:mb-[25px]">
            <div className="flex items-center justify-between mb-[12px]">
              <span className="block uppercase">Buying</span>
            </div>

            <Menu as="div" className="cryptocurrency-types relative">
              <MenuButton className="block w-full relative text-black dark:text-white uppercase font-medium text-sm md:text-base">
                <span className="flex items-center">
                  <Image
                    src={buying.image}
                    className="ltr:mr-[10px] rtl:ml-[10px]"
                    alt={buying.name}
                    width={42}
                    height={42}
                  />
                  {buying.name}
                  <span className="ltr:ml-[5px] rtl:mr-[5px] font-normal text-gray-500 dark:text-gray-400">
                    ({buying.symbol})
                  </span>
                </span>
                <i className="ri-arrow-down-s-line absolute ltr:-right-[4px] rtl:-left-[4px] text-[22px] top-1/2 -translate-y-1/2"></i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {cryptocurrencies.map((crypto) => (
                  <MenuItem
                    as="div"
                    key={crypto.symbol}
                    className={`flex items-center w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] cursor-pointer hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                      selling.symbol === crypto.symbol
                        ? "bg-gray-50 dark:bg-[#333]"
                        : ""
                    }`}
                    onClick={() => handleBuyingChange(crypto)}
                  >
                    <Image
                      src={crypto.image}
                      className="w-[22px] ltr:mr-[8px] rtl:ml-[8px]"
                      alt={crypto.name}
                      width={22}
                      height={22}
                    />
                    {crypto.name}
                    <span className="font-normal ltr:ml-[3px] rtl:mr-[3px] text-gray-500 dark:text-gray-400">
                      ({crypto.symbol})
                    </span>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            <div className="relative mt-[15px]">
              <label className="absolute ltr:left-[20px] rtl:right-[20px] text-xs top-[8px]">
                {buying.symbol}
              </label>
              <input
                type="text"
                className="block w-full bg-white dark:bg-[#0c1427] border border-white dark:border-[#0c1427] rounded-md font-bold text-black dark:text-white px-[20px] h-[50px] pt-[16px] outline-0"
                value={calculateEquivalent()}
                readOnly
              />
              <span className="absolute ltr:right-[20px] rtl:left-[20px] inline-block top-1/2 -translate-y-1/2">
                ${buying.rate}
              </span>
            </div>
          </div>

          <button
            className="py-[11px] px-[30px] block w-full text-center font-medium md:text-md rounded-md bg-primary-500 text-white transition-all hover:bg-primary-400"
            type="button"
          >
            Exchange
          </button>
        </div>
      </div>
    </>
  );
};

export default Exchange;
