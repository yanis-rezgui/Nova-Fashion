import { memo } from "react";
import {
    ShoppingBag,
    Clock3,
    Truck,
    CircleCheck,
    CircleX,
} from "lucide-react";
import { useOrdersAdminContext } from "../../AdminContexts/OrdersAdminContext";


const OrderStats = () => {

    const { stats } = useOrdersAdminContext();

    const statsData = [
        {
            name: "Total commandes",
            value: stats.totalOrders,
            icon: ShoppingBag,
        },
        {
            name: "En préparation",
            value: stats.preparationOrders,
            icon: Clock3,
        },
        {
            name: "Expédiées",
            value: stats.shippedOrders,
            icon: Truck,
        },
        {
            name: "Livrées",
            value: stats.deliveredOrders,
            icon: CircleCheck,
        },
        {
            name: "Annulées",
            value: stats.cancelledOrders,
            icon: CircleX,
        },
    ];

    return (
        <div
            className="
                flex flex-wrap w-full items-center gap-5 justify-center
                mt-5 pb-10
            "
        >
            {statsData.map((s) => {

                const Icon = s.icon;

                return (
                    <div
                        key={s.name}
                        className="
                            bg-white
                            p-3
                            shadow-2xl
                            rounded-[10px]
                            flex flex-row
                            justify-between
                            items-center
                            w-[230px]
                            transition-transform
                            duration-200
                            hover:scale-105
                        "
                    >

                        <div className="flex flex-col gap-1">

                            <p className="text-[1em] font-[600]">
                                {s.name}
                            </p>

                            <p className="text-[1.2em]">
                                {s.value}
                            </p>

                        </div>

                        <Icon size={40} />

                    </div>
                );
            })}
        </div>
    );
};

export default memo(OrderStats);