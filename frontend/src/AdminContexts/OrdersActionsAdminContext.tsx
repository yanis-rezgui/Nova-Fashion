import { createContext, useContext, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import type { OrderStatus } from "../Types/Types";

interface OrdersActionsAdminContextType {
    updateOrderStatus: (
        orderId: string,
        status: OrderStatus
    ) => Promise<void>;

    deleteOrder: (
        orderId: string
    ) => Promise<void>;

    loadingAction: boolean;
    errorAction: string | null;
    successAction: string | null;
    clearActionMessages: () => void;
}

const OrdersActionsAdminContext =
    createContext<OrdersActionsAdminContextType | null>(null);

export const OrdersActionsAdminProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const { token } = useAuthContext();

    const [loadingAction, setLoadingAction] = useState(false);
    const [errorAction, setErrorAction] = useState<string | null>(null);
    const [successAction, setSuccessAction] = useState<string | null>(null);


    const clearActionMessages = () => {
        setErrorAction(null);
        setSuccessAction(null);
    };


    const updateOrderStatus = async (
        orderId: string,
        status: OrderStatus
    ) => {

        if (!token) return;

        try {

            setLoadingAction(true);
            setErrorAction(null);
            setSuccessAction(null);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Error updating order status"
                );
            }

            setSuccessAction(
                data.message || "Order status updated successfully"
            );

        } catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "Error updating order status";

            setErrorAction(message);

            throw err;

        } finally {

            setLoadingAction(false);

        }
    };


    const deleteOrder = async (orderId: string) => {

        if (!token) return;

        try {

            setLoadingAction(true);
            setErrorAction(null);
            setSuccessAction(null);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Error deleting order"
                );
            }

            setSuccessAction(
                data.message || "Order deleted successfully"
            );

        } catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "Error deleting order";

            setErrorAction(message);

            throw err;

        } finally {

            setLoadingAction(false);

        }
    };


    return (
        <OrdersActionsAdminContext.Provider
            value={{
                updateOrderStatus,
                deleteOrder,
                loadingAction,
                errorAction,
                successAction,
                clearActionMessages,
            }}
        >
            {children}
        </OrdersActionsAdminContext.Provider>
    );
};


export const useOrdersActionsAdminContext = () => {

    const context = useContext(OrdersActionsAdminContext);

    if (!context) {
        throw new Error(
            "Please use the useOrdersActionsAdminContext hook inside the OrdersActionsAdminProvider"
        );
    }

    return context;
};