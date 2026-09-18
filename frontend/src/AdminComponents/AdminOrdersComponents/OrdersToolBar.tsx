import { Search } from "lucide-react";
import { memo } from "react"
import { useOrdersAdminContext } from "../../AdminContexts/OrdersAdminContext";



const SortSelect = () => {

    const {
        filterOrders,
        setFilterOrders
    } = useOrdersAdminContext();

    const handleSortChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = e.target.value;

        setFilterOrders({
            ...filterOrders,
            tri: [
                "all",
                "today",
                "yesterday",
                "last_7_days",
                "last_30_days",
                "this_month",
                "last_month",
                "custom",
            ].includes(value)
                ? value as typeof filterOrders.tri
                : filterOrders.tri,

            sort:
                value === "newest" || value === "oldest"
                    ? value
                    : filterOrders.sort,
        });
    };

    return (
        <select
            value={
                filterOrders.tri !== "all"
                    ? filterOrders.tri
                    : filterOrders.sort
            }
            onChange={handleSortChange}
                className="w-[150px] text-[12px] bg-white h-[35px]
                border-1 border-gray-300 rounded-[5px] text-gray-600
                cursor-pointer max-[800px]:w-full"
        >
            <option value="all">
                Toutes les dates
            </option>

            <option value="today">
                Aujourd'hui
            </option>

            <option value="yesterday">
                Hier
            </option>

            <option value="last_7_days">
                7 derniers jours
            </option>

            <option value="last_30_days">
                30 derniers jours
            </option>

            <option value="this_month">
                Ce mois-ci
            </option>

            <option value="last_month">
                Le mois dernier
            </option>

            <option value="custom">
                Période personnalisée
            </option>

            <option value="newest">
                Plus récentes
            </option>

            <option value="oldest">
                Plus anciennes
            </option>
        </select>
    );
};

const OrdersToolBar = () => {

    const {filterOrders, setFilterOrders} = useOrdersAdminContext();

    const submitForm = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const search = formData.get("search") as string;

        if (!search || search.trim() === "") return;

        setFilterOrders({
            ...filterOrders,
            search: search.trim()
        });
    };

    return(
        <div className="flex flex-row justify-between items-center w-full py-10 border-t 
        border-t-gray-300 px-70 max-[1500px]:px-50 max-[1300px]:px-30 max-[1100px]:px-20
        max-[1000px]:px-5
        max-[800px]:flex-col max-[800px]:items-baseline max-[800px]:gap-2
        ">
           
           <p className="font-bold">
            Gestion des Commandes
           </p>

           <div className="flex flex-row gap-2 items-center
           max-[800px]:flex-col max-[800px]:items-baseline
           
           ">
                         <form
                onSubmit={submitForm}
                className="relative "
            >
                <input
                    type="text"
                    name="search"
                    placeholder="Nom du produit.."
                    className="
                        w-[170px]
                        text-[13px]
                        border-1
                        border-gray-300
                        pl-2
                        pr-10
                        h-[35px]
                        rounded-[5px]
                        resize-none
                        bg-white
                        text-[#222344]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#B89B72]
                        max-[800px]:w-full
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

                        <select
                value={filterOrders.status}
                onChange={(e) =>
                    setFilterOrders({
                        ...filterOrders,
                        status: e.target.value
                    })
                }
                className="w-[160px] text-[12px] bg-white h-[35px]
                border-1 border-gray-300 rounded-[5px] text-gray-600
                cursor-pointer max-[800px]:w-full
                "
            >
                <option value="">Toutes les commandes</option>

                <option value="EN_PREPARATION">
                    En préparation
                </option>

                <option value="EXPEDIEE">
                    Expédiées
                </option>

                <option value="LIVREE">
                    Livrées
                </option>

                <option value="ANNULEE">
                    Annulées
                </option>
            </select>

            <SortSelect/>
           </div>
           
        </div>
    )
}

export default memo(OrdersToolBar);