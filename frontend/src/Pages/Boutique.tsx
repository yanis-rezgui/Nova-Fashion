import { memo } from "react"
import BoutiqueHero from "../components/BoutiqueComponents/BoutiqueHero";
import ToolBar from "../components/BoutiqueComponents/ToolBar";
import FilterComponent from "../components/BoutiqueComponents/FilterComponent";
import AllClothes from "../components/BoutiqueComponents/AllClothes";



const Boutique = () => {

    return(
        <section className="min-h-screen flex flex-col w-full items-center bg-[#F7F4EE]">
            <BoutiqueHero/>
            <ToolBar/>
            <div className="flex flex-row items-start mt-10 
            gap-10 mb-10 justify-center w-full px-10 max-[1100px]:flex-col 
            max-[1100px]:items-center
            ">
                <FilterComponent/>
                <AllClothes/>
            </div>
        </section>
    ) 
}

export default memo(Boutique);