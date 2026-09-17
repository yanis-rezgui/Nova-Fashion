import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../Contexts/OrderContext"

import {Package} from "lucide-react"
import { memo } from "react";

const SuccessOrderPop = () => {


    const {setShowSuccessPop} = useOrderContext();
    const navigate = useNavigate();
    return(
            <div onClick={() => {
                setShowSuccessPop(false)
                navigate("/boutique")
                }} className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[800px] h-[350px] bg-white flex flex-col rounded-[10px] overflow-y-auto
                p-5 relative items-center
                "
            >

               <p className="text-center text-[1.4em] font-bold">
                Merci pour votre commande.
               </p>
               <p className="text-center mt-3 text-[17px]">
                Nous avons bien reçu votre demande et nous vous contacterons prochainement pour confirmer les détails de votre commande.
               </p>
 
                <Package size={75} className="mt-5"/>
               <button
               onClick={() => {
                setShowSuccessPop(false)
                navigate("/boutique")
                }}
                className="bg-[#B89B72] text-white mt-5 w-[200px] py-3 font-bold 

           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
           "
               >
                Retour à la boutique
               </button>

               <div
                    className="text-[2em] text-[#0F172A] cursor-pointer absolute 
                top-0 right-2 cursor-pointer transition-opacity duration-200
                hover:opacity-80 active:opacity-60
                "
                    onClick={() => {
                setShowSuccessPop(false)
                navigate("/boutique")
                }}
                >
                    &times;
                </div>
            </div>
            </div>
    )
}


export default memo(SuccessOrderPop);