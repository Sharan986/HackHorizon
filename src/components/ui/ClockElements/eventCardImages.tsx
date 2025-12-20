import Image from "next/image";
import Plank from "@/assets/images/datePlank.png"
import Shield from "@/assets/svg/eventCardShield.svg"

export function PlankImage() {
  return (
    <div className="w-[245px] sm:w-[350px] md:w-[490px] lg:w-[700px]">
        <Image src={Plank} alt="" className="w-full h-auto" draggable={false}/>
    </div>
  );
}

export function EventCardShield() {
  return (
    <div className="flex items-center gap-2 w-fit">
      <div className="w-[91px] sm:w-[130px] md:w-[182px] lg:w-[260px]">
        <Image src={Shield} alt="Shield" className="w-full h-auto" draggable={false}/>
      </div>
      <div className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[250px]">
        <Image
          src="/arka_jain_logo.png"
          alt="ARKA JAIN University Logo"
          width={250}
          height={50}
          className="w-full h-auto"
          draggable={false}
        />
      </div>
    </div>
  );
}