


import { createContext, useContext, useEffect, useState } from "react";
import type { Settings } from "../Types/Types";

interface SettingsContextType {
  settings: Settings | null;
  setSettings: (s : Settings | null)=>void;
  loadingSettings: boolean;
  getSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);

  const getSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Error in getting settings");
      }

      setSettings(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loadingSettings, getSettings,
      setSettings
     }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Please use the useSettingsContext Hook inside the SettingsProvider");
  }
  return context;
};