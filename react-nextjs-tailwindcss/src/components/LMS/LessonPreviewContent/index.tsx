"use client";

import React from "react"; 
import Link from "next/link";

const LessonPreviewContent: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <video controls className="rounded-md w-full h-auto">
            <source
              src="/images/video.mp4"
              className="rounded-full"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <h4 className="!mt-[20px] md:!mt-[25px] !mb-[10px] !text-lg md:!text-xl">
            Introduction to Cybersecurity
          </h4>
          <p>
            Node.js for Beginners: Alias animi labque, deserunt distinctio eum
            excepturi fuga iure labore magni molestias mollitia natus, officia
            pofro quis sunt temporibus veritatis voluptatem voluptatum.
          </p>
          <Link
            href="#"
            className="inline-block font-medium rounded-md md:text-md py-[12px] px-[22px] bg-primary-500 text-white transition-all hover:bg-primary-400"
          >
            Next Tutorial
          </Link>
        </div>
      </div>
    </>
  );
};

export default LessonPreviewContent;
