import { memo, useEffect, useState } from "react";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryImage } from "../../Types/Types";

const Galerie = ({
    setShowPop,
    images,
    initialIndex = 0,
}: {
    setShowPop: (b: boolean) => void;
    images: CategoryImage[];
    initialIndex?: number;
}) => {
    const [currentImg, setCurrentImg] = useState(initialIndex);

    const slideLeft = () =>
        setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

    const slideRight = () =>
        setCurrentImg((prev) => (prev + 1) % images.length);

    // navigation clavier (flèches + Echap)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") slideLeft();
            if (e.key === "ArrowRight") slideRight();
            if (e.key === "Escape") setShowPop(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [images.length]);

    return (
        <div
            onClick={() => setShowPop(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm p-6 max-[600px]:p-2
            flex justify-center items-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex flex-col items-center gap-4 w-full h-full max-w-[1100px] justify-center"
            >
                <button
                    onClick={() => setShowPop(false)}
                    aria-label="Fermer la galerie"
                    className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/10 text-white
                    flex items-center justify-center transition-all duration-200
                    hover:bg-white/20 active:scale-90"
                >
                    <X size={20} />
                </button>

                <p className="text-white text-[1.4em] font-bold text-center">La galerie</p>

                <div className="relative flex items-center justify-center w-full">
                    <button
                        onClick={slideLeft}
                        aria-label="Image précédente"
                        className="absolute left-1 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm
                        text-white flex items-center justify-center transition-all duration-200
                        hover:bg-white/20 active:scale-90"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <img
                        src={images[currentImg].url}
                        className="max-w-[900px] w-full object-contain h-[500px] rounded-xl
                        max-[850px]:h-[350px] max-[550px]:h-[280px]"
                        alt=""
                    />

                    <button
                        onClick={slideRight}
                        aria-label="Image suivante"
                        className="absolute right-1 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm
                        text-white flex items-center justify-center transition-all duration-200
                        hover:bg-white/20 active:scale-90"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>

                <p className="text-[14px] font-semibold text-gray-300">
                    {currentImg + 1}/{images.length}
                </p>

                <div className="flex flex-wrap justify-center items-center gap-2 max-w-[700px]">
                    {images.map((img, index) => (
                        <button
                            key={img.publicId}
                            onClick={() => setCurrentImg(index)}
                            aria-label={`Image ${index + 1}`}
                            className={`w-[60px] h-[60px] rounded-lg overflow-hidden shrink-0
                            transition-all duration-200
                            ${index === currentImg
                                ? "ring-2 ring-[#cdad7d] opacity-100"
                                : "opacity-50 hover:opacity-80"}`}
                        >
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(Galerie);