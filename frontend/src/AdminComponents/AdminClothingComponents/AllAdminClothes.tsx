import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    Trash2,
    ImageOff,
    CircleCheck,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    PackageOpen,
} from "lucide-react";

import { useAdminClothingContext } from "../../AdminContexts/AdminClothingContext";
import { useAuthContext } from "../../Contexts/AuthContext";
import type { Clothing } from "../../Types/Types";
import { useNavigate } from "react-router-dom";

// =====================================================
// Popup de confirmation de suppression
// =====================================================

interface DeletePopProps {
    cloth: Clothing;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

const DeletePop = memo(
    ({ cloth, onCancel, onConfirm, isDeleting }: DeletePopProps) => {
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
                    className="bg-white rounded-[10px] shadow-2xl p-6 w-[400px] max-[500px]:w-full flex flex-col gap-4"
                >
                    <h3 className="text-[1.2em] font-bold text-[#171717]">
                        Supprimer ce produit ?
                    </h3>
                    <p className="text-[14px] text-gray-600">
                        Vous êtes sur le point de supprimer{" "}
                        <strong>{cloth.name}</strong>. Cette action est
                        irréversible.
                    </p>

                    <div className="flex flex-row justify-end gap-3 mt-2">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-[5px] border-2 border-[#171717]
                            text-[#171717] font-[600] text-[14px] cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-[5px] bg-red-600 text-white
                            font-[600] text-[14px] cursor-pointer flex flex-row items-center gap-2
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting && (
                                <Loader2 size={16} className="animate-spin" />
                            )}
                            Supprimer
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }
);

// =====================================================
// Badge de statut
// =====================================================

const StatusBadge = ({ active }: { active: boolean }) => {
    return (
        <span
            className={`flex flex-row items-center gap-1 px-2 py-1 rounded-full
            text-[12px] font-[600] w-fit
            ${
                active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
            }`}
        >
            {active ? <CircleCheck size={14} /> : <XCircle size={14} />}
            {active ? "Actif" : "Inactif"}
        </span>
    );
};

// =====================================================
// Ligne produit (desktop)
// =====================================================

interface RowProps {
    cloth: Clothing;
    onDeleteClick: () => void;
}

const ClothRow = memo(({ cloth, onDeleteClick }: RowProps) => {
    const navigate = useNavigate();

    const hasDiscount =
        cloth.discountPrice !== null &&
        cloth.discountPrice !== undefined &&
        cloth.discountPrice < cloth.price;

    return (
        <tr className="border-b border-b-gray-200 hover:bg-gray-50 transition-colors duration-200">
            <td className="p-3">
                <div className="flex flex-row items-center gap-3">
                    {cloth.images?.[0]?.url ? (
                        <img
                            src={cloth.images[0].url}
                            alt={cloth.name}
                            className="w-[50px] h-[50px] object-cover rounded-[8px] border border-gray-200"
                        />
                    ) : (
                        <div className="w-[50px] h-[50px] rounded-[8px] bg-gray-100 flex items-center justify-center">
                            <ImageOff size={20} className="text-gray-400" />
                        </div>
                    )}

                    <p className="font-[600] text-[#171717] text-[14px] max-w-[200px] truncate">
                        {cloth.name}
                    </p>
                </div>
            </td>

            <td className="p-3 text-[14px] text-[#222344]">
                {cloth.category?.name || "—"}
            </td>

            <td className="p-3 text-[14px] text-[#222344]">
                {cloth.gender}
            </td>

            <td className="p-3">
                {hasDiscount ? (
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-400 line-through">
                            {cloth.price} DA
                        </span>

                        <span className="text-[14px] font-[600] text-[#B89B72]">
                            {cloth.discountPrice} DA
                        </span>
                    </div>
                ) : (
                    <span className="text-[14px] font-[600] text-[#171717]">
                        {cloth.price} DA
                    </span>
                )}
            </td>

            <td className="p-3">
                <StatusBadge active={cloth.active} />
            </td>

            <td className="p-3 text-[13px] text-gray-500">
                {new Date(cloth.createdAt).toLocaleDateString("fr-FR")}
            </td>

            {/* Actions */}
            <td className="p-3">
                <div className="flex flex-row items-center gap-2">
                    <button
                        onClick={() => navigate(`/admin/cloth/${cloth._id}`)}
                        title="Voir les détails"
                        className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <Eye size={16} />
                    </button>

                    <button
                        onClick={onDeleteClick}
                        title="Supprimer"
                        className="p-2 rounded-[5px] border-2 border-red-600 text-red-600
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
});

// =====================================================
// Carte produit (mobile)
// =====================================================

const ClothCard = memo(({ cloth, onDeleteClick }: RowProps) => {
    const navigate = useNavigate();

    const hasDiscount =
        cloth.discountPrice !== null &&
        cloth.discountPrice !== undefined &&
        cloth.discountPrice < cloth.price;

    return (
        <div className="bg-white rounded-[10px] shadow-2xl p-4 flex flex-col gap-3 w-full">
            <div className="flex flex-row items-center gap-3">
                {cloth.images?.[0]?.url ? (
                    <img
                        src={cloth.images[0].url}
                        alt={cloth.name}
                        className="w-[60px] h-[60px] object-cover rounded-[8px] border border-gray-200"
                    />
                ) : (
                    <div className="w-[60px] h-[60px] rounded-[8px] bg-gray-100 flex items-center justify-center shrink-0">
                        <ImageOff size={22} className="text-gray-400" />
                    </div>
                )}

                <div className="flex flex-col gap-1 min-w-0">
                    <p className="font-[600] text-[#171717] text-[15px] truncate">
                        {cloth.name}
                    </p>

                    <p className="text-[13px] text-gray-500">
                        {cloth.category?.name || "—"} • {cloth.gender}
                    </p>
                </div>
            </div>

            <div className="flex flex-row justify-between items-center">
                {hasDiscount ? (
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-[13px] text-gray-400 line-through">
                            {cloth.price} DA
                        </span>

                        <span className="text-[15px] font-[600] text-[#B89B72]">
                            {cloth.discountPrice} DA
                        </span>
                    </div>
                ) : (
                    <span className="text-[15px] font-[600] text-[#171717]">
                        {cloth.price} DA
                    </span>
                )}

                <StatusBadge active={cloth.active} />
            </div>

            <div className="flex flex-row items-center justify-between border-t border-t-gray-200 pt-3">
                <p className="text-[12px] text-gray-500">
                    Ajouté le{" "}
                    {new Date(cloth.createdAt).toLocaleDateString("fr-FR")}
                </p>

                {/* Actions */}
                <div className="flex flex-row items-center gap-2">
                    <button
                        onClick={() => navigate(`/admin/cloth/${cloth._id}`)}
                        title="Voir les détails"
                        className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <Eye size={16} />
                    </button>

                    <button
                        onClick={onDeleteClick}
                        title="Supprimer"
                        className="p-2 rounded-[5px] border-2 border-red-600 text-red-600
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
});

// =====================================================
// Composant principal
// =====================================================

const AllAdminClothes = () => {
    const {
        clothes,
        loadingClothes,
        getClothes,
        page,
        setPage,
        totalPages,
        total,
    } = useAdminClothingContext();

    const { token } = useAuthContext();

    const [clothToDelete, setClothToDelete] = useState<Clothing | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDelete = async () => {
        if (!clothToDelete || !token) return;

        try {
            setIsDeleting(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/clothing/${clothToDelete._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error deleting clothing"
                );
            }

            await getClothes();
            setClothToDelete(null);
        } catch (err) {
            console.error("Error deleting clothing:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-5 w-full px-70 max-[1300px]:px-40
        max-[1100px]:px-20 max-[1000px]:px-5 mt-10 mb-15">

            {/* Modal de confirmation de suppression */}
            <AnimatePresence>
                {clothToDelete && (
                    <DeletePop
                        cloth={clothToDelete}
                        onCancel={() => setClothToDelete(null)}
                        onConfirm={handleDelete}
                        isDeleting={isDeleting}
                    />
                )}
            </AnimatePresence>

            {/* ============================================= */}
            {/* Chargement */}
            {/* ============================================= */}

            {loadingClothes && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2
                        size={30}
                        className="animate-spin text-[#B89B72]"
                    />

                    <p className="text-gray-600">
                        Chargement des produits...
                    </p>
                </div>
            )}

            {/* ============================================= */}
            {/* Aucun produit */}
            {/* ============================================= */}

            {!loadingClothes && clothes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-[10px] shadow-2xl">
                    <PackageOpen
                        size={40}
                        className="text-gray-400"
                    />

                    <p className="text-gray-600 font-[600]">
                        Aucun produit trouvé
                    </p>
                </div>
            )}

            {/* ============================================= */}
            {/* Vue Desktop : tableau */}
            {/* ============================================= */}

            {!loadingClothes && clothes.length > 0 && (
                <div className="bg-white rounded-[10px] shadow-2xl overflow-x-auto max-[800px]:hidden">
                    <table className="w-full min-w-[700px] border-collapse ">
                        <thead>
                            <tr className="bg-[#F7F4EE] border-b border-b-gray-300">
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Produit
                                </th>

                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Catégorie
                                </th>

                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Genre
                                </th>

                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Prix
                                </th>

                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Statut
                                </th>

                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Ajouté le
                                </th>

                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {clothes.map((cloth) => (
                                <ClothRow
                                    key={cloth._id}
                                    cloth={cloth}
                                    onDeleteClick={() =>
                                        setClothToDelete(cloth)
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ============================================= */}
            {/* Vue Mobile : cartes */}
            {/* ============================================= */}

            {!loadingClothes && clothes.length > 0 && (
                <div className="hidden max-[800px]:flex flex-col gap-3">
                    {clothes.map((cloth) => (
                        <ClothCard
                            key={cloth._id}
                            cloth={cloth}
                            onDeleteClick={() =>
                                setClothToDelete(cloth)
                            }
                        />
                    ))}
                </div>
            )}

            {/* ============================================= */}
            {/* Pagination */}
            {/* ============================================= */}

            {!loadingClothes && totalPages > 1 && (
                <div className="flex flex-row justify-between items-center mt-2
                max-[600px]:flex-col max-[600px]:gap-3">
                    <p className="text-[13px] text-gray-500">
                        Page {page} sur {totalPages} — {total} produits
                    </p>

                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={() =>
                                setPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={page <= 1}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            onClick={() =>
                                setPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={page >= totalPages}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(AllAdminClothes);