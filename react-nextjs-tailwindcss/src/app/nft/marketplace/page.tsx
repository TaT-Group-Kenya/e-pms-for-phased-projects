import FeaturedNFTArtworks from "@/components/NFT/Marketplace/FeaturedNFTArtworks";
import Link from "next/link";
import Image from "next/image";
import TopCreators from "@/components/NFT/Marketplace/TopCreators";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Marketplace</h5>

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
            NFT
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Marketplace
          </li>
        </ol>
      </div>

      <div
        className="trezo-card mb-[25px] p-[20px] md:p-[25px] relative z-[1] rounded-md"
        style={{
          background: "linear-gradient(92deg, #23272E 7.31%, #3F5272 97.89%)",
        }}
      >
        <div className="trezo-card-content md:py-[33px] md:px-[15px] lg:flex justify-between items-center">
          <div>
            <h3 className="!text-white !text-xl md:!text-2xl !mb-[5px]">
              Manage Your NFT From One Place
            </h3>
            <p className="text-gray-300">
              The world’s first and largest digital marketplace for discover,
              collect, sell and create your own NFTs.
            </p>
          </div>
          <div>
            <Link
              href="/nft/create-nft"
              className="text-[15px] md:text-md mt-[15px] lg:mt-0 rounded-[4px] bg-primary-500 text-white font-medium py-[7px] px-[30px] transition-all hover:bg-primary-400 inline-block"
            >
              Create NFT
            </Link>
          </div>
        </div>

        <Image
          src="/images/nfts/shape.png"
          className="absolute top-0 ltr:right-0 rtl:left-0 -z-[1]"
          alt="shape"
          width={210}
          height={180}
        />
      </div>

      <FeaturedNFTArtworks />

      <TopCreators />
    </>
  );
}
