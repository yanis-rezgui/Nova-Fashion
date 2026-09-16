import { createContext, useContext, useState } from "react";
import { useCartcontext } from "./CartContext";


interface OrderContextType{
    placeOrder : (firstName : string, lastName : string, address : string, wilaya : string, phone : string)=>Promise<void>;
    loadingOrder : boolean;
    msg : string | null;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({children} : {children : React.ReactNode}) => {

    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const {cart, resetCart} = useCartcontext();
    const [msg, setMsg] = useState<string | null>(null);

    const placeOrder = async(firstName : string, lastName : string, address : string, wilaya : string, phone : string) => {

        try{

            setLoadingOrder(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({firstName,lastName,address,wilaya,phone,items : cart})
            })

            const data = await res.json();

            if(!res.ok){
                setMsg(data.error || data.message || "Error in placing order");
                throw new Error(data.error || data.message || "Error in placing order");
            }

            resetCart();
        }catch(err){
            console.error(err);
        }finally{
            setLoadingOrder(false);
        }
    }

    return <OrderContext.Provider value={{
        placeOrder,
        loadingOrder,
        msg
    }}>
        {children}
    </OrderContext.Provider>
}


export const useOrderContext = () => {

    const context = useContext(OrderContext);

    if(!context){
        throw new Error("Please use the useOrderContext hook inside the OrderProvider");
    }

    return context;
}