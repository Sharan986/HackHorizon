import Image from "next/image"
import LogoHeading from "../../assets/webp/heading1.png"


export default function HackHorizonHeadingLogo() {
    return ( 
        <div className="animate-float">
            <Image 
                src={LogoHeading} 
                alt="Hack Horizon Logo" 
                className="w-[98vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] max-w-[1500px] h-auto" 
                draggable={false}
                priority
            />
        </div>
    )
}