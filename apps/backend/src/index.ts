import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const port = 8000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Socket.IO Server is running!");
});

io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", ({ roomId, userId }: { roomId: string, userId: string }) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const roomSize = room?.size || 0;

        if (roomSize < 2) {
            console.log(`A new user with userId ${userId} joined room ${roomId}`);
            socket.join(roomId);
            socket.broadcast.to(roomId).emit("user-connected", userId);
        } else {
            console.log(`Room ${roomId} is full. User ${userId} cannot join.`);
            socket.emit("room-full", roomId);
        }
    });

    socket.on("user-toggle-audio", (userId: string, roomId: string) => {
        console.log(`userId ${userId} toggle audio with roomid ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
    })

    socket.on("user-toggle-video", (userId: string, roomId: string) => {
        console.log(`userId ${userId} toggle video with roomid ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-toggle-video", userId);
    })

    socket.on("user-leave", (userId: string, roomId: string) => {
        console.log(`userId ${userId} left the roomid ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-leave", userId);
    })

    socket.on("send-message", (userId: string, roomId: string, message: string) => {
        console.log(`message ${message} from user ${userId} received in room`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("receive-message", message);
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
