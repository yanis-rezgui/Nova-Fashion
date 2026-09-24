import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useHeroContext } from "../../../Contexts/HeroContext";


// =====================================================
// HERO SKELETON
// =====================================================

const HeroSkeleton = () => {

    return (

        <div
            className="
                w-[600px]
                h-[400px]
                bg-white
                shadow-2xl
                rounded-[10px]
                p-8
                flex
                flex-col
                relative
                overflow-hidden

                max-[620px]:w-[320px]
                max-[620px]:h-[600px]

                animate-pulse
            "
        >

            <div
                className="
                    absolute
                    inset-0
                    p-8
                    flex
                    flex-row
                    items-center
                    justify-center
                    gap-5

                    max-[620px]:flex-col
                    max-[620px]:gap-10
                "
            >

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4

                        max-[620px]:items-center
                    "
                >

                    {/* KICKER */}

                    <div
                        className="
                            w-[150px]
                            h-[22px]
                            rounded-[5px]
                            bg-gray-200

                            max-[620px]:w-[130px]
                        "
                    />


                    {/* TITLE */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                        "
                    >

                        <div
                            className="
                                w-[190px]
                                h-[27px]
                                rounded-[5px]
                                bg-gray-200
                            "
                        />

                        <div
                            className="
                                w-[160px]
                                h-[27px]
                                rounded-[5px]
                                bg-gray-200
                            "
                        />

                        <div
                            className="
                                w-[130px]
                                h-[27px]
                                rounded-[5px]
                                bg-gray-200
                            "
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                        "
                    >

                        <div
                            className="
                                w-[210px]
                                h-[15px]
                                rounded-[4px]
                                bg-gray-200
                            "
                        />

                        <div
                            className="
                                w-[170px]
                                h-[15px]
                                rounded-[4px]
                                bg-gray-200
                            "
                        />

                    </div>


                    {/* CTA */}

                    <div
                        className="
                            w-[210px]
                            h-[38px]
                            rounded-[10px]
                            bg-gray-200
                            mt-1
                        "
                    />

                </div>


                {/* =====================================================
                    IMAGE
                ===================================================== */}

                <div
                    className="
                        w-[200px]
                        h-[230px]
                        rounded-[8px]
                        bg-gray-200

                        max-[620px]:w-[180px]
                        max-[620px]:h-[180px]
                    "
                />

            </div>


            {/* =====================================================
                INDICATORS
            ===================================================== */}

            <div
                className="
                    flex
                    flex-row
                    justify-center
                    items-center
                    gap-2

                    absolute
                    bottom-3
                    left-1/2
                    -translate-x-1/2
                "
            >

                <div
                    className="
                        w-[30px]
                        h-[10px]
                        rounded-full
                        bg-gray-200
                    "
                />

                <div
                    className="
                        w-[10px]
                        h-[10px]
                        rounded-full
                        bg-gray-200
                    "
                />

                <div
                    className="
                        w-[10px]
                        h-[10px]
                        rounded-full
                        bg-gray-200
                    "
                />

            </div>

        </div>
    );
};


const HeroSlide = () => {

    const [index, setIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);

    const { hero, loadingHero } = useHeroContext();
    const navigate = useNavigate();


    // =====================================================
    // LOADING
    // =====================================================

    if (loadingHero) {
        return <HeroSkeleton />;
    }


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (!hero || hero.slides.length === 0) {
        return null;
    }


    const slides = hero.slides;
    const slide = slides[index];


    // =====================================================
    // CHANGE SLIDE
    // =====================================================

    const changeSlide = (newIndex: number) => {

        if (newIndex === index) return;

        setDirection(newIndex > index ? 1 : -1);
        setIndex(newIndex);
    };


    // =====================================================
    // NEXT / PREVIOUS
    // =====================================================

    const nextSlide = () => {

        setDirection(1);

        setIndex((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };


    const previousSlide = () => {

        setDirection(-1);

        setIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };


    // =====================================================
    // ANIMATION
    // =====================================================

    const slideVariants = {

        enter: (direction: number) => ({
            opacity: 0,
            x: direction > 0 ? 80 : -80,
            scale: 0.97,
        }),

        center: {
            opacity: 1,
            x: 0,
            scale: 1,
        },

        exit: (direction: number) => ({
            opacity: 0,
            x: direction > 0 ? -80 : 80,
            scale: 0.97,
        }),
    };


    return (

        <div
            className="
                w-[600px]
                h-[400px]
                bg-white
                shadow-2xl
                rounded-[10px]
                p-8
                flex
                flex-col
                relative
                overflow-hidden

                max-[620px]:w-[320px]
                max-[620px]:h-[600px]
            "
        >

            <AnimatePresence
                mode="wait"
                custom={direction}
            >

                <motion.div
                    key={slide._id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                    }}

                    className="
                        absolute
                        inset-0
                        p-8
                        flex
                        flex-row
                        items-center
                        justify-center
                        gap-5

                        max-[620px]:flex-col
                        max-[620px]:gap-10
                    "
                >

                    {/* CONTENT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -25,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.12,
                            ease: "easeOut",
                        }}

                        className="
                            flex
                            flex-col
                            gap-3

                            max-[620px]:justify-center
                            max-[620px]:items-center
                        "
                    >

                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.4,
                                delay: 0.15,
                            }}

                            className="
                                text-[#171717]
                                font-bold
                                text-[2.2em]

                                max-[620px]:text-[1.8em]
                            "
                        >
                            {slide.kicker}
                        </motion.h1>


                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: 0.2,
                            }}

                            className="
                                text-[#B89B72]
                                text-[1.7em]
                                leading-9
                                font-[600]

                                max-[620px]:text-center
                            "
                        >
                            {slide.title}
                        </motion.div>


                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: 0.25,
                            }}

                            className="
                                text-[#171717]
                                text-[1.1em]

                                max-[620px]:text-center
                            "
                        >
                            {slide.description}
                        </motion.p>


                        <motion.button
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: 0.3,
                            }}

                            whileHover={{
                                scale: 1.03,
                                opacity: 0.85,
                            }}

                            whileTap={{
                                scale: 0.97,
                            }}

                            className="
                                w-[210px]
                                text-white
                                text-[15px]
                                bg-[#171717]
                                py-2
                                rounded-[10px]
                                font-bold
                                cursor-pointer
                            "

                            onClick={() => navigate("/boutique")}
                        >
                            {slide.cta}
                        </motion.button>

                    </motion.div>


                    {/* IMAGE */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: direction > 0 ? 40 : -40,
                            scale: 0.92,
                        }}

                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                        }}

                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}

                        className="
                            flex
                            items-center
                            justify-center
                            shrink-0
                        "
                    >

                        <motion.img
                            src={slide.image.url}
                            alt={slide.kicker}

                            className="
                                w-[200px]
                                object-contain
                            "

                            animate={{
                                y: [0, -5, 0],
                            }}

                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                    </motion.div>

                </motion.div>

            </AnimatePresence>


            {/* PREVIOUS / NEXT */}

            {slides.length > 1 && (
                <>
                    <button
                        onClick={previousSlide}
                        aria-label="Slide précédent"

                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2

                            w-8
                            h-8
                            rounded-full

                            bg-white/80
                            backdrop-blur-sm

                            text-[#171717]

                            flex
                            items-center
                            justify-center

                            opacity-0
                            hover:opacity-100

                            transition-opacity
                            duration-200

                            shadow-md
                            cursor-pointer
                        "
                    >
                        ‹
                    </button>

                    <button
                        onClick={nextSlide}
                        aria-label="Slide suivant"

                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2

                            w-8
                            h-8
                            rounded-full

                            bg-white/80
                            backdrop-blur-sm

                            text-[#171717]

                            flex
                            items-center
                            justify-center

                            opacity-0
                            hover:opacity-100

                            transition-opacity
                            duration-200

                            shadow-md
                            cursor-pointer
                        "
                    >
                        ›
                    </button>
                </>
            )}


            {/* INDICATORS */}

            <div
                className="
                    flex
                    flex-row
                    justify-center
                    items-center
                    gap-2

                    absolute
                    bottom-3
                    left-1/2
                    -translate-x-1/2
                "
            >

                {slides.map((item, i) => (

                    <motion.button
                        key={item._id}
                        onClick={() => changeSlide(i)}

                        animate={{
                            width: i === index ? 30 : 10,
                            opacity: i === index ? 1 : 0.6,
                        }}

                        transition={{
                            duration: 0.25,
                            ease: "easeOut",
                        }}

                        className="
                            h-[10px]
                            rounded-full
                            cursor-pointer
                            bg-[#171717]
                        "

                        aria-label={`Aller au slide ${i + 1}`}
                    />

                ))}

            </div>

        </div>
    );
};

export default HeroSlide;