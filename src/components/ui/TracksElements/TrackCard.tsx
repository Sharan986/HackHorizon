import Image from "next/image";
import TrackHealthImg from "../../../assets/svg/Traks/TrackHealth.svg"
// import BlueCorner from "../../../assets/svg/Traks/BlueCorner.svg"
import CornerElement from "./CornerElement";

interface TrackCardProps {
    BgColor?: string,
    BC1?: string,
    BC2?: string,
    Logo: string,
    CornerImg: string,
    Title: string
}

export default function TrackCard({ BgColor, BC1, BC2, Logo, CornerImg, Title }: TrackCardProps) {
    return (
        <div className="flex flex-col items-center justify-center w-fit h-fit md:scale-100 scale-83">
            <div className={`relative w-[270px] h-[338px] mb-10 flex px-2.5 py-[15px] ${BgColor} border-[5px] ${BC1}`}>
                <div className={`flex flex-1 justify-center items-center bg-transparent border-[6px] ${BC2}`}>
                    <Image src={Logo} alt="TrackHealth" draggable={false}/>
                </div>
                <CornerElement ImageSrc={CornerImg} Position="-top-4 -left-4" Rotation="0deg" />
                <CornerElement ImageSrc={CornerImg} Position="-top-4 -right-4" Rotation="90deg" />
                <CornerElement ImageSrc={CornerImg} Position="-bottom-4 -left-4" Rotation="270deg" />
                <CornerElement ImageSrc={CornerImg} Position="-bottom-4 -right-4" Rotation="180deg" />
            </div>
            <div style={{ width: 300, alignSelf: 'center', paddingLeft: 11, paddingRight: 11, paddingTop: 10, paddingBottom: 10, background: 'linear-gradient(0deg, #DB7200 49%, #EDAA4A 50%, #FFE394 100%)', boxShadow: '0px 1.650254726409912px 0px #FBBB31 inset', overflow: 'hidden', borderRadius: 47.86, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'block', margin: '0 auto' }}>
                <div style={{ alignSelf: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8, background: '#FCCC31', boxShadow: '0px -2.0628185272216797px 0px #F8DC47 inset', overflow: 'hidden', borderRadius: 35.29, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'block', minHeight: 60, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', color: 'white', fontSize: 24, fontWeight: '400', wordBreak: 'break-word', whiteSpace: 'normal', textShadow: '0px 3px 0px rgba(0, 0, 0, 1.00)', lineHeight: 1.2, minHeight: 36, maxWidth: '100%' }} className="text-stroke-black">{Title}</div>
                </div>
            </div>
        </div>
    )
}