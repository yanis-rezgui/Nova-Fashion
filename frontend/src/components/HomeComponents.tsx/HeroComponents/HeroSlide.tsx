
import { useState } from "react";



type Slide = {
  id: string;
  kicker: string;
  title: string[];
  description: string;
  image: string;
  alt: string;
};

// 👉 Remplace les images par les tiennes (tons beige / crème / noir / marron)
const SLIDES: Slide[] = [
  {
    id: "elegance",
    kicker: "01 — Élégance",
    title: ["L'élégance", "à la portée", "de tous."],
    description: "Des pièces pensées pour vous accompagner avec style.",
    image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789386195/pullCategory_w9sclq.jpg", // look complet / modèle, ambiance beige
    alt: "Look complet Nova Fashion dans une ambiance beige",
  },
  {
    id: "confection",
    kicker: "02 — Confection",
    title: ["Des vêtements", "finement", "taillés."],
    description: "Des coupes soignées jusque dans les moindres détails.",
    image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789385155/pull4_pxpocu.jpg", // gros plan couture / texture
    alt: "Gros plan sur la couture et la texture d'un vêtement",
  },
  {
    id: "qualite",
    kicker: "03 — Qualité",
    title: ["Une qualité", "sélectionnée", "avec soin."],
    description:
      "Parce que chaque pièce mérite de trouver sa place dans votre garde-robe.",
    image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789385153/pull3_otvqik.jpg", // sélection de vêtements / boutique
    alt: "Sélection de vêtements présentés en boutique",
  },
];


const HeroSlide = () => {

    const [index, setIndex] = useState<number>(0);

    const slide = SLIDES[index];

    return(
        <div className="w-[600px] h-[400px] bg-white shadow-2xl rounded-[10px] p-8 flex flex-col relative">

             <div className="flex flex-row items-center gap-5 justify-center">

                <div className="flex flex-col gap-5">
                    <h1 className="text-[#171717] font-bold text-[2.2em]">
                        {slide.kicker}
                    </h1>

                    <div className="flex flex-wrap gap-2
                    text-[#B89B72] text-[1.7em] leading-6 font-[600]
                    ">
                        {slide.title.map((t)=>{
                            return(
                                <p>
                                    {t}
                                </p>
                            )
                        })}
                    </div>
                    <p className="text-[#171717]  text-[1.1em]">
                        {slide.description}
                    </p>
                </div>

                <img src={slide.image} alt={slide.alt} 
                className="w-[200px] object-contain"
                />

             </div>

             <div className="flex flex-row justify-center items-center gap-2 absolute bottom-3 left-[45%] ">
                {SLIDES.map((_,i)=>{
                    return(
                        < >
                        {i === index ?
                        
                          <div key={i} className="bg-[#171717] w-[30px] h-[10px] rounded-full cursor-pointer 
                          transition-opacity duration-200 hover:opacity-80 active:opacity-100
                          
                          "></div>
                          : 
                          <div key={i} onClick={()=>setIndex(i)}
                          className="bg-gray-300 w-[10px] h-[10px] rounded-full cursor-pointer 
                          transition-opacity duration-200 hover:opacity-80 active:opacity-100"></div>}
                          </>
                    )
                })}
             </div>

        </div>
    )

}


export default HeroSlide;