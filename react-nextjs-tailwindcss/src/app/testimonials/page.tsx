import TestimonialsStyle1 from "@/components/Testimonials/TestimonialsStyle1";
import TestimonialsStyle2 from "@/components/Testimonials/TestimonialsStyle2";
import TestimonialsStyle3 from "@/components/Testimonials/TestimonialsStyle3";
import TestimonialsStyle4 from "@/components/Testimonials/TestimonialsStyle4";
import TestimonialsStyle5 from "@/components/Testimonials/TestimonialsStyle5";
import TestimonialsStyle6 from "@/components/Testimonials/TestimonialsStyle6";
import TestimonialsStyle7 from "@/components/Testimonials/TestimonialsStyle7";
import TestimonialsStyle8 from "@/components/Testimonials/TestimonialsStyle8";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Testimonials</h5>

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
            Testimonials
          </li>
        </ol>
      </div>

      <TestimonialsStyle1 />

      <TestimonialsStyle2 />

      <TestimonialsStyle3 />

      <TestimonialsStyle4 />

      <TestimonialsStyle5 />

      <TestimonialsStyle6 />

      <TestimonialsStyle7 />

      <TestimonialsStyle8 />
    </>
  );
}
