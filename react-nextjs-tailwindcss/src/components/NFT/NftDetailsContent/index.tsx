"use client";

import React, { useState } from "react";
import Image from "next/image";

// Define the data structure
interface NftImage {
  id: number;
  src: string;
  alt: string;
}

// Dynamic data for NFT images
const nftImages: NftImage[] = [
  {
    id: 0,
    src: "/images/nfts/nft-details1.jpg",
    alt: "nft-details-image-1",
  },
  {
    id: 1,
    src: "/images/nfts/nft-details2.jpg",
    alt: "nft-details-image-2",
  },
  {
    id: 2,
    src: "/images/nfts/nft-details3.jpg",
    alt: "nft-details-image-3",
  },
  {
    id: 3,
    src: "/images/nfts/nft-details4.jpg",
    alt: "nft-details-image-4",
  },
];

const NftDetailsContent: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<number>(0);

  // Handle tab click
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // Product Description tabs
  const [pdActiveTab, setpdActiveTab] = useState(0);

  const handlepdTabClick = (index: number) => {
    setpdActiveTab(index);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="2xl:col-span-1">
          <div className="trezo-card">
            <div className="trezo-card-content" id="nftDetailsImageSlides">
              {/* Display the active image */}
              {nftImages.map(
                (image) =>
                  activeTab === image.id && (
                    <div
                      key={image.id}
                      className="bg-white dark:bg-[#0c1427] p-[13px]"
                    >
                      <Image
                        className="rounded-md"
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={600}
                      />
                    </div>
                  )
              )}

              <div className="my-[15px] flex items-center justify-between gap-4">
                {nftImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleTabClick(image.id)}
                    className={`cursor-pointer ${
                      activeTab === image.id
                        ? "border rounded-md border-primary-500"
                        : ""
                    }`}
                  >
                    <Image
                      className="rounded-md"
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={600}
                    />
                  </div>
                ))}
              </div>

              <button
                className="text-[15px] md:text-md rounded-[4px] bg-primary-500 text-white font-medium py-[7px] px-[20px] transition-all hover:bg-primary-400 block w-full"
                type="button"
              >
                Place Bid
              </button>
            </div>
          </div>
        </div>

        <div className="2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content">
              <span className="block text-xs mb-[2px]">NFT ID: 35246</span>

              <h2 className="!text-lg md:!text-xl !mb-0">Christmas Eve</h2>

              <div className="h-[1px] bg-primary-50 dark:bg-[#172036] mt-[12px] mb-[15px]"></div>

              <div className="sm:flex items-center sm:gap-[40px]">
                <div className="flex items-center gap-[10px]">
                  <div className="relative ltr:pr-[7px] rtl:pl-[7px]">
                    <Image
                      src="/images/nfts/author.gif"
                      className="rounded-full w-[35px]"
                      alt="author-image"
                      width={35}
                      height={35}
                    />
                    <Image
                      src="/images/nfts/verified2.svg"
                      className="absolute ltr:right-0 rtl:left-0 bottom-0"
                      alt="verified"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs">
                      Creator
                    </span>
                    <span className="font-semibold text-black dark:text-white inline-block">
                      Anan Loren
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-[10px] mt-[20px] sm:mt-0">
                  <Image
                    src="/images/icons/schedule.svg"
                    alt="schedule"
                    width={28}
                    height={28}
                  />
                  <div>
                    <span className="block text-xs">Published</span>
                    <span className="block text-black dark:text-white font-semibold">
                      23 June 2024
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-[20px] py-[19px] px-[20px] md:px-[25px] bg-gray-50 dark:bg-[#0a0e19] sm:flex items-center justify-between gap-[15px] rounded-md text-center">
                <div className="mt-[15px] first:mt-0 sm:mt-0">
                  <span className="block text-xs">Price:</span>
                  <span className="block font-semibold text-primary-800">
                    5.50 ETH
                  </span>
                </div>

                <div className="mt-[15px] first:mt-0 sm:mt-0">
                  <span className="block text-xs">Highest Bid:</span>
                  <span className="block font-semibold text-gray-900 dark:text-gray-400">
                    4.95 ETH
                  </span>
                </div>

                <div className="mt-[15px] first:mt-0 sm:mt-0">
                  <span className="block text-xs">Stock:</span>
                  <span className="block font-semibold text-gray-900 dark:text-gray-400">
                    130/450
                  </span>
                </div>

                <div className="mt-[15px] first:mt-0 sm:mt-0">
                  <span className="block text-xs">Auction End In:</span>
                  <span className="active-auctions-timer block font-semibold text-gray-900 dark:text-gray-400">
                    <span className="hours-span px-1">
                      <span className="hours">03</span>h
                    </span>
                    <span className="minutes-span px-1">
                      <span className="minutes">56</span>m
                    </span>
                    <span className="seconds-span px-1">
                      <span className="seconds">46</span>s
                    </span>
                  </span>
                </div>
              </div>

              <h3 className="!text-lg !mt-[20px] md:!mt-[45px] !mb-[12px]">
                Description
              </h3>

              <p className="leading-[1.7]">
                This NFT captures the essence of boundless potential, symbolized
                by a surreal landscape where the sky meets the earth in a
                dazzling fusion of colors. The intricate design features flowing
                lines that blend together, representing the limitless paths we
                can take in life.
              </p>

              <h3 className="!text-lg !mt-[20px] md:!mt-[45px] !mb-[20px]">
                Product Description
              </h3>
              <div className="trezo-tabs" id="trezo-tabs">
                <ul className="nfts-navs mb-[20px]">
                  <li className="nav-item inline-block ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-[35px] rtl:md:ml-[35px]">
                    <button
                      type="button"
                      onClick={() => handlepdTabClick(0)}
                      className={`nav-link block transition-all relative uppercase md:tracking-[2px] text-xs font-semibold ${
                        pdActiveTab === 0 ? "active" : ""
                      }`}
                    >
                      Place Bids
                    </button>
                  </li>

                  <li className="nav-item inline-block ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-[35px] rtl:md:ml-[35px]">
                    <button
                      type="button"
                      onClick={() => handlepdTabClick(1)}
                      className={`nav-link block transition-all relative uppercase md:tracking-[2px] text-xs font-semibold ${
                        pdActiveTab === 1 ? "active" : ""
                      }`}
                    >
                      Additional Information
                    </button>
                  </li>

                  <li className="nav-item inline-block ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-[35px] rtl:md:ml-[35px]">
                    <button
                      type="button"
                      onClick={() => handlepdTabClick(2)}
                      className={`nav-link block transition-all relative uppercase md:tracking-[2px] text-xs font-semibold ${
                        pdActiveTab === 2 ? "active" : ""
                      }`}
                    >
                      Details
                    </button>
                  </li>
                </ul>

                <div>
                  {pdActiveTab === 0 && (
                    <div className="table-responsive overflow-x-auto">
                      <table className="w-full">
                        <tbody className="text-black dark:text-white">
                          <tr>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full w-[50px]">
                                  <Image
                                    src="/images/nfts/auction1.gif"
                                    className="inline-block rounded-[6px]"
                                    alt="auction-image"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold inline-block mb-px">
                                    Christmas Eve
                                  </span>
                                  <span className="block text-gray-500 dark:text-gray-400 text-xs">
                                    by John Lira
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                11.75 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                10.00 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                30 mins ago
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full w-[50px]">
                                  <Image
                                    src="/images/nfts/auction2.gif"
                                    className="inline-block rounded-[6px]"
                                    alt="auction-image"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold inline-block mb-px">
                                    Rotating Flower
                                  </span>
                                  <span className="block text-gray-500 dark:text-gray-400 text-xs">
                                    by WalterW.
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                9.25 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                6.10 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                1 hr ago
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full w-[50px]">
                                  <Image
                                    src="/images/nfts/auction3.jpg"
                                    className="inline-block rounded-[6px]"
                                    alt="auction-image"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold inline-block mb-px">
                                    Windows Art
                                  </span>
                                  <span className="block text-gray-500 dark:text-gray-400 text-xs">
                                    by Christino
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                17.24 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                11.75 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                1.30 hr ago
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full w-[50px]">
                                  <Image
                                    src="/images/nfts/auction4.jpg"
                                    className="inline-block rounded-[6px]"
                                    alt="auction-image"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold inline-block mb-px">
                                    3D Logo
                                  </span>
                                  <span className="block text-gray-500 dark:text-gray-400 text-xs">
                                    by Hater
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                12.12 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                10.24 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                35 mins ago
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <div className="flex items-center gap-[10px]">
                                <div className="rounded-full w-[50px]">
                                  <Image
                                    src="/images/nfts/auction5.jpg"
                                    className="inline-block rounded-[6px]"
                                    alt="auction-image"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold inline-block mb-px">
                                    Awesome Bird
                                  </span>
                                  <span className="block text-gray-500 dark:text-gray-400 text-xs">
                                    by Liveslong
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                8.15 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                7.15 ETH
                              </span>
                            </td>
                            <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                              <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                                2 hrs ago
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {pdActiveTab === 1 && (
                    <ul className="text-sm">
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Brand:
                        </span>
                        Apple
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Model:
                        </span>
                        MacBook Pro
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Price:
                        </span>
                        $2499
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Dimensions (mm):
                        </span>
                        304.10 x 212.40 x 14.90
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Weight (kg):
                        </span>
                        1.37
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Colors:
                        </span>
                        Space Grey
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Operating system:
                        </span>
                        macOS
                      </li>
                      <li className="py-[11px] px-[20px] border-b border-l border-r border-primary-50 dark:border-[#172036] first:border-t">
                        <span className="text-black dark:text-white">
                          Battery Life (up to hours):
                        </span>
                        10
                      </li>
                    </ul>
                  )}

                  {pdActiveTab === 2 && (
                    <div className="border border-primary-50 dark:border-[#172036] rounded-md p-[15px] md:p-[20px]">
                      <p className="text-sm">
                        The Apple MacBook Pro 16.2 is a cutting-edge laptop
                        designed to deliver exceptional performance and advanced
                        features for professionals and creative enthusiasts.
                        With its sleek aluminum body and precision engineering,
                        this MacBook Pro represents the pinnacle of Apple
                        laptop technology.
                      </p>
                      <p className="text-sm">
                        Stay connected with a variety of ports, including
                        Thunderbolt 3, USB-C, and audio jacks. These versatile
                        ports support high-speed data transfer and external
                        device connections. Enjoy a rich audio experience with
                        high-fidelity speakers that deliver clear and immersive
                        sound. Perfect for content creators and multimedia
                        enthusiasts.
                      </p>
                      <p className="text-sm">
                        Equipped with the latest processors, ample RAM, and
                        high-performance graphics, the MacBook Pro 16.2 ensures
                        smooth multitasking, fast rendering, and efficient
                        handling of resource-intensive tasks. Seamlessly
                        integrate with the macOS ecosystem, benefiting from
                        features like iCloud, Siri, and a vast selection of
                        applications available on the App Store.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NftDetailsContent;
