import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Material Symbols</h5>

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
            Material Symbols
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <code className="p-[15px] md:p-[20px] block bg-[#f5f2f0] dark:bg-[#15203c] break-words text-[#d63384] text-base">
            &lt;
            <span className="text-[#905] ltr:mr-[5px] rtl:ml-[5px]">span</span>
            <span className="text-[#690]">class</span>=
            <span className="text-[#07a]">
              &quot;material-symbols-outlined&quot;
            </span>
            &gt;search&lt;/<span className="text-[#905]">span</span>&gt;
          </code>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-[25px] mb-[25px]">
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">search</span>
            <span className="block mt-[20px] md:mt-[35px]">search</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">home</span>
            <span className="block mt-[20px] md:mt-[35px]">home</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">menu</span>
            <span className="block mt-[20px] md:mt-[35px]">menu</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">close</span>
            <span className="block mt-[20px] md:mt-[35px]">close</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">settings</span>
            <span className="block mt-[20px] md:mt-[35px]">settings</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">done</span>
            <span className="block mt-[20px] md:mt-[35px]">done</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">expand_more</span>
            <span className="block mt-[20px] md:mt-[35px]">expand_more</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">search</span>
            <span className="block mt-[20px] md:mt-[35px]">search</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="block mt-[20px] md:mt-[35px]">check_circle</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">favorite</span>
            <span className="block mt-[20px] md:mt-[35px]">favorite</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">add</span>
            <span className="block mt-[20px] md:mt-[35px]">add</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="block mt-[20px] md:mt-[35px]">arrow_back</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">star</span>
            <span className="block mt-[20px] md:mt-[35px]">star</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">chevron_right</span>
            <span className="block mt-[20px] md:mt-[35px]">chevron_right</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">logout</span>
            <span className="block mt-[20px] md:mt-[35px]">logout</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">arrow_forward_ios</span>
            <span className="block mt-[20px] md:mt-[35px]">
              arrow_forward_ios
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="block mt-[20px] md:mt-[35px]">add_circle</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">cancel</span>
            <span className="block mt-[20px] md:mt-[35px]">cancel</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span className="block mt-[20px] md:mt-[35px]">arrow_back_ios</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">arrow_forward</span>
            <span className="block mt-[20px] md:mt-[35px]">arrow_forward</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">arrow_drop_down</span>
            <span className="block mt-[20px] md:mt-[35px]">
              arrow_drop_down
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">check</span>
            <span className="block mt-[20px] md:mt-[35px]">check</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">check_box</span>
            <span className="block mt-[20px] md:mt-[35px]">check_box</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">toggle_on</span>
            <span className="block mt-[20px] md:mt-[35px]">toggle_on</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">open_in_new</span>
            <span className="block mt-[20px] md:mt-[35px]">open_in_new</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">grade</span>
            <span className="block mt-[20px] md:mt-[35px]">grade</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">refresh</span>
            <span className="block mt-[20px] md:mt-[35px]">refresh</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">
              check_box_outline_blank
            </span>
            <span className="block mt-[20px] md:mt-[35px]">
              check_box_outline_blank
            </span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">login</span>
            <span className="block mt-[20px] md:mt-[35px]">login</span>
          </div>
        </div>
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] md:pt-[40px] rounded-md">
          <div className="trezo-card-content text-center">
            <span className="material-symbols-outlined">chevron_left</span>
            <span className="block mt-[20px] md:mt-[35px]">chevron_left</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-[25px]">
        <a
          href="https://fonts.google.com/icons"
          target="_blank"
          className="inline-block py-[12px] px-[30px] rounded-full bg-primary-500 text-white transition-all hover:bg-primary-400"
        >
          View All Icons
        </a>
      </div>
    </>
  );
}
