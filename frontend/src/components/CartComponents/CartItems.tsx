import { memo } from "react";
import { useCartcontext } from "../../Contexts/CartContext"
import CartItem from "./CartItem";



const CartItems = () => {

    const {cart} = useCartcontext();
    return(
        <div className="bg-white flex flex-col w-[900px] gap-0 border border-gray-300 rounded-[5px]
        shadow-2xl max-[1300px]:w-[600px] max-[600px]:w-[300px]
        "> 
          {cart.map((c, i)=>{
            return(
                <CartItem item={c} key={i}/>
            )
          })}
        </div>
    )
}

export default memo(CartItems);