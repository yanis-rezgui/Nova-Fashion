import { memo } from "react"
import { useClothingContext } from "../../../Contexts/ClothingContext";



const SecondHeroCards = () => {

    const {clothes} = useClothingContext();
    return(
        <div className="flex flex-col justify-between items-center h-[400px] max-[1000px]:flex-row max-[1000px]:h-full max-[1000px]:w-full
        max-[620px]:flex-col max-[620px]:justify-center max-[620px]:gap-5
        ">
              {clothes.slice(0,2).map((c)=>(
                <div className="flex flex-row w-[250px] h-[180px] rounded-[10px] shadow-2xl gap-5
                bg-white p-3 justify-between items-center max-[620px]:w-[320px]
                ">
                    <div className="flex flex-col gap-2">
                        <p className="text-[17px] font-bold">
                            {c.name}
                        </p>
                        <p className="text-[#B89B72] font-bold text-[15px]">
                            {c.category.name}
                        </p>
                       {c.discountPrice && c.discountPrice <  c.price ?
                   <div className="flex flex-col ">
                    <p className="line-through text-[14px] text-red-700">
                        {c.price} DA
                    </p>
                    <p className="text-gray-800 text-[17px]">
                        {c.discountPrice} DA
                    </p>
                   </div>
                   :
                   <p className="text-gray-800 text-[15px] font-[600]">
                    {c.price} DA
                   </p>
                 }
                    </div>
                    <img src={c.images?.[0]?.url || "image url"}
                    className="w-[100px] h-[100px] object-contain"
                    />
                </div>
              ))}
        </div>
    )
}


export default memo(SecondHeroCards);