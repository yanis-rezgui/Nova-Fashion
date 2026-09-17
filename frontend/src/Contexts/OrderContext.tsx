import { createContext, useContext, useEffect, useState } from "react";
import { useCartcontext } from "./CartContext";
import type { PlaceOrder } from "../Types/Types";


interface OrderContextType{
    placeOrder : (order : PlaceOrder)=>Promise<void>;
    loadingOrder : boolean;
    msg : string | null;
    orderDetail : PlaceOrder;
    setOrderDetail : (o : PlaceOrder)=>void;
    showSuccessPop : boolean;
    setShowSuccessPop : (b : boolean)=>void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({children} : {children : React.ReactNode}) => {

    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const {cart, resetCart} = useCartcontext();
    const [msg, setMsg] = useState<string | null>(null);
    const [showSuccessPop, setShowSuccessPop] = useState<boolean>(false);
    const [orderDetail, setOrderDetail] = useState<PlaceOrder>(()=>{
        const saved = localStorage.getItem('orderDetail');

        return saved ? JSON.parse(saved) : {
         
              firstName: "",
              lastName: "",
              address: "",
              phone: "",
              wilaya: "",
           
        }
    });

    useEffect(()=>{
        localStorage.setItem('orderDetail', JSON.stringify(orderDetail));
    }, [orderDetail])

    const placeOrder = async(order : PlaceOrder) => {

        try{

            setLoadingOrder(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({firstName : order.firstName.trim(),
                    lastName : order.lastName.trim(),
                    address : order.address.trim(),
                    wilaya : order.wilaya.trim(),
                    phone : order.phone.trim(),
                    items : cart})
            });

            const data = await res.json();

            if(!res.ok){
                setMsg(data.error || data.message || "Error in placing order");
                throw new Error(data.error || data.message || "Error in placing order");
            }

            resetCart();
            setOrderDetail({
                  firstName: "",
              lastName: "",
              address: "",
              phone: "",
              wilaya: "",
            })
            setShowSuccessPop(true);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingOrder(false);
        }
    }

    return <OrderContext.Provider value={{
        placeOrder,
        loadingOrder,
        msg,
        orderDetail,
        setOrderDetail,
        showSuccessPop,
        setShowSuccessPop
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