import { memo, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import type { HeroSlideInput } from "../../Types/Types";

interface HeroSlideEditorProps {
    index: number;
    slide: HeroSlideInput;
    imageFile: File | null;
    onChange: (updates: Partial<HeroSlideInput>) => void;
    onImageChange: (file: File | null) => void;
    onRemove: () => void;
    canRemove: boolean;
}

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/avif",
];

const HeroSlideEditor = ({
    index,
    slide,
    imageFile,
    onChange,
    onImageChange,
    onRemove,
    canRemove,
}: HeroSlideEditorProps) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previewUrl = imageFile
        ? URL.createObjectURL(imageFile)
        : slide.image?.url;

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

            <div className="flex flex-row items-center justify-between">
                <p className="text-[1.1em] font-bold text-[#171717]">
                    Slide {index + 1}
                </p>

                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-2 rounded-[5px] border-2 border-red-600 text-red-600 cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="flex flex-row gap-4 max-[700px]:flex-col">

                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative w-[140px] h-[140px] shrink-0 rounded-[10px] border-2 border-dashed
                    flex items-center justify-center cursor-pointer overflow-hidden
                    transition-colors duration-200
                    ${
                        isDragging
                            ? "border-[#B89B72] bg-[#F7F4EE]"
                            : "border-gray-300 bg-gray-50 hover:border-[#B89B72]"
                    }`}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 px-2">
                            <ImagePlus size={26} className="text-[#B89B72]" />
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
                        value={slide.kicker}
                        onChange={(e) => onChange({ kicker: e.target.value })}
                        placeholder="Kicker (ex: 01 — Élégance)"
                        className="h-[42px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />

                    <input
                        value={slide.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        placeholder="Titre"
                        className="h-[42px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />

                    <textarea
                        value={slide.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        placeholder="Description"
                        rows={2}
                        className="px-3 py-2 border-2 border-[#171717] rounded-[8px] text-[14px] resize-none
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />

                    <input
                        value={slide.cta}
                        onChange={(e) => onChange({ cta: e.target.value })}
                        placeholder="Texte du bouton (CTA)"
                        className="h-[42px] px-3 border-2 border-[#171717] rounded-[8px] text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-[#B89B72]"
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(HeroSlideEditor);