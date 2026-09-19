// ─── Notifications.tsx ────────────────────────────────────────────────────────
import { memo, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AlertCircle, CheckCheck, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useNotificationsContext } from "../AdminContexts/NotificationsContext";
import NotificationsFilter from "../AdminComponents/NotificationsComponents/NotificationsFilter";
import NotificationsList from "../AdminComponents/NotificationsComponents/NotificationsList";

const Notifications = () => {
    const {
        notificationsStats,
        loadingNotificationsStats,
        markAllAsRead,
        loadingMarkAllAsRead,
        pagination,
        currentPage,
        setCurrentPage,
        msg,
    } = useNotificationsContext();

    // Le contexte remet msg à null avant chaque requête : on recopie donc msg
    // dans un état local pour pouvoir fermer la bannière sans toucher au contexte.
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(msg);
    }, [msg]);

    return (
        <MotionConfig reducedMotion="user">
            <section className="flex min-h-screen w-full flex-col items-center bg-neutral-50 px-5 pb-20 pt-[90px]">

                {/* En-tête */}
                <header className="text-center">
                    <h1 className="text-[1.8em] font-bold text-neutral-900">Notifications</h1>
                    <p className="mx-auto mt-2 max-w-[420px] text-[15px] leading-6 text-neutral-500">
                        Suivez l'activité de la boutique : commandes, catalogue et nouveautés.
                        Filtrez vos notifications et marquez-les comme lues.
                    </p>
                </header>

                <div className="mt-10 flex w-full max-w-[700px] flex-col">

                    {/* Erreur */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                role="alert"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                            >
                                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                                <p className="flex-1">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => setError(null)}
                                    aria-label="Fermer le message d'erreur"
                                    className="cursor-pointer rounded p-0.5 text-red-700 transition-opacity duration-200
                                    hover:opacity-70 focus-visible:outline-2 focus-visible:outline-red-700"
                                >
                                    <X size={16} aria-hidden="true" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* KPI */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <KpiCard label="Total" value={notificationsStats.total} loading={loadingNotificationsStats} color="text-neutral-900" />
                        <KpiCard label="Non lues" value={notificationsStats.unread} loading={loadingNotificationsStats} color="text-red-700" />
                        <KpiCard label="Lues" value={notificationsStats.read} loading={loadingNotificationsStats} color="text-green-700" />
                    </div>

                    {/* Filtre + tout marquer comme lu */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <NotificationsFilter />

                        {notificationsStats.unread > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                disabled={loadingMarkAllAsRead}
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white
                                px-4 py-2 text-sm font-semibold text-neutral-700 transition-opacity duration-200
                                hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                            >
                                {loadingMarkAllAsRead ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                        Marquage en cours...
                                    </>
                                ) : (
                                    <>
                                        <CheckCheck size={16} aria-hidden="true" />
                                        Tout marquer comme lu
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Liste */}
                    <NotificationsList />

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <nav aria-label="Pagination des notifications" className="mt-6 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="flex cursor-pointer items-center gap-1 rounded-lg bg-neutral-200 px-4 py-2 text-[14px]
                                font-semibold text-neutral-900 transition-opacity duration-200 hover:opacity-80 active:opacity-60
                                disabled:cursor-not-allowed disabled:opacity-40
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                            >
                                <ChevronLeft size={16} aria-hidden="true" />
                                Précédent
                            </button>

                            <span className="text-sm font-semibold tabular-nums text-neutral-900">
                                Page {pagination.page} / {pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage >= pagination.totalPages}
                                className="flex cursor-pointer items-center gap-1 rounded-lg bg-neutral-200 px-4 py-2 text-[14px]
                                font-semibold text-neutral-900 transition-opacity duration-200 hover:opacity-80 active:opacity-60
                                disabled:cursor-not-allowed disabled:opacity-40
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                            >
                                Suivant
                                <ChevronRight size={16} aria-hidden="true" />
                            </button>
                        </nav>
                    )}
                </div>
            </section>
        </MotionConfig>
    );
};

export default memo(Notifications);

// ─── KpiCard (local) ──────────────────────────────────────────────────────────
interface KpiCardProps {
    label: string;
    value: number;
    color: string;
    loading: boolean;
}

function KpiCard({ label, value, color, loading }: KpiCardProps) {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="mb-1 text-xs text-neutral-500">{label}</p>
            {loading ? (
                <div className="h-7 w-10 animate-pulse rounded bg-neutral-100" />
            ) : (
                <p className={`text-xl font-semibold tabular-nums ${color}`}>{value}</p>
            )}
        </div>
    );
}
