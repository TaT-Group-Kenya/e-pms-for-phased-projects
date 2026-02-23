"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const RecentlyPlayed: React.FC = () => {
  const [tracks, setTracks] = useState([
    {
      id: 1,
      title: "Mastering Digital Marketing",
      artist: "Sarah Johnson",
      image: "/images/playlists/playlist1.jpg",
      audio: "https://cldup.com/qR72ozoaiQ.mp3",
      played: "40min. ago",
      listens: 8200,
      duration: "45:30",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Content Marketing Essentials",
      artist: "Tom Richards",
      image: "/images/playlists/playlist2.jpg",
      audio: "https://cldup.com/qR72ozoaiQ.mp3",
      played: "1h. ago",
      listens: 9500,
      duration: "25:50",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Social Media Trends for 2025",
      artist: "David Chen",
      image: "/images/playlists/playlist3.jpg",
      audio: "https://cldup.com/qR72ozoaiQ.mp3",
      played: "1day ago",
      listens: 7400,
      duration: "30:20",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Advanced SEO Techniques",
      artist: "Emily Davis",
      image: "/images/playlists/playlist4.jpg",
      audio: "https://cldup.com/qR72ozoaiQ.mp3",
      played: "2days ago",
      listens: 6800,
      duration: "50:10",
      isFavorite: false,
    },
    {
      id: 5,
      title: "Email Marketing Strategies",
      artist: "Michael Brown",
      image: "/images/playlists/playlist5.jpg",
      audio: "https://cldup.com/qR72ozoaiQ.mp3",
      played: "3days ago",
      listens: 7200,
      duration: "35:45",
      isFavorite: false,
    },
    {
      id: 6,
      title: "Data-Driven Marketing Insights",
      artist: "Laura Wilson",
      image: "/images/playlists/playlist6.jpg",
      audio: "https://cldup.com/qR72ozoaiQ.mp3",
      played: "5days ago",
      listens: 8900,
      duration: "40:15",
      isFavorite: false,
    },
  ]);

  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  const handlePlay = (trackId: number) => {
    if (currentTrack === trackId) {
      if (audio) {
        audio.pause();
        setCurrentTrack(null);
        setAudio(null);
      }
    } else {
      const track = tracks.find((t) => t.id === trackId);
      if (track) {
        const newAudio = new Audio(track.audio);
        if (audio) {
          audio.pause();
        }
        setAudio(newAudio);
        setCurrentTrack(trackId);
      }
    }
  };

  const handleFavorite = (trackId: number) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.id === trackId
          ? { ...track, isFavorite: !track.isFavorite }
          : track
      )
    );
  };

  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[30px] lg:mb-[38px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Recently Played</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Link
              href="#"
              className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
            >
              View All{" "}
              <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto -mt-[14px]">
            <table className="w-full without-top-bottom-border">
              <tbody className="text-black dark:text-white">
                {tracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className={
                      index === 0 || index === tracks.length - 1
                        ? "no-border"
                        : ""
                    }
                  >
                    <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[12.5px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[10px]">
                        <button
                          onClick={() => handlePlay(track.id)}
                          className="inline-block leading-none text-xl text-primary-500"
                        >
                          <i
                            className={`ri-${
                              currentTrack === track.id ? "pause" : "play"
                            }-large-fill`}
                          ></i>
                        </button>
                        <div className="rounded-md w-[34px]">
                          <Image
                            alt="user-image"
                            className="rounded-md"
                            src={track.image}
                            width={34}
                            height={34}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {track.title}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {track.artist}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[12.5px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                      Played {track.played}
                    </td>

                    <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[12.5px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="block text-gray-500 dark:text-gray-400 relative ltr:pl-[27px] rtl:pr-[27px]">
                        <i className="material-symbols-outlined !text-[20px] absolute top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0 text-primary-500">
                          headset_mic
                        </i>
                        {track.listens}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[12.5px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <button
                        type="button"
                        onClick={() => handleFavorite(track.id)}
                        className="leading-none text-xl text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                      >
                        <i
                          className={`ri-${
                            track.isFavorite
                              ? "heart-fill text-primary-500"
                              : "heart-line"
                          }`}
                        ></i>
                      </button>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[12.5px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {track.duration}
                    </td>

                    <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[12.5px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <Menu
                        as="div"
                        className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
                      >
                        <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                          <i className="ri-more-2-fill"></i>
                        </MenuButton>

                        <MenuItems
                          className={`transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ${
                            index >= tracks.length - 2
                              ? "bottom-full"
                              : "top-full"
                          }`}
                        >
                          {[
                            "Add to Playlist",
                            "Go to Album",
                            "View Credits",
                          ].map((option) => (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-border:first-child td {
          border-top: none;
          padding-top: 0;
        }
        .no-border:last-child td {
          border-bottom: none;
          padding-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default RecentlyPlayed;
