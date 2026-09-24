import  { memo } from "react"
import ClothCard from "../BoutiqueComponents/ClothCard";
import { useAccueilClothingContext } from "../../Contexts/AccueilClothinContext";


const Promotions = () => {

    const {promotions} = useAccueilClothingContext();

    return(
        promotions.length > 0 &&
        <section className="flex flex-col w-full py-10 px-10 bg-white">
                 

                <div className="flex flex-col gap-3 justify-center
                items-center
                 ">
                    <h1 className="text-[#B89B72] font-semibold text-[2em]">
                        Les pièces du moment
                    </h1>
                    <p className="text-[1.2em] font-bold max-[900px]:text-center">
                        Profitez de nos offres sélectionnées avant qu'elles ne disparaissent.
                    </p>
                 </div>


                 <div className="flex flex-wrap justify-center items-center gap-5 mt-10">
                    {promotions.map((p)=>{
                        return(
                            <ClothCard cloth={p} key={p._id}/>
                        )
                    })}
                 </div>

                
           
        </section>
    )
}

export default memo(Promotions);