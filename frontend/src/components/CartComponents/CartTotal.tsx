import { useCartcontext } from "../../Contexts/CartContext"


const CartTotal = () => {

    const {totalCartItems, totalPrice} = useCartcontext();

    return(
        <div className="bg-white border border-gray-300 p-5 flex
        flex-col p-5 w-[400px] rounded-[5px] shadow-2xl
        max-[420px]:w-[300px]
        ">
           <div className="flex flex-col gap-1 w-full pb-3">
           <div className="flex flex-row justify-between items-center">
               <p className="font-[600] text-gray-800">Nombre de produits:</p>
               <p>{totalCartItems()}</p>
           </div>

           <div className="flex flex-row justify-between items-center">
            <p className="font-[600] text-gray-800">Livraison (Alger):</p>
            <p>
                400 DA
            </p>
           </div>

           <div className="flex flex-row justify-between items-center">
            <p className="font-[600] text-gray-800">Livraison (Hors Alger):</p>
            <p>
                900 DA
            </p>
           </div>
           </div>

           <div className="flex flex-row justify-between items-center border-t border-t-gray-300 pt-3">
            <p className="text-[20px] font-bold">
                Total
            </p>
            <p className="text-[17px] font-[600]">
                {totalPrice()} DA
            </p>
           </div>

           <button className="bg-[#B89B72] py-2 text-white font-bold border-0 mt-3
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
           ">
            Valider ma commande
           </button>

        </div>
    )
}


export default CartTotal;   