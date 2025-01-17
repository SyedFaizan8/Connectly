import ReactPlayer from 'react-player';

interface PlayerProps {
    url: MediaStream;
    playerId: string;
    muted?: boolean;
    playing?: boolean;
}

const Player: React.FC<PlayerProps> = ({ url, playerId, muted = false, playing = true }) => {
    return (
        <div className='player-wrapper'>
            <ReactPlayer
                url={url}
                key={playerId}
                muted={muted}
                playing={playing}
            />
        </div>
    );
};

export default Player;