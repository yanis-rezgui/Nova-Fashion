import { memo } from "react";
import { useClothingContext } from "../../Contexts/ClothingContext"
import ClothCard from "./ClothCard";
import { PackageOpen } from "lucide-react";


const AllClothes = () => {

    const {clothes} = useClothingContext();

    return(     
        
        <div className="flex flex-wrap justify-center  items-center gap-5 w-[900px] max-[1300px]:w-[600px]">
            {clothes.length === 0 
            
            ? 
              <div className="flex flex-col gap-3 justify-center items-center">
                <PackageOpen size={60}/>
               <p className="text-[1.1em] font-bolf text-center font-bold">
                Aucun article disponible
               </p>
            </div> : clothes.map((c)=>{
                return(
                    <ClothCard cloth={c} key={c._id}/>
                )
            })}
        </div>
        
    )
}

export default memo(AllClothes);