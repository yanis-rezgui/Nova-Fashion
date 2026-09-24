import HeroSlider from "./HeroComponents/HeroSlide"
import SecondHeroCards from "./HeroComponents/SecondHeroCards";
import {
    Truck,
    Banknote,
    RefreshCcw,
    MessageCircle,
} from "lucide-react";


const Hero = () => {

    const reassuranceItems = [
    {
        icon: Truck,
        title: "Livraison rapide",
        description: "Recevez votre commande rapidement",
    },
    {
        icon: Banknote,
        title: "Paiement à la livraison",
        description: "Payez à la réception de votre colis",
    },
    {
        icon: RefreshCcw,
        title: "Échange possible",
        description: "Échangez votre article selon nos conditions",
    },
    {
        icon: MessageCircle,
        title: "Support client",
        description: "Nous sommes là pour vous accompagner",
    },
];

    return(
        <section className="w-full flex flex-col justify-center items-center bg-gray-100 py-15">
        
                {/* INTRO HERO */}
    <div className="flex flex-col items-center text-center gap-2 mb-8 px-4">
        <p className="text-[#B89B72] text-[15px] font-semibold tracking-[0.25em] uppercase">
            Nova Fashion
        </p>

        <h1 className="text-[#171717] text-[2.2rem] font-bold">
            Votre style, votre signature.
        </h1>

        <p className="text-gray-500 text-[15px] max-w-[550px]">
            Découvrez une sélection de vêtements pensée pour allier
            style, confort et simplicité.
        </p>
    </div>

            <div className="flex flex-row items-center gap-5  max-[1000px]:flex-col
            
            ">
            <HeroSlider/>
            <SecondHeroCards/>
            </div>

            <div className="flex flex-col justify-center items-center w-full mt-25 gap-3">
                   <p className="text-[#B89B72] text-[17px] font-semibold tracking-[0.25em] uppercase">
            NOTRE HISTOIRE
        </p>

        <h1 className="text-[#171717] text-[1.8em] font-bold text-center">
            Une passion née entre étudiants,
             devenue une ambition.
        </h1>

               <img src="https://res.cloudinary.com/dub4fhabm/image/upload/v1790095617/495c328f-8184-43eb-a655-944a189d763c.png"
                alt="" 
                className="w-[600px] mt-5 max-[620px]:w-[300px]"
                />

                <a
                href="#histoire"
                className="bg-[#B89B72] text-white py-2 px-4 rounded-[5px] font-semibold
                cursor-pointer transition-opacity duration-200 hover:opacity-80 
                active:opacity-60 mt-3
                "
                >
                    Lire notre histoire
                </a>
              
            </div>

            <div className="flex flex-wrap w-full justify-between mt-10 px-15 items-center gap-5 max-[1000px]:justify-center">
                {reassuranceItems.map((r)=>{
                    const Icon = r.icon;
                    return(
                        <div className="flex flex-col justify-center items-center gap-1">
                           <Icon size={35}/>
                           <p className="text-[15px] font-bold">
                            {r.title}
                           </p>
                           <p className="text-[13px] text-gray-700">
                            {r.description}
                           </p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Hero;


