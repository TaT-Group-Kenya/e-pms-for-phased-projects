"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const MostPopular: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null); // Track currently playing audio
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element

  // State to manage the list of tabs and their content
  const [tabs] = useState([
    {
      id: 0,
      label: "Marketing",
      content: [
        {
          id: 1,
          image: "/images/podcasts/podcast1.jpg",
          title: "Influencer Marketing",
          author: "Amanda Garcia",
          listens: 6300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 2,
          image: "/images/podcasts/podcast2.jpg",
          title: "Data for Better Ads",
          author: "David Chen",
          listens: 8500,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 3,
          image: "/images/podcasts/podcast3.jpg",
          title: "Boosting Engagement",
          author: "Lisa Kim",
          listens: 9300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 4,
          image: "/images/podcasts/podcast4.jpg",
          title: "Real Engagement Metrics",
          author: "Sarah Johnson",
          listens: 8700,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 5,
          image: "/images/podcasts/podcast5.jpg",
          title: "SEO for E-Commerce",
          author: "Johnson",
          listens: 8900,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 6,
          image: "/images/podcasts/podcast6.jpg",
          title: "Podcast Marketing 101",
          author: "Amanda",
          listens: 9400,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
      ],
    },
    {
      id: 1,
      label: "Content",
      content: [
        {
          id: 1,
          image: "/images/podcasts/podcast3.jpg",
          title: "Boosting Engagement",
          author: "Lisa Kim",
          listens: 9300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 2,
          image: "/images/podcasts/podcast1.jpg",
          title: "Influencer Marketing",
          author: "Amanda Garcia",
          listens: 6300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 3,
          image: "/images/podcasts/podcast2.jpg",
          title: "Data for Better Ads",
          author: "David Chen",
          listens: 8500,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 4,
          image: "/images/podcasts/podcast4.jpg",
          title: "Real Engagement Metrics",
          author: "Sarah Johnson",
          listens: 8700,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 5,
          image: "/images/podcasts/podcast5.jpg",
          title: "SEO for E-Commerce",
          author: "Johnson",
          listens: 8900,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 6,
          image: "/images/podcasts/podcast6.jpg",
          title: "Podcast Marketing 101",
          author: "Amanda",
          listens: 9400,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
      ],
    },
    {
      id: 2,
      label: "Social",
      content: [
        {
          id: 1,
          image: "/images/podcasts/podcast1.jpg",
          title: "Influencer Marketing",
          author: "Amanda Garcia",
          listens: 6300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 2,
          image: "/images/podcasts/podcast5.jpg",
          title: "SEO for E-Commerce",
          author: "Johnson",
          listens: 8900,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 3,
          image: "/images/podcasts/podcast3.jpg",
          title: "Boosting Engagement",
          author: "Lisa Kim",
          listens: 9300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 4,
          image: "/images/podcasts/podcast6.jpg",
          title: "Podcast Marketing 101",
          author: "Amanda",
          listens: 9400,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 5,
          image: "/images/podcasts/podcast2.jpg",
          title: "Data for Better Ads",
          author: "David Chen",
          listens: 8500,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 6,
          image: "/images/podcasts/podcast4.jpg",
          title: "Real Engagement Metrics",
          author: "Sarah Johnson",
          listens: 8700,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
      ],
    },
    {
      id: 3,
      label: "Analytics",
      content: [
        {
          id: 1,
          image: "/images/podcasts/podcast3.jpg",
          title: "Boosting Engagement",
          author: "Lisa Kim",
          listens: 9300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 2,
          image: "/images/podcasts/podcast6.jpg",
          title: "Podcast Marketing 101",
          author: "Amanda",
          listens: 9400,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 3,
          image: "/images/podcasts/podcast2.jpg",
          title: "Data for Better Ads",
          author: "David Chen",
          listens: 8500,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 4,
          image: "/images/podcasts/podcast4.jpg",
          title: "Real Engagement Metrics",
          author: "Sarah Johnson",
          listens: 8700,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 5,
          image: "/images/podcasts/podcast1.jpg",
          title: "Influencer Marketing",
          author: "Amanda Garcia",
          listens: 6300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 6,
          image: "/images/podcasts/podcast5.jpg",
          title: "SEO for E-Commerce",
          author: "Johnson",
          listens: 8900,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
      ],
    },
    {
      id: 4,
      label: "Customer",
      content: [
        {
          id: 1,
          image: "/images/podcasts/podcast2.jpg",
          title: "Data for Better Ads",
          author: "David Chen",
          listens: 8500,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 2,
          image: "/images/podcasts/podcast3.jpg",
          title: "Boosting Engagement",
          author: "Lisa Kim",
          listens: 9300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 3,
          image: "/images/podcasts/podcast1.jpg",
          title: "Influencer Marketing",
          author: "Amanda Garcia",
          listens: 6300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 4,
          image: "/images/podcasts/podcast6.jpg",
          title: "Podcast Marketing 101",
          author: "Amanda",
          listens: 9400,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 5,
          image: "/images/podcasts/podcast4.jpg",
          title: "Real Engagement Metrics",
          author: "Sarah Johnson",
          listens: 8700,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 6,
          image: "/images/podcasts/podcast5.jpg",
          title: "SEO for E-Commerce",
          author: "Johnson",
          listens: 8900,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
      ],
    },
    {
      id: 5,
      label: "Trends",
      content: [
        {
          id: 1,
          image: "/images/podcasts/podcast1.jpg",
          title: "Influencer Marketing",
          author: "Amanda Garcia",
          listens: 6300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 2,
          image: "/images/podcasts/podcast2.jpg",
          title: "Data for Better Ads",
          author: "David Chen",
          listens: 8500,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 3,
          image: "/images/podcasts/podcast3.jpg",
          title: "Boosting Engagement",
          author: "Lisa Kim",
          listens: 9300,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 4,
          image: "/images/podcasts/podcast4.jpg",
          title: "Real Engagement Metrics",
          author: "Sarah Johnson",
          listens: 8700,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 5,
          image: "/images/podcasts/podcast5.jpg",
          title: "SEO for E-Commerce",
          author: "Johnson",
          listens: 8900,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
        {
          id: 6,
          image: "/images/podcasts/podcast6.jpg",
          title: "Podcast Marketing 101",
          author: "Amanda",
          listens: 9400,
          audio: "https://cldup.com/qR72ozoaiQ.mp3",
        },
      ],
    },
  ]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handlePlay = (id: number, audioUrl: string) => {
    if (currentlyPlaying === id) {
      // If the same audio is clicked, pause it
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      // If a different audio is clicked, play it
      if (audioRef.current) {
        audioRef.current.pause(); // Stop the currently playing audio
      }
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play();
      setCurrentlyPlaying(id);

      // Add event listener for when the audio ends
      newAudio.addEventListener("ended", () => {
        setCurrentlyPlaying(null); // Reset the currently playing state
      });
    }
  };

  // Cleanup audio event listeners when the component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", () => {});
      }
    };
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[23px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Most Popular</h5>
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
        <div className="trezo-card-content">
          <div className="trezo-tabs" id="trezo-tabs">
            <ul className="most-popular-navs mb-[18px]">
              {tabs.map((tab, index) => (
                <li
                  key={tab.id}
                  className="nav-item inline-block mb-[7px] ltr:mr-[4px] rtl:ml-[4px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <button
                    type="button"
                    onClick={() => handleTabClick(index)}
                    className={`nav-link inline-block font-medium text-xs rounded-[30px] py-[4px] px-[12px] text-gray-500 dark:text-gray-400 transition-all bg-gray-100 dark:bg-dark ${
                      activeTab === index ? "bg-primary-500 text-white" : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px]">
              {tabs[activeTab]?.content?.map((item) => (
                <div key={item.id}>
                  <div
                    className="relative rounded-md h-[185.06px] bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${item.image})`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handlePlay(item.id, item.audio)}
                      className="bg-primary-500 text-white rounded-full flex items-center justify-center w-[44px] h-[44px] absolute ltr:left-[15px] rtl:right-[15px] bottom-[15px] text-[22px] transition-all hover:bg-primary-600"
                    >
                      <i
                        className={`ri-${
                          currentlyPlaying === item.id ? "pause" : "play"
                        }-large-fill`}
                      ></i>
                    </button>
                  </div>

                  <div className="mt-[16px]">
                    <h4 className="!font-medium !text-base !mb-[11px]">
                      <Link
                        href="#"
                        target="_blank"
                        className="transition-all hover:text-primary-500"
                      >
                        {item.title}
                      </Link>
                    </h4>

                    <div className="flex items-center gap-[15px] md:gap-[20px] lg:gap-[25px] text-xs">
                      <span className="block">By: {item.author}</span>
                      <span className="relative block ltr:pl-[20px] rtl:pr-[20px]">
                        <i className="material-symbols-outlined !text-base text-primary-500 absolute top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0 -mt-px">
                          headset_mic
                        </i>
                        {item.listens}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MostPopular;
