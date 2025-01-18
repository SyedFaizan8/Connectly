"use client"

import Player from '@/components/Player';
import { useSocket } from '@/context/SocketProvider'
import useMediaStream from '@/hooks/useMediaStream';
import usePeer from '@/hooks/usePeer';

import usePlayer, { Players } from '@/hooks/usePlayer';
import Bottom from '@/components/Bottom';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useDeepCopy from '@/hooks/useDeepCopy';

const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    const { room: roomId } = useParams<{ room: string }>()
    const {
        setPlayers,
        playerHighlighted,
        nonHighlightedPlayers,
        toggleAudio,
        toggleVideo,
        leaveRoom
    } = usePlayer(myId, roomId, peer);

    const [users, setUsers] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        if (!socket || !peer || !stream) return;

        const handleUserConnected = (newUser: string) => {
            console.log(`user connected in room with userId ${newUser}`)
            const call = peer.call(newUser, stream)

            call.on("stream", (incomingStream) => {
                console.log(`Incoming stream from id ${newUser}`)

                setPlayers((prev) => ({
                    ...prev,
                    [newUser]: {
                        url: incomingStream,
                        muted: false,
                        playing: true,
                    }
                }))

                setUsers((prev) => ({
                    ...prev,
                    [newUser]: call
                }))
            })
        }

        socket?.on("user-connected", handleUserConnected);

        return () => {
            socket?.off("user-connected", handleUserConnected);
        }

    }, [peer, socket, stream]);


    useEffect(() => {
        if (!socket) return;

        const handleToggleAudio = (userId: string) => {
            console.log(`user with ${userId} toggled audio`);
            setPlayers((prev: Players) => {
                const copy = useDeepCopy(prev);
                copy[userId].muted = !copy[userId].muted;
                return { ...copy };
            })
        }
        const handleToggleVideo = (userId: string) => {
            console.log(`user with ${userId} toggled video`);
            setPlayers((prev: Players) => {
                const copy = useDeepCopy(prev);
                copy[userId].playing = !copy[userId].playing;
                return { ...copy }
            })
        }
        const handleUserLeave = (userId: string) => {
            console.log(`user with ${userId} leave the room`);
            users[userId]?.close();
        }

        socket?.on("user-toggle-audio", handleToggleAudio);
        socket?.on("user-toggle-video", handleToggleVideo);
        socket?.on("user-leave", handleUserLeave);
        return () => {
            socket.off("user-toggle-audio", handleToggleAudio);
            socket.off("user-toggle-video", handleToggleVideo);
            socket.off("user-leave", handleUserLeave);
        }
    }, [setPlayers, socket])

    useEffect(() => {
        if (!peer || !stream) return;
        peer.on("call", (call) => {
            const { peer: callerId } = call;
            call.answer(stream)

            call.on("stream", (incomingStream) => {
                console.log(`Incoming stream from id ${callerId}`)

                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: incomingStream,
                        muted: false,
                        playing: true,
                    }
                }))

                setUsers((prev) => ({
                    ...prev,
                    [callerId]: call
                }))
            })
        })
    }, [peer, stream])

    useEffect(() => {
        if (!stream || !myId) return;
        console.log(`setting my stream ${myId}`);
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: stream,
                muted: false,
                playing: true,
            }
        }))
    }, [myId, stream])

    return (
        <>
            <div className="absolute w-9/12 left-0 mx-auto top-5 bottom-12 h-4/5">
                {playerHighlighted && (
                    <Player
                        url={playerHighlighted.url}
                        muted={playerHighlighted.muted}
                        playing={playerHighlighted.playing}
                        isActive />
                )}
            </div>
            <div className="absolute flex flex-col overflow-y-auto w-52 h-1/4 right-5 top-5">
                {Object.keys(nonHighlightedPlayers).map((playerId) => {
                    const { url, muted, playing } = nonHighlightedPlayers[playerId];
                    return <Player key={playerId} url={url} muted={muted} playing={playing} isActive={false} />
                })}
            </div>
            {playerHighlighted && (
                <Bottom
                    muted={playerHighlighted.muted}
                    playing={playerHighlighted.playing}
                    toggleAudio={toggleAudio}
                    toggleVideo={toggleVideo}
                    leaveRoom={leaveRoom} />
            )}
        </>
    )
}

export default Room;