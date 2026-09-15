import { createContext, useContext, useEffect, useState } from "react";
import type { Clothing } from "../Types/Types";


interface FavoritesContextType{
    favoritesIds : string[];
    toggleFavorite : (id : string)=>void;
    favorites : Clothing[];
    loadingFavorites : boolean;
    getFavorites : ()=>Promise<void>;
    isFavorite : (id : string)=>boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({children} : {children : React.ReactNode}) => {

    const [favoritesIds, setFavoritesIds] = useState<string[]>(()=>{
        const saved = localStorage.getItem('favoritesIds');

        return saved ? JSON.parse(saved) : []
    });

    useEffect(()=>{
        localStorage.setItem("favoritesIds", JSON.stringify(favoritesIds));
    } , [favoritesIds]);

    const [loadingFavorites, setLoadingFavorites] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<Clothing[]>([]);

    const toggleFavorite = (id : string) => {

        const exist = favoritesIds.find((f)=>f === id);

        if(exist){
            const newFavorites = favoritesIds.filter((f)=>f !== id);

            setFavoritesIds(newFavorites);
        }else{
           setFavoritesIds([
            ...favoritesIds,
            id
            ]);
        }
    }

    const getFavorites = async() => {

        try{

            setLoadingFavorites(true);
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/favorites/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({favoriteIds : favoritesIds})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Favorites got successfully");
            }

            setFavorites(data.data);
            console.log("Favorites : ", data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingFavorites(false);
        }
    }

    useEffect(()=>{
        getFavorites();
    }, [])

    const isFavorite = (id : string)=>{

        const contain = favoritesIds.find((f)=>f === id);

        if(contain){
            return true;
        }else{
            return false;
        }
    }
    return <FavoritesContext.Provider value={{
    favoritesIds,
    toggleFavorite,
    favorites,
    loadingFavorites,
    getFavorites,
    isFavorite
    }}>
        {children}
    </FavoritesContext.Provider>
    
}


export const useFavoritesContext = () => {

    const context = useContext(FavoritesContext);

    if(!context){
        throw new Error("Please use the useFavoritesContext hook inside the FavoritesProvider");
    }

    return context;
}