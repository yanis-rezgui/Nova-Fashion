import { memo } from "react";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    ClipboardCheck,
    Package,
    Truck,
} from "lucide-react";


const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};


const card = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};


const line = {
    hidden: {
        scaleX: 0,
    },
    visible: {
        scaleX: 1,
        transition: {
            duration: 0.8,
            ease: "easeInOut",
            delay: 0.3,
        },
    },
};


const Etapes = () => {

    const orderSteps = [
        {
            step: "01",
            icon: ShoppingBag,
            title: "Choisissez vos pièces",
            description:
                "Parcourez notre boutique et sélectionnez les vêtements qui correspondent à votre style et à vos envies.",
        },
        {
            step: "02",
            icon: ClipboardCheck,
            title: "Passez votre commande",
            description:
                "Ajoutez vos articles au panier, renseignez vos informations et validez simplement votre commande.",
        },
        {
            step: "03",
            icon: Package,
            title: "Nous préparons votre colis",
            description:
                "Votre commande est soigneusement préparée et emballée avant d'être remise à notre service de livraison.",
        },
        {
            step: "04",
            icon: Truck,
            title: "Recevez votre commande",
            description:
                "Votre colis arrive directement chez vous. Il ne vous reste plus qu'à profiter de vos nouvelles pièces.",
        },
    ];


    return (
        <section
            className="
                flex flex-col
                w-full
                bg-[#171717]
                items-center
                px-10
                py-15
                text-gray-50
                gap-5
            "
        >

            {/* HEADER */}

            <p
                className="
                    text-[#B89B72]
                    text-[15px]
                    font-semibold
                    tracking-[0.25em]
                    uppercase
                "
            >
                COMMENT ÇA MARCHE ?
            </p>


            <h2
                className="
                    text-center
                    text-[2em]
                    text-gray-50
                    font-bold
                "
            >
                Commandez simplement, de A à Z.
            </h2>


            <h3
                className="
                    text-gray-400
                    w-[600px]
                    text-center
                    max-[650px]:w-[320px]
                    text-[15px]
                "
            >
                Découvrez une expérience de commande simple et rapide,
                de la sélection de vos pièces jusqu'à leur livraison.
            </h3>


            {/* STEPS */}

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{
                    once: true,
                    amount: 0.2,
                }}
                className="
                    relative
                    flex flex-row
                    items-start
                    justify-center
                    gap-10
                    mt-16
                    w-full
                    max-w-[1200px]

                    max-[850px]:flex-col
                    max-[850px]:items-center
                    max-[850px]:gap-14
                "
            >

                {/* Ligne horizontale - Desktop */}

                <motion.div
                    variants={line}
                    style={{
                        transformOrigin: "left",
                    }}
                    className="
                        absolute
                        top-[35px]
                        left-[12%]
                        right-[12%]
                        h-[3px]
                        bg-[#B89B72]
                        origin-left

                        max-[850px]:hidden
                    "
                />


                {/* Ligne verticale - Mobile */}

                <motion.div
                    variants={line}
                    style={{
                        transformOrigin: "top",
                    }}
                    className="
                        hidden
                        max-[850px]:block
                        absolute
                        top-[35px]
                        bottom-[35px]
                        left-1/2
                        -translate-x-1/2
                        w-[3px]
                        bg-[#B89B72]
                    "
                />


                {orderSteps.map((s) => {

                    const Icon = s.icon;

                    return (
                        <motion.div
                            key={s.step}
                            variants={card}
                            whileHover={{
                                scale: 1.04,
                                y: -4,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 18,
                            }}
                            className="
                                relative
                                z-10
                                flex flex-col
                                items-center
                                text-center
                                w-[250px]

                                max-[850px]:w-[300px]
                            "
                        >

                            {/* ICON */}

                            <div
                                className="
                                    relative
                                    flex
                                    items-center
                                    justify-center
                                    w-[70px]
                                    h-[70px]
                                    rounded-full
                                    bg-white
                                    border-4
                                    border-[#B89B72]
                                    shadow-lg
                                "
                            >

                                <Icon
                                    size={28}
                                    className="text-[#171717]"
                                />


                                {/* STEP NUMBER */}

                                <span
                                    className="
                                        absolute
                                        -top-2
                                        -right-2
                                        flex
                                        items-center
                                        justify-center
                                        w-[26px]
                                        h-[26px]
                                        rounded-full
                                        bg-[#B89B72]
                                        text-white
                                        text-[12px]
                                        font-bold
                                        border-2
                                        border-[#171717]
                                    "
                                >
                                    {s.step}
                                </span>

                            </div>


                            {/* TITLE */}

                            <h3
                                className="
                                    text-[18px]
                                    font-bold
                                    text-gray-100
                                    mt-5
                                "
                            >
                                {s.title}
                            </h3>


                            {/* DESCRIPTION */}

                            <p
                                className="
                                    text-[14px]
                                    text-gray-400
                                    mt-2
                                    leading-5.5
                                "
                            >
                                {s.description}
                            </p>

                        </motion.div>
                    );
                })}

            </motion.div>

        </section>
    );
};


export default memo(Etapes);
