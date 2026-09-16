import { memo } from "react";
import { useCartcontext } from "../../Contexts/CartContext";


const ResetCartPop = ({setShowDeletePop} : {setShowDeletePop : (b : boolean)=>void}) => {

    const {resetCart} = useCartcontext();
    return (
        <div onClick={() => setShowDeletePop(false)} className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[800px] h-[250px] bg-white flex flex-col rounded-[10px] overflow-y-auto
                p-5 relative
                "
            >
                <p className="text-center text-[18px] mt-5 text-[#0F172A]">
                    Etes vous sûr de vouloir reinitialiser votre panier ?
                </p>

                <div className="flex flex-row justify-center items-center gap-2 mt-5">
                    <button
                        onClick={resetCart}
                        className="bg-[#0F172A] text-white text-[15px] font-[500]
                py-2 mt-3 rounded-[5px] cursor-pointer transition-opacity duration-200 hover:opacity-80
                active:opacity-60  justify-center px-3 flex flex-row items-center
                gap-1
                "
                    >
                        Oui, reinitialiser
                    </button>

                    <button
                        onClick={() => setShowDeletePop(false)}
                        className=" bg-red-600 text-white text-[15px] font-[500]
                py-2 mt-3 rounded-[5px] cursor-pointer transition-opacity duration-200 hover:opacity-80
                active:opacity-60 justify-center px-3 flex flex-row items-center
                gap-1 
                "
                    >
                        Annuler
                    </button>
                </div>

                <div
                    className="text-[2em] text-[#0F172A] cursor-pointer absolute 
                top-0 right-2 cursor-pointer transition-opacity duration-200
                hover:opacity-80 active:opacity-60
                "
                    onClick={() => setShowDeletePop(false)}
                >
                    &times;
                </div>
            </div>
        </div>
    );
}

export default memo(ResetCartPop);