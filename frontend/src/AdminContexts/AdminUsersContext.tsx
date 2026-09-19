import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";



interface AdminUsersContextType{
    getUser : ()=>Promise<void>;
    loadingGetUser : boolean;

    updateUser : (firstName: string, lastName: string, email : string)=>Promise<void>;
    loadingUpdateUser : boolean;

    updatePassword : (oldPassword: string, password1 : string, password2 : string)=>Promise<void>;
    loadingUpdatePassword : boolean;
}

const AdminUsersContext = createContext<AdminUsersContextType | null>(null);

export const AdminUsersProvider = ({children}: {children : React.ReactNode}) => {


    const [loadingGetUser, setLoadingGetUser] = useState<boolean>(false);
    const [loadingUpdateUser, setLoadingUpdateUser] = useState<boolean>(false);
    const [loadingUpdatePassword, setLoadingUpdatePassword] = useState<boolean>(false);
    const {token, setUser} = useAuthContext();

    const getUser = async() => {

        try{
            setLoadingGetUser(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/`, {
                method : "GET",
                headers : {
                      "Content-Type" : "application/json",
                      Authorization : `Bearer ${token}`
                }
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting user");
            }

            setUser(data.data);
            console.log("User : ", data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingGetUser(false);
        }
    }

    const updateUser = async(firstName : string, lastName : string, email : string) => {

        try{

            setLoadingUpdateUser(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/`,{
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({firstName, lastName, email})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating user");
            }

            await getUser();
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdateUser(false);
        }
    }


    const updatePassword = async(oldPassword : string, password1 : string, password2 : string) => {

        try{

            setLoadingUpdatePassword(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/password`,{
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({oldPassword, password1, password2})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating password")
            }

        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdatePassword(false);
        }
    }

    useEffect(()=>{
       if(token) getUser();
    }, [token]);
    
    return <AdminUsersContext.Provider value={{
        getUser,
        loadingGetUser,
        updateUser,
        loadingUpdateUser,
        updatePassword,
        loadingUpdatePassword
    }}>
        {children}
    </AdminUsersContext.Provider>
}


export const useAdminUsersContext = () => {

    const context = useContext(AdminUsersContext);

    if(!context){
        throw new Error("Please use the useAdminUsersContext inside the AdminUsersProvider");
    }

    return context;
}