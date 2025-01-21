"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { useSocket } from '@/context/SocketProvider'
import useMediaStream from '@/hooks/useMediaStream';
import usePeer from '@/hooks/usePeer';
import useDeepCopy from '@/hooks/useDeepCopy';
import usePlayer, { Players } from '@/hooks/usePlayer';

import Player from '@/components/Player';
import Bottom from '@/components/Bottom';
import CopySection from '@/components/CopySection';
import useIsMobile from '@/hooks/useIsMobile';

const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    const { room: roomId } = useParams<{ room: string }>()
    const {
        players,
        setPlayers,
        playerHighlighted,
        nonHighlightedPlayers,
        toggleAudio,
        toggleVideo,
        leaveRoom,
        message,
        handleMessage,
        setMessage,
        data,
        setData
    } = usePlayer(myId, roomId, peer);

    const [users, setUsers] = useState<{ [key: string]: any }>({});
    const isMobile = useIsMobile();


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
            const playersCopy = useDeepCopy(players);
            delete playersCopy[userId];
            setPlayers(playersCopy);
        }

        socket?.on("user-toggle-audio", handleToggleAudio);
        socket?.on("user-toggle-video", handleToggleVideo);
        socket?.on("user-leave", handleUserLeave);
        return () => {
            socket.off("user-toggle-audio", handleToggleAudio);
            socket.off("user-toggle-video", handleToggleVideo);
            socket.off("user-leave", handleUserLeave);
        }
    }, [players, setPlayers, socket, users])

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

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            ["Away"]: "",
            ["You"]: ""
        }))
    }, [])

    useEffect(() => {
        if (!socket) return;
        const handleMessageData = (message: string) => {
            console.log("message recieved ", message)
            setData((prev) => ({
                ...prev,
                ["Away"]: message,
            }))
        }
        socket?.on("receive-message", handleMessageData);
        return () => {
            socket?.off("receive-message", handleMessageData);
        }
    }, [])

    useEffect(() => {
        if (!socket) return;
        const handleRoomFull = () => {
            leaveRoom();
        }

        socket?.on("room-full", handleRoomFull);

        return () => {
            socket?.off("room-full", handleRoomFull);
        }
    }, [socket, leaveRoom])


    return (
        <>
            <div className="h-full w-full flex justify-center items-center">
                <div className="absolute top-5 bottom-12 h-4/5">
                    {playerHighlighted && (
                        <Player
                            url={playerHighlighted.url}
                            muted={playerHighlighted.muted}
                            playing={playerHighlighted.playing}
                            isActive />
                    )}
                </div>
                <div className="absolute flex flex-col overflow-y-auto  md:w-52 right-5 top-5">
                    {Object.keys(nonHighlightedPlayers).map((playerId) => {
                        const { url, muted, playing } = nonHighlightedPlayers[playerId];
                        return <Player key={playerId} url={url} muted={muted} playing={playing} isActive={false} />
                    })}
                </div>
                <CopySection roomId={roomId} />
                {playerHighlighted && (
                    <Bottom
                        muted={playerHighlighted.muted}
                        playing={playerHighlighted.playing}
                        toggleAudio={toggleAudio}
                        toggleVideo={toggleVideo}
                        leaveRoom={leaveRoom} />
                )}
                {!isMobile && <div className="z-0 w-2/12 h-auto absolute rounded right-5 bottom-5">
                    {data &&
                        <ul className="h-auto p-2 mb-4 rounded border border-white ">
                            {Object.entries(data).map(([id, content]) => (
                                <li key={id}>
                                    <strong className={`${id === "You" ? "text-green-500" : "text-yellow-500"}`}>{id}:</strong> {content}
                                </li>
                            ))}
                        </ul>
                    }
                    <form className="flex border-white border rounded z-10" onSubmit={handleMessage}>
                        <input type="text" placeholder='Type your message here' className="inline px-1 bg-black text-white" value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type='submit' className="z-0 inline border border-l-white w-full bg-red-700 text-white">Send</button>
                    </form>
                </div>}
            </div>
        </>
    )
}

export default Room;