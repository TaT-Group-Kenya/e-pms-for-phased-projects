"use client";

import React from "react"; 
import Link from "next/link";

const Breadcrumb: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card bg-cover bg-no-repeat bg-center p-[20px] md:p-[25px] rounded-md mb-[25px]"
        style={{
          backgroundImage: "url(/images/sparklines/sparkline-bg.jpg)",
        }}
      >
        <div className="trezo-card-content md:flex items-center justify-between">
          <h5 className="!mb-0 !text-white">Crypto Performance</h5>

          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 before:text-white">
              <Link
                href="/dashboard/ecommerce/"
                className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] text-white"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-white top-1/2 -translate-y-1/2">
                  home
                </i>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-white before:text-white">
              Crypto Performance
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;
