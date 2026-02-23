 
import BasicRadialBarChart from "@/components/Charts/RadialBar/BasicRadialBarChart";
import CustomAngleCircleRadialBarChart from "@/components/Charts/RadialBar/CustomAngleCircleRadialBarChart";
import GradientRadialBarChart from "@/components/Charts/RadialBar/GradientRadialBarChart";
import MultipleRadialBarChart from "@/components/Charts/RadialBar/MultipleRadialBarChart";
import SemiCircularGaugeRadialBarChart from "@/components/Charts/RadialBar/SemiCircularGaugeRadialBarChart";
import StrockedCircularGaugeRadialBarChart from "@/components/Charts/RadialBar/StrockedCircularGaugeRadialBarChart";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">RadialBar Charts</h5>

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
            ApexCharts
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            RadialBar Charts
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-[25px]">
        <BasicRadialBarChart />

        <MultipleRadialBarChart />

        <CustomAngleCircleRadialBarChart />

        <GradientRadialBarChart />

        <StrockedCircularGaugeRadialBarChart />

        <SemiCircularGaugeRadialBarChart />
      </div>
    </>
  );
}
