"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface PortfolioItem {
  id: number;
  coin: string;
  symbol: string;
  amount: string;
  totalValue: string;
}

const Portfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [totalBalance, setTotalBalance] = useState<string>("");

  useEffect(() => {
    // Simulate fetching data
    const fetchPortfolio = () => {
      const data: PortfolioItem[] = [
        {
          id: 1,
          coin: "Bitcoin",
          symbol: "BTC",
          amount: "0.50 BTC",
          totalValue: "$13,500",
        },
        {
          id: 2,
          coin: "Ethereum",
          symbol: "ETH",
          amount: "5.00 ETH",
          totalValue: "$8,750",
        },
        {
          id: 3,
          coin: "Binance",
          symbol: "BNB",
          amount: "100 SOL",
          totalValue: "$3,500",
        },
        {
          id: 4,
          coin: "Tether",
          symbol: "USDT",
          amount: "10 BNB",
          totalValue: "$2,500",
        },
        {
          id: 5,
          coin: "XRP",
          symbol: "XRP",
          amount: "1,000 ADA",
          totalValue: "$250",
        },
      ];

      const total = data.reduce((acc, item) => {
        const value = parseFloat(item.totalValue.replace(/[$,]/g, ""));
        return acc + value;
      }, 0);

      setPortfolioItems(data);
      setTotalBalance(`$${total.toLocaleString()}`);
    };

    fetchPortfolio();
  }, []);

  return (
    <>
      <div
        className="trezo-card bg-primary-600 bg-left-bottom bg-no-repeat bg-contain mb-[25px] p-[20px] md:p-[25px] rounded-md"
        style={{ backgroundImage: "url(/images/portfolio-bg.jpg)" }}
      >
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-white">Portfolio</h5>
          </div>
        </div>

        <div className="trezo-card-content relative z-[1] md:mt-[29px]">
          <div className="flex items-center mb-[20px] md:mb-[28px]">
            <Image
              src="/images/icons/total-balance.svg"
              alt="total-balance"
              width={40}
              height={40}
            />
            <div className="ltr:ml-[10px] rtl:mr-[10px]">
              <span className="block uppercase text-white">Total balance</span>
              <h4 className="!mb-0 !text-white !font-semibold !mt-[6px] !text-[18px] md:!text-[20px]">
                {totalBalance}
                <span className="font-medium relative text-base ltr:ml-[3px] rtl:mr-[3px] ltr:pl-[25px] rtl:pr-[25px] text-success-100">
                  <i className="material-symbols-outlined absolute !text-[20px] ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                    trending_up
                  </i>
                  +2.3%
                </span>
              </h4>
            </div>
          </div>

          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-white">
                <tr>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Coin
                  </th>
                  <th className="font-medium text-xs text-center px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Amount
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Total Value
                  </th>
                </tr>
              </thead>

              <tbody className="text-white">
                {portfolioItems.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b !border-primary-400">
                      {item.coin}{" "}
                      <span className="text-xs font-normal">
                        ({item.symbol})
                      </span>
                    </td>
                    <td className="font-medium text-center whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b !border-primary-400">
                      {item.amount}
                    </td>
                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b !border-primary-400">
                      {item.totalValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ltr:text-right rtl:text-left">
            <a
              href="#"
              className="inline-block px-[12px] py-[4px] rounded-md text-white font-medium border border-primary-400 transition-all hover:bg-primary-400 mt-[20px] md:mt-[28px]"
            >
              <span className="inline-block relative ltr:pr-[17px] rtl:pl-[17px]">
                View All Portfolio
                <i className="ri-arrow-right-s-line absolute ltr:-right-[6px] rtl:-left-[6px] text-[20px] top-1/2 -translate-y-1/2"></i>
              </span>
            </a>
          </div>

          <div className="absolute ltr:right-0 rtl:left-0 -top-[55px] -z-[1] hidden md:block">
            <Image
              src="/images/sphere-bowl.png"
              alt="sphere-bowl"
              width={130}
              height={107}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
