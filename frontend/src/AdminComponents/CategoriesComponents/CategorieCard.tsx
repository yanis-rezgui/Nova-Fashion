import { memo } from "react"
import type { Category } from "../../Types/Types";
import { useAdminCategoriesContext } from "../../AdminContexts/AdminCategoriesContext";





const CategorieCard = ({categorie} : {categorie : Category}) => {

    const {setCategoryDetails, setShowUpdateCategoryPop, setShowDeleteCategoryPop} = useAdminCategoriesContext();
    return(
        <div className="w-[300px] border border-gray-300 rounded-[10px] bg-white">
            <img src={categorie.image.url} alt="" 
            className="rounded-t-[10px] w-full h-[200px] object-contain"
            />
            <div className="flex flex-col gap-2 mt-2 p-2">
                <p className="text-[1.1em] font-bold text-gray-900">
                    {categorie.name}
                </p>

                <div className="mt-2 flex flex-row justify-center items-center gap-2">
                    <button 
                    onClick={()=>{
                        setCategoryDetails(categorie);
                        setShowUpdateCategoryPop(true);
                    }}
                     className="w-[120px] text-[14px] font-[600] bg-[#B89B72]
                     py-2 text-white cursor-pointer transition-opacity duration-200
                     hover:opacity-80 active:opacity-60
                     "
                    >
                        <i className="fa-solid fa-eye"></i> Détails
                    </button>

                    <button 
                    className="w-[120px] text-[14px] font-[600] bg-red-700
                     py-2 text-white cursor-pointer transition-opacity duration-200
                     hover:opacity-80 active:opacity-60
                     "
                    onClick={()=>{
                        setCategoryDetails(categorie);
                        setShowDeleteCategoryPop(true);
                    }}>
                        <i className="fa-solid fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}

export default memo(CategorieCard);