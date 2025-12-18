"use client";
import Image from "next/image";
import PrizeRevealedSoon from "@/assets/svg/PrizeRevealedsoon.png";
import DividerButtonImg from "@/assets/svg/DividerButton.svg";

export default function PrizePoolCard() {
  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="w-screen">
        <Image 
          src={PrizeRevealedSoon} 
          alt="Prize Revealed Soon" 
          className="w-full h-auto object-cover"
          priority
          draggable={false}
        />
      </div>
      <div className="mt-8 md:mt-12">
        <Image 
          src={DividerButtonImg} 
          alt="Divider Button" 
          className="w-auto h-auto"
          draggable={false}
        />
      </div>
    </div>
  );
}
