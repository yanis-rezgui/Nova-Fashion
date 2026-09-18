import { createContext, useState, useContext } from "react";
import type { Settings } from "../Types/Types";
import { useAuthContext } from "../Contexts/AuthContext";
import { useSettingsContext } from "../Contexts/SettingsContext";




interface AdminSettingsContextType {
    loadingUpdateSettings: boolean;
    updateSettings: (settings: Settings) => Promise<void>;
    errorMsg: string | null;
}


const AdminSettingsContext =
    createContext<AdminSettingsContextType | null>(null);


export const AdminSettingsProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const [loadingUpdateSettings, setLoadingUpdateSettings] =
        useState<boolean>(false);

    const [errorMsg, setErrorMsg] =
        useState<string | null>(null);

    const { token } = useAuthContext();

    const { setSettings } = useSettingsContext();


    const updateSettings = async (settings: Settings) => {

        setLoadingUpdateSettings(true);
        setErrorMsg(null);

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/settings/`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        shopName: settings.shopName,

                        shipping: {
                            algerPrice: settings.shipping.algerPrice,
                            outsideAlgerPrice:
                                settings.shipping.outsideAlgerPrice
                        },

                        contact: {
                            phone: settings.contact.phone,
                            email: settings.contact.email
                        },

                        socialLinks: settings.socialLinks
                    })
                }
            );


            const data = await res.json();


            if (!res.ok) {

                const message =
                    data.error ||
                    data.message ||
                    "Error in updating settings";

                setErrorMsg(message);

                throw new Error(message);
            }


            setSettings(data.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoadingUpdateSettings(false);

        }
    };


    return (
        <AdminSettingsContext.Provider
            value={{
                loadingUpdateSettings,
                updateSettings,
                errorMsg
            }}
        >
            {children}
        </AdminSettingsContext.Provider>
    );
};


export const useAdminSettingsContext = () => {

    const context = useContext(AdminSettingsContext);

    if (!context) {
        throw new Error(
            "Please use the useAdminSettingsContext hook inside an AdminSettingsProvider"
        );
    }

    return context;
};