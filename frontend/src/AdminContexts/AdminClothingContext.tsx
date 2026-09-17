import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type {
    Clothing,
    ClothingFilterType,
    Variant,
} from "../Types/Types";

import { useAuthContext } from "../Contexts/AuthContext";


// =====================================================
// Types payloads
// =====================================================

interface ClothingCreatePayload {
    name: string;
    description: string;
    gender: string;
    price: number;
    discountPrice?: number | null;
    category: string;
    active?: boolean;
    variants?: { color: string; size: string; quantity: number }[];
    images?: File[];
}

interface ClothingUpdatePayload {
    name?: string;
    description?: string;
    gender?: string;
    price?: number;
    discountPrice?: number | null;
    category?: string;
    active?: boolean;
    existingImageIds?: string[];
    newImages?: File[];
}

interface VariantPayload {
    color: string;
    size: string;
    quantity: number;
}

interface ActionResult {
    success: boolean;
    message: string;
}


// =====================================================
// Context Type
// =====================================================

interface AdminClothingContextType {

    clothes: Clothing[];

    loadingClothes: boolean;

    getClothes: () => Promise<void>;

    filterClothes: ClothingFilterType;

    setFilterClothes: (
        f: ClothingFilterType
    ) => void;

    page: number;
setPage: React.Dispatch<React.SetStateAction<number>>;

limit: number;

setLimit: React.Dispatch<React.SetStateAction<number>>;


    total: number;

    totalPages: number;

    clothDetails: Clothing | null;

    variants: Variant[] | null;

    getCloth: (id: string) => Promise<void>;

    loadingGetCloth: boolean;

    // Statistics
    totalClothes: number;

    activeClothes: number;

    lowStockCount: number;

    outOfStockCount: number;

    // Mutations Clothing
    createClothing: (
        payload: ClothingCreatePayload
    ) => Promise<ActionResult>;

    updateClothing: (
        id: string,
        payload: ClothingUpdatePayload
    ) => Promise<ActionResult>;

    deleteClothing: (
        id: string
    ) => Promise<ActionResult>;

    mutatingClothing: boolean;

    // Mutations Variants
    addVariant: (
        clothingId: string,
        variant: VariantPayload
    ) => Promise<ActionResult>;

    updateVariant: (
        variantId: string,
        updates: Partial<VariantPayload>
    ) => Promise<ActionResult>;

    deleteVariant: (
        variantId: string
    ) => Promise<ActionResult>;

    mutatingVariant: boolean;
}


// =====================================================
// Context
// =====================================================

const AdminClothingContext =
    createContext<AdminClothingContextType | null>(null);


// =====================================================
// Provider
// =====================================================

export const AdminClothingProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const { token } = useAuthContext();


    // =================================================
    // Clothes
    // =================================================

    const [clothes, setClothes] =
        useState<Clothing[]>([]);


    const [loadingClothes, setLoadingClothes] =
        useState<boolean>(false);


    // =================================================
    // Filters
    // =================================================

    const [filterClothes, setFilterClothesState] =
        useState<ClothingFilterType>(() => {

            const saved =
                localStorage.getItem(
                    "adminFilterClothes"
                );

            return saved
                ? JSON.parse(saved)
                : {
                    gender: "",
                    category: "",
                    minPrice: 0,
                    maxPrice: 0,
                    search: "",
                    discount: "",
                    sort: "new_arrival",
                    stock: "",
                };
        });


    // =================================================
    // Pagination
    // =================================================

    const [page, setPage] =
        useState<number>(1);


    const [limit, setLimit] =
        useState<number>(10);


    const [total, setTotal] =
        useState<number>(0);


    const [totalPages, setTotalPages] =
        useState<number>(0);


    // =================================================
    // Cloth details
    // =================================================

    const [clothDetails, setClothDetails] =
        useState<Clothing | null>(null);


    const [variants, setVariants] =
        useState<Variant[] | null>(null);


    const [loadingGetCloth, setLoadingGetCloth] =
        useState<boolean>(false);


    // =================================================
    // Statistics
    // =================================================

    const [totalClothes, setTotalClothes] =
        useState<number>(0);


    const [activeClothes, setActiveClothes] =
        useState<number>(0);


    const [lowStockCount, setLowStockCount] =
        useState<number>(0);


    const [outOfStockCount, setOutOfStockCount] =
        useState<number>(0);


    // =================================================
    // Mutations state
    // =================================================

    const [mutatingClothing, setMutatingClothing] =
        useState<boolean>(false);


    const [mutatingVariant, setMutatingVariant] =
        useState<boolean>(false);


    // =================================================
    // Save filters
    // =================================================

    useEffect(() => {

        localStorage.setItem(
            "adminFilterClothes",
            JSON.stringify(filterClothes)
        );

    }, [filterClothes]);


    // =================================================
    // Update filters
    // =================================================

    const setFilterClothes = (
        filters: ClothingFilterType
    ) => {

        setFilterClothesState(filters);

        setPage(1);
    };


    // =================================================
    // Get Clothes
    // =================================================

    const getClothes = async () => {

        if (!token) return;

        try {

            setLoadingClothes(true);

            const params =
                new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if (filterClothes.category?.trim()) {
                params.append("category", filterClothes.category.trim());
            }

            if (filterClothes.gender?.trim()) {
                params.append("gender", filterClothes.gender.trim());
            }

            if (
                filterClothes.minPrice !== undefined &&
                filterClothes.minPrice > 0
            ) {
                params.append(
                    "minPrice",
                    filterClothes.minPrice.toString()
                );
            }

            if (
                filterClothes.maxPrice !== undefined &&
                filterClothes.maxPrice > 0 &&
                filterClothes.maxPrice > filterClothes.minPrice
            ) {
                params.append(
                    "maxPrice",
                    filterClothes.maxPrice.toString()
                );
            }

            if (filterClothes.search?.trim()) {
                params.append("search", filterClothes.search.trim());
            }

            if (filterClothes.discount?.trim()) {
                params.append("discount", filterClothes.discount.trim());
            }

            if (filterClothes.sort?.trim()) {
                params.append("sort", filterClothes.sort.trim());
            }

            if (filterClothes.stock?.trim()) {
                params.append("stock", filterClothes.stock.trim());
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/clothing/admin?${params.toString()}`,
                {
                    method: "GET",
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
                    "Error in getting admin clothes"
                );
            }

            setClothes(data.data);
            setTotal(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
            setTotalClothes(data.totalClothes ?? 0);
            setActiveClothes(data.activeClothes ?? 0);
            setLowStockCount(data.lowStockCount ?? 0);
            setOutOfStockCount(data.outOfStockCount ?? 0);

        } catch (err) {

            console.error("Error getting admin clothes:", err);

        } finally {

            setLoadingClothes(false);
        }
    };


    // =================================================
    // Get Cloth Details
    // =================================================

    const getCloth = async (id: string) => {

        try {

            setLoadingGetCloth(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/clothing/${id}`,
                { method: "GET" }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in getting cloth"
                );
            }

            setClothDetails(data.data.cloth);
            setVariants(data.data.variants);

        } catch (err) {

            console.error("Error getting cloth:", err);

        } finally {

            setLoadingGetCloth(false);
        }
    };


    // =================================================
    // Create Clothing
    // =================================================

    const createClothing = async (
        payload: ClothingCreatePayload
    ): Promise<ActionResult> => {

        if (!token) {
            return { success: false, message: "Non authentifié" };
        }

        try {

            setMutatingClothing(true);

            const formData = new FormData();

            formData.append("name", payload.name);
            formData.append("description", payload.description);
            formData.append("gender", payload.gender);
            formData.append("price", payload.price.toString());
            formData.append("category", payload.category);

            if (
                payload.discountPrice !== undefined &&
                payload.discountPrice !== null
            ) {
                formData.append(
                    "discountPrice",
                    payload.discountPrice.toString()
                );
            }

            if (payload.active !== undefined) {
                formData.append("active", payload.active.toString());
            }

            if (payload.variants && payload.variants.length > 0) {
                formData.append(
                    "variants",
                    JSON.stringify(payload.variants)
                );
            }

            if (payload.images && payload.images.length > 0) {
                payload.images.forEach((file) => {
                    formData.append("images", file);
                });
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/clothing`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de la création",
                };
            }

            await getClothes();

            return { success: true, message: data.message };

        } catch (err) {

            console.error("Error creating clothing:", err);

            return {
                success: false,
                message: "Erreur lors de la création du vêtement",
            };

        } finally {

            setMutatingClothing(false);
        }
    };


    // =================================================
    // Update Clothing
    // =================================================

    const updateClothing = async (
        id: string,
        payload: ClothingUpdatePayload
    ): Promise<ActionResult> => {

        if (!token) {
            return { success: false, message: "Non authentifié" };
        }

        try {

            setMutatingClothing(true);

            const formData = new FormData();

            if (payload.name !== undefined) {
                formData.append("name", payload.name);
            }

            if (payload.description !== undefined) {
                formData.append("description", payload.description);
            }

            if (payload.gender !== undefined) {
                formData.append("gender", payload.gender);
            }

            if (payload.price !== undefined) {
                formData.append("price", payload.price.toString());
            }

            if (payload.discountPrice !== undefined) {
                formData.append(
                    "discountPrice",
                    payload.discountPrice === null
                        ? ""
                        : payload.discountPrice.toString()
                );
            }

            if (payload.category !== undefined) {
                formData.append("category", payload.category);
            }

            if (payload.active !== undefined) {
                formData.append("active", payload.active.toString());
            }

            if (payload.existingImageIds !== undefined) {
                formData.append(
                    "existingImageIds",
                    JSON.stringify(payload.existingImageIds)
                );
            }

            if (payload.newImages && payload.newImages.length > 0) {
                payload.newImages.forEach((file) => {
                    formData.append("images", file);
                });
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/clothing/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de la mise à jour",
                };
            }

            await getClothes();

            if (clothDetails?._id === id) {
                await getCloth(id);
            }

            return { success: true, message: data.message };

        } catch (err) {

            console.error("Error updating clothing:", err);

            return {
                success: false,
                message: "Erreur lors de la mise à jour du vêtement",
            };

        } finally {

            setMutatingClothing(false);
        }
    };


    // =================================================
    // Delete Clothing
    // =================================================

    const deleteClothing = async (
        id: string
    ): Promise<ActionResult> => {

        if (!token) {
            return { success: false, message: "Non authentifié" };
        }

        try {

            setMutatingClothing(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/clothing/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de la suppression",
                };
            }

            await getClothes();

            return { success: true, message: data.message };

        } catch (err) {

            console.error("Error deleting clothing:", err);

            return {
                success: false,
                message: "Erreur lors de la suppression du vêtement",
            };

        } finally {

            setMutatingClothing(false);
        }
    };


    // =================================================
    // Add Variant
    // =================================================

    const addVariant = async (
        clothingId: string,
        variant: VariantPayload
    ): Promise<ActionResult> => {

        if (!token) {
            return { success: false, message: "Non authentifié" };
        }

        try {

            setMutatingVariant(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/variants/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        clothing: clothingId,
                        ...variant,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de l'ajout",
                };
            }

            if (clothDetails?._id === clothingId) {
                await getCloth(clothingId);
            }

            return { success: true, message: data.message };

        } catch (err) {

            console.error("Error adding variant:", err);

            return {
                success: false,
                message: "Erreur lors de l'ajout de la variante",
            };

        } finally {

            setMutatingVariant(false);
        }
    };


    // =================================================
    // Update Variant
    // =================================================

    const updateVariant = async (
        variantId: string,
        updates: Partial<VariantPayload>
    ): Promise<ActionResult> => {

        if (!token) {
            return { success: false, message: "Non authentifié" };
        }

        try {

            setMutatingVariant(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/variants/${variantId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updates),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de la mise à jour",
                };
            }

            if (clothDetails) {
                await getCloth(clothDetails._id);
            }

            return { success: true, message: data.message };

        } catch (err) {

            console.error("Error updating variant:", err);

            return {
                success: false,
                message: "Erreur lors de la mise à jour de la variante",
            };

        } finally {

            setMutatingVariant(false);
        }
    };


    // =================================================
    // Delete Variant
    // =================================================

    const deleteVariant = async (
        variantId: string
    ): Promise<ActionResult> => {

        if (!token) {
            return { success: false, message: "Non authentifié" };
        }

        try {

            setMutatingVariant(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/variants/${variantId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de la suppression",
                };
            }

            if (clothDetails) {
                await getCloth(clothDetails._id);
            }

            return { success: true, message: data.message };

        } catch (err) {

            console.error("Error deleting variant:", err);

            return {
                success: false,
                message: "Erreur lors de la suppression de la variante",
            };

        } finally {

            setMutatingVariant(false);
        }
    };


    // =================================================
    // Fetch when filters/pagination change
    // =================================================

    useEffect(() => {

        if (!token) return;

        getClothes();

    }, [token, filterClothes, page, limit]);


    // =================================================
    // Provider
    // =================================================

    return (
        <AdminClothingContext.Provider
            value={{

                clothes,
                loadingClothes,
                getClothes,
                filterClothes,
                setFilterClothes,
                page,
                setPage,
                limit,
                setLimit,
                total,
                totalPages,
                clothDetails,
                variants,
                getCloth,
                loadingGetCloth,
                totalClothes,
                activeClothes,
                lowStockCount,
                outOfStockCount,

                createClothing,
                updateClothing,
                deleteClothing,
                mutatingClothing,

                addVariant,
                updateVariant,
                deleteVariant,
                mutatingVariant,

            }}
        >
            {children}
        </AdminClothingContext.Provider>
    );
};


// =====================================================
// Hook
// =====================================================

export const useAdminClothingContext = () => {

    const context = useContext(AdminClothingContext);

    if (!context) {
        throw new Error(
            "Please use the useAdminClothingContext hook inside the AdminClothingProvider"
        );
    }

    return context;
};