import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const DARK = "#171717";
const ACCENT = "#B89B72";

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <section
            className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center"
            style={{ backgroundColor: "#F7F4EE" }}
        >

            {/* ── Grand 404 stylisé ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex items-center justify-center"
            >
                <p
                    className="text-[7em] min-[500px]:text-[9em] font-bold leading-none select-none"
                    style={{ color: DARK, opacity: 0.06 }}
                >
                    404
                </p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="absolute flex flex-col items-center"
                >
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${ACCENT}1A` }}
                    >
                        <Search size={26} color={ACCENT} />
                    </div>
                </motion.div>
            </motion.div>

            {/* ── Texte ── */}
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[1.6em] min-[500px]:text-[2em] font-bold mt-2"
                style={{ color: DARK }}
            >
                Page introuvable
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-500 mt-3 max-w-[420px] text-[15px] leading-relaxed"
            >
                La page que vous cherchez n'existe pas, a été déplacée ou le lien que vous avez suivi est incorrect.
            </motion.p>

            {/* ── Actions ── */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col min-[420px]:flex-row items-center gap-3 mt-8 w-full max-w-[360px] min-[420px]:max-w-none"
            >
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center gap-2 w-full min-[420px]:w-auto px-6 py-3 rounded-[6px]
                    text-white text-[14px] font-[600] cursor-pointer transition-opacity duration-200
                    hover:opacity-85 active:opacity-70"
                    style={{ backgroundColor: DARK }}
                >
                    <Home size={16} />
                    Retour à l'accueil
                </button>

                <button
                    onClick={() => navigate("/boutique")}
                    className="flex items-center justify-center gap-2 w-full min-[420px]:w-auto px-6 py-3 rounded-[6px]
                    text-[14px] font-[600] border cursor-pointer transition-opacity duration-200
                    hover:opacity-70 active:opacity-50"
                    style={{ borderColor: ACCENT, color: DARK }}
                >
                    Voir la boutique
                </button>
            </motion.div>

            {/* ── Lien retour discret ── */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 mt-6 text-[13px] text-gray-500 cursor-pointer
                transition-opacity duration-200 hover:opacity-70"
            >
                <ArrowLeft size={14} />
                Retourner à la page précédente
            </motion.button>

        </section>
    );
};

export default memo(NotFound);