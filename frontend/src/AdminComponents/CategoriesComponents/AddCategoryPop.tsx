import { memo, useRef, useState } from "react";
import { useAdminCategoriesContext } from "../../AdminContexts/AdminCategoriesContext";

const AddCategoryPop = () => {
    const {
        setShowCreateCategoryPop,
        createCategory,
        loadingCreateCategory
    } = useAdminCategoriesContext();

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "image/avif"
    ];

    const handleFile = (file: File | undefined | null) => {
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setError("Format d'image non supporté");
            return;
        }

        setError("");
        setImage(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleCreate = async () => {
        setError("");

        if (!name || name.trim() === "") {
            setError("Le nom de la catégorie est requis");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("description", description.trim());

        if (image) {
            formData.append("image", image);
        }

        await createCategory(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[800px] bg-white flex flex-col rounded-[10px] overflow-y-auto max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-4 py-2 flex flex-row w-full justify-between items-center border-b border-b-gray-300">
                    <p className="text-[1.5em] font-bold text-[#0F172A]">
                        Nouvelle Catégorie
                    </p>
                    <span
                        onClick={() => setShowCreateCategoryPop(false)}
                        className="text-[2em] cursor-pointer text-[#0F172A] transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        &times;
                    </span>
                </div>

                <div className="p-4 flex flex-col gap-3">
                    {/* Nom */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[15px] font-[600] text-[#0F172A]">
                            Nom de la catégorie*
                        </label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Ex: T-Shirts"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px] bg-gray-100"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[15px] font-[600] text-[#0F172A]">
                            Description
                        </label>
                        <textarea
                            value={description}
                            placeholder="Ex: Découvrez notre collection de T-Shirts..."
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px] bg-gray-100 resize-none"
                        />
                    </div>

                    {/* Image */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] font-[600] text-[#0F172A]">
                            Image
                        </label>

                        {!image && (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => inputRef.current?.click()}
                                className={`flex flex-col items-center justify-center gap-2 w-full h-[150px] border-2 border-dashed rounded-[10px] cursor-pointer transition-colors duration-200 ${
                                    isDragging
                                        ? "border-[#222344] bg-gray-100"
                                        : "border-gray-300 bg-gray-50"
                                }`}
                            >
                                <i className="fa-solid fa-cloud-arrow-up text-[2em] text-[#222344]"></i>
                                <p className="text-[14px] text-gray-500 text-center px-3">
                                    Glissez-déposez une image ici, ou cliquez pour sélectionner
                                </p>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/jpg,image/avif"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFile(e.target.files?.[0])
                                    }
                                />
                            </div>
                        )}

                        {image && (
                            <div className="relative w-[120px] h-[120px]">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-[5px] border-2 border-[#cdad7d]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="absolute -top-2 -right-2 bg-red-600 text-white w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] cursor-pointer hover:opacity-80"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    <div className="h-[30px] flex justify-center items-center text-[15px] text-center text-red-600">
                        {error && <span>{error}</span>}
                    </div>

                    {/* Submit */}
                    <button
                        className="bg-[#0F172A] text-white font-bold text-[15px] w-full cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 py-2 rounded-[5px] mt-5"
                        disabled={loadingCreateCategory}
                        onClick={handleCreate}
                    >
                        {loadingCreateCategory ? "Création..." : "Créer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(AddCategoryPop);