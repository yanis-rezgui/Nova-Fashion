import { memo } from "react";
import { useAdminClothingContext } from "../../AdminContexts/AdminClothingContext";
import { Search } from "lucide-react";

const SortSelect = () => {

    const {
        filterClothes,
        setFilterClothes
    } = useAdminClothingContext();

    const handleSortChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setFilterClothes({
            ...filterClothes,
            sort: e.target.value
        });
    };

    return (
        <select
            value={filterClothes.sort}
            onChange={handleSortChange}
            className="
                h-[45px]
                px-4
                border-2
                border-[#171717]
                rounded-lg
                bg-white
                text-[#171717]
                text-[14px]
                focus:outline-none
                focus:ring-2
                focus:ring-[#B89B72]
                cursor-pointer
            "
        >
            <option value="">
                Trier par
            </option>

            <option value="new_arrival">
                Nouveautés
            </option>

            <option value="asc_price">
                Prix croissant
            </option>

            <option value="desc_price">
                Prix décroissant
            </option>

             <option value="in">
                En stock
            </option>

            <option value="low">
                Stock faible
            </option>

            <option value="out">
                Rupture de stock
            </option>
        </select>
    );
};

const ToolBarAdmin = () => {

    const {
        totalClothes,
        setFilterClothes,
        filterClothes
    } = useAdminClothingContext();

    const submitForm = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const search = formData.get("search") as string;

        if (!search || search.trim() === "") return;

        setFilterClothes({
            ...filterClothes,
            search: search.trim()
        });
    };

    return (
        <div className="
            pt-5
            border-t border-t-gray-300
            flex flex-row justify-between items-center w-full mt-5 px-70
            max-[800px]:flex-col
            max-[800px]:justify-center
            max-[800px]:items-baseline
            max-[800px]:px-5
            max-[800px]:gap-3
            max-[1200px]:px-20
        ">

            <p className="text-[#171717] font-[600] text-[19px]">
                {totalClothes} Produits
            </p>

            <form
                onSubmit={submitForm}
                className="relative max-[600px]:w-full"
            >
                <input
                    type="text"
                    name="search"
                    placeholder="Nom du produit.."
                    className="
                        w-[400px]
                        text-[14px]
                        border-2
                        border-[#171717]
                        pl-4
                        pr-10
                        h-[45px]
                        rounded-lg
                        resize-none
                        bg-white
                        text-[#222344]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#B89B72]
                        max-[600px]:w-full
                    "
                />

                <Search
                    type="submit"
                    size={18}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-[#171717]
                        cursor-pointer
                        transition-opacity
                        duration-200
                        hover:opacity-80
                        active:opacity-60
                    "
                />
            </form>

            <SortSelect />

        </div>
    );
};

export default memo(ToolBarAdmin);