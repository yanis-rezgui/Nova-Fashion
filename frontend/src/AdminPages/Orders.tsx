import { memo } from "react"
import OrdersStats from "../AdminComponents/AdminOrdersComponents/OrdersStats";
import OrdersToolBar from "../AdminComponents/AdminOrdersComponents/OrdersToolBar";
import AllOrders from "../AdminComponents/AdminOrdersComponents/AllOrders";


const Orders = () => {


    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">

             <h1 className="text-[1.4em] font-bold mt-10">
                Commandes
             </h1>

             <h3 className="text-[16px] text-gray-800">
                Gérez et suivez les commandes de vos clients
             </h3>

             <OrdersStats/>

             <OrdersToolBar/>
             <AllOrders/>
        </section>
    )
}

export default memo(Orders);