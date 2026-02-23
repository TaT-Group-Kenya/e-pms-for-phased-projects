import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">RemixIcon</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Icons
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            RemixIcon
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <code className="p-[15px] md:p-[20px] block bg-[#f5f2f0] dark:bg-[#15203c] text-[.875em] break-words text-[#d63384]">
            &lt;<span className="text-[#905] ltr:mr-[5px] rtl:ml-[5px]">i</span>
            <span className="text-[#690]">class</span>=
            <span className="text-[#07a]">&quot;ri-home-7-line&quot;</span>
            &gt;&lt;/<span className="text-[#905]">i</span>&gt;
          </code>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-[25px] mb-[25px]">
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-home-7-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-home-7-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-store-2-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-store-2-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-mail-open-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-mail-open-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-cloud-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-cloud-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-bar-chart-box-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-bar-chart-box-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-calendar-todo-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-calendar-todo-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-global-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-global-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-flag-2-fill"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-flag-2-fill
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-service-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-service-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-megaphone-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-megaphone-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-message-2-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-message-2-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-chat-quote-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-chat-quote-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-emoji-sticker-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-emoji-sticker-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-ball-pen-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-ball-pen-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-contrast-2-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-contrast-2-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-collage-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-collage-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-bug-fill"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-bug-fill
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-scan-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-scan-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-wifi-off-fill"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-wifi-off-fill
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-eth-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-eth-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-cup-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-cup-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-cake-3-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-cake-3-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-angularjs-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-angularjs-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-edge-new-fill"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-edge-new-fill
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-xbox-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-xbox-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-map-pin-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-map-pin-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-rocket-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-rocket-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-bus-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-bus-line
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-motorbike-fill"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-motorbike-fill
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center text-[25px]">
            <i className="ri-image-add-line"></i>
            <span className="block mt-[20px] md:mt-[35px] text-base">
              ri-image-add-line
            </span>
          </div>
        </div>
      </div>

      <div className="text-center mb-[25px]">
        <a
          href="https://remixicon.com/"
          target="_blank"
          className="inline-block py-[12px] px-[30px] rounded-full bg-primary-500 text-white transition-all hover:bg-primary-400"
        >
          View All Icons
        </a>
      </div>
    </>
  );
}
