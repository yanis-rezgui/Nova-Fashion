import prisma from "../config/prisma.js";
import { getIo } from "../socket/socket.js";


export const notifyAdmins = async ({
    title,
    message,
    type
}) => {

    const admins = await prisma.user.findMany({
        where: {
            role: "ADMIN"
        },
        select: {
            id: true
        }
    });

    if (admins.length === 0) {
        return;
    }

    const notifications = await prisma.notification.createManyAndReturn({
        data: admins.map((admin) => ({
            title,
            message,
            type,
            userId: admin.id
        }))
    });

    // Envoyer les notifications en temps réel
    const io = getIo();

    notifications.forEach((notification) => {

        io.to("admins").emit(
            "notification:new",
            notification
        );

    });
};