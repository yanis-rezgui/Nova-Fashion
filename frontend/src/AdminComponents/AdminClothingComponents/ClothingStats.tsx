import  { memo } from "react"
import {
    Shirt,
    CircleCheck,
    TriangleAlert,
    PackageX,
} from "lucide-react";
import { useAdminClothingContext } from "../../AdminContexts/AdminClothingContext"



const ClothingStats = () => {


    const {totalClothes,activeClothes,lowStockCount,outOfStockCount} = useAdminClothingContext();
        const stats = [
        {
            name: "Total produits",
            value: totalClothes,
            icon: Shirt,
        },
        {
            name: "Produits actifs",
            value: activeClothes,
            icon: CircleCheck,
        },
        {
            name: "Stock faible",
            value: lowStockCount,
            icon: TriangleAlert,
        },
        {
            name: "Rupture de stock",
            value: outOfStockCount,
            icon: PackageX,
        },
    ];
    return(
        <div className="flex flex-wrap w-full items-center gap-5 justify-center items-center
        mt-5
        ">
         {stats.map((s)=>{
            
            const Icon = s.icon;

            return(
                <div key={s.name} 
                className="bg-white p-3 shadow-2xl rounded-[10px] flex flex-row justify-between 
                items-center w-[230px] transition-transform duration-200 hover:scale-105"
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-[1em] font-[600]">
                            {s.name}
                        </p>
                        <p className="text-[1.2em]">
                            {s.value}
                        </p>
                    </div>

                    <Icon size={40}/>
                </div>
            )
         })}
        </div>
    )
}

export default memo(ClothingStats);