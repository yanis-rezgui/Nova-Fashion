import { memo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface ExistingImage {
    _id: string;
    url: string;
    publicId?: string;
}

interface ClothImagesManagerProps {
    oldImages: ExistingImage[];
    setOldImages: (images: ExistingImage[]) => void;
    newImages: File[];
    setNewImages: (files: File[]) => void;
}

const ClothImagesManager = ({
    oldImages,
    setOldImages,
    newImages,
    setNewImages,
}: ClothImagesManagerProps) => {

    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "image/avif",
    ];

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const validFiles = Array.from(files).filter((f) =>
            allowedTypes.includes(f.type)
        );

        setNewImages([...newImages, ...validFiles]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeOldImage = (index: number) =>
        setOldImages(oldImages.filter((_, i) => i !== index));

    const removeNewImage = (index: number) =>
        setNewImages(newImages.filter((_, i) => i !== index));

    return (
        <div className="flex flex-col gap-3 w-full bg-white p-4 rounded-[10px] shadow-2xl">
            <p className="text-[1.2em] font-bold text-[#171717]">
                Images du produit
            </p>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 w-full h-[140px]
                border-2 border-dashed rounded-[10px] cursor-pointer transition-colors duration-200
                ${
                    isDragging
                        ? "border-[#B89B72] bg-[#F7F4EE]"
                        : "border-gray-300 bg-gray-50"
                }`}
            >
                <ImagePlus size={28} className="text-[#B89B72]" />
                <p className="text-[13px] text-gray-500 text-center px-3">
                    Glissez-déposez vos images ici, ou cliquez pour sélectionner
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg,image/avif"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            <div className="flex flex-wrap gap-3 mt-1">
                {oldImages.map((img, i) => (
                    <div key={img._id} className="relative w-[90px] h-[90px]">
                        <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover rounded-[8px] border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => removeOldImage(i)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white w-[20px] h-[20px]
                            rounded-full flex items-center justify-center cursor-pointer
                            transition-opacity duration-200 hover:opacity-80"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                {newImages.map((file, i) => (
                    <div key={`new-${i}`} className="relative w-[90px] h-[90px]">
                        <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-full h-full object-cover rounded-[8px] border-2 border-[#B89B72]"
                        />
                        <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white w-[20px] h-[20px]
                            rounded-full flex items-center justify-center cursor-pointer
                            transition-opacity duration-200 hover:opacity-80"
                        >
                            <X size={12} />
                        </button>
                        <span className="absolute bottom-0 left-0 bg-[#171717] text-white text-[9px] px-1
                        rounded-tr-[5px] rounded-bl-[8px]">
                            nouvelle
                        </span>
                    </div>
                ))}
            </div>

            {oldImages.length === 0 && newImages.length === 0 && (
                <p className="text-[13px] text-gray-400 italic">
                    Aucune image pour ce produit
                </p>
            )}
        </div>
    );
};

export default memo(ClothImagesManager);