import  { memo } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useCategoriesContext } from "../../Contexts/CategoriesContext";
import { useClothingContext } from "../../Contexts/ClothingContext";



const CategoriesSection = () => {

    const {categories} = useCategoriesContext();
    const navigate = useNavigate();
    const {setFilterClothes, filterClothes} = useClothingContext();

    return(
        <div className="flex flex-col w-full py-10 px-10">

             <div className="flex flex-row w-full justify-between items-center 
             max-[900px]:flex-col
             max-[900px]:justify-center max-[900px]:items-center
             max-[900px]:gap-5
             ">

                 <div className="flex flex-col gap-3 max-[900px]:justify-center
                 max-[900px]:items-center
                 ">
                    <h1 className="text-[#B89B72] font-semibold text-[2em]">
                        Explorez nos catégories
                    </h1>
                    <p className="text-[1.2em] font-bold max-[900px]:text-center">
                        Trouvez facilement les pièces qui correspondent à votre style.
                    </p>
                 </div>

                 <Link to="/boutique" 
                 className="underline cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60">
                     Voir toutes les catégories &#8594;
                 </Link>
             </div>

             <div className="flex flex-wrap justify-center items-center gap-5 mt-15">
                {categories.slice(0,6).map((c)=>{
                    return(
                        <div 
                        style={{ backgroundImage: `url(${c.image.url || "url"})` }}
                        className="bg-cover bg-center flex items-center justify-center h-[200px] w-[200px] rounded-[10px]
                        ">
                            <div className="w-full h-full bg-black/50 rounded-[10px]
                            transition-transform duration-200 hover:scale-105 cursor-pointer
                            relative flex justify-center items-center
                            "
                            onClick={()=>{
                                  setFilterClothes({
                                    ...filterClothes,
                                    category : c._id
                                  })
                                  navigate("/boutique")
                            }}
                            >
                                <p className="text-white font-semibold text-[1.2em]">
                                    {c.name}
                                </p>
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
    )
}

export default memo(CategoriesSection);