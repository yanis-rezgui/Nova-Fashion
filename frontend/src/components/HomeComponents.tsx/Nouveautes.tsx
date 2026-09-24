import { memo } from "react";
import { Link } from "react-router-dom";
import { useAccueilClothingContext } from "../../Contexts/AccueilClothinContext";
import ClothCard from "../BoutiqueComponents/ClothCard";


const Nouveautes = () => {

    const {newClothes} = useAccueilClothingContext();

    return(
        <section className="flex flex-col w-full py-10 px-10 bg-gray-100">
           <div className="flex flex-row w-full justify-between items-center 
             max-[900px]:flex-col
             max-[900px]:justify-center max-[900px]:items-center
             max-[900px]:gap-5
             ">

                 <div className="flex flex-col gap-3 max-[900px]:justify-center
                 max-[900px]:items-center
                 ">
                    <h1 className="text-[#B89B72] font-semibold text-[2em]">
                        Nouveautés
                    </h1>
                    <p className="text-[1.2em] font-bold max-[900px]:text-center">
                        Découvrez les dernières pièces ajoutées à Nova Fashion.
                    </p>
                 </div>

                 <Link to="/boutique" 
                 className="underline cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60">
                     Voir toutes les nouveautés &#8594;
                 </Link>
             </div>

             <div className="mt-10 flex flex-wrap justify-center items-center gap-5 ">
                {newClothes.map((c)=>{
                    return(
                        <ClothCard cloth={c} key={c._id}/>
                    )
                })}
             </div>
        </section>
    )
}

export default memo(Nouveautes);