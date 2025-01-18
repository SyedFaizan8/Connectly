import { FaMicrophone as Mic, FaVideo as Video } from "react-icons/fa";
import { BiSolidPhoneOff as PhoneOff } from "react-icons/bi";
import { IoMdMicOff as MicOff } from "react-icons/io";
import { BsFillCameraVideoOffFill as VideoOff } from "react-icons/bs";

const Bottom = ({ muted, playing, toggleAudio, toggleVideo, leaveRoom }:
    { muted: boolean, playing: boolean, toggleAudio: any, toggleVideo: any, leaveRoom: any }) => {

    return (
        <div className="absolute flex justify-between bottom-5 left-0 right-0 mx-auto w-72">
            {muted ?
                <MicOff size={55} onClick={toggleAudio} className="p-4 rounded-full text-white cursor-pointer bg-red-950 hover:bg-red-600" />
                : <Mic size={55} onClick={toggleAudio} className="p-4 rounded-full text-white cursor-pointer bg-red-950 hover:bg-red-600" />}
            {playing ?
                <Video size={55} onClick={toggleVideo} className="p-4 rounded-full text-white cursor-pointer bg-red-950 hover:bg-red-600" />
                : <VideoOff size={55} onClick={toggleVideo} className="p-4 rounded-full text-white cursor-pointer bg-red-950 hover:bg-red-600" />}
            <PhoneOff onClick={leaveRoom} size={50} className="p-4 rounded-full text-white cursor-pointer bg-red-950 hover:bg-red-600" />
        </div>
    )
}
export default Bottom;