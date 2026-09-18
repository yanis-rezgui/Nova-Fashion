import { memo, useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Save,
    Store,
    Truck,
    Phone,
    Share2
} from "lucide-react";

import type { Settings } from "../Types/Types";
import { useSettingsContext } from "../Contexts/SettingsContext";
import { useAdminSettingsContext } from "../AdminContexts/AdminSettingsContext";

const inputClass =
    "border border-gray-300 rounded-[5px] p-2 outline-none w-full text-[14px] bg-white " +
    "focus:border-[#0F172A] transition-colors duration-200";

const labelClass =
    "text-[13px] font-[500] text-gray-600 mb-1";

const cardClass =
    "bg-white rounded-[8px] p-5 w-full flex flex-col gap-4 shadow-sm border border-gray-100";

const sectionTitleClass =
    "text-[16px] font-[700]";

const General = () => {
    const { settings, loadingSettings } = useSettingsContext();

    const {
        updateSettings,
        loadingUpdateSettings,
        errorMsg
    } = useAdminSettingsContext();

    const [form, setForm] = useState<Settings | null>(null);
    const [successMsg, setSuccessMsg] = useState(false);

    useEffect(() => {
        if (settings) {
            setForm(settings);
        }
    }, [settings]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loadingSettings || !form) {
        return (
            <section className="flex flex-col w-full items-center bg-gray-200 min-h-screen px-5 text-[#0F172A]">
                <p className="mt-30">
                    Chargement des paramètres...
                </p>
            </section>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Handlers
    |--------------------------------------------------------------------------
    */

    const handleShopNameChange = (value: string) => {
        setForm({
            ...form,
            shopName: value
        });

        setSuccessMsg(false);
    };

    const handleShippingChange = (
        field: "algerPrice" | "outsideAlgerPrice",
        value: string
    ) => {
        setForm({
            ...form,
            shipping: {
                ...form.shipping,
                [field]: value === "" ? 0 : Number(value)
            }
        });

        setSuccessMsg(false);
    };

    const handleContactChange = (
        field: "phone" | "email",
        value: string
    ) => {
        setForm({
            ...form,
            contact: {
                ...form.contact,
                [field]: value
            }
        });

        setSuccessMsg(false);
    };

    const handleSocialChange = (
        index: number,
        field: "name" | "url",
        value: string
    ) => {
        const updatedSocialLinks = [...form.socialLinks];

        updatedSocialLinks[index] = {
            ...updatedSocialLinks[index],
            [field]: value
        };

        setForm({
            ...form,
            socialLinks: updatedSocialLinks
        });

        setSuccessMsg(false);
    };

    const handleAddSocial = () => {
        setForm({
            ...form,
            socialLinks: [
                ...form.socialLinks,
                {
                    name: "",
                    url: ""
                }
            ]
        });

        setSuccessMsg(false);
    };

    const handleRemoveSocial = (index: number) => {
        setForm({
            ...form,
            socialLinks: form.socialLinks.filter(
                (_, i) => i !== index
            )
        });

        setSuccessMsg(false);
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async () => {
        setSuccessMsg(false);

        await updateSettings(form);

        /*
         * errorMsg peut encore avoir son ancienne valeur ici à cause
         * du fonctionnement asynchrone de React.
         *
         * Pour l'instant, on affiche le succès après l'appel.
         * On pourra améliorer le Context pour retourner true/false.
         */
        setSuccessMsg(true);

        setTimeout(() => {
            setSuccessMsg(false);
        }, 3000);
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <section className="flex flex-col w-full items-center bg-gray-200 min-h-screen px-5 text-[#0F172A]">

            {/* Header */}
            <div className="flex flex-col items-center text-center mt-30">
                <p className="text-[2em] font-bold">
                    Paramètres généraux
                </p>

                <p className="w-[600px] max-[650px]:w-[300px] mt-3 text-[14px] text-gray-600">
                    Configurez les informations de votre boutique,
                    vos options de livraison, vos coordonnées de
                    contact et vos réseaux sociaux.
                </p>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6 w-[600px] max-[650px]:w-full mt-10 mb-10">

                {/* ======================================================
                    BOUTIQUE
                ====================================================== */}

                <div className={cardClass}>

                    <div className="flex items-center gap-2">
                        <Store
                            size={18}
                            strokeWidth={2}
                        />

                        <p className={sectionTitleClass}>
                            Boutique
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClass}>
                            Nom de la boutique
                        </label>

                        <input
                            type="text"
                            className={inputClass}
                            value={form.shopName}
                            maxLength={100}
                            onChange={(e) =>
                                handleShopNameChange(e.target.value)
                            }
                        />
                    </div>

                </div>

                {/* ======================================================
                    LIVRAISON
                ====================================================== */}

                <div className={cardClass}>

                    <div className="flex items-center gap-2">
                        <Truck
                            size={18}
                            strokeWidth={2}
                        />

                        <p className={sectionTitleClass}>
                            Livraison
                        </p>
                    </div>

                    <div className="flex gap-4 max-[500px]:flex-col">

                        {/* Alger */}
                        <div className="flex flex-col flex-1">

                            <label className={labelClass}>
                                Prix Alger (DA)
                            </label>

                            <input
                                type="number"
                                min={0}
                                className={inputClass}
                                value={form.shipping.algerPrice}
                                onChange={(e) =>
                                    handleShippingChange(
                                        "algerPrice",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* Hors Alger */}
                        <div className="flex flex-col flex-1">

                            <label className={labelClass}>
                                Prix hors Alger (DA)
                            </label>

                            <input
                                type="number"
                                min={0}
                                className={inputClass}
                                value={
                                    form.shipping
                                        .outsideAlgerPrice
                                }
                                onChange={(e) =>
                                    handleShippingChange(
                                        "outsideAlgerPrice",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* ======================================================
                    CONTACT
                ====================================================== */}

                <div className={cardClass}>

                    <div className="flex items-center gap-2">
                        <Phone
                            size={18}
                            strokeWidth={2}
                        />

                        <p className={sectionTitleClass}>
                            Contact
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">

                        <label className={labelClass}>
                            Téléphone
                        </label>

                        <input
                            type="text"
                            className={inputClass}
                            value={form.contact.phone}
                            onChange={(e) =>
                                handleContactChange(
                                    "phone",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    {/* Email */}
                    <div className="flex flex-col">

                        <label className={labelClass}>
                            Email
                        </label>

                        <input
                            type="email"
                            className={inputClass}
                            value={form.contact.email}
                            onChange={(e) =>
                                handleContactChange(
                                    "email",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {/* ======================================================
                    SOCIAL LINKS
                ====================================================== */}

                <div className={cardClass}>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">
                            <Share2
                                size={18}
                                strokeWidth={2}
                            />

                            <p className={sectionTitleClass}>
                                Réseaux sociaux
                            </p>
                        </div>

                        <span className="text-[12px] text-gray-400">
                            {form.socialLinks.length} réseau
                            {form.socialLinks.length > 1
                                ? "x"
                                : ""}
                        </span>

                    </div>

                    {/* Social links */}
                    {form.socialLinks.length > 0 ? (
                        <div className="flex flex-col gap-4">

                            {form.socialLinks.map(
                                (social, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 items-end max-[500px]:flex-col max-[500px]:items-stretch
                                        border-b border-gray-100 pb-4 last:border-none last:pb-0"
                                    >

                                        {/* Name */}
                                        <div className="flex flex-col flex-1">

                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                Nom
                                            </label>

                                            <input
                                                type="text"
                                                className={
                                                    inputClass
                                                }
                                                placeholder="Instagram"
                                                value={
                                                    social.name
                                                }
                                                onChange={(e) =>
                                                    handleSocialChange(
                                                        index,
                                                        "name",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                            />

                                        </div>

                                        {/* URL */}
                                        <div className="flex flex-col flex-[2]">

                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                URL
                                            </label>

                                            <input
                                                type="url"
                                                className={
                                                    inputClass
                                                }
                                                placeholder="https://..."
                                                value={
                                                    social.url
                                                }
                                                onChange={(e) =>
                                                    handleSocialChange(
                                                        index,
                                                        "url",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                            />

                                        </div>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSocial(
                                                    index
                                                )
                                            }
                                            disabled={
                                                loadingUpdateSettings
                                            }
                                            className="flex items-center justify-center gap-1.5
                                            text-[13px] text-red-500 p-2 rounded-[5px]
                                            cursor-pointer transition-opacity duration-200
                                            hover:opacity-70 active:opacity-50
                                            disabled:opacity-40 disabled:cursor-not-allowed
                                            shrink-0"
                                        >
                                            <Trash2
                                                size={15}
                                            />

                                            Supprimer
                                        </button>

                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <div className="border border-dashed border-gray-300 rounded-[5px] p-5 text-center">

                            <p className="text-[13px] text-gray-500">
                                Aucun réseau social configuré.
                            </p>

                        </div>
                    )}

                    {/* Add */}
                    <button
                        type="button"
                        onClick={handleAddSocial}
                        disabled={loadingUpdateSettings}
                        className="flex items-center gap-2 text-[14px] p-2
                        border border-[#0F172A] text-[#0F172A]
                        rounded-[5px] font-[500] cursor-pointer
                        transition-opacity duration-200 hover:opacity-70
                        active:opacity-50 self-start
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} />

                        Ajouter un réseau social
                    </button>

                </div>

                {/* ======================================================
                    MESSAGES
                ====================================================== */}

                {errorMsg && (
                    <div className="text-red-500 text-[14px] text-center">
                        {errorMsg}
                    </div>
                )}

                {successMsg && !errorMsg && (
                    <div className="text-green-600 text-[14px] text-center">
                        Paramètres mis à jour avec succès
                    </div>
                )}

                {/* ======================================================
                    SAVE
                ====================================================== */}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loadingUpdateSettings}
                    className="flex items-center justify-center gap-2
                    text-[15px] p-2 bg-[#0F172A] text-white
                    rounded-[5px] font-[500] cursor-pointer
                    transition-opacity duration-200 hover:opacity-80
                    active:opacity-60 disabled:opacity-50
                    disabled:cursor-not-allowed"
                >
                    <Save size={17} />

                    {loadingUpdateSettings
                        ? "Enregistrement..."
                        : "Enregistrer les modifications"}
                </button>

            </div>

        </section>
    );
};

export default memo(General);