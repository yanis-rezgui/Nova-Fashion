import { memo } from "react";
import { useClothingContext } from "../../Contexts/ClothingContext"
import { Search } from "lucide-react";

const SortSelect = () => {

    const {
        filterClothes,
        setFilterClothes
    } = useClothingContext();

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
        </select>
    );
};


const ToolBar = () => {

    const {totalClothes, setFilterClothes, filterClothes} = useClothingContext();

    const submitForm = (e : React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const form = e.currentTarget;

        const formData = new FormData(form);

        const search = formData.get("search") as string;

        if(!search || search.trim() === "") return;
        setFilterClothes({
            ...filterClothes,
            search : search.trim()
        });
    }

    return(

        <div className="flex flex-row justify-between items-center w-full mt-5 px-10 max-[600px]:flex-col
        max-[600px]:justify-center max-[600px]:items-baseline max-[600px]:px-5 max-[600px]:gap-3
        ">

             <p className="text-[#171717] font-[600] text-[19px]">
                {totalClothes} Produits
             </p>

              <form onSubmit={submitForm} className="relative max-[600px]:w-full">
                    <input
                        type="text"
                        name="search"
                        placeholder="Nom du produit.."
                        className="w-[400px] text-[14px] border-2 border-[#171717] pl-4 pr-10
                        h-[45px] rounded-lg resize-none bg-white text-[#222344]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]
                        max-[600px]:w-full"
                    />
                    <Search
                    type="submit"
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#171717] cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    />
                </form>

            <SortSelect/>


        </div>
    )
}

export default memo(ToolBar);