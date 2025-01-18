import ReactPlayer from 'react-player';
import { FaMicrophone as Mic } from "react-icons/fa";
import { IoMdMicOff as MicOff } from "react-icons/io";
import { FaUserCircle as User } from "react-icons/fa";

interface PlayerProps {
    url: MediaStream;
    muted?: boolean;
    playing?: boolean;
    isActive?: boolean;
}

const Player: React.FC<PlayerProps> = ({ url, muted = false, playing = true, isActive }) => {
    return (
        <div className={`relative overflow-hidden mb-5 h-full 
        ${isActive ? 'rounded-lg' : 'rounded-md h-min w-52 shadow-[0px_0px_11px_-1px_rgba(0,0,0,0.75)]'}
        ${!playing && 'flex items-center justify-center'}`}>
            {playing ?
                <ReactPlayer
                    url={url}
                    muted={muted}
                    playing={playing}
                    width="100%"
                    height="100%"
                />
                : <User size={isActive ? 400 : 150} className="text-whie" />}
            {
                !isActive ?
                    (muted ?
                        <MicOff size={20} className="text-white absolute right-2 bottom-2" />
                        : <Mic size={20} className="text-white absolute right-2 bottom-2" />)
                    : undefined
            }
        </div>
    );
};

export default Player;