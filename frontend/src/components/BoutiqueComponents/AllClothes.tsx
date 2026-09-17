import { memo } from "react";
import { useClothingContext } from "../../Contexts/ClothingContext"
import ClothCard from "./ClothCard";


const AllClothes = () => {

    const {clothes} = useClothingContext();

    return(
        <div className="flex flex-wrap  items-center gap-5 w-[900px] max-[1300px] w-[600px]">
            {clothes.map((c)=>{
                return(
                    <ClothCard cloth={c} key={c._id}/>
                )
            })}
        </div>
    )
}

export default memo(AllClothes);