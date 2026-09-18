import { memo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Order } from "../../Types/Types";

interface OrderDetailsPopProps {
    order: Order;
    onClose: () => void;
}

const OrderDetailsPop = ({ order, onClose }: OrderDetailsPopProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-5"
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[10px] shadow-2xl p-6 w-[550px] max-h-[85vh] overflow-y-auto
                max-[600px]:w-full flex flex-col gap-4"
            >
                <div className="flex flex-row items-center justify-between">
                    <h3 className="text-[1.3em] font-bold text-[#171717]">
                        Détails de la commande
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer
                        transition-colors duration-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                        <p className="text-[12px] text-gray-500 font-[600]">Client</p>
                        <p className="text-[14px] text-[#171717]">
                            {order.firstName} {order.lastName}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[12px] text-gray-500 font-[600]">Téléphone</p>
                        <p className="text-[14px] text-[#171717]">{order.phone}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[12px] text-gray-500 font-[600]">Wilaya</p>
                        <p className="text-[14px] text-[#171717]">{order.wilaya}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[12px] text-gray-500 font-[600]">Date</p>
                        <p className="text-[14px] text-[#171717]">
                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <p className="text-[12px] text-gray-500 font-[600]">Adresse</p>
                        <p className="text-[14px] text-[#171717]">{order.address}</p>
                    </div>
                </div>

                <div className="border-t border-t-gray-200 pt-3 flex flex-col gap-2">
                    <p className="text-[13px] font-[700] text-[#171717]">
                        Articles ({order.items.length})
                    </p>

                    {order.items.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-row justify-between items-center
                            bg-[#F7F4EE] rounded-[8px] p-2"
                        >
                            <div className="flex flex-col">
                                <p className="text-[13px] font-[600] text-[#171717]">
                                    {item.name}
                                </p>
                                <p className="text-[12px] text-gray-500">
                                    {item.color} • {item.size} • x{item.quantity}
                                </p>
                            </div>
                            <p className="text-[13px] font-[600] text-[#171717]">
                                {item.price * item.quantity} DA
                            </p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-t-gray-200 pt-3 flex flex-col gap-1">
                    <div className="flex flex-row justify-between text-[13px] text-gray-600">
                        <span>Sous-total produits</span>
                        <span>{order.totalPrice} DA</span>
                    </div>
                    <div className="flex flex-row justify-between text-[13px] text-gray-600">
                        <span>Livraison</span>
                        <span>{order.deliveryFee} DA</span>
                    </div>
                    <div className="flex flex-row justify-between text-[15px] font-[700] text-[#171717] mt-1">
                        <span>Total</span>
                        <span>{order.totalPrice + order.deliveryFee} DA</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default memo(OrderDetailsPop);