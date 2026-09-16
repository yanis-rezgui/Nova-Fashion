
import { memo, useEffect, useMemo, useState } from "react";
import { useClothingContext } from "../../Contexts/ClothingContext";
import { useFavoritesContext } from "../../Contexts/FavoritesContext";
import { useCartcontext } from "../../Contexts/CartContext";
import { AnimatePresence, motion } from "framer-motion";

const Infos = () => {

    const {
        clothDetails,
        variants
    } = useClothingContext();

    const {
        toggleFavorite,
        isFavorite
    } = useFavoritesContext();

    const {
        addToCart,
        msg
    } = useCartcontext();


    /* =========================
       DESCRIPTION
    ========================= */

    const [open, setOpen] = useState<boolean>(false);


    /* =========================
       VARIANT SELECTION
    ========================= */

    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const [quantity, setQuantity] = useState<number>(1);


    /* =========================
       STOCK
    ========================= */

    const isOutOfStock = useMemo(() => {

        if (!variants || variants.length === 0) {
            return true;
        }

        return !variants.some(
            (variant) => variant.quantity > 0
        );

    }, [variants]);


    /* =========================
       AVAILABLE COLORS
    ========================= */

    const availableColors = useMemo(() => {

        if (!variants) return [];

        /*
         * On garde uniquement les couleurs
         * qui possèdent au moins une taille
         * avec du stock.
         */

        return Array.from(
            new Set(
                variants
                    .filter((variant) => variant.quantity > 0)
                    .map((variant) => variant.color)
            )
        );

    }, [variants]);


    /* =========================
       SIZES FOR SELECTED COLOR
    ========================= */

    const sizesForSelectedColor = useMemo(() => {

        if (!variants || !selectedColor) {
            return [];
        }

        return variants.filter(
            (variant) =>
                variant.color === selectedColor
        );

    }, [variants, selectedColor]);


    /* =========================
       SELECTED VARIANT
    ========================= */

    const selectedVariant = useMemo(() => {

        if (
            !variants ||
            !selectedColor ||
            !selectedSize
        ) {
            return null;
        }

        return variants.find(
            (variant) =>
                variant.color === selectedColor &&
                variant.size === selectedSize
        ) ?? null;

    }, [
        variants,
        selectedColor,
        selectedSize
    ]);


    /* =========================
       DEFAULT COLOR + SIZE
    ========================= */

    useEffect(() => {

        if (
            !variants ||
            variants.length === 0 ||
            isOutOfStock
        ) {
            setSelectedColor(null);
            setSelectedSize(null);
            setQuantity(1);
            return;
        }


        /*
         * On récupère la première variant
         * réellement disponible.
         */

        const firstAvailableVariant = variants.find(
            (variant) => variant.quantity > 0
        );

        if (!firstAvailableVariant) {
            return;
        }


        /*
         * Première couleur disponible
         */

        setSelectedColor(
            firstAvailableVariant.color
        );


        /*
         * Première taille disponible
         * pour cette couleur
         */

        const firstSizeForColor = variants.find(
            (variant) =>
                variant.color === firstAvailableVariant.color &&
                variant.quantity > 0
        );

        setSelectedSize(
            firstSizeForColor?.size ?? null
        );


        /*
         * Quantité par défaut
         */

        setQuantity(1);

    }, [variants, isOutOfStock]);


    /* =========================
       CHANGE COLOR
    ========================= */

    const handleColorChange = (color: string) => {

        setSelectedColor(color);

        /*
         * Quand on change de couleur,
         * on cherche automatiquement
         * la première taille disponible.
         */

        const firstAvailableSize = variants?.find(
            (variant) =>
                variant.color === color &&
                variant.quantity > 0
        );

        setSelectedSize(
            firstAvailableSize?.size ?? null
        );

        /*
         * On recommence toujours à 1.
         */

        setQuantity(1);
    };


    /* =========================
       CHANGE SIZE
    ========================= */

    const handleSizeChange = (size: string) => {

        setSelectedSize(size);

        /*
         * Une nouvelle variante est sélectionnée,
         * donc on remet la quantité à 1.
         */

        setQuantity(1);
    };


    /* =========================
       QUANTITY
    ========================= */

    const decreaseQuantity = () => {

        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };


    const increaseQuantity = () => {

        if (!selectedVariant) return;

        setQuantity((current) =>
            Math.min(
                current + 1,
                selectedVariant.quantity
            )
        );
    };


    /* =========================
       ADD TO CART
    ========================= */

    const handleAddToCart = () => {

        if (!clothDetails || !selectedVariant) {
            return;
        }

        if (selectedVariant.quantity <= 0) {
            return;
        }

        if (quantity > selectedVariant.quantity) {
            return;
        }

        addToCart(
            clothDetails,
            selectedVariant,
            quantity
        );
    };


    /* =========================
       RENDER
    ========================= */

    return (

        <div className="w-[900px] bg-white rounded-[10px] shadow-2xl p-5 flex flex-col gap-3
        max-[1300px]:w-[700px] max-[1100px]:w-[500px] max-[600px]:w-[400px] max-[450px]:w-[300px] mt-5
        mb-10
        ">

            {/* =========================
                NAME
            ========================= */}

            <h2 className="text-[1.5em] font-[600] text-[#171717]">
                {clothDetails?.name}
            </h2>


            {/* =========================
                PRICE
            ========================= */}

            {clothDetails?.discountPrice &&
             clothDetails.discountPrice < clothDetails.price ? (

                <div className="flex flex-col">

                    <p className="line-through text-[17px] text-red-700">
                        {clothDetails.price} DA
                    </p>

                    <p className="text-gray-800 text-[20px]">
                        {clothDetails.discountPrice} DA
                    </p>

                </div>

            ) : (

                <p className="text-gray-800 text-[20px]">
                    {clothDetails?.price} DA
                </p>

            )}


            {/* =========================
                FAVORITE
            ========================= */}

            <button
                onClick={() => {

                    if (clothDetails) {
                        toggleFavorite(clothDetails._id);
                    }

                }}
                className="bg-black/80 w-[200px] h-[40px]
                rounded-[5px] cursor-pointer"
            >

                {isFavorite(clothDetails?._id || "") ? (

                    <span className="text-white flex flex-row gap-2
                    justify-center items-center">

                        <i className="fa-solid fa-heart text-red-600"></i>

                        Favoris

                    </span>

                ) : (

                    <span className="text-white">

                        <i className="fa-regular fa-heart text-white"></i>

                        {" "}Ajouter aux Favoris

                    </span>

                )}

            </button>

            {/* =========================
                DESCRIPTION
            ========================= */}

            <div
                className="w-full p-5 mt-10 flex flex-col gap-2
                border-t border-b border-gray-300"
            >

                <div className="flex flex-row w-full
                justify-between items-center">

                    <p className="text-[1.6em] font-bold">
                        Description
                    </p>

                    <motion.i
                        onClick={() =>
                            setOpen((prev) => !prev)
                        }
                        className="fa-solid fa-chevron-down
                        text-[1.5em] cursor-pointer
                        hover:opacity-80 active:opacity-60"
                        animate={{
                            rotate: open ? 180 : 0,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: "easeInOut",
                        }}
                    />

                </div>


                <AnimatePresence initial={false}>

                    {open && (

                        <motion.div
                            className="flex flex-col gap-1
                            text-[15px] mt-2 overflow-hidden"
                            initial={{
                                height: 0,
                                opacity: 0,
                            }}
                            animate={{
                                height: "auto",
                                opacity: 1,
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                        >

                            {clothDetails?.description}

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>


            {/* =========================
                VARIANTS
            ========================= */}

            <div className="w-full mt-8 flex flex-col gap-6">

                {isOutOfStock ? (

                    <div className="border border-red-200 bg-red-50
                    rounded-[5px] p-4">

                        <p className="text-red-700 font-[600]">
                            Rupture de stock
                        </p>

                    </div>

                ) : (

                    <>

                        {/* =========================
                            COLORS
                        ========================= */}

                        <div className="flex flex-col gap-3">

                            <p className="font-[600] text-[17px]">
                                Couleur
                            </p>

                            <div className="flex flex-wrap gap-3">

                                {availableColors.map((color) => (

                                    <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                style={{
                    backgroundColor: color
                }}
                className={`
                    h-[30px]
                    w-[30px]
                    rounded-full
                    cursor-pointer
                    transition-all
                    ${
                        selectedColor === color
                            ? "ring-2 ring-black ring-offset-2"
                            : "hover:scale-105"
                    }
                `}
                aria-label={`Couleur ${color}`}
            />

                                ))}

                            </div>

                        </div>


                        {/* =========================
                            SIZES
                        ========================= */}

                        <div className="flex flex-col gap-3">

                            <p className="font-[600] text-[17px]">
                                Taille
                            </p>

                            <div className="flex flex-wrap gap-3">

                                {sizesForSelectedColor.map(
                                    (variant) => {

                                        const unavailable =
                                            variant.quantity === 0;

                                        return (

                                            <button
                                                key={variant._id}
                                                disabled={unavailable}
                                                onClick={() =>
                                                    handleSizeChange(
                                                        variant.size
                                                    )
                                                }
                                                className={`
                                                    w-[55px]
                                                    h-[40px]
                                                    border
                                                    rounded-[5px]
                                                    transition-all
                                                    ${
                                                        unavailable
                                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                            : selectedSize === variant.size
                                                                ? "bg-black text-white border-black cursor-pointer"
                                                                : "bg-white text-black border-gray-300 hover:border-black cursor-pointer"
                                                    }
                                                `}
                                            >

                                                {variant.size}

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        </div>


                        {/* =========================
                            SELECTED VARIANT STOCK
                        ========================= */}

                        {selectedVariant && (

                            <div className="flex flex-col gap-1">

                                {selectedVariant.quantity <= 3 ? (

                                    <p className="text-orange-600 text-[14px]">
                                        Plus que {selectedVariant.quantity} disponible(s)
                                    </p>

                                ) : (

                                    <p className="text-green-600 text-[14px]">
                                        En stock
                                    </p>

                                )}

                            </div>

                        )}


                        {/* =========================
                            QUANTITY
                        ========================= */}

                        <div className="flex flex-col gap-3">

                            <p className="font-[600] text-[17px]">
                                Quantité
                            </p>

                            <div className="flex items-center
                            border border-gray-300
                            rounded-[5px] w-fit">

                                <button
                                    onClick={decreaseQuantity}
                                    disabled={
                                        !selectedVariant ||
                                        quantity <= 1
                                    }
                                    className="w-[40px] h-[40px]
                                    cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40"
                                >
                                    −
                                </button>

                                <span className="w-[40px]
                                text-center">
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    disabled={
                                        !selectedVariant ||
                                        quantity >= selectedVariant.quantity
                                    }
                                    className="w-[40px] h-[40px]
                                    cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        <div className="h-[30px]">
                        {msg && 
                         <p className="text-[15px]">
                            {msg}
                         </p>
                        }
                        </div>
                        {/* =========================
                            ADD TO CART
                        ========================= */}

                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedVariant}
                            className="
                                w-full
                                h-[50px]
                                rounded-[5px]
                                bg-black
                                text-white
                                font-[600]
                                cursor-pointer
                                transition
                                hover:bg-black/80
                                disabled:bg-gray-300
                                disabled:cursor-not-allowed
                            "
                        >

                            Ajouter au panier

                        </button>

                    </>

                )}

            </div>


            

        </div>
    );
};

export default memo(Infos);
