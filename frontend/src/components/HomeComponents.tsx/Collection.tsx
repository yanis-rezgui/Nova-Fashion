
import  { memo } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useClothingContext } from "../../Contexts/ClothingContext";



const Collection = () => {

    
    const navigate = useNavigate();
    const {setFilterClothes, filterClothes} = useClothingContext();

      const collections = [
        {
            name: "HOMME",
            image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1790154771/6d715c2b-47a3-4b2a-8ea3-49599e7b5a25.png",
            gender: "HOMME",
        },
        {
            name: "FEMME",
            image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1790154862/a0652269-504b-43b0-b741-9a23a91fdda0.png",
            gender: "FEMME",
        },
        {
            name: "UNISEXE",
            image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1790155010/a0dbc734-1a07-411d-ae7e-e3e764859b8d.png",
            gender: "UNISEXE",
        },
    ];

    return(
        <div className="flex flex-col w-full py-10 px-10">

             <div className="flex flex-row w-full justify-between items-center 
             max-[900px]:flex-col
             max-[900px]:justify-center max-[900px]:items-center
             max-[900px]:gap-5
             ">

                 <div className="flex flex-col gap-3 max-[900px]:justify-center
                 max-[900px]:items-center
                 ">
                    <h1 className="text-[#B89B72] font-semibold text-[2em]">
                        DÉCOUVREZ NOS COLLECTIONS
                    </h1>
                    <p className="text-[1.2em] font-bold max-[900px]:text-center">
                        Des pièces pensées pour chaque style.
                    </p>
                 </div>

                 <Link to="/boutique" 
                 className="underline cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60">
                     Voir la boutique &#8594;
                 </Link>
             </div>

             <div className="flex flex-wrap justify-center items-center gap-5 mt-15">
                {collections.map((c)=>{
                    return(
                        <div 
                        style={{ backgroundImage: `url(${c.image || "url"})` }}
                        className="bg-cover bg-center flex items-center justify-center h-[300px] w-[300px] rounded-[10px]
                        
                        ">
                            <div className="w-full h-full bg-black/50 rounded-[10px]
                            relative flex flex-col justify-center items-center gap-5
                            "
                           
                            >
                                <p className="text-white font-semibold text-[1.2em]">
                                    {c.name}
                                </p>

                                <button  
                                className="bg-white text-[15px] font-[500] px-3 py-1 rounded-[5px]
                                cursor-pointer transition-opacity duration-200 hover:opacity-80 
                                active:opacity-60
                                "
                                onClick={()=>{
                                  setFilterClothes({
                                    ...filterClothes,
                                    gender : c.name
                                  })
                                  navigate("/boutique")
                            }}>
                                    Découvrez → 
                                </button>
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
    )
}

export default memo(Collection);