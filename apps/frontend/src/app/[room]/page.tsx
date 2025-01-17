"use client"

import Player from '@/components/Player';
import { useSocket } from '@/context/SocketProvider'
import useMediaStream from '@/hooks/useMediaStream';
import usePeer from '@/hooks/usePeer';
import { useEffect } from 'react';

const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();

    useEffect(() => {
        if (!socket) return;

        const handleUserConnected = (newUser: string) => {
            console.log(`user connected in room with userId ${newUser}`)
        }

        socket?.on("user-connected", handleUserConnected);

        return () => {
            socket?.off("user-connected", handleUserConnected);
        }

    }, []);

    return (
        <>
            {stream && <Player url={stream} playerId={myId} />}
        </>
    )
}

export default Room;