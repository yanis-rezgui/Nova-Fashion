import { memo } from "react"
import {
    PackageCheck,
    RotateCcw,
    CreditCard
} from "lucide-react";

const AideCommande = () => {



    const data = [
        {
            title: "Expédition & traitement",
            description:
                "Nous préparons chaque commande avec soin afin de vous garantir une expédition rapide et fiable. Vos articles sont soigneusement emballés pour arriver dans les meilleures conditions.",
            icon: PackageCheck
        },
        {
            title: "Retours simplifiés",
            description:
                "Un article ne correspond pas à vos attentes ? Vous pouvez effectuer un retour simplement, conformément à nos conditions de retour. Votre satisfaction reste notre priorité.",
            icon: RotateCcw
        },
        {
            title: "Modes de paiement",
            description:
                "Chez Nova, vous pouvez régler votre commande à la livraison. Vous payez uniquement lorsque votre colis vous est remis, pour une expérience d'achat simple et en toute confiance.",
            icon: CreditCard
        }
    ];

    return(
        <div className="bg-white border border-gray-300 p-5 flex
        flex-col gap-5 w-[400px] rounded-[5px] shadow-2xl max-[420px]:w-[300px]
        ">
            {data.map((d)=>{
               const Icon = d.icon;

               return(
                <div key={d.title} className="flex flex-row gap-2 w-full items-start">
                    <Icon size={40}/>
                    <div className="flex flex-col gap-1 w-[300px] max-[420px]:w-[200px]">
                        <p className="text-[16px] font-bold">
                            {d.title}
                        </p>
                        <p className="text-[14px] text-gray-700 leading-5">
                            {d.description}
                        </p>
                    </div>
                </div>
               )
            })}
        </div>
    )
}

export default memo(AideCommande);