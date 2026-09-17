import { memo, useState } from "react";
import { Pencil, Trash2, Plus, Check, X, Loader2 } from "lucide-react";
import { useAdminClothingContext } from "../../AdminContexts/AdminClothingContext";
import type { Variant } from "../../../../../ElAhlem/frontend/src/Types/Types";

interface VariantRowProps {
    variant: Variant;
}

const VariantRow = memo(({ variant }: VariantRowProps) => {

    const { updateVariant, deleteVariant, mutatingVariant } =
        useAdminClothingContext();

    const [editing, setEditing] = useState(false);
    const [color, setColor] = useState(variant.color);
    const [size, setSize] = useState(variant.size);
    const [quantity, setQuantity] = useState(variant.quantity);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = async () => {
        const result = await updateVariant(variant._id, {
            color,
            size,
            quantity: Number(quantity),
        });

        if (result.success) setEditing(false);
    };

    const handleCancel = () => {
        setColor(variant.color);
        setSize(variant.size);
        setQuantity(variant.quantity);
        setEditing(false);
    };

    const handleDelete = async () => {
        await deleteVariant(variant._id);
        setConfirmDelete(false);
    };

    const stockColor =
        quantity === 0
            ? "text-red-600"
            : quantity < 10
            ? "text-yellow-600"
            : "text-green-600";

    return (
        <div className="flex flex-row items-center gap-3 bg-[#F7F4EE] rounded-[8px] p-3
        max-[600px]:flex-wrap">

            {editing ? (
                <>
                    <input
                    
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Couleur"
                        className="w-[100px] h-[38px] px-2 border-2 border-[#171717] rounded-[5px] text-[13px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />
                    <input
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        placeholder="Taille"
                        className="w-[80px] h-[38px] px-2 border-2 border-[#171717] rounded-[5px] text-[13px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />
                    <input
                        type="number"
                        min={0}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Qté"
                        className="w-[80px] h-[38px] px-2 border-2 border-[#171717] rounded-[5px] text-[13px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />

                    <div className="flex flex-row items-center gap-2 ml-auto">
                        <button
                            onClick={handleSave}
                            disabled={mutatingVariant}
                            className="p-2 rounded-[5px] bg-[#171717] text-white cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50"
                        >
                            {mutatingVariant ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={mutatingVariant}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717] cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center">
                    <input type="color"
                    value={variant.color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-[30px] h-[30px] rounded-full"
                    />
                    <p className="text-[13px]">
                        {variant.color}
                    </p>
                    </div>
                    <p className="text-[14px] text-[#222344] w-[60px]">
                        {variant.size}
                    </p>
                    <p className={`text-[14px] font-[600] ${stockColor}`}>
                        {variant.quantity} en stock
                    </p>

                    <div className="flex flex-row items-center gap-2 ml-auto">
                        <button
                            onClick={() => setEditing(true)}
                            className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717] cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            <Pencil size={15} />
                        </button>

                        {confirmDelete ? (
                            <div className="flex flex-row items-center gap-1">
                                <button
                                    onClick={handleDelete}
                                    disabled={mutatingVariant}
                                    className="px-2 py-2 rounded-[5px] bg-red-600 text-white text-[12px]
                                    cursor-pointer transition-opacity duration-200 hover:opacity-80"
                                >
                                    Confirmer
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="p-2 rounded-[5px] border-2 border-[#171717] text-[#171717]
                                    cursor-pointer"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="p-2 rounded-[5px] border-2 border-red-600 text-red-600 cursor-pointer
                                transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

const AddVariantForm = memo(({ clothingId }: { clothingId: string }) => {

    const { addVariant, mutatingVariant } = useAdminClothingContext();

    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState<number | "">("");

    const handleAdd = async () => {

        if (!color.trim() || !size.trim() || quantity === "" || Number(quantity) < 0) {
            return;
        }

        const result = await addVariant(clothingId, {
            color: color.trim(),
            size: size.trim(),
            quantity: Number(quantity),
        });

        if (result.success) {
            setColor("");
            setSize("");
            setQuantity("");
        }
    };

    return (
        <div className="flex flex-row items-center gap-3 border-2 border-dashed border-gray-300
        rounded-[8px] p-3 max-[600px]:flex-wrap">
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Couleur"
                className="w-[100px] h-[38px] px-2 border-2 border-[#171717] rounded-[5px] text-[13px]
                focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
            />
            <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Taille"
                className="w-[80px] h-[38px] px-2 border-2 border-[#171717] rounded-[5px] text-[13px]
                focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
            />
            <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) =>
                    setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Qté"
                className="w-[80px] h-[38px] px-2 border-2 border-[#171717] rounded-[5px] text-[13px]
                focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
            />

            <button
                onClick={handleAdd}
                disabled={mutatingVariant}
                className="flex flex-row items-center gap-1 ml-auto px-3 py-2 rounded-[5px]
                bg-[#B89B72] text-white text-[13px] font-[600] cursor-pointer
                transition-opacity duration-200 hover:opacity-80 active:opacity-60 disabled:opacity-50"
            >
                {mutatingVariant ? (
                    <Loader2 size={15} className="animate-spin" />
                ) : (
                    <Plus size={15} />
                )}
                Ajouter
            </button>
        </div>
    );
});

interface VariantsManagerProps {
    clothingId: string;
    variants: Variant[];
}

const VariantsManager = ({ clothingId, variants }: VariantsManagerProps) => {
    return (
        <div className="flex flex-col gap-3 w-full bg-white p-4 rounded-[10px] shadow-2xl">
            <p className="text-[1.2em] font-bold text-[#171717]">
                Variantes ({variants.length})
            </p>

            {variants.length === 0 && (
                <p className="text-[13px] text-gray-400 italic">
                    Aucune variante pour ce produit
                </p>
            )}

            <div className="flex flex-col gap-2">
                {variants.map((v) => (
                    <VariantRow key={v._id} variant={v} />
                ))}
            </div>

            <AddVariantForm clothingId={clothingId} />
        </div>
    );
};

export default memo(VariantsManager);