import Notification from "../models/notification.model.js";
import { getIo } from "../socket/socket.js";


export const notifyAdmins = async ({
    title,
    message,
    type
}) => {

    const notification = await Notification.create({
        title,
        message,
        type
    });


    // Envoyer la notification en temps réel
    const io = getIo();

    io.to("admins").emit(
        "notification:new",
        notification.toObject()
    );


    return notification;
};