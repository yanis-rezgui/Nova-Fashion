// ─── NotificationsFilter.tsx ──────────────────────────────────────────────────
import { memo } from "react";
import { motion } from "framer-motion";
import { useNotificationsContext } from "../../AdminContexts/NotificationsContext";

const OPTIONS: { label: string; value: boolean | undefined }[] = [
    { label: "Toutes", value: undefined },
    { label: "Non lues", value: false },
    { label: "Lues", value: true },
];

const NotificationsFilter = () => {
    const { read, setRead } = useNotificationsContext();

    return (
        <div
            role="radiogroup"
            aria-label="Filtrer les notifications"
            className="inline-flex rounded-lg bg-neutral-200/70 p-1"
        >
            {OPTIONS.map((option) => {
                const active = read === option.value;

                return (
                    <button
                        key={option.label}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setRead(option.value)}
                        className="relative cursor-pointer rounded-md px-4 py-1.5 text-sm font-semibold
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                        {active && (
                            <motion.span
                                layoutId="notifications-filter-pill"
                                className="absolute inset-0 rounded-md bg-white shadow-sm"
                                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            />
                        )}
                        <span
                            className={`relative transition-colors duration-200 ${
                                active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                            }`}
                        >
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default memo(NotificationsFilter);
