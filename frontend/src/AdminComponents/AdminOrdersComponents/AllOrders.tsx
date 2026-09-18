import { memo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    PackageOpen,
} from "lucide-react";

import { useOrdersAdminContext } from "../../AdminContexts/OrdersAdminContext";
import { useOrdersActionsAdminContext } from "../../AdminContexts/OrdersActionsAdminContext";
import type { Order } from "../../Types/Types";

import OrderStatusSelect from "./OrderStatusSelect";
import OrderDetailsPop from "./OrderDetailsPop";
import DeleteOrderPop from "./DeleteOrderPop";
import Toast from "../AdminClothDetailsComponents/Toast";

// =====================================================
// Props partagées desktop / mobile
// =====================================================

interface RowProps {
    order: Order;
    onViewDetails: () => void;
    onDeleteClick: () => void;
    onStatusError: (message: string) => void;
}

// =====================================================
// Ligne commande (desktop)
// =====================================================

const OrderRow = memo(
    ({ order, onViewDetails, onDeleteClick, onStatusError }: RowProps) => {

        const totalItems = order.items.reduce(
            (sum, i) => sum + i.quantity,
            0
        );

        return (
            <tr className="border-b border-b-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <td className="p-3">
                    <p className="font-[600] text-[#171717] text-[14px]">
                        {order.firstName} {order.lastName}
                    </p>
                    <p className="text-[12px] text-gray-500">{order.phone}</p>
                </td>

                <td className="p-3 text-[14px] text-[#222344]">
                    {order.wilaya}
                </td>

                <td className="p-3 text-[14px] text-[#222344]">
                    {totalItems} article{totalItems > 1 ? "s" : ""}
                </td>

                <td className="p-3 text-[14px] font-[600] text-[#171717]">
                    {order.totalPrice + order.deliveryFee} DA
                </td>

                <td className="p-3">
                    <OrderStatusSelect
                        orderId={order._id}
                        status={order.status}
                        onError={onStatusError}
                    />
                </td>

                <td className="p-3 text-[13px] text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </td>

                <td className="p-3">
                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={onViewDetails}
                            title="Voir les détails"
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={onDeleteClick}
                            title="Supprimer"
                            className="p-2 rounded-[5px] border-2 border-red-600 text-red-600
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }
);

// =====================================================
// Carte commande (mobile)
// =====================================================

const OrderCard = memo(
    ({ order, onViewDetails, onDeleteClick, onStatusError }: RowProps) => {

        const totalItems = order.items.reduce(
            (sum, i) => sum + i.quantity,
            0
        );

        return (
            <div className="bg-white rounded-[10px] shadow-2xl p-4 flex flex-col gap-3 w-full">

                <div className="flex flex-row justify-between items-start gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="font-[600] text-[#171717] text-[15px] truncate">
                            {order.firstName} {order.lastName}
                        </p>
                        <p className="text-[13px] text-gray-500">
                            {order.phone} • {order.wilaya}
                        </p>
                    </div>

                    <OrderStatusSelect
                        orderId={order._id}
                        status={order.status}
                        onError={onStatusError}
                    />
                </div>

                <div className="flex flex-row justify-between items-center border-t border-t-gray-200 pt-3">
                    <p className="text-[13px] text-gray-500">
                        {totalItems} article{totalItems > 1 ? "s" : ""}
                    </p>
                    <p className="text-[15px] font-[600] text-[#171717]">
                        {order.totalPrice + order.deliveryFee} DA
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between border-t border-t-gray-200 pt-3">
                    <p className="text-[12px] text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>

                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={onViewDetails}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={onDeleteClick}
                            className="p-2 rounded-[5px] border-2 border-red-600 text-red-600
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

// =====================================================
// Composant principal
// =====================================================

const AllOrders = () => {

    const {
        orders,
        loadingOrders,
        getOrders,
        page,
        setPage,
        totalPages,
        total,
    } = useOrdersAdminContext();

    const { deleteOrder, loadingAction } = useOrdersActionsAdminContext();

    const [viewedOrder, setViewedOrder] = useState<Order | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [toast, setToast] = useState<
        { message: string; type: "success" | "error" } | null
    >(null);

    const handleStatusError = (message: string) => {
        setToast({ message, type: "error" });
    };

    const handleDelete = async () => {

        if (!orderToDelete) return;

        try {

            setIsDeleting(true);

            await deleteOrder(orderToDelete._id);
            await getOrders();

            setToast({
                message: "Commande supprimée avec succès",
                type: "success",
            });

            setOrderToDelete(null);

        } catch (err) {

            setToast({
                message:
                    err instanceof Error
                        ? err.message
                        : "Erreur lors de la suppression",
                type: "error",
            });

        } finally {

            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-5 w-full pb-20 px-70 max-[1500px]:px-50
        max-[1300px]:px-30 max-[1100px]:px-20 max-[1000px]:px-5">

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* ============================================= */}
            {/* Chargement */}
            {/* ============================================= */}
            {loadingOrders && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={30} className="animate-spin text-[#B89B72]" />
                    <p className="text-gray-600">Chargement des commandes...</p>
                </div>
            )}

            {/* ============================================= */}
            {/* Aucune commande */}
            {/* ============================================= */}
            {!loadingOrders && orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-3
                bg-white rounded-[10px] shadow-2xl">
                    <PackageOpen size={40} className="text-gray-400" />
                    <p className="text-gray-600 font-[600]">Aucune commande trouvée</p>
                </div>
            )}

            {/* ============================================= */}
            {/* Vue Desktop : tableau */}
            {/* ============================================= */}
            {!loadingOrders && orders.length > 0 && (
                <div className="bg-white rounded-[10px] shadow-2xl overflow-x-auto max-[800px]:hidden">
                    <table className="w-full min-w-[750px] border-collapse">
                        <thead>
                            <tr className="bg-[#F7F4EE] border-b border-b-gray-300">
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Client
                                </th>
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Wilaya
                                </th>
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Articles
                                </th>
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Total
                                </th>
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Statut
                                </th>
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Date
                                </th>
                                <th className="p-3 text-left text-[13px] font-[700] text-[#171717]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderRow
                                    key={order._id}
                                    order={order}
                                    onViewDetails={() => setViewedOrder(order)}
                                    onDeleteClick={() => setOrderToDelete(order)}
                                    onStatusError={handleStatusError}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ============================================= */}
            {/* Vue Mobile : cartes */}
            {/* ============================================= */}
            {!loadingOrders && orders.length > 0 && (
                <div className="hidden max-[800px]:flex flex-col gap-3">
                    {orders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            onViewDetails={() => setViewedOrder(order)}
                            onDeleteClick={() => setOrderToDelete(order)}
                            onStatusError={handleStatusError}
                        />
                    ))}
                </div>
            )}

            {/* ============================================= */}
            {/* Pagination */}
            {/* ============================================= */}
            {!loadingOrders && totalPages > 1 && (
                <div className="flex flex-row justify-between items-center mt-2
                max-[600px]:flex-col max-[600px]:gap-3">
                    <p className="text-[13px] text-gray-500">
                        Page {page} sur {totalPages} — {total} commandes
                    </p>

                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page <= 1}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() =>
                                setPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={page >= totalPages}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* ============================================= */}
            {/* Popup détails */}
            {/* ============================================= */}
            <AnimatePresence>
                {viewedOrder && (
                    <OrderDetailsPop
                        order={viewedOrder}
                        onClose={() => setViewedOrder(null)}
                    />
                )}
            </AnimatePresence>

            {/* ============================================= */}
            {/* Popup suppression */}
            {/* ============================================= */}
            <AnimatePresence>
                {orderToDelete && (
                    <DeleteOrderPop
                        clientName={`${orderToDelete.firstName} ${orderToDelete.lastName}`}
                        isDeleting={isDeleting || loadingAction}
                        onCancel={() => setOrderToDelete(null)}
                        onConfirm={handleDelete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(AllOrders);