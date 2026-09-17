import { memo } from "react"
import OrderInfo from "../components/OrderComponents/OrderInfo";
import Checkout from "../components/OrderComponents/Checkout";
import { useOrderContext } from "../Contexts/OrderContext";
import SuccessOrderPop from "../components/OrderComponents/SuccessOrderPop";



const Order = () => {

    const {showSuccessPop} = useOrderContext();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">

            <div className="flex flex-row gap-5 items-start mt-10">
                <OrderInfo/>
                <Checkout/>
            </div>

            {showSuccessPop && <SuccessOrderPop/>}
        </section>
    )
}

export default memo(Order);