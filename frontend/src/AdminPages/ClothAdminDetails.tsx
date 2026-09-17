import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Save, Loader2 } from "lucide-react";

import { useAdminClothingContext } from "../AdminContexts/AdminClothingContext";
import ClothInfosForm, {
    type ClothFormState,
} from "../AdminComponents/AdminClothDetailsComponents/ClothInfosForm";
import ClothImagesManager from "../AdminComponents/AdminClothDetailsComponents/ClothImagesManager";
import VariantsManager from "../AdminComponents/AdminClothDetailsComponents/VariantsManager";
import DeleteClothPop from "../AdminComponents/AdminClothDetailsComponents/DeleteClothPop";
import Toast from "../AdminComponents/AdminClothDetailsComponents/Toast";

interface CategoryOption {
    _id: string;
    name: string;
}

interface ExistingImage {
    _id: string;
    url: string;
    publicId?: string;
}

const ClothAdminDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        getCloth,
        clothDetails,
        variants,
        loadingGetCloth,
        updateClothing,
        deleteClothing,
        mutatingClothing,
    } = useAdminClothingContext();

    const [categories, setCategories] = useState<CategoryOption[]>([]);

    const [form, setForm] = useState<ClothFormState | null>(null);
    const [oldImages, setOldImages] = useState<ExistingImage[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);

    const [showDeletePop, setShowDeletePop] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [toast, setToast] = useState<
        { message: string; type: "success" | "error" } | null
    >(null);

    // =========================
    // Chargement du produit
    // =========================

    useEffect(() => {
        if (id) getCloth(id);
    }, [id]);

    // =========================
    // Chargement des catégories
    // =========================

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/categories`
                );

                const data = await res.json();

                if (res.ok) setCategories(data.data || []);

            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    // =========================
    // Initialisation du formulaire
    // =========================

    useEffect(() => {

        if (clothDetails) {

            setForm({
                name: clothDetails.name,
                description: clothDetails.description,
                gender: clothDetails.gender,
                price: clothDetails.price,
                discountPrice: clothDetails.discountPrice ?? null,
                category:
                    typeof clothDetails.category === "string"
                        ? clothDetails.category
                        : (clothDetails.category as any)?._id || "",
                active: clothDetails.active,
            });

            setOldImages(
                (clothDetails.images || []).map((img: any) => ({
                    _id: img._id,
                    url: img.url,
                    publicId: img.publicId,
                }))
            );

            setNewImages([]);
        }
    }, [clothDetails]);

    const handleFormChange = (updates: Partial<ClothFormState>) => {
        setForm((prev) => (prev ? { ...prev, ...updates } : prev));
    };

    // =========================
    // Soumission des modifications
    // =========================

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!form || !clothDetails) return;

        if (!form.name.trim() || !form.description.trim() || !form.category) {
            setToast({
                message: "Veuillez remplir tous les champs obligatoires.",
                type: "error",
            });
            return;
        }

        const result = await updateClothing(clothDetails._id, {
            name: form.name.trim(),
            description: form.description.trim(),
            gender: form.gender,
            price: form.price,
            discountPrice: form.discountPrice,
            category: form.category,
            active: form.active,
            existingImageIds: oldImages.map((img) => img._id),
            newImages,
        });

        if (result.success) {
            setToast({
                message: "Vêtement mis à jour avec succès !",
                type: "success",
            });
            setNewImages([]);
        } else {
            setToast({ message: result.message, type: "error" });
        }
    };

    // =========================
    // Suppression du produit
    // =========================

    const handleDelete = async () => {

        if (!clothDetails) return;

        setIsDeleting(true);

        const result = await deleteClothing(clothDetails._id);

        setIsDeleting(false);
        setShowDeletePop(false);

        if (result.success) {
            navigate("/admin/clothes");
        } else {
            setToast({ message: result.message, type: "error" });
        }
    };

    return (
        <section className="min-h-screen flex flex-col w-full items-center bg-[#F7F4EE]">

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {loadingGetCloth && (
                <div className="flex flex-col items-center justify-center py-40 gap-3">
                    <Loader2 size={30} className="animate-spin text-[#B89B72]" />
                    <p className="text-gray-600">Chargement du produit...</p>
                </div>
            )}

            {!loadingGetCloth && !clothDetails && (
                <div className="flex flex-col items-center justify-center py-40 gap-3">
                    <p className="text-gray-600 font-[600]">Produit introuvable</p>
                    <button
                        onClick={() => navigate("/admin/clothes")}
                        className="px-4 py-2 rounded-[5px] bg-[#171717] text-white cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        Retour à la liste
                    </button>
                </div>
            )}

            {!loadingGetCloth && clothDetails && form && (
                <div className="flex flex-col w-[900px] mt-10 mb-20 px-5 gap-5
                max-[950px]:w-full">

                    {/* ============================================= */}
                    {/* Header */}
                    {/* ============================================= */}
                    <div className="flex flex-row items-center justify-between gap-3
                    max-[600px]:flex-col max-[600px]:items-stretch">

                        <button
                            onClick={() => navigate("/admin/clothes")}
                            className="flex flex-row items-center gap-2 text-[#171717] font-[600]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            w-fit"
                        >
                            <ArrowLeft size={20} />
                            Retour aux vêtements
                        </button>

                        <button
                            onClick={() => setShowDeletePop(true)}
                            className="flex flex-row items-center justify-center gap-2 px-4 py-2
                            rounded-[5px] border-2 border-red-600 text-red-600 font-[600] text-[14px]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Trash2 size={16} />
                            Supprimer le produit
                        </button>
                    </div>

                    <h1 className="text-[1.8em] font-bold text-[#171717] max-[600px]:text-[1.4em]">
                        {clothDetails.name}
                    </h1>

                    {/* ============================================= */}
                    {/* Formulaire */}
                    {/* ============================================= */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">

                        <ClothInfosForm
                            form={form}
                            onChange={handleFormChange}
                            categories={categories}
                        />

                        <ClothImagesManager
                            oldImages={oldImages}
                            setOldImages={setOldImages}
                            newImages={newImages}
                            setNewImages={setNewImages}
                        />

                        <button
                            type="submit"
                            disabled={mutatingClothing}
                            className="flex flex-row items-center justify-center gap-2 w-fit self-end
                            px-5 py-3 rounded-[5px] bg-[#B89B72] text-white font-[600] text-[14px]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50 max-[600px]:w-full max-[600px]:self-stretch"
                        >
                            {mutatingClothing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Enregistrer les modifications
                        </button>
                    </form>

                    {/* ============================================= */}
                    {/* Variantes */}
                    {/* ============================================= */}
                    <VariantsManager
                        clothingId={clothDetails._id}
                        variants={variants || []}
                    />
                </div>
            )}

            {/* ============================================= */}
            {/* Popup suppression */}
            {/* ============================================= */}
            <AnimatePresence>
                {showDeletePop && (
                    <DeleteClothPop
                        clothName={clothDetails?.name || ""}
                        isDeleting={isDeleting}
                        onCancel={() => setShowDeletePop(false)}
                        onConfirm={handleDelete}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default memo(ClothAdminDetails);