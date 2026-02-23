"use client";

import React from "react";

interface TokenData {
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const GainersLosers: React.FC = () => {
  const tokenData: TokenData[] = [
    {
      name: "Goatseus Maximus",
      price: "$0.719",
      change: "+ 47.44%",
      isPositive: true,
    },
    {
      name: "Uniswap",
      price: "$9.15",
      change: "- 31.87%",
      isPositive: false,
    },
    {
      name: "Aave",
      price: "$161.05",
      change: "+ 23.94%",
      isPositive: true,
    },
    {
      name: "Bittenso",
      price: "$526.97",
      change: "- 22.94%",
      isPositive: false,
    },
    {
      name: "Injective",
      price: "$20.87",
      change: "+ 21.41%",
      isPositive: true,
    },
    {
      name: "Monero",
      price: "$209.38",
      change: "- 0.84%",
      isPositive: false,
    },
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Gainers & Losers</h5>
        </div>
        <div className="trezo-card-subtitle">Timeframe: 24h</div>
      </div>
      <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <tbody className="text-black dark:text-white">
              {tokenData.map((token, index) => (
                <tr key={index} className="group">
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11.9px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] text-[13px] group-last:pb-0 group-last:border-b-0 group-first:pt-0 group-first:!border-t-0">
                    {token.name}
                  </td>
                  <td className="text-gray-500 dark:text-gray-400 text-center whitespace-nowrap px-[20px] py-[11.9px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] text-[13px] group-last:pb-0 group-last:border-b-0 group-first:pt-0 group-first:!border-t-0">
                    {token.price}
                  </td>
                  <td
                    className={`${
                      token.isPositive ? "text-success-600" : "text-danger-500"
                    } ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[11.9px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] text-[13px] group-last:pb-0 group-last:border-b-0 group-first:pt-0 group-first:!border-t-0`}
                  >
                    {token.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GainersLosers;
