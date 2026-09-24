import { memo } from "react"
import { useCategoriesContext } from "../Contexts/CategoriesContext";
import CategorieCard from "../AdminComponents/CategoriesComponents/CategorieCard";
import { useAdminCategoriesContext } from "../AdminContexts/AdminCategoriesContext";
import AddCategoryPop from "../AdminComponents/CategoriesComponents/AddCategoryPop";
import UpdateCategoryPop from "../AdminComponents/CategoriesComponents/UpdateCategoryPop";
import DeleteCategoryPop from "../AdminComponents/CategoriesComponents/DeleteCategoryPop";


const Categories = () => {

    const {categories} = useCategoriesContext();
    const {showCreateCategoryPop, setShowCreateCategoryPop,
          showUpdateCategoryPop, categoryDetails,
           showDeleteCategoryPop
    } = useAdminCategoriesContext();

    return(
        <>
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">
             <h1 className="text-[2em] mt-10 font-bold"> 
                Categories
             </h1>

             <p className="text-[1.1em] text-gray-800 mt-2">
                Gérez les catégories de votre catalogue
             </p>

             <button className="bg-[#B89B72] py-2 text-white font-bold border-0 mt-5
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 px-4"
           onClick={()=>setShowCreateCategoryPop(true)}
           >
                + Ajouter une catégorie
             </button>

            <div className="flex flex-wrap items-center justify-center gap-5 mt-10 mb-10 px-10">
             {categories.map((c)=>{
                return(
                    <CategorieCard categorie={c} key={c._id}/>
                )
             })}
             </div>
        </section>

           {showCreateCategoryPop && <AddCategoryPop/>}
           {showUpdateCategoryPop && <UpdateCategoryPop category={categoryDetails!}/>}
            {showDeleteCategoryPop && <DeleteCategoryPop category={categoryDetails!}/>}

        </>
    )
}


export default memo(Categories);