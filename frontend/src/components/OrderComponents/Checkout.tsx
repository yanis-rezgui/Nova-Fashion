import { memo } from "react"
import { useCartcontext } from "../../Contexts/CartContext";
import { useOrderContext } from "../../Contexts/OrderContext";
import { useSettingsContext } from "../../Contexts/SettingsContext";

const Checkout = () => {

    const {cart, totalPrice} = useCartcontext();
    const {placeOrder, orderDetail, loadingOrder} = useOrderContext();
    const {settings} = useSettingsContext();

    const handlePlaceOrder = async() => {

        if(!orderDetail.firstName || orderDetail.firstName.trim() === ""){
            return
        }

        if(!orderDetail.lastName || orderDetail.lastName.trim() === ""){
            return
        }

        if(!orderDetail.phone || orderDetail.phone.trim() === ""){
            return
        }

        if(!orderDetail.address || orderDetail.address.trim() === ""){
            return
        }

        if(!orderDetail.wilaya || orderDetail.wilaya.trim() === ""){
            return
        }

        if(cart.length === 0) return;

        await placeOrder(orderDetail);
    }

    return(
        <div className="w-[400px] bg-white border border-gray-300 rounded-[5px] p-5
        max-[1000px]:w-[320px]
        ">
           
           <h3 className="font-bold text-[18px] py-2">
            Votre commande
           </h3>
            
           <div className="flex flex-row justify-between items-center py-3 border-t border-t-gray-300
           text-[15px] font-[600]
           ">
            <p >
                Produit
            </p>

            <p>
                Sous-total
            </p>
           </div>

           <div className="flex flex-col gap-3 py-3 border-t border-t-gray-300">
            {cart.map((item)=>{
                return(
                    <div className="flex flex-row w-full justify-between items-center">
                        <div className="flex flex-col ">
                            <p className="text-[15px] w-[170px] font-[500] leading-5">
                                {item.name}
                            </p>
                            <p>
                                Qté: {item.quantity}
                            </p>
                        </div>

                        <p className="text-[17px] font-[600]">
                            {item.price.toFixed(2)} DA
                        </p>
                    </div>
                )
            })}
           </div>

           <div className="py-2 flex flex-row items-center justify-between w-full border-t border-t-gray-300">
            <p className="text-[16px]">
                Sous-total
            </p>
            <p className="text-[1.1em] font-bold">
                {totalPrice().toFixed(2)} DA
            </p>
           </div>

           <div className="py-2 border-t border-t-gray-300 flex flex-col gap-1">
            <h3 className="text-[1.2em] font-bold">Livraison</h3>
            <div className="flex flex-row justify-between items-center">
                <p>
                    Sur Alger
                </p>
                <p className="text-[1.1em] font-[600]">
                    {settings?.shipping.algerPrice} DA
                </p>
            </div>

            <div className="flex flex-row justify-between items-center">
                <p>
                    Hors Alger
                </p>
                <p className="text-[1.1em] font-[600]">
                    {settings?.shipping.outsideAlgerPrice} DA
                </p>
            </div>
           </div>

           <div className="text-center px-5 py-2 text-[15px] bg-[#6F6A62] text-white rounded-full
           leading-5 mt-2
           ">
             Paiement à la livraison, Payez votre commande à la réception.
           </div>

           <button className="bg-[#B89B72] text-white mt-5 w-full py-3 font-bold 
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
           "
           onClick={handlePlaceOrder}
           >
              {loadingOrder ? "Chargement..." : "Lancer la commande"}
           </button>

        </div>
    )
}

export default memo(Checkout);