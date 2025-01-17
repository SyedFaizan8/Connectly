"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";

const Home = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>('')

  const generateUuid = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return 'xxxx4xxxyxxx'.replace(/[xy]/g, () => {
      const r = Math.floor(Math.random() * chars.length);
      return chars[r];
    });
  };

  const createAndJoin = () => {
    const uuid = generateUuid();
    router.push(`/${uuid}`);
  }

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`)
    else { alert("Please provide a valid roomId") }
  }

  return (
    <>
      <div className="w-4/12 mx-auto p-2 border border-white rounded mt-8 text-white flex flex-col items-center">
        <h1 className="text-xl text-center">Connectly</h1>
        <div className="flex flex-col items-center mt-3 w-full">
          <input className="text-black text-lg p-1 rounded w-9/12 mb-3"
            placeholder="enter room id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)} />
          <button className="bg-red-700 py-2 px-4 rounded"
            onClick={joinRoom}>
            Join Room
          </button>
        </div>
        <span className="my-3 text-xl">-----------------or-----------------</span>
        <button className="bg-red-700 py-2 px-4 rounded" onClick={createAndJoin}>Create a new room</button>
      </div>
    </>
  )
}

export default Home
