import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import type {
    Notification,
    NotificationsPagination,
    NotificationsStats
} from "../Types/Types";

import { useAuthContext } from "../Contexts/AuthContext";
import {socket} from "../socket/socket.js"



// =========================================================
// TYPES
// =========================================================

interface NotificationsContextType {

    // =========================
    // NOTIFICATIONS
    // =========================

    notifications: Notification[];
    loadingNotifications: boolean;

    getNotifications: () => Promise<void>;


    // =========================
    // FILTER
    // =========================

    read: boolean | undefined;
    setRead: (value: boolean | undefined) => void;


    // =========================
    // PAGINATION
    // =========================

    currentPage: number;
    setCurrentPage: (page: number) => void;

    pageLimit: number;
    setPageLimit: (limit: number) => void;

    pagination: NotificationsPagination | null;


    // =========================
    // MARK AS READ
    // =========================

    markAsRead: (id: string) => Promise<boolean>;
    loadingMarkAsRead: boolean;


    // =========================
    // MARK ALL AS READ
    // =========================

    markAllAsRead: () => Promise<boolean>;
    loadingMarkAllAsRead: boolean;


    // =========================
    // STATS
    // =========================

    notificationsStats: NotificationsStats;

    getNotificationsStats: () => Promise<void>;

    loadingNotificationsStats: boolean;


    // =========================
    // MESSAGE
    // =========================

    msg: string | null;
}


// =========================================================
// CONTEXT
// =========================================================

const NotificationsContext =
    createContext<NotificationsContextType | null>(null);


// =========================================================
// PROVIDER
// =========================================================

export const NotificationsProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const { token, user } = useAuthContext();


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [loadingNotifications, setLoadingNotifications] =
        useState<boolean>(false);


    // =====================================================
    // FILTER
    // =====================================================

    const [read, setRead] =
        useState<boolean | undefined>(undefined);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState<number>(1);

    const [pageLimit, setPageLimit] =
        useState<number>(10);

    const [pagination, setPagination] =
        useState<NotificationsPagination | null>(null);


    // =====================================================
    // MARK AS READ
    // =====================================================

    const [loadingMarkAsRead, setLoadingMarkAsRead] =
        useState<boolean>(false);


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const [loadingMarkAllAsRead, setLoadingMarkAllAsRead] =
        useState<boolean>(false);


    // =====================================================
    // STATS
    // =====================================================

    const [notificationsStats, setNotificationsStats] =
        useState<NotificationsStats>({
            total: 0,
            unread: 0,
            read: 0
        });

    const [loadingNotificationsStats, setLoadingNotificationsStats] =
        useState<boolean>(false);


    // =====================================================
    // MESSAGE
    // =====================================================

    const [msg, setMsg] =
        useState<string | null>(null);


        // ─── À mettre dans NotificationsProvider ──────────────────────────────────────
// 1) Ajouter useRef à l'import de "react"
// 2) SUPPRIMER les deux effets Socket.IO actuels (celui sans logs "connect",
//    et celui avec handleConnect / handleConnectError / handleDisconnect)
// 3) Les remplacer par ce bloc, à placer après la déclaration de currentPage/read

// Dernières valeurs du filtre et de la page, lisibles depuis le handler socket
// sans avoir à reconnecter le socket à chaque changement.
const viewRef = useRef({ read, currentPage });

useEffect(() => {
    viewRef.current = { read, currentPage };
}, [read, currentPage]);


useEffect(() => {

    if (!token || !user) {
        return;
    }

    socket.auth = { token };

    const handleConnect = () => {
        console.log("🟢 Socket.IO connecté ! ID :", socket.id);
    };

    const handleConnectError = (error: Error) => {
        console.error("🔴 Erreur de connexion Socket.IO :", error.message);
    };

    const handleDisconnect = (reason: string) => {
        console.log("🟠 Socket.IO déconnecté :", reason);
    };

    const handleNewNotification = (notification: Notification) => {

        const { read, currentPage } = viewRef.current;

        setNotifications(prev => {

            // Éviter les doublons
            if (prev.some(item => item._id === notification._id)) {
                return prev;
            }

            // Une nouvelle notification est non lue, et elle est la plus récente :
            // on ne l'ajoute que si la liste affichée peut la contenir.
            if (read === true || currentPage !== 1) {
                return prev;
            }

            return [notification, ...prev];
        });

        // Les stats, elles, changent quel que soit le filtre
        setNotificationsStats(prev => ({
            total: prev.total + 1,
            unread: prev.unread + 1,
            read: prev.read
        }));
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification:new", handleNewNotification);

    socket.connect();

    return () => {
        socket.off("connect", handleConnect);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
        socket.off("notification:new", handleNewNotification);
        socket.disconnect();
    };

}, [token, user?._id]);



    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    const getNotifications = async () => {

        try {

            setLoadingNotifications(true);
            setMsg(null);


            const params = new URLSearchParams();


            params.append(
                "page",
                String(currentPage)
            );


            params.append(
                "limit",
                String(pageLimit)
            );


            if (read !== undefined) {

                params.append(
                    "read",
                    String(read)
                );

            }


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/notifications?${params.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            if (!res.ok) {

                setMsg(
                    data.error ||
                    data.message ||
                    "Erreur lors de la récupération des notifications"
                );

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in getting notifications"
                );

            }


            console.log(
                "Notifications : ",
                data.data
            );


            setNotifications(
                data.data
            );


            setPagination(
                data.pagination
            );


        } catch (err) {

            console.error(err);

        } finally {

            setLoadingNotifications(false);

        }

    };


    // =====================================================
    // MARK AS READ
    // =====================================================

    const markAsRead = async (
        id: string
    ): Promise<boolean> => {

        try {

            setLoadingMarkAsRead(true);
            setMsg(null);


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/notifications/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            if (!res.ok) {

                setMsg(
                    data.error ||
                    data.message ||
                    "Erreur lors de la lecture de la notification"
                );

                return false;

            }


            // Mettre directement à jour la notification
            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === id
                        ? {
                            ...notification,
                            read: true
                        }
                        : notification
                )
            );


            // Mettre à jour les statistiques
            setNotificationsStats(prev => {

                if (prev.unread <= 0) {
                    return prev;
                }

                return {
                    ...prev,
                    unread: prev.unread - 1,
                    read: prev.read + 1
                };

            });


            return true;


        } catch (err) {

            console.error(err);

            setMsg(
                "Erreur réseau, veuillez réessayer"
            );

            return false;

        } finally {

            setLoadingMarkAsRead(false);

        }

    };


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const markAllAsRead = async (): Promise<boolean> => {

        try {

            setLoadingMarkAllAsRead(true);
            setMsg(null);


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/notifications`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            if (!res.ok) {

                setMsg(
                    data.error ||
                    data.message ||
                    "Erreur lors de la lecture des notifications"
                );

                return false;

            }


            // Toutes les notifications deviennent lues
            setNotifications(prev =>
                prev.map(notification => ({
                    ...notification,
                    read: true
                }))
            );


            // Mise à jour des statistiques
            setNotificationsStats(prev => ({
                ...prev,
                read: prev.read + prev.unread,
                unread: 0
            }));


            return true;


        } catch (err) {

            console.error(err);

            setMsg(
                "Erreur réseau, veuillez réessayer"
            );

            return false;

        } finally {

            setLoadingMarkAllAsRead(false);

        }

    };


    // =====================================================
    // GET NOTIFICATIONS STATS
    // =====================================================

    const getNotificationsStats = async () => {

        try {

            setLoadingNotificationsStats(true);


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/notifications/stats`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in getting notifications stats"
                );

            }


            console.log(
                "Notifications stats : ",
                data.data
            );


            setNotificationsStats(
                data.data
            );


        } catch (err) {

            console.error(err);

        } finally {

            setLoadingNotificationsStats(false);

        }

    };


       


    // =====================================================
    // FETCH STATS
    // =====================================================

    useEffect(() => {

        if (!token || !user) return;

        getNotificationsStats();

    }, [token]);


   
    

   

      useEffect(()=>{
        if(token && user)
        getNotifications();
      }, [token, user])


    // =====================================================
    // PROVIDER
    // =====================================================

    return (
        <NotificationsContext.Provider
            value={{

                // Notifications
                notifications,
                loadingNotifications,
                getNotifications,


                // Filter
                read,
                setRead,


                // Pagination
                currentPage,
                setCurrentPage,

                pageLimit,
                setPageLimit,

                pagination,


                // Mark as read
                markAsRead,
                loadingMarkAsRead,


                // Mark all as read
                markAllAsRead,
                loadingMarkAllAsRead,


                // Stats
                notificationsStats,
                getNotificationsStats,
                loadingNotificationsStats,


                // Message
                msg

            }}
        >
            {children}
        </NotificationsContext.Provider>
    );

};


// =========================================================
// HOOK
// =========================================================

export const useNotificationsContext = () => {

    const context =
        useContext(NotificationsContext);


    if (!context) {

        throw new Error(
            "Please use useNotificationsContext inside the NotificationsProvider"
        );

    }


    return context;
};