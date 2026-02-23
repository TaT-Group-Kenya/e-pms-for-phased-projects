"use client";

import React from "react"; 

const SearchContent: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">
              120{" "}
              <span className="text-gray-500 dark:text-gray-400">
                results found for
              </span>{" "}
              “Ipsum”
            </h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="border border-gray-100 dark:border-[#172036] mb-[15px] rounded-md p-[20px]">
            <span className="block mb-[12px] font-semibold text-[17px] text-black dark:text-white">
              What is Lorem Ipsum?
            </span>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>

          <div className="border border-gray-100 dark:border-[#172036] mb-[15px] rounded-md p-[20px]">
            <span className="block mb-[12px] font-semibold text-[17px] text-black dark:text-white">
              Why do we use it Lorem Ipsum?
            </span>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using Content here,
              content here, making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for lorem ipsum will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </p>
          </div>

          <div className="border border-gray-100 dark:border-[#172036] mb-[15px] rounded-md p-[20px]">
            <span className="block mb-[12px] font-semibold text-[17px] text-black dark:text-white">
              Where does it come from Lorem Ipsum?
            </span>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classNameical Latin literature from 45
              BC, making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classNameical
              literature, discovered the undoubtable source.
            </p>
            <p>
              Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus
              Bonorum et Malorum The Extremes of Good and Evil by Cicero,
              written in 45 BC. This book is a treatise on the theory of ethics,
              very popular during the Renaissance. The first line of Lorem
              Ipsum, Lorem ipsum dolor sit amet comes from a line in
              section 1.10.32.
            </p>
          </div>
          
          <div className="border border-gray-100 dark:border-[#172036] mb-[15px] rounded-md p-[20px]">
            <span className="block mb-[12px] font-semibold text-[17px] text-black dark:text-white">
              Where can I get some Lorem Ipsum?
            </span>
            <p>
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which do look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there is anything embarrassing
              hidden in the middle of text.
            </p>
            <p>
              All the Lorem Ipsum generators on the Internet tend to repeat
              predefined chunks as necessary, making this the first true
              generator on the Internet. It uses a dictionary of over 200 Latin
              words, combined with a handful of model sentence structures, to
              generate Lorem Ipsum which looks reasonable. The generated Lorem
              Ipsum is therefore always free from repetition, injected humour,
              or non-characteristic words etc.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchContent;
