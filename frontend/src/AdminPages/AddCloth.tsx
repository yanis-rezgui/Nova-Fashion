import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { useAdminClothingContext } from "../AdminContexts/AdminClothingContext";
import ClothInfosForm, {
    type ClothFormState,
} from "../AdminComponents/AdminClothDetailsComponents/ClothInfosForm";
import ClothImagesManager from "../AdminComponents/AdminClothDetailsComponents/ClothImagesManager";
import NewVariantsManager, {
    type LocalVariant,
} from "../AdminComponents/AdminAddClothComponents/NewVariantsManager";
import Toast from "../AdminComponents/AdminClothDetailsComponents/Toast";

interface CategoryOption {
    _id: string;
    name: string;
}

const defaultForm: ClothFormState = {
    name: "",
    description: "",
    gender: "HOMME",
    price: 0,
    discountPrice: null,
    category: "",
    active: true,
};

const AddCloth = () => {

    const navigate = useNavigate();

    const { createClothing, mutatingClothing } = useAdminClothingContext();

    const [categories, setCategories] = useState<CategoryOption[]>([]);

    const [form, setForm] = useState<ClothFormState>(defaultForm);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [variants, setVariants] = useState<LocalVariant[]>([]);

   

    const [toast, setToast] = useState<
        { message: string; type: "success" | "error" } | null
    >(null);

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

    const handleFormChange = (updates: Partial<ClothFormState>) => {
        setForm((prev) => ({ ...prev, ...updates }));
    };

    // =========================
    // Gestion locale des variantes
    // =========================

    const handleAddVariant = (variant: Omit<LocalVariant, "tempId">) => {
        setVariants((prev) => [
            ...prev,
            { ...variant, tempId: crypto.randomUUID() },
        ]);
    };

    const handleUpdateVariant = (
        tempId: string,
        updates: Partial<Omit<LocalVariant, "tempId">>
    ) => {
        setVariants((prev) =>
            prev.map((v) => (v.tempId === tempId ? { ...v, ...updates } : v))
        );
    };

    const handleRemoveVariant = (tempId: string) => {
        setVariants((prev) => prev.filter((v) => v.tempId !== tempId));
    };

    // =========================
    // Soumission de la création
    // =========================

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!form.name.trim() || !form.description.trim() || !form.category) {
            setToast({
                message: "Veuillez remplir tous les champs obligatoires.",
                type: "error",
            });
            return;
        }

        const result = await createClothing({
            name: form.name.trim(),
            description: form.description.trim(),
            gender: form.gender,
            price: form.price,
            discountPrice: form.discountPrice,
            category: form.category,
            active: form.active,
            variants: variants.map(({ color, size, quantity }) => ({
                color,
                size,
                quantity,
            })),
            images: newImages,
        });

        if (result.success) {
            setToast({
                message: "Vêtement créé avec succès !",
                type: "success",
            });
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
                </div>

                <h1 className="text-[1.8em] font-bold text-[#171717] max-[600px]:text-[1.4em]">
                    Ajouter un nouveau vêtement
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
                        oldImages={[]}
                        setOldImages={() => {}}
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
                        Créer le vêtement
                    </button>
                </form>

                {/* ============================================= */}
                {/* Variantes */}
                {/* ============================================= */}
                <NewVariantsManager
                    variants={variants}
                    onAdd={handleAddVariant}
                    onUpdate={handleUpdateVariant}
                    onRemove={handleRemoveVariant}
                />
            </div>
        </section>
    );
};

export default memo(AddCloth);
