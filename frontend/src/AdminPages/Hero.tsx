import { memo, useEffect, useState } from "react";
import { Save, Loader2, Plus } from "lucide-react";

import { useHeroContext } from "../Contexts/HeroContext";
import HeroSlideEditor from "../AdminComponents/AdminHeroComponents/HeroSlideEditor";
import HeroFeaturedProductEditor from "../AdminComponents/AdminHeroComponents/HeroFeaturedProductEditor";
import Toast from "../AdminComponents/AdminClothDetailsComponents/Toast";

import type {
    HeroSlideInput,
    HeroFeaturedProductInput,
} from "../Types/Types";

const emptySlide = (): HeroSlideInput => ({
    kicker: "",
    title: "",
    description: "",
    cta: "",
});

const emptyProduct = (): HeroFeaturedProductInput => ({
    name: "",
    category: "",
    price: 0,
});

const AdminHero = () => {

    const {
        hero,
        loadingHero,
        createHero,
        creatingHero,
        updateHero,
        updatingHero,
        
    } = useHeroContext();

    const [slides, setSlides] = useState<HeroSlideInput[]>([
        emptySlide(),
        emptySlide(),
        emptySlide(),
    ]);

    const [featuredProducts, setFeaturedProducts] = useState<
        HeroFeaturedProductInput[]
    >([emptyProduct(), emptyProduct()]);

    const [slideImageFiles, setSlideImageFiles] = useState<(File | null)[]>([
        null,
        null,
        null,
    ]);

    const [featuredImageFiles, setFeaturedImageFiles] = useState<
    (File | null)[]
    >([null, null]);

    const [initialized, setInitialized] = useState(false);

    const [toast, setToast] = useState<
        { message: string; type: "success" | "error" } | null
    >(null);

    // =========================
    // Initialisation à partir du hero existant
    // =========================

useEffect(() => {

    if (initialized || loadingHero) return;   // ✅ attend maintenant vraiment la fin du fetch

    if (hero) {
        setSlides(
            hero.slides.map((s) => ({
                _id: s._id,
                kicker: s.kicker,
                title: s.title,
                description: s.description,
                cta: s.cta,
                image: s.image,        // ✅ image existante conservée
            }))
        );

        setSlideImageFiles(hero.slides.map(() => null));

        setFeaturedProducts(
            hero.featuredProducts.map((p) => ({
                _id: p._id,
                name: p.name,
                category: p.category,
                price: p.price,
                image: p.image,        // ✅ image existante conservée
            }))
        );

        setFeaturedImageFiles(hero.featuredProducts.map(() => null));
    }

    setInitialized(true);

}, [hero, loadingHero, initialized]);

    // =========================
    // Slides
    // =========================

    const handleSlideChange = (
        index: number,
        updates: Partial<HeroSlideInput>
    ) => {
        setSlides((prev) =>
            prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
        );
    };

    const handleSlideImageChange = (index: number, file: File | null) => {
        setSlideImageFiles((prev) =>
            prev.map((f, i) => (i === index ? file : f))
        );
    };

    const handleAddSlide = () => {
        setSlides((prev) => [...prev, emptySlide()]);
        setSlideImageFiles((prev) => [...prev, null]);
    };

    const handleRemoveSlide = (index: number) => {
        if (slides.length <= 3) return;
        setSlides((prev) => prev.filter((_, i) => i !== index));
        setSlideImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // =========================
    // Featured products
    // =========================

    const handleProductChange = (
        index: number,
        updates: Partial<HeroFeaturedProductInput>
    ) => {
        setFeaturedProducts((prev) =>
            prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
        );
    };

    const handleProductImageChange = (index: number, file: File | null) => {
        setFeaturedImageFiles((prev) =>
            prev.map((f, i) => (i === index ? file : f))
        );
    };

    // =========================
    // Soumission
    // =========================

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const hasEmptyField =
            slides.some(
                (s) =>
                    !s.kicker.trim() ||
                    !s.title.trim() ||
                    !s.description.trim() ||
                    !s.cta.trim()
            ) ||
            featuredProducts.some((p) => !p.name.trim() || !p.category.trim());

        if (hasEmptyField) {
            setToast({
                message: "Veuillez remplir tous les champs obligatoires.",
                type: "error",
            });
            return;
        }

        let success = false;

        if (!hero) {

            // ============ CREATE ============

            const missingSlideImage = slideImageFiles.some((f) => !f);
            const missingProductImage = featuredImageFiles.some((f) => !f);

            if (missingSlideImage || missingProductImage) {
                setToast({
                    message: "Chaque slide et chaque produit vedette doit avoir une image.",
                    type: "error",
                });
                return;
            }

            success = await createHero({
                slides: slides.map(({ kicker, title, description, cta }) => ({
                    kicker,
                    title,
                    description,
                    cta,
                })),
                featuredProducts: featuredProducts.map(
                    ({ name, category, price }) => ({ name, category, price })
                ),
                slideImages: slideImageFiles as File[],
                featuredProductImages: featuredImageFiles as File[],
            });

        } else {

            // ============ UPDATE ============

            const missingSlideImage = slides.some(
                (s, i) => !s.image && !slideImageFiles[i]
            );

            const missingProductImage = featuredProducts.some(
                (p, i) => !p.image && !featuredImageFiles[i]
            );

            if (missingSlideImage || missingProductImage) {
                setToast({
                    message: "Chaque slide et chaque produit vedette doit avoir une image.",
                    type: "error",
                });
                return;
            }

            const slideImageIndexes: number[] = [];
            const newSlideImages: File[] = [];

            slideImageFiles.forEach((file, i) => {
                if (file) {
                    slideImageIndexes.push(i);
                    newSlideImages.push(file);
                }
            });

            const featuredProductImageIndexes: number[] = [];
            const newFeaturedImages: File[] = [];

            featuredImageFiles.forEach((file, i) => {
                if (file) {
                    featuredProductImageIndexes.push(i);
                    newFeaturedImages.push(file);
                }
            });

            success = await updateHero({
                slides,
                featuredProducts,
                slideImages: newSlideImages,
                slideImageIndexes,
                featuredProductImages: newFeaturedImages,
                featuredProductImageIndexes,
            });
        }

        if (success) {

            setToast({
                message: hero
                    ? "Hero mis à jour avec succès !"
                    : "Hero créé avec succès !",
                type: "success",
            });

            setSlideImageFiles(slides.map(() => null));
            setFeaturedImageFiles(featuredProducts.map(() => null));

        } else {

            setToast({
                message: "Une erreur est survenue, veuillez réessayer.",
                type: "error",
            });
        }
    };

    const isSaving = creatingHero || updatingHero;

    return (
        <section className="min-h-screen flex flex-col w-full items-center bg-[#F7F4EE]">

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h1 className="text-[2em] mt-10 font-bold text-[#171717]">
                Hero de la page d'accueil
            </h1>

            <p className="text-[1.1em] text-gray-800 mt-2 text-center px-5 max-w-[600px]">
                Gérez le slider et les produits mis en avant sur la page d'accueil
            </p>

            {loadingHero && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={30} className="animate-spin text-[#B89B72]" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            )}

            {!loadingHero && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-[800px] gap-6 mt-8 mb-16 px-5
                    max-[850px]:w-full"
                >

                    <div className="flex flex-row items-center justify-between">
                        <p className="text-[1.3em] font-bold text-[#171717]">
                            Slides ({slides.length})
                        </p>

                        <button
                            type="button"
                            onClick={handleAddSlide}
                            className="flex flex-row items-center gap-2 px-3 py-2 rounded-[5px]
                            border-2 border-[#171717] text-[#171717] text-[13px] font-[600]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Plus size={15} />
                            Ajouter un slide
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {slides.map((slide, i) => (
                            <HeroSlideEditor
                                key={slide._id || `new-slide-${i}`}
                                index={i}
                                slide={slide}
                                imageFile={slideImageFiles[i]}
                                onChange={(updates) => handleSlideChange(i, updates)}
                                onImageChange={(file) => handleSlideImageChange(i, file)}
                                onRemove={() => handleRemoveSlide(i)}
                                canRemove={slides.length > 3}
                            />
                        ))}
                    </div>

                    <p className="text-[1.3em] font-bold text-[#171717] mt-4">
                        Produits vedettes
                    </p>

                    <div className="flex flex-col gap-4">
                        {featuredProducts.map((product, i) => (
                            <HeroFeaturedProductEditor
                                key={product._id || `new-product-${i}`}
                                index={i}
                                product={product}
                                imageFile={featuredImageFiles[i]}
                                onChange={(updates) => handleProductChange(i, updates)}
                                onImageChange={(file) => handleProductImageChange(i, file)}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex flex-row items-center justify-center gap-2 w-fit self-end
                        px-5 py-3 rounded-[5px] bg-[#B89B72] text-white font-[600] text-[14px]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 max-[600px]:w-full max-[600px]:self-stretch"
                    >
                        {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {hero ? "Enregistrer les modifications" : "Créer le Hero"}
                    </button>

                </form>
            )}

        </section>
    );
};

export default memo(AdminHero);