import { memo, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import type { HeroFeaturedProductInput } from "../../Types/Types";

interface HeroFeaturedProductEditorProps {
    index: number;
    product: HeroFeaturedProductInput;
    imageFile: File | null;
    onChange: (updates: Partial<HeroFeaturedProductInput>) => void;
    onImageChange: (file: File | null) => void;
}

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/avif",
];

const HeroFeaturedProductEditor = ({
    index,
    product,
    imageFile,
    onChange,
    onImageChange,
}: HeroFeaturedProductEditorProps) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previewUrl = imageFile
        ? URL.createObjectURL(imageFile)
        : product.image?.url;

    const handleFile = (file: File | null | undefined) => {
        if (file && allowedTypes.includes(file.type)) {
            onImageChange(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    return (
        <div className="flex flex-col gap-3 bg-white p-4 rounded-[10px] shadow-2xl w-full">

            <p className="text-[1.1em] font-bold text-[#171717]">
                Produit vedette {index + 1}
            </p>

            <div className="flex flex-row gap-4 max-[700px]:flex-col">

                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative w-[120px] h-[120px] shrink-0 rounded-[10px] border-2 border-dashed
                    flex items-center justify-center cursor-pointer overflow-hidden
                    transition-colors duration-200
                    ${
                        isDragging
                            ? "border-[#B89B72] bg-[#F7F4EE]"
                            : "border-gray-300 bg-gray-50 hover:border-[#B89B72]"
                    }`}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 px-2">
                            <ImagePlus size={24} className="text-[#B89B72]" />
                            <p className="text-[10px] text-gray-500 text-center">
                                Glisser-déposer
                            </p>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg,image/avif"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <input
                        value={product.name}
                        onChange={(e) => onChange({ name: e.target.value })}
                        placeholder="Nom du produit"
                        className="h-[42px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />

                    <input
                        value={product.category}
                        onChange={(e) => onChange({ category: e.target.value })}
                        placeholder="Catégorie"
                        className="h-[42px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />

                    <input
                        type="number"
                        min={0}
                        value={product.price}
                        onChange={(e) => onChange({ price: Number(e.target.value) })}
                        placeholder="Prix (DA)"
                        className="h-[42px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(HeroFeaturedProductEditor);