"use client";

import Cta from "@/components/FrontPage/Cta";
import Features from "@/components/FrontPage/Features";
import Footer from "@/components/FrontPage/Footer";
import LightDarkModeButton from "@/components/FrontPage/LightDarkModeButton";
import Navbar from "@/components/FrontPage/Navbar";
import OurTeam from "@/components/FrontPage/OurTeam";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="front-page-body overflow-hidden">
        <LightDarkModeButton />

        <Navbar />

        <div className="pt-[125px] md:pt-[145px] lg:pt-[185px] xl:pt-[195px] text-center">
          <div className="container 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
            <h1 className="!mb-0 !leading-[1.2] !text-[32px] md:!text-[40px] lg:!text-[50px] xl:!text-[60px] -tracking-[.5px] md:-tracking-[1px] xl:-tracking-[1.5px]">
              Features
            </h1>
            <div className="absolute bottom-0 -z-[1] ltr:-right-[30px] rtl:-left-[30px] blur-[250px]">
              <Image
                src="/images/front-pages/shape3.png"
                alt="shape3"
                width={685}
                height={685}
              />
            </div>
            <div className="absolute -top-[220px] -z-[1] ltr:-left-[50px] rtl:-right-[50px] blur-[150px]">
              <Image
                src="/images/front-pages/shape5.png"
                alt="shape3"
                width={658}
                height={656}
              />
            </div>
          </div>
        </div>

        <Features />

        <OurTeam />

        <Cta />

        <Footer />
      </div>
    </>
  );
}
