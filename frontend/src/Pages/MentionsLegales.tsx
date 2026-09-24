import { memo } from "react";

import { useSettingsContext } from "../Contexts/SettingsContext";


const legalNoticeSections = (
    shopName: string,
    phone: string,
    email: string
) => [
    {
        id: 1,
        title: "Éditeur du site",
        content: [
            shopName,
            "Boutique de vêtements en ligne",
            `Téléphone : ${phone}`,
            `E-mail : ${email}`,
        ],
    },

    {
        id: 2,
        title: "Directeur de la publication",
        content: [
            `Le directeur de la publication du site est le responsable de ${shopName}.`,
        ],
    },

    {
        id: 3,
        title: "Objet du site",
        content: [
            `Le site ${shopName} est une boutique en ligne dédiée à la présentation et à la vente de vêtements et d'articles de mode.`,
            "Le site permet notamment aux utilisateurs de découvrir les produits disponibles, consulter leurs caractéristiques, sélectionner leurs variantes, ajouter des articles au panier ou aux favoris et passer des commandes.",
            "Les informations, produits, prix, disponibilités et contenus présentés sur le site peuvent évoluer en fonction de l'activité de la boutique.",
        ],
    },

    {
        id: 4,
        title: "Conception et développement du site",
        content: [
            `Le site internet ${shopName} a été conçu et développé avec des technologies web modernes, notamment :`,
            "• React",
            "• TypeScript",
            "• Vite",
            "• Tailwind CSS",
            "• Node.js",
            "• Express.js",
            "• MongoDB",
            "• Mongoose",
            "• Cloudinary",
        ],
    },

    {
        id: 5,
        title: "Hébergement et services techniques",
        content: [
            "Les services d'hébergement et d'infrastructure nécessaires au fonctionnement du site sont fournis par des prestataires techniques tiers.",
            "Le site peut également utiliser des services tiers pour certaines fonctionnalités techniques, notamment le stockage d'images, l'envoi d'e-mails, la gestion des données ou les notifications.",
            "Les prestataires techniques concernés peuvent traiter certaines données uniquement dans le cadre des services qu'ils fournissent au fonctionnement de la boutique.",
        ],
    },

    {
        id: 6,
        title: "Propriété intellectuelle",
        content: [
            `L'ensemble des éléments présents sur le site ${shopName}, notamment les textes, photographies, logos, illustrations, icônes, éléments graphiques, contenus, produits et structure du site, est susceptible d'être protégé par les règles applicables en matière de propriété intellectuelle.`,
            "Toute reproduction, représentation, modification, adaptation ou diffusion, totale ou partielle, des contenus du site sans autorisation préalable est susceptible d'être interdite.",
            "Les marques, logos, photographies ou contenus appartenant à des tiers restent la propriété de leurs détenteurs respectifs.",
        ],
    },

    {
        id: 7,
        title: "Informations relatives aux produits",
        content: [
            "Les informations relatives aux vêtements et articles présentés sur le site sont communiquées à titre informatif et commercial.",
            "Les descriptions, photographies, couleurs, tailles, caractéristiques, prix et disponibilités des produits peuvent être modifiés ou mis à jour.",
            "Les photographies présentées sur le site sont destinées à illustrer les produits. De légères différences peuvent éventuellement apparaître entre les photographies et le produit réel, notamment en fonction de l'affichage de l'écran.",
            "La disponibilité d'un produit ou d'une variante peut évoluer en fonction des stocks disponibles.",
            "Les utilisateurs sont invités à vérifier les informations affichées sur la fiche produit avant de passer commande.",
        ],
    },

    {
        id: 8,
        title: "Commandes",
        content: [
            `Le site permet aux utilisateurs de sélectionner des produits, leurs variantes disponibles, les quantités souhaitées et de passer une commande en renseignant les informations nécessaires à sa livraison.`,
            "Les informations communiquées lors de la commande doivent être exactes et suffisamment complètes afin de permettre le traitement et la livraison de celle-ci.",
            "Après validation d'une commande, celle-ci peut être traitée, préparée puis remise au service ou au livreur chargé de sa livraison.",
            "Le statut d'une commande peut évoluer au cours de son traitement, notamment lors de sa préparation, de son expédition, de sa livraison ou de son annulation.",
        ],
    },

    {
        id: 9,
        title: "Livraison",
        content: [
            `Les commandes passées sur ${shopName} peuvent être livrées en fonction des zones desservies par la boutique.`,
            "Les frais de livraison applicables sont indiqués lors du processus de commande et peuvent varier selon la wilaya de livraison.",
            "Les délais et modalités de livraison peuvent dépendre de la zone géographique, du traitement de la commande et du service chargé de la livraison.",
            "L'utilisateur doit fournir une adresse et un numéro de téléphone permettant de faciliter la livraison de sa commande.",
        ],
    },

    {
        id: 10,
        title: "Paiement",
        content: [
            `${shopName} propose actuellement le paiement à la livraison pour les commandes effectuées sur la boutique en ligne.`,
            "Dans le cadre du paiement à la livraison, le règlement du montant de la commande est effectué lors de la réception du colis selon les modalités prévues par la boutique.",
            "Les éventuelles modalités de paiement supplémentaires seront indiquées sur le site lorsqu'elles seront disponibles.",
        ],
    },

    {
        id: 11,
        title: "Protection des données personnelles",
        content: [
            `${shopName} accorde une importance particulière à la protection des données personnelles communiquées par les utilisateurs.`,
            "Les données collectées via le site, notamment lors de la création d'un compte, d'une commande ou d'une demande de contact, sont utilisées afin d'assurer le fonctionnement de la boutique et le traitement des demandes des utilisateurs.",
            "Les données personnelles sont traitées conformément à la réglementation algérienne applicable en matière de protection des données à caractère personnel.",
            `Pour toute question relative au traitement de vos données personnelles, vous pouvez contacter ${shopName} à l'adresse suivante : ${email}.`,
        ],
    },

    {
        id: 12,
        title: "Cookies et technologies similaires",
        content: [
            "Le site peut utiliser des cookies ou des technologies similaires nécessaires à son fonctionnement, à l'amélioration de l'expérience utilisateur ou à certaines fonctionnalités de la boutique.",
            "Certaines informations peuvent notamment être conservées localement sur l'appareil de l'utilisateur afin de permettre le fonctionnement de fonctionnalités telles que le panier ou certaines préférences.",
            "L'utilisateur peut configurer son navigateur afin de limiter ou de supprimer les cookies.",
        ],
    },

    {
        id: 13,
        title: "Responsabilité",
        content: [
            `${shopName} s'efforce de fournir des informations fiables, exactes et régulièrement mises à jour sur son site.`,
            "Toutefois, la boutique ne peut garantir l'exactitude, l'exhaustivité ou l'actualité de l'ensemble des informations publiées à tout moment.",
            "Les prix, stocks, caractéristiques, photographies et disponibilités des produits peuvent évoluer sans préavis.",
            "La boutique ne saurait être tenue responsable des dommages résultant notamment d'une indisponibilité temporaire du site, d'une erreur technique, d'une interruption du service ou de l'utilisation d'informations devenues obsolètes.",
            "La boutique peut également utiliser des services ou plateformes tiers nécessaires au fonctionnement de certaines fonctionnalités du site.",
        ],
    },

    {
        id: 14,
        title: "Liens externes",
        content: [
            "Certains liens présents sur le site peuvent rediriger vers des plateformes ou sites internet externes, notamment les réseaux sociaux ou d'autres services utilisés par la boutique.",
            "Ces services sont soumis à leurs propres conditions d'utilisation et politiques de confidentialité.",
            `${shopName} ne peut être tenue responsable du contenu, du fonctionnement ou des pratiques de ces services tiers.`,
        ],
    },

    {
        id: 15,
        title: "Disponibilité du site",
        content: [
            `${shopName} s'efforce de maintenir le site accessible et fonctionnel.`,
            "Toutefois, le site peut être temporairement inaccessible en raison notamment d'opérations de maintenance, de mises à jour, de problèmes techniques ou de circonstances indépendantes de la volonté de la boutique.",
            "La boutique se réserve la possibilité de modifier, suspendre ou interrompre temporairement certaines fonctionnalités du site lorsque cela est nécessaire.",
        ],
    },

    {
        id: 16,
        title: "Droit applicable",
        content: [
            "Les présentes mentions légales sont soumises au droit algérien.",
            "Tout litige relatif à l'utilisation du site sera soumis aux règles de compétence applicables en Algérie.",
        ],
    },

    {
        id: 17,
        title: "Nous contacter",
        content: [
            `Pour toute question concernant les présentes mentions légales ou le fonctionnement du site, vous pouvez contacter ${shopName}.`,
            `Téléphone : ${phone}`,
            `E-mail : ${email}`,
        ],
    },

    {
        id: 18,
        title: "Dernière mise à jour",
        content: [
            "Septembre 2026",
        ],
    },
];


const MentionsLegales = () => {

    const { settings, loadingSettings } = useSettingsContext();

    if (loadingSettings || !settings) {
        return (
            <section className="min-h-screen flex items-center justify-center px-5">
                <div className="text-sm text-gray-500">
                    Chargement...
                </div>
            </section>
        );
    }

    const sections = legalNoticeSections(
        settings.shopName,
        settings.contact.phone,
        settings.contact.email
    );

    return (
        <section className="min-h-screen flex flex-col w-full items-center bg-white px-5">

            <div className="w-full max-w-[1000px] py-16">

                <div className="border-b border-gray-200 pb-8">

                    <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#B89B72]">
                        {settings.shopName}
                    </span>

                    <h1 className="mt-3 text-[2.2em] font-bold text-[#171717]">
                        Mentions légales
                    </h1>

                    <p className="mt-3 max-w-[750px] text-gray-600 leading-7">
                        Informations légales relatives au site internet de{" "}
                        {settings.shopName}.
                    </p>

                </div>

                <div className="flex flex-col mt-12">

                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="mb-10"
                        >

                            <h2 className="text-2xl font-bold text-[#171717] mb-4">
                                {section.title}
                            </h2>

                            <div className="flex flex-col gap-2">

                                {section.content.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="text-gray-700 leading-7 whitespace-pre-line"
                                    >
                                        {paragraph}
                                    </p>
                                ))}

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
};

export default memo(MentionsLegales);