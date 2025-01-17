"use client"

import { useSocket } from "@/context/SocketProvider";
import { useParams } from "next/navigation";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react"

const usePeer = () => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [myId, setMyId] = useState('');
    const isPeerSet = useRef(false);
    const socket = useSocket();
    const { room: roomId } = useParams<{ room: string }>();

    useEffect(() => {
        if (isPeerSet.current || !roomId || !socket) return;
        isPeerSet.current = true;

        const myPeer = new Peer();
        setPeer(myPeer);

        myPeer.on('open', (id) => {
            console.log(`Your peer id is ${id}`);
            setMyId(id);
            socket?.emit("join-room", { roomId, id });

        })
    }, [roomId, socket])

    return { peer, myId }
}

export default usePeer;