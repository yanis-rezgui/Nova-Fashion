import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";

let io;

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                // "https://ton-site-vercel.app"
            ],
            credentials: true
        }
    });

    // Authentification du socket
    io.use(socketAuth);

    io.on("connection", (socket) => {

        const user = socket.user;

        // Uniquement les admins
        if (user) {

            socket.join("admins");

            console.log(
                `Admin ${user.firstName} connected and joined admins room`
            );

        } else {

            // Les utilisateurs normaux n'ont rien à faire ici
            socket.disconnect(true);

            return;
        }

    });

    return io;
};


export const getIo = () => {

    if (!io) {
        throw new Error("Socket.io is not initialized");
    }

    return io;
};