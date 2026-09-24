import { createContext, useContext, useEffect, useState } from "react";
import type { CreateHeroPayload, Hero, UpdateHeroPayload } from "../Types/Types";
import { useAuthContext } from "./AuthContext";


interface HeroContextType {

    hero: Hero | null;
    loadingHero: boolean;
    getHero: () => Promise<void>;

    creatingHero: boolean;
    createHero: (payload: CreateHeroPayload) => Promise<boolean>;

    updatingHero: boolean;
    updateHero: (payload: UpdateHeroPayload) => Promise<boolean>;
}

const HeroContext = createContext<HeroContextType | null>(null);

export const HeroProvider = ({children} : {children : React.ReactNode}) => {

    const [hero, setHero] = useState<Hero | null>(null);
    const [loadingHero, setLoadingHero] = useState<boolean>(true);

    const [creatingHero, setCreatingHero] = useState<boolean>(false);
    const [updatingHero, setUpdatingHero] = useState<boolean>(false);
    const {token} = useAuthContext();

    const getHero = async () => {
        try{

            setLoadingHero(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hero`, {
                method: "GET",
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting hero");
            }

            setHero(data.data);

        }catch(err){
            console.error(err);
        }finally{
            setLoadingHero(false);
        }
    }


    const createHero = async (payload: CreateHeroPayload) : Promise<boolean> => {

        try{

            setCreatingHero(true);

            const formData = new FormData();

            formData.append("slides", JSON.stringify(payload.slides));
            formData.append("featuredProducts", JSON.stringify(payload.featuredProducts));

            payload.slideImages.forEach((file) => {
                formData.append("slideImages", file);
            });

            payload.featuredProductImages.forEach((file) => {
                formData.append("featuredProductImages", file);
            });

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hero`, {
                method: "POST",
                 headers : {
                    Authorization : `Bearer ${token}`
                },
                body: formData,
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in creating hero");
            }

            setHero(data.data);
            return true;

        }catch(err){
            console.error(err);
            return false;
        }finally{
            setCreatingHero(false);
        }
    }


    const updateHero = async (payload: UpdateHeroPayload) : Promise<boolean> => {

        try{

            setUpdatingHero(true);

            const formData = new FormData();

            formData.append("slides", JSON.stringify(payload.slides));
            formData.append("featuredProducts", JSON.stringify(payload.featuredProducts));
            formData.append("slideImageIndexes", JSON.stringify(payload.slideImageIndexes));
            formData.append("featuredProductImageIndexes", JSON.stringify(payload.featuredProductImageIndexes));

            payload.slideImages.forEach((file) => {
                formData.append("slideImages", file);
            });

            payload.featuredProductImages.forEach((file) => {
                formData.append("featuredProductImages", file);
            });

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hero`, {
                method: "PUT",
                headers : {
                    Authorization : `Bearer ${token}`
                },
                body: formData,
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating hero");
            }

            setHero(data.data);
            return true;

        }catch(err){
            console.error(err);
            return false;
        }finally{
            setUpdatingHero(false);
        }
    }


    useEffect(()=>{
        getHero();
    }, []);

    return <HeroContext.Provider value={{
        hero,
        loadingHero,
        getHero,

        creatingHero,
        createHero,

        updatingHero,
        updateHero,
    }}>
        {children}
    </HeroContext.Provider>

}


export const useHeroContext = () => {

    const context = useContext(HeroContext);

    if(!context){
        throw new Error("Please use the useHeroContext hook inside the HeroProvider");
    }

    return context;
}