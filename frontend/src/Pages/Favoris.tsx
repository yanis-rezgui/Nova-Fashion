import { memo } from "react"
import { useFavoritesContext } from "../Contexts/FavoritesContext";

import ClothCard from "../components/BoutiqueComponents/ClothCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";



const Favoris = () => {

    const {favorites} = useFavoritesContext();
    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">

           {
            favorites.length === 0
            ?
            <>
            <Heart
                size={60}
                strokeWidth={1.5}
                className="mt-10"
            />
            <h1 className="text-[1.8em] font-bold mt-3">Votre liste est vide</h1>
            <h2 className="text-[17px] font-[600] mt-2 px-5 text-center">
                Vous n'avez encore ajouté aucun article
                à vos favoris. Découvrez notre collection
                et gardez vos coups de cœur à portée de main.
            </h2>

            <Link to="/boutique"
            className="bg-[#B89B72] text-white mt-5 flex justify-center items-center py-3 font-bold 
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
           w-[200px]
           "
            >
                Découvrir la boutique
            </Link>
            </>
            :
             <>
               <h1 className="text-[1.8em] font-bold mt-10">Mes favoris</h1>
               <h2 className="text-[17px] font-[600] mt-2">
                Les articles que vous aimez
               </h2>

               <p className="text-[1.1em] mt-2">
                {favorites.length} Articles
               </p>

               <div className="px-5 flex flex-wrap items-center justify-center mt-10">
                {favorites.map((f)=>{
                    return(
                        <ClothCard cloth={f}/>
                    )
                })}
               </div>
             </>
           }
        </section>
    )
}

export default memo(Favoris);