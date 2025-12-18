"use client";
import Image from "next/image";
import PrizeRevealedSoon from "@/assets/svg/PrizeRevealedsoon.png";
import DividerButtonImg from "@/assets/svg/DividerButton.svg";

export default function PrizePoolCard() {
  return (
    <div className="w-full flex flex-col justify-center items-center overflow-hidden">
      <div className="w-full">
        <Image 
          src={PrizeRevealedSoon} 
          alt="Prize Revealed Soon" 
          className="w-full h-auto"
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
