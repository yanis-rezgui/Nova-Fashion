// ─── NotificationsList.tsx ────────────────────────────────────────────────────
import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    Check,
    FolderPlus,
    Loader2,
    PackageCheck,
    Shirt,
    ShoppingBag,
    XCircle,
    type LucideIcon,
} from "lucide-react";
import { useNotificationsContext } from "../../AdminContexts/NotificationsContext";
import type { Notification, NotificationType } from "../../Types/Types";

// =========================================================
// CONFIG PAR TYPE
// =========================================================

const TYPE_CONFIG: Record<
    NotificationType,
    { icon: LucideIcon; label: string; iconClass: string }
> = {
    NEW_ORDER: {
        icon: ShoppingBag,
        label: "Nouvelle commande",
        iconClass: "bg-blue-50 text-blue-700",
    },
    ORDER_CANCELLED: {
        icon: XCircle,
        label: "Commande annulée",
        iconClass: "bg-red-50 text-red-700",
    },
    ORDER_DELIVERED: {
        icon: PackageCheck,
        label: "Commande livrée",
        iconClass: "bg-green-50 text-green-700",
    },
    NEW_CATEGORY: {
        icon: FolderPlus,
        label: "Nouvelle catégorie",
        iconClass: "bg-amber-50 text-amber-700",
    },
    NEW_CLOTHING: {
        icon: Shirt,
        label: "Nouveau vêtement",
        iconClass: "bg-violet-50 text-violet-700",
    },
};

// =========================================================
// HELPERS
// =========================================================

function formatRelativeTime(iso: string): string {
    const date = new Date(iso);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} h`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} j`;

    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatFullDate(iso: string): string {
    return new Date(iso).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
    });
}

const EMPTY_STATES: Record<"all" | "unread" | "read", { title: string; text: string }> = {
    all: {
        title: "Aucune notification pour le moment",
        text: "Les nouvelles commandes et les ajouts au catalogue apparaîtront ici.",
    },
    unread: {
        title: "Tout est à jour",
        text: "Vous n'avez aucune notification non lue.",
    },
    read: {
        title: "Aucune notification lue",
        text: "Les notifications que vous marquez comme lues apparaîtront ici.",
    },
};

// =========================================================
// LISTE
// =========================================================

const NotificationsList = () => {
    const { notifications, loadingNotifications, read } = useNotificationsContext();

    // Premier chargement (ou filtre sans résultat en cours de chargement) : squelettes
    if (loadingNotifications && notifications.length === 0) {
        return <NotificationsSkeleton />;
    }

    if (notifications.length === 0) {
        const key = read === undefined ? "all" : read ? "read" : "unread";

        return (
            <div className="flex flex-col items-center rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                    <Bell size={20} aria-hidden="true" />
                </span>
                <p className="font-semibold text-neutral-900">{EMPTY_STATES[key].title}</p>
                <p className="mt-1 max-w-[320px] text-sm text-neutral-500">{EMPTY_STATES[key].text}</p>
            </div>
        );
    }

    return (
        <ul
            aria-busy={loadingNotifications}
            className={`flex flex-col gap-2 transition-opacity duration-200 ${
                loadingNotifications ? "opacity-60" : "opacity-100"
            }`}
        >
            <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                    <motion.li
                        key={notification._id}
                        layout="position"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <NotificationItem notification={notification} />
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
};

export default memo(NotificationsList);

// =========================================================
// ITEM
// =========================================================

const NotificationItem = memo(function NotificationItem({
    notification,
}: {
    notification: Notification;
}) {
    const { markAsRead } = useNotificationsContext();
    const [pending, setPending] = useState(false);

    const config = TYPE_CONFIG[notification.type];
    const Icon = config.icon;

    const handleMarkAsRead = async () => {
        setPending(true);
        await markAsRead(notification._id);
        setPending(false);
    };

    return (
        <article
            className={`flex items-start gap-3 rounded-lg border bg-white p-4 transition-colors duration-300 ${
                notification.read ? "border-neutral-100" : "border-neutral-300"
            }`}
        >
            <span
                role="img"
                aria-label={config.label}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconClass}`}
            >
                <Icon size={18} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    {!notification.read && (
                        <>
                            <span className="h-2 w-2 shrink-0 rounded-full bg-neutral-900" aria-hidden="true" />
                            <span className="sr-only">Non lue</span>
                        </>
                    )}
                    <h3
                        className={`truncate text-[15px] ${
                            notification.read
                                ? "font-medium text-neutral-600"
                                : "font-semibold text-neutral-900"
                        }`}
                    >
                        {notification.title}
                    </h3>
                </div>

                <p className="mt-1 text-sm leading-5 text-neutral-500">{notification.message}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <time
                    dateTime={notification.createdAt}
                    title={formatFullDate(notification.createdAt)}
                    className="whitespace-nowrap text-xs text-neutral-400"
                >
                    {formatRelativeTime(notification.createdAt)}
                </time>

                {!notification.read && (
                    <button
                        type="button"
                        onClick={handleMarkAsRead}
                        disabled={pending}
                        aria-label="Marquer comme lue"
                        title="Marquer comme lue"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-neutral-200
                        text-neutral-500 transition-opacity duration-200 hover:opacity-70 active:opacity-50
                        disabled:cursor-not-allowed disabled:opacity-50
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                        {pending ? (
                            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                        ) : (
                            <Check size={14} aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>
        </article>
    );
});

// =========================================================
// SKELETON
// =========================================================

function NotificationsSkeleton() {
    return (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label="Chargement des notifications">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-neutral-100 bg-white p-4">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
                        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-100" />
                    </div>
                    <div className="h-3 w-14 animate-pulse rounded bg-neutral-100" />
                </div>
            ))}
        </div>
    );
}
