import { memo, useEffect } from "react"
import { useParams } from "react-router-dom";
import { useClothingContext } from "../Contexts/ClothingContext";
import { Link } from "react-router-dom";
import ClothingImages from "../components/ClothingDetailsComponents/ClothingImages";
import Infos from "../components/ClothingDetailsComponents/Infos";

const ClothDetails = () => {

    const {id} = useParams();
    const {getCloth, clothDetails, setFilterClothes, filterClothes} = useClothingContext();

    useEffect(()=>{
        getCloth(id)
    }, [id]);

    return(
        <section className="min-h-screen flex flex-col w-full items-center bg-[#F7F4EE] relative">
           
           <div className="flex flex-row justify-center items-center gap-1 absolute top-2 left-2 text-[15px] text-gray-800">
            <Link to="/boutique"
            className=""
            >Boutique</Link> / <Link to="/boutique" onClick={()=>{
                setFilterClothes({...filterClothes, category : clothDetails?.category._id || ""})
            }}>{clothDetails?.category.name}</Link> / <p>{clothDetails?.name}</p>
           </div>

           <h3 className="text-[#171717] text-[1.3em] font-[600] mt-15">
            {clothDetails?.category.name}
           </h3>
           <h1 className="text-[#171717] text-[2em] font-bold mt-2 text-center leading-10">
            {clothDetails?.name}
           </h1>

           <ClothingImages/>
           <Infos/>
        </section>
    )
}


export default memo(ClothDetails);