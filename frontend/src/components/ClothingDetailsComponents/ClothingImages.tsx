import { memo, useState } from "react"
import { useClothingContext } from "../../Contexts/ClothingContext";
import Galerie from "./Galerie";

const ClothingImages = () => {

    const [index, setIndex] = useState<number>(0);
    const {clothDetails} = useClothingContext();
    const [showAllPop, setShowAllPop] = useState<boolean>(false);
    return(
        <>
        <div className="flex flex-row gap-5 items-center  justify-center
         max-[1300px]:w-[700px] w-[900px] bg-white rounded-[5px] h-[500px] max-[1100px]:flex-col max-[1100px]:w-[500px]
         max-[600px]:w-[400px] max-[450px]:w-[300px] shadow shadow-2xl mt-10">
             
             <div className="overflow-y-auto h-[500px] space-y-1 p-2  flex flex-col gap-3 items-center w-[200px] white order-1 max-[1100px]:order-2 max-[1100px]:overflow-x-auto max-[1100px]:space-x-1 max-[1100px]:flex-row max-[1100px]:h-[200px] max-[1100px]:w-full max-[1100px]:px-4 ">
               {clothDetails?.images.map((img, i)=>{
                  return(
                    <img 
                    key={i}
                    src={img.url} alt="cloth_image" 
                    className={`w-[150px] p-2 h-[100px] object-contain cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60  ${i === index ? "bg-gray-300" : ""} `}
                    onClick={()=>setIndex(i)}
                    />
                  )
               })}
             </div>

             <div className="w-full flex justify-center items-center relative h-full order-2 max-[1100px]:order-1 max-[1100px]:h-[300px] ">
                <img src={clothDetails?.images[index].url} alt="" 
                className="max-[1100px]:h-full max-[1100px]:w-full max-[1100px]:object-contain p-2 flex justify-center items-center h-full w-full object-contain"
                />

                                        <div className="absolute top-2 left-2 bg-black/60 text-white px-4 py-[4px] flex items-center justify-center text-[15px] font-bold rounded-full">{index + 1}/{clothDetails?.images.length}</div>

                        <div className="absolute bg-black/60 text-white bottom-2 px-4 text-[15px] font-[600] cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 py-2 rounded-full right-2"
                         onClick={()=>setShowAllPop(true)}
                        >
                            <i className="fa-solid fa-images"></i> Tout voir
                        </div>
             </div>
        </div>

        {showAllPop && <Galerie setShowPop={setShowAllPop} images={clothDetails?.images || []}/>}

        </>
    )
}


export default memo(ClothingImages);