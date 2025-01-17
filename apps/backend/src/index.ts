import express, { Express } from 'express';
// import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app: Express = express();
// const server = createServer(app);

const PORT = 8000;
const io = new Server(PORT, {
    cors: {
        origin: "*", // Update as needed for production
        methods: ["GET", "POST"],
    },
});
// const io = new Server(server, { cors: { origin: "*" } });

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket: Socket) => {
    console.log(`Socket Connected`, socket.id);

    socket.on("room:join", (data) => {
        const { email, room } = data;

        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);

        io.to(room).emit("user:joined", { email, id: socket.id });

        socket.join(room);

        io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({ to, offer }) => {

        io.to(to).emit("incomming:call", { from: socket.id, offer });

    });

    socket.on("call:accepted", ({ to, ans }) => {

        io.to(to).emit("call:accepted", { from: socket.id, ans });

    });

    socket.on("peer:nego:needed", ({ to, offer }) => {

        console.log("peer:nego:needed", offer);

        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });

    });

    socket.on("peer:nego:done", ({ to, ans }) => {

        console.log("peer:nego:done", ans);

        io.to(to).emit("peer:nego:final", { from: socket.id, ans });

    });

    socket.on("disconnect", () => {

        console.log(`user is disconnected with user id:${socket.id}`);

    })
})

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })


// const PORT = 8000;
// const io = new Server(PORT, {
//     cors: {
//         origin: "*", // Update as needed for production
//         methods: ["GET", "POST"],
//     },
// });

// console.log(`Socket.IO server running on port ${PORT}`);

// const emailToSocketIdMap = new Map();
// const socketIdToEmailMap = new Map();

// // Logging helper
// const log = (message, data = {}) => {
//     console.log(`[${new Date().toISOString()}] ${message}`, data);
// };

// // Check if `to` email/socket exists and emit
// const emitToValidSocket = (to, event, payload) => {
//     const socketId = emailToSocketIdMap.get(to);
//     if (socketId) io.to(socketId).emit(event, payload);
//     else log(`Target socket not found for email: ${to}`);
// };

// io.on("connection", (socket) => {
//     log("Socket connected", { id: socket.id });

//     // Handle room joining
//     socket.on("room:join", ({ email, room }) => {
//         emailToSocketIdMap.set(email, socket.id);
//         socketIdToEmailMap.set(socket.id, email);

//         socket.join(room);

//         io.to(room).emit("user:joined", { email, id: socket.id });
//         io.to(socket.id).emit("room:join", { email, room });

//         log("User joined room", { email, room, id: socket.id });
//     });

//     // Handle user calls
//     socket.on("user:call", ({ to, offer }) =>
//         emitToValidSocket(to, "incoming:call", { from: socket.id, offer })
//     );

//     // Handle call acceptance
//     socket.on("call:accepted", ({ to, ans }) =>
//         emitToValidSocket(to, "call:accepted", { from: socket.id, ans })
//     );

//     // Peer negotiation needed
//     socket.on("peer:nego:needed", ({ to, offer }) => {
//         log("Peer negotiation needed", { from: socket.id, to, offer });
//         emitToValidSocket(to, "peer:nego:needed", { from: socket.id, offer });
//     });

//     // Peer negotiation done
//     socket.on("peer:nego:done", ({ to, ans }) => {
//         log("Peer negotiation done", { from: socket.id, to, ans });
//         emitToValidSocket(to, "peer:nego:final", { from: socket.id, ans });
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {

//         const email = socketIdToEmailMap.get(socket.id);

//         if (email) {
//             emailToSocketIdMap.delete(email);
//             socketIdToEmailMap.delete(socket.id);
//         }

//         log("Socket disconnected", { id: socket.id, email });
//     });
// });
