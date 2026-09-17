import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, CircleX } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {

    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className={`fixed top-5 right-5 z-[200] flex flex-row items-center gap-2
                px-4 py-3 rounded-[8px] shadow-2xl text-white text-[14px] font-[600]
                max-[500px]:left-5 max-[500px]:right-5
                ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
            >
                {type === "success" ? (
                    <CircleCheck size={18} />
                ) : (
                    <CircleX size={18} />
                )}
                {message}
            </motion.div>
        </AnimatePresence>
    );
};

export default memo(Toast);