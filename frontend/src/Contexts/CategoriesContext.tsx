import { createContext, useContext, useEffect, useState } from "react";
import type { Category } from "../Types/Types";



interface CategoriesContextType{
    categories : Category[];
    loadingCategories : boolean;
    getCategories : ()=>Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export const CategoriesProvider = ({children} : {children : React.ReactNode}) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

    const getCategories = async() => {

        try{
            setLoadingCategories(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories/`,{
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getching categories");
            }

            setCategories(data.data);
            console.log("Categories : ", data.data);

        }catch(err){
            console.error(err);
        }finally{
            setLoadingCategories(false);
        }
    }

    useEffect(()=>{
        getCategories()
    }, []);

    return <CategoriesContext.Provider value={{
        categories,
        loadingCategories,
        getCategories
    }}>
        {children}
    </CategoriesContext.Provider>
}

export const useCategoriesContext = () => {

    const context = useContext(CategoriesContext);

    if(!context){
        throw new Error("Please use the useCategoriesContext inside the CategoriesProvider");
    }

    return context;
}