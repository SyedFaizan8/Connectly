"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { WavyBackground } from "@/components/ui/wavy-background";

const roomSchema = z.object({
  roomId: z
    .string()
    .nonempty("Room ID is required")
    .length(12, "Room ID isIncorrect"),
});

type RoomSchema = z.infer<typeof roomSchema>;

const Home = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
  });

  const generateUuid = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return 'xxxxxxxxxxxx'.replace(/x/g, () => {
      const r = Math.floor(Math.random() * chars.length);
      return chars[r];
    });
  };

  const createAndJoin = () => {
    const uuid = generateUuid();
    router.push(`/${uuid}`);
  };

  const joinRoom = (data: RoomSchema) => {
    router.push(`/${data.roomId}`);
  };

  return (
    <WavyBackground className="w-full h-full flex justify-center items-center">
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-md w-5/6 md:w-5/12 p-8 border border-white rounded-xl text-white flex flex-col items-center">
          <div className="flex justify-center items-center md:py-8">
            <Image src="/logo.png" alt="Connectly Logo" width={100} height={50} />
            <h1 className="text-3xl md:text-6xl text-center font-mono">Connectly</h1>
          </div>
          <form
            className="flex flex-col items-center mt-3 w-full"
            onSubmit={handleSubmit(joinRoom)}
          >
            <input
              className={`text-black text-lg p-1 rounded w-9/12 mb-3 ${errors.roomId ? "border-red-500" : ""}`}
              placeholder="Enter Room ID"
              {...register("roomId")}
            />
            {errors.roomId && (
              <span className="text-red-500 text-sm p-2">{errors.roomId.message}</span>
            )}
            <button className="bg-red-700 py-2 mt-2  px-4  rounded-md border text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md" type="submit">
              Join Room
            </button>
          </form>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-6 h-1 w-full text-center text-xl"></div>
          <button className="bg-red-700 py-2  px-4  rounded-md border text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md" onClick={createAndJoin}>
            New Meeting
          </button>
        </div>
      </div>
    </WavyBackground>
  );
};

export default Home;


