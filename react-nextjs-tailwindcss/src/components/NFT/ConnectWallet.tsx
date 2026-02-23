"use client";

import React from "react";
import Image from "next/image"; 

interface Wallet {
  id: number;
  name: string;
  image: string;
  description: string;
}

const wallets: Wallet[] = [
  {
    id: 1,
    name: "Metamask",
    image: "/images/wallet/metamask.svg",
    description:
      "MetaMask is a software cryptocurrency wallet used to interact with the Ethereum blockchain.",
  },
  {
    id: 2,
    name: "Binance",
    image: "/images/wallet/binance.svg",
    description:
      "Binance offers a relatively secure, versatile way to invest in and trade cryptocurrencies.",
  },
  {
    id: 3,
    name: "Coinbase",
    image: "/images/wallet/coinbase.svg",
    description:
      "Coinbase Wallet is a software product that gives you access to a wide spectrum.",
  },
  {
    id: 4,
    name: "Trust Wallet",
    image: "/images/wallet/metamask.svg",
    description:
      "Trust Wallet is a multi-crypto wallet that enables users to store and manage their assets.",
  },
  {
    id: 5,
    name: "WalletConnect",
    image: "/images/wallet/binance.svg",
    description:
      "WalletConnect is an open protocol for connecting dApps to mobile wallets using QR code scanning.",
  },
  {
    id: 6,
    name: "Ledger",
    image: "/images/wallet/metamask.svg",
    description:
      "Ledger Wallet is a hardware wallet for securely storing cryptocurrencies offline.",
  },
];

const ConnectWallet: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-[25px] mb-[25px]">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] text-center rounded-md"
          >
            <div className="trezo-card-content md:py-[13px]">
              <Image
                src={wallet.image}
                className="inline-block"
                alt={wallet.name}
                width={54}
                height={54}
              />

              <h3 className="!text-lg !mb-[12px] !mt-[18px]">{wallet.name}</h3>

              <p className="text-gray-400 mx-auto md:max-w-[285px] leading-[1.6] mb-[20px]">
                {wallet.description}
              </p>

              <button className="text-[15px] md:text-md rounded-[7px] bg-primary-500 text-white font-medium py-[6px] px-[40px] transition-all hover:bg-primary-400 inline-block">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ConnectWallet;
