"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import Bitcoin from "./Bitcoin";
import Ethereum from "./Ethereum";
import Solana from "./Solana";
import Binance from "./Binance";
import Cardano from "./Cardano";

const CryptocurrencyWatchlist: React.FC = () => {
  return (
    <>
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Cryptocurrency Watchlist</h5>
          </div>
        </div>

        <div
          className="trezo-card-content relative"
          id="cryptocurrencyWatchlistSlides"
        >
          <Swiper
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
              1536: {
                slidesPerView: 4,
              },
            }}
            modules={[Autoplay, Pagination]}
          >
            <SwiperSlide>
              <Bitcoin />
            </SwiperSlide>

            <SwiperSlide>
              <Ethereum />
            </SwiperSlide>

            <SwiperSlide>
              <Solana />
            </SwiperSlide>

            <SwiperSlide>
              <Binance />
            </SwiperSlide>

            <SwiperSlide>
              <Cardano />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default CryptocurrencyWatchlist;
