import { memo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface DeleteClothPopProps {
    clothName: string;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteClothPop = ({
    clothName,
    isDeleting,
    onCancel,
    onConfirm,
}: DeleteClothPopProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-5"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[10px] shadow-2xl p-6 w-[420px] max-[500px]:w-full
                flex flex-col gap-4"
            >
                <h3 className="text-[1.2em] font-bold text-[#171717]">
                    Supprimer ce produit ?
                </h3>
                <p className="text-[14px] text-gray-600">
                    Vous êtes sur le point de supprimer définitivement{" "}
                    <strong>{clothName}</strong> ainsi que toutes ses variantes.
                    Cette action est irréversible.
                </p>

                <div className="flex flex-row justify-end gap-3 mt-2">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                        font-[600] text-[14px] cursor-pointer transition-opacity duration-200
                        hover:opacity-80 active:opacity-60 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-[5px] bg-red-600 text-white font-[600] text-[14px]
                        cursor-pointer flex flex-row items-center gap-2 transition-opacity duration-200
                        hover:opacity-80 active:opacity-60 disabled:opacity-50"
                    >
                        {isDeleting && <Loader2 size={16} className="animate-spin" />}
                        Supprimer définitivement
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default memo(DeleteClothPop);