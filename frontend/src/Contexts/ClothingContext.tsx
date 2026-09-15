import { createContext, useContext, useEffect, useState } from "react";
import type { Clothing, ClothingFilterType, Variant } from "../Types/Types";


interface ClothingContextType{

    clothes : Clothing[];
    loadingClothes : boolean;
    getClothes : ()=>Promise<void>;
    filterClothes : ClothingFilterType;
    setFilterClothes : (f : ClothingFilterType)=>void;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    total: number;
    totalPages: number;

    clothDetails : Clothing | null;
    variants : Variant[] | null;
    getCloth : (id : string)=>Promise<void>;
    loadingGetCloth : boolean;

    totalClothes : number;
}

const ClothingContext = createContext<ClothingContextType | null>(null);

export const ClothingProvider = ({children} : {children : React.ReactNode}) => {

    const [clothes, setClothes] = useState<Clothing[]>([]);
    const [loadingClothes, setLoadingClothes] = useState<boolean>(false);
    const [filterClothes, setFilterClothes] = useState<ClothingFilterType>(()=>{
        const saved = localStorage.getItem("filterClothes");

        return saved ? JSON.parse(saved) : {
                gender : "",
                category: "",
                minPrice : 0,
                maxPrice : 0,
                search : "",
                discount : "",
        }
    });

    useEffect(()=>{
        localStorage.setItem('filterClothes', JSON.stringify(filterClothes));
    }, [filterClothes]);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [clothDetails, setClothDetails] = useState<Clothing | null>(null);
    const [variants, setVariants] = useState<Variant[] | null>(null);
    const [loadingGetCloth, setLoadingGetCloth] = useState<boolean>(false);

    const [totalClothes, setTotalClothes] = useState<number>(0);

    const getClothes = async() => {
        try{

            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if(filterClothes.category && filterClothes.category !== ""){
               params.append("category", filterClothes.category.trim());
            }

            if(filterClothes.gender && filterClothes.gender !== ""){
                params.append("gender", filterClothes.gender);
            }

            if(filterClothes.minPrice && filterClothes.minPrice >= 0){
                params.append("minPrice", filterClothes.minPrice.toString());
            }

            if(filterClothes.maxPrice && filterClothes.maxPrice > filterClothes.minPrice){
                params.append("maxPrice", filterClothes.maxPrice.toString());
            }

            if(filterClothes.search && filterClothes.search !== ""){
                params.append("search", filterClothes.search.trim());
            }

            if(filterClothes.discount && filterClothes.discount !== ""){
                params.append("discount", filterClothes.discount.trim());
            }

            if(filterClothes.sort && filterClothes.sort !== ""){
                params.append("sort", filterClothes.sort.trim());
            }

            setLoadingClothes(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/clothing?${params.toString()}`,{
                method : "GET",
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting clothes");
            }

            setClothes(data.data);
            console.log("Clothes : ", data.data)
            setTotal(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
            setTotalClothes(data.totalClothes);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingClothes(false);
        }
    }

    const getCloth = async(id : string) => {

        try{

            setLoadingGetCloth(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/clothing/${id}`,{
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting cloth");
            }

            setClothDetails(data.data.cloth);
            setVariants(data.data.variants);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingGetCloth(false);
        }
    }
    

    useEffect(()=>{
        getClothes();
    }, [filterClothes, page, limit]);
    

    return <ClothingContext.Provider value={{
    clothes,
    loadingClothes,
    getClothes,
    filterClothes,
    setFilterClothes,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,

    clothDetails,
    variants,
    getCloth,
    loadingGetCloth,
    totalClothes
    }}>
        {children}
    </ClothingContext.Provider>

}


export const useClothingContext = () => {

    const context = useContext(ClothingContext);

    if(!context){
        throw new Error("Please use the useClothingContext hook inside the ClothingProvider");
    }

    return context;
}