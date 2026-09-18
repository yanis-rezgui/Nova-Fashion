import { createContext, useContext, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { useCategoriesContext } from "../Contexts/CategoriesContext";
import type { Category } from "../Types/Types";


interface AdminCategoriesContextType{

    showCreateCategoryPop : boolean;
    setShowCreateCategoryPop : (b : boolean)=>void;
    loadingCreateCategory: boolean;
    createCategory : (formData: FormData)=>Promise<void>;


    showUpdateCategoryPop : boolean;
    setShowUpdateCategoryPop : (b : boolean)=>void;
    loadingUpdateCategory: boolean;
    updateCategory : (id : string,formData: FormData)=>Promise<void>;


    showDeleteCategoryPop : boolean;
    setShowDeleteCategoryPop : (b : boolean)=>void;
    loadingDeleteCategory: boolean;
    deleteCategory : (id : string)=>Promise<void>;

    categoryDetails: Category | null;
    setCategoryDetails : (c : Category | null)=>void;


}

const AdminCategoriesContext = createContext<AdminCategoriesContextType | null>(null);

export const AdminCategoriesProvider = ({children} : {children : React.ReactNode}) => {

    const [showCreateCategoryPop, setShowCreateCategoryPop] = useState<boolean>(false);
    const [loadingCreateCategory, setLoadingCreateCategory] = useState<boolean>(false);
    const {token} = useAuthContext();
    const {getCategories} = useCategoriesContext();

    const [showUpdateCategoryPop, setShowUpdateCategoryPop] = useState<boolean>(false);
    const [loadingUpdateCategory, setLoadingUpdateCategory] = useState<boolean>(false);

    const [showDeleteCategoryPop, setShowDeleteCategoryPop] = useState<boolean>(false);
    const [loadingDeleteCategory, setLoadingDeleteCategory] = useState<boolean>(false);

    const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);

    const createCategory = async(formData : FormData) => {

        try{

            setLoadingCreateCategory(true);
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories/`,{
                method: "POST",
                headers : {
                   Authorization : `Bearer ${token}`
                },
                body:formData
            }
            );

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in creating category");
            }

            await getCategories();
            setShowCreateCategoryPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingCreateCategory(false);
        }
    }


        const updateCategory = async(id : string,formData : FormData) => {

        try{

            setLoadingUpdateCategory(true);
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`,{
                method: "PUT",
                headers : {
                   Authorization : `Bearer ${token}`
                },
                body:formData
            }
            );

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating category");
            }

            await getCategories();
            setShowUpdateCategoryPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdateCategory(false);
        }
    }




    const deleteCategory = async(id : string) => {

        try{

            setLoadingDeleteCategory(true);
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`,{
                method: "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                   Authorization : `Bearer ${token}`
                },
            
            }
            );

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating category");
            }

            await getCategories();
            setShowDeleteCategoryPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingDeleteCategory(false);
        }
    }

    return <AdminCategoriesContext.Provider value={{
            showCreateCategoryPop,
    setShowCreateCategoryPop ,
    loadingCreateCategory,
    createCategory,

    showUpdateCategoryPop,
    setShowUpdateCategoryPop,
    loadingUpdateCategory,
    updateCategory,

    showDeleteCategoryPop,
    setShowDeleteCategoryPop,
    deleteCategory,
    loadingDeleteCategory,

    categoryDetails,
    setCategoryDetails
    }}>
        {children}
    </AdminCategoriesContext.Provider>
}




export const useAdminCategoriesContext = () => {

    const context = useContext(AdminCategoriesContext);

    if (!context) {
        throw new Error(
            "Please use the useAdminCategoriesContext hook inside the AdminCategoriesProvider"
        );
    }

    return context;
};