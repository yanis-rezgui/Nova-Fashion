import  { memo } from "react";
import ClothingStats from "../AdminComponents/AdminClothingComponents/ClothingStats";
import ToolBarAdmin from "../AdminComponents/AdminClothingComponents/ToolBarAdmin";
import AllAdminClothes from "../AdminComponents/AdminClothingComponents/AllAdminClothes";
import { useNavigate } from "react-router-dom";

const Clothes = () => {

    const navigate = useNavigate();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">
             <div className="flex flex-row justify-between items-center w-full px-80 mt-10 pb-5 
             border-b border-b-gray-300 max-[1300px]:px-40 max-[1100px]:px-20 max-[1000px]:px-5
             ">
                <h1 className="text-[1.8em] font-bold max-[1000px]:text-[1.4em]">
                Vos Vêtements   
                </h1>

                <button 
                onClick={()=>navigate("/admin/addCloth")}
                className="bg-[#B89B72] py-2 px-2 text-white font-bold border-0 mt-3
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
           rounded-[5px]
           ">
                    + Ajouter un vêtements   
                </button>
             </div>


             <p className="text-center text-[1.2em] px-5 mt-5">
                Gérez vos produits, vos variantes et vos stocks 
             </p>

             <ClothingStats/>
             <ToolBarAdmin/>

             <AllAdminClothes/>
        </section>
    );
}


export default memo(Clothes);