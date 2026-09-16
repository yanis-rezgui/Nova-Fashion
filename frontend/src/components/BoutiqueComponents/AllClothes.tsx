import { memo } from "react";
import { useClothingContext } from "../../Contexts/ClothingContext"
import ClothCard from "./ClothCard";


const AllClothes = () => {

    const {clothes} = useClothingContext();

    return(
        <div className="flex flex-wrap justify-center items-center gap-5 w-[1000px]">
            {clothes.map((c)=>{
                return(
                    <ClothCard cloth={c} key={c._id}/>
                )
            })}
        </div>
    )
}

export default memo(AllClothes);