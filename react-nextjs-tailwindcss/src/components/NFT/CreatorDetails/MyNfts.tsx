"use client";

import React, { useState } from "react";
import Image from "next/image"; 

interface Nft {
  id: number;
  image: string;
  name: string;
  artist: string;
  price: string;
  bid: string;
  time: string;
  status: "all" | "inAuction" | "sold";
}

const MyNfts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Number of items per page

  const [nfts] = useState<Nft[]>([
    {
      id: 1,
      image: "/images/nfts/auction1.gif",
      name: "Christmas Eve",
      artist: "John Lira",
      price: "11.75 ETH",
      bid: "10.00 ETH",
      time: "30 mins ago",
      status: "inAuction",
    },
    {
      id: 2,
      image: "/images/nfts/auction2.gif",
      name: "Rotating Flower",
      artist: "WalterW.",
      price: "9.25 ETH",
      bid: "6.10 ETH",
      time: "1 hr ago",
      status: "sold",
    },
    {
      id: 3,
      image: "/images/nfts/auction3.jpg",
      name: "Starry Nights",
      artist: "Van Gogh",
      price: "12.50 ETH",
      bid: "10.80 ETH",
      time: "3 hrs ago",
      status: "inAuction",
    },
    {
      id: 4,
      image: "/images/nfts/auction4.jpg",
      name: "CyberPunk City",
      artist: "Neo-Future",
      price: "15.00 ETH",
      bid: "12.30 ETH",
      time: "5 hrs ago",
      status: "sold",
    },
    {
      id: 5,
      image: "/images/nfts/auction5.jpg",
      name: "Abstract Light",
      artist: "Picasso",
      price: "8.75 ETH",
      bid: "6.00 ETH",
      time: "6 hrs ago",
      status: "inAuction",
    },
    {
      id: 6,
      image: "/images/nfts/auction1.gif",
      name: "Golden Sunset",
      artist: "Leonardo",
      price: "14.20 ETH",
      bid: "11.90 ETH",
      time: "10 hrs ago",
      status: "sold",
    },
    {
      id: 7,
      image: "/images/nfts/auction2.gif",
      name: "Digital Waves",
      artist: "Elon Art",
      price: "10.40 ETH",
      bid: "9.80 ETH",
      time: "12 hrs ago",
      status: "inAuction",
    },
    {
      id: 8,
      image: "/images/nfts/auction3.jpg",
      name: "Galactic Dreams",
      artist: "AstroN",
      price: "13.75 ETH",
      bid: "11.00 ETH",
      time: "15 hrs ago",
      status: "sold",
    },
    {
      id: 9,
      image: "/images/nfts/auction4.jpg",
      name: "Futuristic Skyline",
      artist: "SkyMaster",
      price: "11.60 ETH",
      bid: "9.75 ETH",
      time: "18 hrs ago",
      status: "inAuction",
    },
    {
      id: 10,
      image: "/images/nfts/auction5.jpg",
      name: "Mystic Forest",
      artist: "NatureLover",
      price: "9.50 ETH",
      bid: "8.20 ETH",
      time: "20 hrs ago",
      status: "sold",
    },
    {
      id: 11,
      image: "/images/nfts/auction1.gif",
      name: "Oceanic Vibes",
      artist: "AquaArtist",
      price: "10.00 ETH",
      bid: "9.00 ETH",
      time: "1 day ago",
      status: "inAuction",
    },
    {
      id: 12,
      image: "/images/nfts/auction2.gif",
      name: "Neon Fusion",
      artist: "TechArt",
      price: "14.80 ETH",
      bid: "13.50 ETH",
      time: "2 days ago",
      status: "sold",
    },
    {
      id: 13,
      image: "/images/nfts/auction3.jpg",
      name: "Electric Pulse",
      artist: "PowerCore",
      price: "12.90 ETH",
      bid: "11.75 ETH",
      time: "3 days ago",
      status: "inAuction",
    },
    {
      id: 14,
      image: "/images/nfts/auction4.jpg",
      name: "Firestorm",
      artist: "Inferno",
      price: "16.40 ETH",
      bid: "14.30 ETH",
      time: "4 days ago",
      status: "sold",
    },
    {
      id: 15,
      image: "/images/nfts/auction5.jpg",
      name: "Digital Cube",
      artist: "ArtBot",
      price: "11.30 ETH",
      bid: "10.50 ETH",
      time: "5 days ago",
      status: "inAuction",
    },
    {
      id: 16,
      image: "/images/nfts/auction1.gif",
      name: "Moonlight Shadows",
      artist: "Lunar",
      price: "13.20 ETH",
      bid: "12.00 ETH",
      time: "6 days ago",
      status: "sold",
    },
    {
      id: 17,
      image: "/images/nfts/auction2.gif",
      name: "Emerald Dream",
      artist: "JewelArt",
      price: "9.90 ETH",
      bid: "8.80 ETH",
      time: "7 days ago",
      status: "inAuction",
    },
    {
      id: 18,
      image: "/images/nfts/auction3.jpg",
      name: "Lost Dimension",
      artist: "Phantom",
      price: "14.60 ETH",
      bid: "13.20 ETH",
      time: "8 days ago",
      status: "sold",
    },
    {
      id: 19,
      image: "/images/nfts/auction4.jpg",
      name: "Cosmic Burst",
      artist: "Galaxia",
      price: "12.00 ETH",
      bid: "10.80 ETH",
      time: "9 days ago",
      status: "inAuction",
    },
    {
      id: 20,
      image: "/images/nfts/auction5.jpg",
      name: "Silent Echo",
      artist: "EchoMan",
      price: "10.75 ETH",
      bid: "9.50 ETH",
      time: "10 days ago",
      status: "sold",
    },
  ]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1); // Reset to the first page when changing tabs
  };

  const filteredNfts = nfts.filter((nft) => {
    if (activeTab === 0) return true; // Show all NFTs
    if (activeTab === 1) return nft.status === "inAuction";
    if (activeTab === 2) return nft.status === "sold";
    return true;
  });

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNfts.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Angela’s NFTs</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="trezo-tabs">
            <ul className="nfts-navs mb-[20px]">
              <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px] ltr:md:mr-[35px] rtl:md:ml-[35px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(0)}
                  className={`nav-link block transition-all relative uppercase md:tracking-[2px] text-xs font-semibold ${
                    activeTab === 0 ? "active" : ""
                  }`}
                >
                  All
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px] ltr:md:mr-[35px] rtl:md:ml-[35px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(1)}
                  className={`nav-link block transition-all relative uppercase md:tracking-[2px] text-xs font-semibold ${
                    activeTab === 1 ? "active" : ""
                  }`}
                >
                  IN AUCTION
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px] ltr:md:mr-[35px] rtl:md:ml-[35px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(2)}
                  className={`nav-link block transition-all relative uppercase md:tracking-[2px] text-xs font-semibold ${
                    activeTab === 2 ? "active" : ""
                  }`}
                >
                  SOLD
                </button>
              </li>
            </ul>

            <div>
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <tbody className="text-black dark:text-white">
                    {currentItems.map((nft) => (
                      <tr key={nft.id}>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <div className="flex items-center gap-[10px]">
                            <div className="rounded-full w-[50px]">
                              <Image
                                src={nft.image}
                                className="inline-block rounded-[6px]"
                                alt="auction-image"
                                width={50}
                                height={50}
                              />
                            </div>
                            <div>
                              <span className="font-semibold inline-block mb-px">
                                {nft.name}
                              </span>
                              <span className="block text-gray-500 dark:text-gray-400 text-xs">
                                by {nft.artist}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {nft.price}
                          </span>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {nft.bid}
                          </span>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                          <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {nft.time}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-[10px] sm:flex sm:items-center justify-between">
                <p className="!mb-0 !text-sm">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredNfts.length)} of{" "}
                  {filteredNfts.length} results
                </p>

                <ol className="mt-[10px] sm:mt-0">
                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    >
                      <span className="opacity-0">0</span>
                      <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                        chevron_left
                      </i>
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                    >
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                          currentPage === index + 1
                            ? "border-primary-500 bg-primary-500 text-white"
                            : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
        </div>
      </div>
    </>
  );
};

export default MyNfts;
