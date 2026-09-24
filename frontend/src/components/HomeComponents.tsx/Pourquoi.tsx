import {
    Truck,
    Shirt,
    Gem,
    Heart,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { memo } from "react";


const Pourquoi = () => {

    const why = [
    {
        icon: Truck,
        title: "Livraison sous 24h",
        description:
            "Recevez vos commandes rapidement grâce à une livraison pensée pour vous faire gagner du temps.",
    },
    {
        icon: Shirt,
        title: "Textiles sélectionnés",
        description:
            "Nous accordons une attention particulière au choix des textiles pour proposer des vêtements agréables à porter au quotidien.",
    },
    {
        icon: Gem,
        title: "Des matériaux soigneusement choisis",
        description:
            "Chaque matière est sélectionnée avec soin pour trouver le bon équilibre entre confort, qualité et durabilité.",
    },
    {
        icon: Heart,
        title: "Créé avec passion",
        description:
            "Derrière chaque pièce, il y a une passion pour le textile, la création et l'envie de proposer une mode qui vous ressemble.",
    },
    {
        icon: ShieldCheck,
        title: "Un savoir-faire développé",
        description:
            "Notre expérience dans différentes catégories de vêtements nous permet de porter une attention particulière aux coupes et aux finitions.",
    },
    {
        icon: Sparkles,
        title: "Pensé pour votre quotidien",
        description:
            "Des pièces modernes, polyvalentes et faciles à porter, imaginées pour accompagner vos journées et votre style.",
    },
];

    return(
        <section className="flex flex-col w-full py-10 px-10 bg-white">
                <div className="flex flex-col gap-3 justify-center
                items-center
                 ">
                    <h1 className="text-[#B89B72] font-semibold text-[2em]">
                        Pourquoi Nova Fashion ?  
                    </h1>
                    <p className="text-[16px] text-center text-gray-700"> 
                        Parce que chaque détail compte. De la sélection des textiles au soin apporté aux finitions, nous imaginons une mode pensée pour allier confort, qualité et style au quotidien.
                    </p>
                 </div>

                <div className="w-full flex flex-wrap justify-center items-center gap-5 mt-10">
                   {why.map((w)=>{

                    const Icon = w.icon;
                    return(
                        <div key={w.title}
                        className="w-[300px] bg-white shadow-2xl p-3 rounded-[10px] 
                        flex flex-col gap-2 h-[200px] border border-gray-400
                        "
                        >
                           <Icon size={40}/>
                           <p className="text-[17px] font-bold">
                            {w.title}
                           </p>
                           <p className="text-[15px] text-gray-700">
                            {w.description}
                           </p>
                        </div>
                    )
                   })}
                </div>
        </section>
    )
}

export default memo(Pourquoi);