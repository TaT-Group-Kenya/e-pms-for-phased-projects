"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface NFTData {
  id: string;
  name: string;
  username: string;
  volume: number;
  price: string;
  status: string;
  image: string;
}

const TopNFTs: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");
  const [nftData, setNftData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate an API call with setTimeout
      setTimeout(() => {
        const data: NFTData[] = [
          {
            id: "1",
            name: "Sky Bird",
            username: "@queensland",
            volume: 6240,
            price: "624 ETH",
            status: "+5.4%",
            image: "/images/nfts/top1.gif",
          },
          {
            id: "2",
            name: "Walking Brain",
            username: "@neverdies",
            volume: 5135,
            price: "597 ETH",
            status: "-3.2%",
            image: "/images/nfts/top2.gif",
          },
          {
            id: "3",
            name: "Flying Flower",
            username: "@emoticons",
            volume: 4321,
            price: "413 ETH",
            status: "+2.5%",
            image: "/images/nfts/top3.gif",
          },
          {
            id: "4",
            name: "Living Robot",
            username: "@puzzleworld",
            volume: 3124,
            price: "321 ETH",
            status: "-1.5%",
            image: "/images/nfts/top4.gif",
          },
          {
            id: "5",
            name: "Thumbs Up",
            username: "@liveslong",
            volume: 2137,
            price: "246 ETH",
            status: "+5.4%",
            image: "/images/nfts/top5.gif",
          }, 
        ];
        setNftData(data);
        setLoading(false);
      }, 1000); // Simulate a 1-second delay
    };

    fetchData();
  }, [selectedOption]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top NFTs</h5>
          </div>

          <div className="trezo-card-subtitle">
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
                {["Weekly", "Monthly", "Yearly"].map((option) => (
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

        <div className="trezo-card-content">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <div className="table-responsive overflow-x-auto">
              <table className="w-full without-border">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                      Sellers
                    </th>
                    <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                      Volumn
                    </th>
                    <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                      Flow Price
                    </th>
                    <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                
                <tbody className="text-black dark:text-white">
                  {nftData.map((nft, index) => (
                    <tr key={index}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                        <div className="flex items-center gap-[10px]">
                          <div className="rounded-full w-[40px]">
                            <Image
                              src={nft.image}
                              className="inline-block rounded-full"
                              alt="nft-image"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div>
                            <span className="font-semibold inline-block mb-px">
                              {nft.name}
                            </span>
                            <span className="block text-gray-500 dark:text-gray-400 text-xs">
                              {nft.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                        <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {nft.volume}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                        <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {nft.price}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                        <span
                          className={`inline-block text-xs px-[9px] dark:bg-[#15203c] dark:border-[#15203c] ${
                            nft.status.startsWith("+")
                              ? "text-success-700 border-success-300 bg-success-100"
                              : "text-orange-700 border-orange-300 bg-orange-100"
                          } border text-sm rounded-[100px]`}
                        >
                          {nft.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopNFTs;
