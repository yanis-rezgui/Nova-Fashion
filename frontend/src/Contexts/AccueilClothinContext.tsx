import { createContext, useContext, useEffect, useState } from "react";
import type { Clothing } from "../Types/Types";



interface AccueilClothinContextType{

    newClothes : Clothing[];

    getAccueilClothes : ()=>Promise<void>;
    promotions : Clothing[];
    loadingAccueilClothes : boolean;

    getRecommendationClothes : ()=>Promise<void>;
    recommendedClothes : Clothing[];
    loadingRecommendations : boolean;
}


const AccueilClothingContext = createContext<AccueilClothinContextType | null>(null);

export const AccueilClothingProvider = ({children} : {children : React.ReactNode})  => {

    const [newClothes, setNewClothes] = useState<Clothing[]>([]);
    const [promotions, setPromotions] = useState<Clothing[]>([]);
    const [loadingAccueilClothes, setLoadingAccueilClothes] = useState<boolean>(false);
    const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
    const [recommendedClothes, setRecommendedClothes] = useState<Clothing[]>([]);

    const getAccueilClothes = async() => {

        try{

            setLoadingAccueilClothes(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/clothing/accueil`,{
                method : "GET",
                headers : {
                    "Content-Type" : "application/json"
                },
                
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting accueil clothes");
            }

            setNewClothes(data.data.newArrivals);
            setPromotions(data.data.promotions);

        }catch(err){
            console.error(err);
        }finally{
            setLoadingAccueilClothes(false);
        }
    }

    const getRecommendationClothes = async() => {

        try{

            setLoadingRecommendations(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/clothing/recommendations`,{
                method : "GET",
                headers: {
                    "Content-Type" : "application/json"
                },

            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in fetching recommendations");
            }

            setRecommendedClothes(data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingRecommendations(false);
        }
    }

    useEffect(()=>{
        getAccueilClothes();
        getRecommendationClothes();
    }, []);

    return <AccueilClothingContext.Provider value={{
            newClothes,
            getAccueilClothes,
            promotions,
            loadingAccueilClothes,
            recommendedClothes,
            loadingRecommendations,
            getRecommendationClothes
    }}>
        {children}
    </AccueilClothingContext.Provider>
}


export const useAccueilClothingContext = () => {

    const context = useContext(AccueilClothingContext);

    if(!context){
        throw new Error('please use the useAccueilClothingContext hook inside the ContextProvider');
    }

    return context;
}