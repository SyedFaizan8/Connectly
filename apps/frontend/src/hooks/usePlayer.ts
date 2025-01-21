import { useSocket } from "@/context/SocketProvider";
import { useState } from "react";
import useDeepCopy from "./useDeepCopy";
import Peer from "peerjs";
import { useRouter } from "next/navigation";

export interface Player {
    url: MediaStream,
    muted: boolean,
    playing: boolean
}

export interface Players {
    [key: string]: Player
}

const usePlayer = (myId: string, roomId: string, peer: Peer | null) => {
    const router = useRouter();
    const socket = useSocket();
    const [players, setPlayers] = useState<Players>({});
    const [message, setMessage] = useState<string>("");
    const [data, setData] = useState<{ [key: string]: string }>({});

    const playersCopy = useDeepCopy(players);

    const playerHighlighted = playersCopy[myId];
    delete playersCopy[myId];

    const nonHighlightedPlayers = playersCopy;

    const leaveRoom = () => {
        socket?.emit("user-leave", myId, roomId);
        peer?.disconnect();
        router.push('/');
    }

    const toggleAudio = () => {
        console.log("I toggled my audio")
        setPlayers((prev: Players) => {
            const copy = useDeepCopy(prev)
            copy[myId].muted = !copy[myId].muted;
            return { ...copy }
        })

        socket?.emit("user-toggle-audio", myId, roomId)
    }

    const toggleVideo = () => {
        console.log("I toggled my video")
        setPlayers((prev: Players) => {
            const copy = useDeepCopy(prev)
            copy[myId].playing = !copy[myId].playing;
            return { ...copy }
        })

        socket?.emit('user-toggle-video', myId, roomId)
    }

    const handleMessage = (e: any) => {
        e.preventDefault();
        if (message.length === 0) return;
        setData((prev) => ({
            ...prev,
            ["You"]: message,
        }))
        socket?.emit("send-message", myId, roomId, message);
        setMessage("");
    }

    return {
        players,
        setPlayers,
        playerHighlighted,
        nonHighlightedPlayers,
        toggleAudio,
        toggleVideo,
        leaveRoom,
        handleMessage,
        message,
        setMessage,
        data,
        setData
    }
}

export default usePlayer;