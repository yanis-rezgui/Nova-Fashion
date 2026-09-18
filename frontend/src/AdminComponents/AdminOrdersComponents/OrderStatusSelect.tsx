import { memo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useOrdersActionsAdminContext } from "../../AdminContexts/OrdersActionsAdminContext";
import { useOrdersAdminContext } from "../../AdminContexts/OrdersAdminContext";
import type { OrderStatus } from "../../Types/Types";

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
    EN_PREPARATION: {
        label: "En préparation",
        classes: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    EXPEDIEE: {
        label: "Expédiée",
        classes: "bg-blue-100 text-blue-700 border-blue-300",
    },
    LIVREE: {
        label: "Livrée",
        classes: "bg-green-100 text-green-700 border-green-300",
    },
    ANNULEE: {
        label: "Annulée",
        classes: "bg-red-100 text-red-700 border-red-300",
    },
};

interface OrderStatusSelectProps {
    orderId: string;
    status: OrderStatus;
    onError: (message: string) => void;
}

const OrderStatusSelect = ({ orderId, status, onError }: OrderStatusSelectProps) => {

    const { updateOrderStatus } = useOrdersActionsAdminContext();
    const { getOrders } = useOrdersAdminContext();

    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const newStatus = e.target.value as OrderStatus;

        if (newStatus === status) return;

        try {
            setIsUpdating(true);
            await updateOrderStatus(orderId, newStatus);
            await getOrders();
        } catch (err) {
            onError(
                err instanceof Error
                    ? err.message
                    : "Erreur lors de la mise à jour du statut"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const config = statusConfig[status];

    return (
        <div className="relative w-fit">
            <select
                value={status}
                onChange={handleChange}
                disabled={isUpdating}
                className={`text-[12px] font-[600] pl-2 pr-6 py-1.5 rounded-full border-2
                cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#B89B72]
                disabled:opacity-60 ${config.classes}`}
            >
                <option value="EN_PREPARATION">En préparation</option>
                <option value="EXPEDIEE">Expédiée</option>
                <option value="LIVREE">Livrée</option>
                <option value="ANNULEE">Annulée</option>
            </select>

            {isUpdating && (
                <Loader2
                    size={12}
                    className="animate-spin absolute right-1.5 top-1/2 -translate-y-1/2"
                />
            )}
        </div>
    );
};

export default memo(OrderStatusSelect);