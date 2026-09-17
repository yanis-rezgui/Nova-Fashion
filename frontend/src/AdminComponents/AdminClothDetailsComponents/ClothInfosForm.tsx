import { memo } from "react";

interface CategoryOption {
    _id: string;
    name: string;
}

export interface ClothFormState {
    name: string;
    description: string;
    gender: string;
    price: number;
    discountPrice: number | null;
    category: string;
    active: boolean;
}

interface ClothInfosFormProps {
    form: ClothFormState;
    onChange: (updates: Partial<ClothFormState>) => void;
    categories: CategoryOption[];
}

const ClothInfosForm = ({ form, onChange, categories }: ClothInfosFormProps) => {
    return (
        <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-[10px] shadow-2xl">
            <p className="text-[1.2em] font-bold text-[#171717]">
                Informations générales
            </p>

            <div className="flex flex-col gap-1">
                <label className="text-[13px] font-[600] text-[#222344]">
                    Nom du produit
                </label>
                <input
                    value={form.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                    className="h-[45px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                    focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[13px] font-[600] text-[#222344]">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    rows={4}
                    className="px-3 py-2 border-2 border-[#171717] rounded-[8px] text-[14px] resize-none
                    focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                />
            </div>

            <div className="flex flex-row gap-4 max-[600px]:flex-col">
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-[13px] font-[600] text-[#222344]">
                        Genre
                    </label>
                    <select
                        value={form.gender}
                        onChange={(e) => onChange({ gender: e.target.value })}
                        className="h-[45px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px] bg-white
                        cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    >
                        <option value="HOMME">Homme</option>
                        <option value="FEMME">Femme</option>
                        <option value="UNISEXE">Unisexe</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label className="text-[13px] font-[600] text-[#222344]">
                        Catégorie
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => onChange({ category: e.target.value })}
                        className="h-[45px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px] bg-white
                        cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    >
                        <option value="">Sélectionner</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-row gap-4 max-[600px]:flex-col">
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-[13px] font-[600] text-[#222344]">
                        Prix (DA)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => onChange({ price: Number(e.target.value) })}
                        className="h-[45px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label className="text-[13px] font-[600] text-[#222344]">
                        Prix remisé (optionnel)
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.discountPrice ?? ""}
                        onChange={(e) =>
                            onChange({
                                discountPrice:
                                    e.target.value === ""
                                        ? null
                                        : Number(e.target.value),
                            })
                        }
                        className="h-[45px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />
                </div>
            </div>

            <label className="flex flex-row items-center gap-2 cursor-pointer w-fit">
                <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => onChange({ active: e.target.checked })}
                    className="w-[18px] h-[18px] accent-[#B89B72] cursor-pointer"
                />
                <span className="text-[14px] font-[600] text-[#171717]">
                    Produit actif (visible sur la boutique)
                </span>
            </label>
        </div>
    );
};

export default memo(ClothInfosForm);