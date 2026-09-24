import { memo } from "react";
import { useSettingsContext } from "../Contexts/SettingsContext";

const privacyPolicySections = (shopName: string, email: string, phone: string) => [
    {
        id: 1,
        title: "Politique de confidentialité",
        content: [
            `La présente politique de confidentialité explique comment ${shopName} collecte, utilise, conserve et protège les données à caractère personnel communiquées par les utilisateurs de son site internet et de sa boutique en ligne.`,
            `${shopName} accorde une importance particulière à la protection de la vie privée de ses clients et s'engage à traiter les données personnelles conformément à la réglementation algérienne applicable en matière de protection des données à caractère personnel.`,
            "Dernière mise à jour : Septembre 2026.",
        ],
    },

    {
        id: 2,
        title: "1. Responsable du traitement",
        content: [
            `Le responsable du traitement des données collectées via le site est ${shopName}.`,
            `Téléphone : ${phone}`,
            `E-mail : ${email}`,
        ],
    },

    {
        id: 3,
        title: "2. Données collectées",
        content: [
            "Selon les fonctionnalités que vous utilisez sur le site, différentes catégories de données peuvent être collectées :",
            "• Nom et prénom.",
            "• Adresse e-mail.",
            "• Numéro de téléphone.",
            "• Adresse de livraison.",
            "• Wilaya de livraison.",
            "• Informations nécessaires au traitement et à la livraison des commandes.",
            "• Informations communiquées lors d'une commande ou d'une demande de contact.",
            "• Données relatives à votre compte utilisateur.",
            "• Produits ajoutés à vos favoris.",
            "• Informations relatives à votre panier.",
            "• Informations relatives à vos commandes et à leur statut.",
            "• Données techniques nécessaires au fonctionnement et à la sécurité du site.",
            "Nous ne collectons que les informations nécessaires au fonctionnement de la boutique, au traitement des commandes et à l'amélioration des services proposés.",
        ],
    },

    {
        id: 4,
        title: "3. Comment vos données sont-elles collectées ?",
        content: [
            "Les données personnelles peuvent notamment être collectées lorsque vous :",
            "• Créez un compte utilisateur.",
            "• Passez une commande sur notre boutique en ligne.",
            "• Renseignez vos informations de livraison.",
            "• Ajoutez des produits à votre panier.",
            "• Ajoutez des produits à vos favoris.",
            "• Envoyez une demande via le formulaire de contact.",
            `• Contactez ${shopName} par l'intermédiaire des informations de contact présentes sur le site.`,
            "• Utilisez les différentes fonctionnalités proposées sur notre boutique en ligne.",
        ],
    },

    {
        id: 5,
        title: "4. Finalités du traitement",
        content: [
            "Les données personnelles collectées sont utilisées notamment pour :",
            "• Créer et gérer votre compte utilisateur.",
            "• Enregistrer et traiter vos commandes.",
            "• Préparer et assurer la livraison de vos commandes.",
            "• Calculer les frais de livraison applicables selon la wilaya.",
            "• Vous contacter concernant une commande ou une demande effectuée.",
            "• Gérer les produits présents dans votre panier.",
            "• Vous permettre de gérer vos produits favoris.",
            "• Suivre l'état et le statut de vos commandes.",
            "• Gérer les notifications relatives à vos commandes.",
            "• Répondre à vos demandes de contact ou d'assistance.",
            "• Assurer le fonctionnement et la sécurité du site.",
            "• Améliorer l'expérience utilisateur et les services proposés.",
            "• Prévenir les utilisations frauduleuses ou abusives du site.",
            "• Respecter les obligations légales applicables.",
        ],
    },

    {
        id: 6,
        title: "5. Base du traitement",
        content: [
            "Le traitement des données personnelles repose notamment sur la nécessité de traiter les commandes effectuées par les utilisateurs, d'assurer leur livraison, de gérer les comptes clients et de permettre le fonctionnement des fonctionnalités proposées sur le site.",
            "Lorsque votre consentement est requis par la réglementation applicable, celui-ci est recueilli dans les conditions prévues à cet effet.",
        ],
    },

    {
        id: 7,
        title: "6. Utilisation des données",
        content: [
            `${shopName} utilise les données personnelles uniquement dans le cadre des finalités pour lesquelles elles ont été collectées.`,
            "Les données sont notamment utilisées pour assurer le traitement des commandes, la communication avec les clients, la livraison des produits et le fonctionnement des services proposés sur la boutique.",
            "Les données ne sont pas utilisées à des fins incompatibles avec ces finalités sans information préalable de l'utilisateur ou sans autre fondement légal applicable.",
        ],
    },

    {
        id: 8,
        title: "7. Données relatives aux commandes",
        content: [
            "Lorsque vous passez une commande, certaines informations sont nécessaires afin de pouvoir traiter et livrer votre commande.",
            "Ces informations peuvent notamment comprendre votre nom, votre prénom, votre numéro de téléphone, votre adresse, votre wilaya, les produits commandés, les variantes sélectionnées, les quantités, le montant de la commande, les frais de livraison et le statut de la commande.",
            "Ces données sont utilisées afin de préparer la commande, organiser sa livraison, vous contacter si nécessaire et assurer le suivi de la commande.",
            "Les informations nécessaires à la livraison peuvent être communiquées au livreur ou au prestataire chargé de remettre la commande.",
        ],
    },

    {
        id: 9,
        title: "8. Paiement",
        content: [
            `${shopName} propose actuellement le paiement à la livraison pour les commandes effectuées sur la boutique en ligne.`,
            "Dans le cadre du paiement à la livraison, aucune donnée bancaire n'est nécessaire pour effectuer votre commande en ligne.",
            "Le montant de la commande ainsi que les éventuels frais de livraison sont indiqués avant la validation de la commande.",
            "Si d'autres moyens de paiement sont proposés ultérieurement, les modalités applicables seront indiquées lors du processus de commande.",
        ],
    },

    {
        id: 10,
        title: "9. Conservation des données",
        content: [
            "Les données personnelles sont conservées pendant une durée adaptée à la finalité pour laquelle elles ont été collectées.",
            "Les données liées à un compte utilisateur peuvent être conservées pendant la durée nécessaire à la gestion du compte et des services associés.",
            "Les données relatives aux commandes peuvent être conservées pendant la durée nécessaire à leur traitement, à leur suivi et pendant les durées éventuellement imposées par la réglementation applicable.",
            "Les informations relatives aux demandes de contact peuvent être conservées pendant la durée nécessaire au traitement et au suivi de la demande.",
            "Lorsque les données ne sont plus nécessaires, elles peuvent être supprimées ou archivées conformément aux obligations légales applicables.",
        ],
    },

    {
        id: 11,
        title: "10. Destinataires des données",
        content: [
            `Les données personnelles sont principalement accessibles aux personnes autorisées au sein de ${shopName} lorsqu'elles sont nécessaires au traitement des commandes, des demandes ou à la gestion du site.`,
            "Certains prestataires techniques peuvent également traiter certaines données afin d'assurer le fonctionnement du site, notamment les services d'hébergement, de base de données, d'envoi d'e-mails, de stockage d'images ou d'autres services techniques nécessaires au fonctionnement de la boutique.",
            "Les informations nécessaires à la livraison peuvent être communiquées aux personnes ou prestataires chargés de la préparation et de la livraison des commandes.",
            `Ces prestataires n'utilisent pas les données personnelles pour leur propre compte dans le cadre des services fournis à ${shopName}.`,
            "Les données personnelles ne sont pas vendues à des tiers à des fins commerciales.",
        ],
    },

    {
        id: 12,
        title: "11. Sécurité des données",
        content: [
            `${shopName} met en œuvre des mesures techniques et organisationnelles adaptées afin de protéger les données personnelles contre les accès non autorisés, la perte, la modification, la divulgation ou toute autre utilisation illicite.`,
            "Les comptes utilisateurs et les fonctionnalités sensibles du site sont notamment protégés par des mécanismes d'authentification et de contrôle des accès.",
            "Les informations sensibles transmises entre l'utilisateur et le site peuvent être protégées par des mécanismes de sécurité adaptés.",
            "Toutefois, aucun système informatique ne peut garantir une sécurité absolue contre l'ensemble des risques existants.",
        ],
    },

    {
        id: 13,
        title: "12. Cookies et technologies similaires",
        content: [
            "Le site peut utiliser des cookies ou des technologies similaires nécessaires à son fonctionnement, à la sécurité du site et à l'amélioration de l'expérience utilisateur.",
            "Certaines informations peuvent notamment être conservées localement sur votre appareil afin de permettre le fonctionnement de fonctionnalités telles que le panier ou certaines préférences utilisateur.",
            "Les technologies utilisées peuvent également contribuer au bon fonctionnement des différentes fonctionnalités de la boutique.",
            "Vous pouvez gérer ou supprimer les cookies depuis les paramètres de votre navigateur.",
        ],
    },

    {
        id: 14,
        title: "13. Panier et produits favoris",
        content: [
            "Le site propose des fonctionnalités permettant aux utilisateurs de gérer un panier et de conserver une liste de produits favoris.",
            "Certaines informations relatives au panier peuvent être stockées localement sur l'appareil de l'utilisateur afin de permettre le bon fonctionnement de la boutique.",
            "Les produits favoris associés à un compte utilisateur peuvent être enregistrés dans les systèmes de ${shopName} afin de permettre leur consultation et leur gestion depuis le compte concerné.",
        ],
    },

    {
        id: 15,
        title: "14. Vos droits",
        content: [
            "Conformément à la réglementation algérienne applicable en matière de protection des données à caractère personnel, vous disposez de droits concernant vos données personnelles.",
            "Vous pouvez notamment, dans les conditions prévues par la réglementation applicable, demander l'accès à vos données, leur rectification, leur mise à jour ou leur suppression lorsque celle-ci est possible.",
            "Vous pouvez également vous opposer à certains traitements ou demander leur limitation lorsque les conditions légales sont réunies.",
            `Pour exercer vos droits ou obtenir des informations concernant le traitement de vos données, vous pouvez contacter ${shopName} à l'adresse suivante : ${email}.`,
        ],
    },

    {
        id: 16,
        title: "15. Liens vers des services tiers",
        content: [
            "Le site peut contenir des liens vers des services ou sites internet appartenant à des tiers, notamment les réseaux sociaux ou d'autres plateformes utilisées pour faciliter certaines fonctionnalités.",
            `${shopName} ne contrôle pas les pratiques de confidentialité de ces services externes.`,
            "Nous vous invitons à consulter les politiques de confidentialité des services tiers concernés lorsque vous les utilisez.",
        ],
    },

    {
        id: 17,
        title: "16. Modifications de la politique",
        content: [
            `${shopName} peut modifier la présente politique de confidentialité afin de tenir compte des évolutions légales, réglementaires, techniques ou fonctionnelles du site.`,
            "La version la plus récente de la politique est celle publiée sur cette page.",
            "Nous vous recommandons de consulter régulièrement cette page afin de prendre connaissance des éventuelles modifications.",
        ],
    },

    {
        id: 18,
        title: "17. Nous contacter",
        content: [
            `Pour toute question concernant la présente politique de confidentialité ou le traitement de vos données personnelles, vous pouvez contacter ${shopName}.`,
            `Téléphone : ${phone}`,
            `E-mail : ${email}`,
        ],
    },

    {
        id: 19,
        title: "Dernière mise à jour",
        content: [
            "Septembre 2026",
        ],
    },
];

const PrivacyPolicy = () => {

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

    const sections = privacyPolicySections(
        settings.shopName,
        settings.contact.email,
        settings.contact.phone
    );

    return (
        <section className="min-h-screen flex flex-col w-full items-center px-5 bg-white">

            <div className="w-full max-w-[1000px] py-16">

                <div className="border-b border-gray-200 pb-8">

                    <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#B89B72]">
                        {settings.shopName}
                    </span>

                    <h1 className="mt-3 text-[2.2em] font-bold text-[#171717]">
                        Politique de confidentialité
                    </h1>

                    <p className="mt-3 max-w-[750px] text-gray-600 leading-7">
                        Découvrez comment {settings.shopName} collecte, utilise
                        et protège vos données personnelles lorsque vous
                        utilisez notre boutique en ligne.
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

export default memo(PrivacyPolicy);