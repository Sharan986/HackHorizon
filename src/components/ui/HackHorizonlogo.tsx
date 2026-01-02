import Image from "next/image"


export default function HackHorizonHeadingLogo() {
    return ( 
        <div>
            <Image 
                src="/images/ui/heading1.png" 
                alt="Hack Horizon Logo" 
                width={1500}
                height={300}
                className="w-[98vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] max-w-[1500px] h-auto" 
                draggable={false}
                priority
            />
        </div>
    )
}