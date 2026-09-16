import { memo } from "react"
import type { Clothing } from "../../Types/Types"
import {ShoppingBag, Eye} from "lucide-react"
import { useFavoritesContext } from "../../Contexts/FavoritesContext"
import { useNavigate } from "react-router-dom"



const ClothCard = ({cloth} : {cloth : Clothing}) => {

    const {isFavorite, toggleFavorite} = useFavoritesContext();

    const navigate = useNavigate();

    return(
        <div className="w-[300px] bg-white border-2 border-gray-900 rounded-[5px] group relative overflow-hidden">

              
             <img src={cloth.images[0].url} alt="cloth_image" 
             className="w-full h-[200px] object-contain rounded-t-[5px]"
             />
             <div className="flex flex-col gap-1 p-2">
                <p className="text-[16px] text-gray-800">
                    {cloth.category.name}
                </p>
                <p className="text-[17px] font-[600]">
                    {cloth.name}
                </p>
                {cloth.discountPrice && cloth.discountPrice <  cloth.price ?
                   <div className="flex flex-col ">
                    <p className="line-through text-[14px] text-red-700">
                        {cloth.price} DA
                    </p>
                    <p className="text-gray-800 text-[17px]">
                        {cloth.discountPrice} DA
                    </p>
                   </div>
                   :
                   <p className="text-gray-800 text-[17px]">
                    {cloth.price} DA
                   </p>
                 }

                 <div  className="
                    absolute
                    inset-0
                    bg-black/0
                    group-hover:bg-black/30
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    opacity-0
                    group-hover:opacity-100
                ">
                    <button className="bg-black/50  top-4 absolute right-4 w-[30px] h-[30px]
                    rounded-full cursor-pointer transition-transform duration-200 hover:scale-105
                    "
                    onClick={()=>toggleFavorite(cloth._id)}
                    >
                        {isFavorite(cloth._id) ? <i className="fa-solid fa-heart text-red-600"></i> : <i className="fa-regular fa-heart text-white"></i>}
                    </button>
                    <div className="flex flex-col justify-center items-center gap-2">
                    <button className="w-[200px] bg-[#F7F4EE] rounded-[5px] text-[#171717]
                    text-[15px] font-[600] flex flex-row items-center justify-center h-[40px]
                    gap-3 cursor-pointer transition-transform duration-200 hover:scale-105
                    ">
                        <ShoppingBag size={20}/>
                        <p>
                            Ajouter au panier</p>
                    </button>

                    <button className="w-[200px] bg-[#B89B72] rounded-[5px] text-[#F7F4EE]
                    text-[15px] font-[600] flex flex-row items-center justify-center h-[40px]
                    gap-3 cursor-pointer transition-transform duration-200 hover:scale-105
                    "
                    onClick={()=>navigate(`/clothDetails/${cloth._id}`)}
                    >
                         <Eye size={20}/>
                         <p>
                            Voir les details
                         </p>
                    </button>
                    </div>
                 </div>
             </div>
        </div>
    )
}


export default memo(ClothCard);