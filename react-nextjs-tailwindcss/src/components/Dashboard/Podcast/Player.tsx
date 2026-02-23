"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Default progress is 0
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time and duration
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Handle progress bar click (seek)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
      audioRef.current.currentTime = seekTime;
    }
  };

  // Format time (convert seconds to mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Reset player
  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false); // Stop playback
    }
  };

  // Fast forward or rewind
  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current; // Store the current audio element in a variable

    if (audioElement) {
      // Reset audio progress to 0 when the component mounts
      audioElement.currentTime = 0;

      // Add event listeners for time updates and metadata
      audioElement.addEventListener("timeupdate", updateTime);
      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration || 0);
      });

      // Add event listener for when the audio ends
      audioElement.addEventListener("ended", () => {
        resetPlayer(); // Reset and stop playback when audio ends
      });
    }

    return () => {
      if (audioElement) {
        // Clean up event listeners using the stored variable
        audioElement.removeEventListener("timeupdate", updateTime);
        audioElement.removeEventListener("loadedmetadata", () => {});
        audioElement.removeEventListener("ended", () => {});
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount

  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Player</h5>
          </div>

          <Menu
            as="div"
            className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
          >
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
              <i className="ri-more-2-fill"></i>
            </MenuButton>

            <MenuItems className="transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ">
              {["Add Music", "Block Music", "Delete Music"].map((option) => (
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

        <div className="trezo-card-content">
          <div
            className="rounded-md h-[205px] bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: "url(/images/player.jpg)",
            }}
          ></div>
          <div className="flex justify-between mt-[19px]">
            <div>
              <h6 className="!font-medium !text-base !mb-[7px]">
                Building an Online Presence
              </h6>
              <span className="block text-xs">Ethan Cooper</span>
            </div>
            <button
              type="button"
              onClick={toggleFavorite}
              className="leading-none relative text-[25px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 -top-[5px]"
            >
              <i
                className={`ri-${isFavorite ? "heart-fill" : "heart-line"}${
                  isFavorite ? " text-primary-500" : ""
                }`}
              ></i>
            </button>
          </div>

          <div id="musicPlayer" className="mt-[15px]" data-player>
            <div className="time-info flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="duration">{formatTime(duration)}</span>
            </div>

            <div
              className="progress mt-[6px] h-[4px] w-full relative rounded-[30px] bg-gray-200 dark:bg-dark cursor-pointer"
              onClick={handleSeek}
              ref={progressBarRef}
            >
              <div
                className="progress-bar bg-primary-500 h-full rounded-[30px]"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              ></div>
            </div>

            <audio ref={audioRef} src="https://cldup.com/qR72ozoaiQ.mp3"></audio>

            <div className="flex items-center justify-between mt-[15px]">
              <div className="flex items-center ltr:-ml-[5px] rtl:-mr-[5px]">
                <button
                  className="rewindBtn leading-none text-[21px] transition-all text-primary-300 dark:text-gray-400 hover:text-primary-500"
                  type="button"
                  onClick={() => skip(-10)}
                >
                  <i className="ri-skip-left-fill"></i>
                </button>
                <button
                  className="fastForwardBtn leading-none text-[21px] transition-all text-primary-300 dark:text-gray-400 hover:text-primary-500"
                  type="button"
                  onClick={() => skip(10)}
                >
                  <i className="ri-skip-right-fill"></i>
                </button>
              </div>
              <button
                type="button"
                className="playPauseBtn flex items-center justify-center w-[44px] h-[44px] text-[20px] transition-all text-primary-500 bg-primary-50 rounded-full hover:bg-primary-500 hover:text-white dark:bg-dark"
                onClick={togglePlayPause}
              >
                <span className="playPauseIcon">{isPlaying ? "⏸" : "▶"}</span>
              </button>
              <button
                className="restartBtn leading-none text-lg transition-all text-primary-300 dark:text-gray-400 hover:text-primary-500"
                type="button"
                onClick={resetPlayer}
              >
                <i className="ri-reset-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;