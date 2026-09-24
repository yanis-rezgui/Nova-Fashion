import { memo } from "react";
import { useHeroContext } from "../../../Contexts/HeroContext";


// =====================================================
// FEATURED PRODUCT SKELETON
// =====================================================

const FeaturedProductSkeleton = () => {

    return (
        <div
            className="
                flex
                flex-row
                w-[250px]
                h-[180px]
                rounded-[10px]
                shadow-2xl
                gap-5
                bg-white
                p-3
                justify-between
                items-center

                max-[620px]:w-[320px]

                animate-pulse
            "
        >

            {/* CONTENT */}

            <div className="flex flex-col gap-3">

                {/* NAME */}

                <div
                    className="
                        w-[105px]
                        h-[18px]
                        rounded-[4px]
                        bg-gray-200
                    "
                />

                {/* CATEGORY */}

                <div
                    className="
                        w-[75px]
                        h-[15px]
                        rounded-[4px]
                        bg-gray-200
                    "
                />

                {/* PRICE */}

                <div
                    className="
                        w-[65px]
                        h-[15px]
                        rounded-[4px]
                        bg-gray-200
                    "
                />

            </div>


            {/* IMAGE */}

            <div
                className="
                    w-[100px]
                    h-[100px]
                    rounded-[8px]
                    bg-gray-200
                    shrink-0
                "
            />

        </div>
    );
};


// =====================================================
// SECOND HERO CARDS
// =====================================================

const SecondHeroCards = () => {

    const { hero, loadingHero } = useHeroContext();


    // =====================================================
    // LOADING
    // =====================================================

    if (loadingHero) {

        return (
            <div
                className="
                    flex
                    flex-col
                    justify-between
                    items-center
                    h-[400px]

                    max-[1000px]:flex-row
                    max-[1000px]:h-full
                    max-[1000px]:w-full

                    max-[620px]:flex-col
                    max-[620px]:justify-center
                    max-[620px]:gap-5
                "
            >

                <FeaturedProductSkeleton />

                <FeaturedProductSkeleton />

            </div>
        );
    }


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (!hero || hero.featuredProducts.length === 0) {
        return null;
    }


    return (

        <div
            className="
                flex
                flex-col
                justify-between
                items-center
                h-[400px]

                max-[1000px]:flex-row
                max-[1000px]:h-full
                max-[1000px]:w-full

                max-[620px]:flex-col
                max-[620px]:justify-center
                max-[620px]:gap-5
            "
        >

            {hero.featuredProducts.map((product) => (

                <div
                    key={product._id}

                    className="
                        flex
                        flex-row
                        w-[250px]
                        h-[180px]
                        rounded-[10px]
                        shadow-2xl
                        gap-5
                        bg-white
                        p-3
                        justify-between
                        items-center

                        max-[620px]:w-[320px]
                    "
                >

                    {/* CONTENT */}

                    <div className="flex flex-col gap-2">

                        <p className="text-[17px] font-bold">
                            {product.name}
                        </p>

                        <p className="text-[#B89B72] font-bold text-[15px]">
                            {product.category}
                        </p>

                        <p className="text-gray-800 text-[15px] font-[600]">
                            {product.price} DA
                        </p>

                    </div>


                    {/* IMAGE */}

                    <img
                        src={product.image.url}
                        alt={product.name}

                        className="
                            w-[100px]
                            h-[100px]
                            object-contain
                            shrink-0
                        "
                    />

                </div>

            ))}

        </div>
    );
};


export default memo(SecondHeroCards);