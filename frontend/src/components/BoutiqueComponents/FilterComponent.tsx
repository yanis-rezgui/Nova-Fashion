
import { memo } from "react";
import { useClothingContext } from "../../Contexts/ClothingContext";
import { useCategoriesContext } from "../../Contexts/CategoriesContext";

const MIN_PRICE = 0;
const MAX_PRICE = 50000;
const PRICE_STEP = 500;

const FilterComponent = () => {

    const {
        filterClothes,
        setFilterClothes
    } = useClothingContext();

    const { categories } = useCategoriesContext();

    const handleGenderChange = (gender: string) => {
        setFilterClothes({
            ...filterClothes,
            gender: gender.trim()
        });
    };

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFilterClothes({
            ...filterClothes,
            category: e.target.value
        });
    };

    const handleDiscountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFilterClothes({
            ...filterClothes,
            discount: e.target.checked ? "true" : ""
        });
    };

    const handleMinPriceChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const value = Number(e.target.value);

        setFilterClothes({
            ...filterClothes,
            minPrice: value
        });
    };

    const handleMaxPriceChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const value = Number(e.target.value);

        setFilterClothes({
            ...filterClothes,
            maxPrice: value
        });
    };

    const resetFilters = () => {
        setFilterClothes({
            gender: "",
            category: "",
            minPrice: 0,
            maxPrice: 0,
            search: filterClothes.search,
            discount: "",
            sort: filterClothes.sort
        });
    };

    return (
        <div
            className="
                bg-white
                w-[400px]
                flex flex-col
                border-2 border-[#171717]
                rounded-[10px]
                shadow-2xl
                max-[1200px]:w-[300px]
            "
        >

            {/* Header */}

            <div className="flex flex-row justify-between items-center p-3">

                <p className="text-[1.3em] font-bold">
                    <i className="fa-solid fa-filter"></i>{" "}
                    Filtres
                </p>

                <button
                    className="
                        flex flex-row
                        justify-center
                        items-center
                        gap-2
                        bg-[#B89B72]
                        text-white
                        px-2
                        py-1
                        text-[15px]
                        rounded-[5px]
                        border-none
                        cursor-pointer
                        transition-opacity
                        duration-200
                        hover:opacity-80
                        active:opacity-60
                    "
                    onClick={resetFilters}
                >
                    Réinitialiser
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                </button>

            </div>


            <div
                className="
                    border-t
                    border-t-gray-300
                    p-3
                    flex
                    flex-col
                    gap-4
                "
            >

                {/* =========================
                    Genre
                ========================= */}

                <div className="flex flex-col gap-1">

                    <h3 className="text-[18px] font-[600]">
                        Genre
                    </h3>

                    <div className="flex flex-col gap-1">

                        <label className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                checked={filterClothes.gender === ""}
                                onChange={() => handleGenderChange("")}
                                className="cursor-pointer"
                            />

                            <span>
                                Tous
                            </span>
                        </label>

                        <label className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                checked={filterClothes.gender === "FEMME"}
                                onChange={() => handleGenderChange("FEMME")}
                                className="cursor-pointer"
                            />

                            <span>
                                Femme
                            </span>
                        </label>

                        <label className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                checked={filterClothes.gender === "HOMME"}
                                onChange={() => handleGenderChange("HOMME")}
                                className="cursor-pointer"
                            />

                            <span>
                                Homme
                            </span>
                        </label>

                        <label className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                checked={filterClothes.gender === "UNISEXE"}
                                onChange={() => handleGenderChange("UNISEXE")}
                                className="cursor-pointer"
                            />

                            <span>
                                Unisexe
                            </span>
                        </label>

                    </div>

                </div>


                {/* =========================
                    Catégorie
                ========================= */}

                <div className="flex flex-col gap-1">

                    <h3 className="text-[18px] font-[600]">
                        Catégorie
                    </h3>

                    <select
                        value={filterClothes.category}
                        onChange={handleCategoryChange}
                        className="
                            p-2
                            bg-gray-100
                            border
                            border-gray-300
                            rounded-[5px]
                            cursor-pointer
                        "
                    >

                        <option value="">
                            Toutes les catégories
                        </option>

                        {categories.map((c) => {
                            return (
                                <option
                                    value={c._id}
                                    key={c._id}
                                >
                                    {c.name}
                                </option>
                            );
                        })}

                    </select>

                </div>


                {/* =========================
                    Prix
                ========================= */}

                <div className="flex flex-col gap-3">

                    <h3 className="text-[18px] font-[600]">
                        Prix
                    </h3>


                    {/* Valeurs */}

                    <div className="flex flex-row justify-between items-center">

                        <div className="flex flex-col">

                            <span className="text-xs text-gray-500">
                                Minimum
                            </span>

                            <span className="font-semibold">
                                {filterClothes.minPrice.toLocaleString("fr-FR")} DA
                            </span>

                        </div>


                        <span className="text-gray-400">
                            —
                        </span>


                        <div className="flex flex-col text-right">

                            <span className="text-xs text-gray-500">
                                Maximum
                            </span>

                            <span className="font-semibold">
                                {filterClothes.maxPrice === 0
                                    ? `${MAX_PRICE.toLocaleString("fr-FR")} DA`
                                    : `${filterClothes.maxPrice.toLocaleString("fr-FR")} DA`
                                }
                            </span>

                        </div>

                    </div>


                    {/* Minimum */}

                    <div className="flex flex-col gap-1">

                        <div className="flex justify-between text-sm">

                            <span>
                                Prix minimum
                            </span>

                            <span className="font-medium">
                                {filterClothes.minPrice.toLocaleString("fr-FR")} DA
                            </span>

                        </div>

                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={PRICE_STEP}
                            value={filterClothes.minPrice}
                            onChange={handleMinPriceChange}
                            className="w-full cursor-pointer accent-[#B89B72]"
                        />

                    </div>


                    {/* Maximum */}

                    <div className="flex flex-col gap-1">

                        <div className="flex justify-between text-sm">

                            <span>
                                Prix maximum
                            </span>

                            <span className="font-medium">
                                {filterClothes.maxPrice === 0
                                    ? `${MAX_PRICE.toLocaleString("fr-FR")} DA`
                                    : `${filterClothes.maxPrice.toLocaleString("fr-FR")} DA`
                                }
                            </span>

                        </div>

                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={PRICE_STEP}
                            value={
                                filterClothes.maxPrice === 0
                                    ? MAX_PRICE
                                    : filterClothes.maxPrice
                            }
                            onChange={handleMaxPriceChange}
                            className="w-full cursor-pointer accent-[#B89B72]"
                        />

                    </div>

                </div>


                {/* =========================
                    Promotion
                ========================= */}

                <div className="flex flex-col gap-1">

                    <h3 className="text-[18px] font-[600]">
                        Promotion
                    </h3>

                    <label className="flex flex-row items-center gap-2">

                        <input
                            type="checkbox"
                            checked={filterClothes.discount === "true"}
                            onChange={handleDiscountChange}
                            className="cursor-pointer"
                        />

                        <span>
                            En promotion
                        </span>

                    </label>

                </div>

            </div>

        </div>
    );
};

export default memo(FilterComponent);

