"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Define types for the featured item
type FeaturedItem = {
  title: string;
  description: string;
  host: string;
  guest: string;
  audioSrc: string;
  imageSrc: string;
  stats: {
    listens: string;
    likes: string;
    shares: string;
  };
};

// Define types for the audio state
type AudioState = {
  progress: number;
  currentTime: string;
  duration: string;
};

const Featured: React.FC = () => {
  const [featuredItems] = useState<FeaturedItem[]>([
    {
      title: "Mastering Digital Marketing",
      description:
        "Learn the latest digital marketing strategies with insights from SEO expert James Lee.",
      host: "Sarah J.",
      guest: "James Lee, SEO Expert",
      audioSrc: "https://cldup.com/qR72ozoaiQ.mp3",
      imageSrc: "/images/featured/featured1.png",
      stats: {
        listens: "8,200",
        likes: "1,500",
        shares: "350",
      },
    },
    {
      title: "Content Marketing Essentials",
      description:
        "This episode covers creating impactful content that resonates with audiences.",
      host: "Sarah J.",
      guest: "James Lee, SEO Expert",
      audioSrc: "https://cldup.com/qR72ozoaiQ.mp3",
      imageSrc: "/images/featured/featured2.png",
      stats: {
        listens: "8,200",
        likes: "1,500",
        shares: "350",
      },
    },
    {
      title: "Social Media Trends",
      description:
        "Learn the latest digital marketing strategies with insights from SEO expert James Lee.",
      host: "Sarah J.",
      guest: "James Lee, SEO Expert",
      audioSrc: "https://cldup.com/qR72ozoaiQ.mp3",
      imageSrc: "/images/featured/featured3.png",
      stats: {
        listens: "8,200",
        likes: "1,500",
        shares: "350",
      },
    },
  ]);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [audioStates, setAudioStates] = useState<{ [key: number]: AudioState }>(
    {}
  );
  const [waveHeights, setWaveHeights] = useState<{ [key: number]: number[] }>(
    {}
  );

  useEffect(() => {
    if (currentlyPlaying !== null) {
      const interval = setInterval(() => {
        setWaveHeights((prev) => {
          const newWaveHeights = { ...prev };
          newWaveHeights[currentlyPlaying] = Array(50)
            .fill(0)
            .map(() => Math.random() * 30);
          return newWaveHeights;
        });
      }, 100); // Update wave heights every 100ms
      return () => clearInterval(interval);
    }
  }, [currentlyPlaying]);

  const handlePlayPause = (index: number) => {
    const audioElement = document.getElementById(
      `audio-${index}`
    ) as HTMLAudioElement;

    if (currentlyPlaying !== null && currentlyPlaying !== index) {
      const previousAudioElement = document.getElementById(
        `audio-${currentlyPlaying}`
      ) as HTMLAudioElement;
      previousAudioElement.pause();
      previousAudioElement.currentTime = 0;
      setCurrentlyPlaying(null);
    }

    if (audioElement.paused) {
      audioElement.play();
      setCurrentlyPlaying(index);
    } else {
      audioElement.pause();
      setCurrentlyPlaying(null);
    }
  };

  const handleTimeUpdate = (index: number) => {
    const audioElement = document.getElementById(
      `audio-${index}`
    ) as HTMLAudioElement;
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;
    const progress = (currentTime / duration) * 100;

    setAudioStates((prev) => ({
      ...prev,
      [index]: {
        progress,
        currentTime: formatTime(currentTime),
        duration: formatTime(duration),
      },
    }));
  };

  const handleLoadedMetadata = (index: number) => {
    const audioElement = document.getElementById(
      `audio-${index}`
    ) as HTMLAudioElement;
    const duration = audioElement.duration;

    setAudioStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        duration: formatTime(duration),
      },
    }));
  };

  const handleEnded = (index: number) => {
    setCurrentlyPlaying(null);
    setAudioStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        progress: 0,
        currentTime: "0:00",
      },
    }));
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className="trezo-card p-[20px] md:p-[25px] rounded-md relative z-[1]"
      style={{
        background: "linear-gradient(84deg, #23272E 3.5%, #526077 94.93%)",
      }}
    >
      <div className="trezo-card-header mb-[12px] flex items-center justify-between">
        <div className="trezo-card-title">
          <span className="inline-block text-xs text-white font-medium py-[1.5px] px-[15px] rounded-[30px] bg-gray-600">
            Featured
          </span>
        </div>
      </div>

      <div className="trezo-card-content relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="podcast-featured-slides"
        >
          {featuredItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h1 className="!text-[22px] md:!text-2xl !text-white !font-medium !mb-[7px]">
                    {item.title}
                  </h1>

                  <p className="md:max-w-[370px] text-gray-200">
                    {item.description}
                  </p>

                  <div className="-mt-[5px]">
                    <div className="inline-block text-gray-50 ltr:mr-[5px] rtl:ml-[5px] rounded-[30px] py-[3.5px] px-[12.5px] border border-gray-500 mt-[10px]">
                      <span className="text-white font-semibold">Host:</span>{" "}
                      {item.host}
                    </div>
                    <div className="inline-block text-gray-50 ltr:mr-[5px] rtl:ml-[5px] rounded-[30px] py-[3.5px] px-[12.5px] border border-gray-500 mt-[10px]">
                      <span className="text-white font-semibold">Guest:</span>{" "}
                      {item.guest}
                    </div>
                  </div>

                  <div
                    className="mt-[20px] md:mt-[30px] md:max-w-[370px]"
                    data-player
                    id={`musicPlayer-${index}`}
                  >
                    <audio
                      id={`audio-${index}`}
                      src={item.audioSrc}
                      onEnded={() => handleEnded(index)}
                      onTimeUpdate={() => handleTimeUpdate(index)}
                      onLoadedMetadata={() => handleLoadedMetadata(index)}
                    ></audio>
                    <div className="flex items-center gap-[15px]">
                      <button
                        type="button"
                        className="playPauseBtn flex items-center justify-center w-[44px] h-[44px] text-xl transition-all text-primary-500 bg-primary-200 rounded-full hover:bg-primary-500 hover:text-white dark:bg-dark"
                        onClick={() => handlePlayPause(index)}
                      >
                        <span className="playPauseIcon">
                          {currentlyPlaying === index ? "⏸" : "▶"}
                        </span>
                      </button>
                      
                      <div className="relative z-[1] grow">
                        <span className="current-time block ltr:text-left rtl:text-right text-white">
                          {audioStates[index]?.currentTime || "0:00"}
                        </span>
                        <span className="duration block ltr:text-right rtl:text-left text-white">
                          {audioStates[index]?.duration || "0:00"}
                        </span>
                        <div className="progress mt-[5px] h-[4px] w-full relative rounded-[30px] bg-gray-400">
                          <div
                            className="progress-bar bg-primary-500 h-full rounded-[30px]"
                            style={{
                              width: `${audioStates[index]?.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                        <div className="wave-container flex items-center absolute rtl:left-0 rtl:right-0 bottom-0 -z-[1]">
                          {Array(50)
                            .fill(0)
                            .map((_, i) => (
                              <span
                                key={i}
                                className="wave-bar w-[2px] h-[30px] ltr:ml-px rtl:mr-px ltr:md:ml-[2.5px] rtl:md:mr-[2.5px] ltr:xl:ml-[3px] rtl:xl:mr-[3px] ltr:first:ml-0 rtl:first:mr-0 bg-gray-600 transition-all"
                                style={{
                                  height: `${waveHeights[index]?.[i] || 10}px`,
                                }}
                              ></span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mx-auto mt-[20px] md:mt-0 md:max-w-[332.5px]">
                  <Image
                    src={item.imageSrc}
                    alt="featured-image"
                    width={332.5}
                    height={200}
                  />
                </div>
              </div>
              <div className="md:flex items-center md:mt-[20px] lg:mt-[9px] gap-[20px]">
                <div className="inline-block relative ltr:pl-[40px] rtl:pr-[40px] mt-[15px] ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-0 rtl:md:ml-0 md:mt-0">
                  <div className="ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 !text-3xl text-primary-400">
                    <i className="ri-customer-service-line"></i>
                  </div>
                  <span className="block font-medium text-xs text-gray-200">
                    Listens
                  </span>
                  <h6 className="!mb-0 !font-medium !text-white !text-base">
                    {item.stats.listens}
                  </h6>
                </div>
                <div className="inline-block relative ltr:pl-[40px] rtl:pr-[40px] mt-[15px] ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-0 rtl:md:ml-0 md:mt-0">
                  <div className="ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 !text-3xl text-primary-400">
                    <i className="ri-thumb-up-line"></i>
                  </div>
                  <span className="block font-medium text-xs text-gray-200">
                    Likes
                  </span>
                  <h6 className="!mb-0 !font-medium !text-white !text-base">
                    {item.stats.likes}
                  </h6>
                </div>
                <div className="inline-block relative ltr:pl-[40px] rtl:pr-[40px] mt-[15px] ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-0 rtl:md:ml-0 md:mt-0">
                  <div className="ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 !text-3xl text-primary-400">
                    <i className="ri-share-line"></i>
                  </div>
                  <span className="block font-medium text-xs text-gray-200">
                    Shares
                  </span>
                  <h6 className="!mb-0 !font-medium !text-white !text-base">
                    {item.stats.shares}
                  </h6>
                </div>
                <div className="inline-block relative ltr:pl-[40px] rtl:pr-[40px] mt-[15px] ltr:mr-[15px] rtl:ml-[15px] ltr:md:mr-0 rtl:md:ml-0 md:mt-0">
                  <div className="ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 !text-3xl text-primary-400">
                    <i className="ri-bookmark-line"></i>
                  </div>
                  <span className="block font-medium text-xs text-gray-200">
                    Save for
                  </span>
                  <h6 className="!mb-0 !font-medium !text-white !text-base">
                    Later
                  </h6>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute -z-[1] bottom-0 ltr:right-0 rtl:left-0 rtl:-scale-x-[1]">
        <Image
          src="/images/featured/featured-shape.png"
          alt="shape-image"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default Featured;
