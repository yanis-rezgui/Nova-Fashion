import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../Types/Types";


interface AuthContextType{
    user : User | null;
    setUser : (u : User | null)=>void;
    token : string | null;
    signIn : (email : string, password : string)=>Promise<void>;
    loadingSignIn : boolean;
    msg : string | null;
    signOut : ()=>Promise<void>;
    loadingSignOut : boolean;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {

    const [user, setUser] = useState<User | null>(()=>{
        const saved = localStorage.getItem('user');

        return saved ? JSON.parse(saved) : null;
    });

    const [msg, setMsg] = useState<string | null>(null);

    const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false);
    const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);

    const [token, setToken] = useState<string | null>(()=>{
        const saved = localStorage.getItem('token');

        return saved ? JSON.parse(saved) : null;
    })

    useEffect(()=>{
        localStorage.setItem('token', JSON.stringify(token));
    }, [token]);

    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const signIn = async(email : string, password : string) => {

        try{

            setMsg(null)
            setLoadingSignIn(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-in`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({email, password})
            });

            const data = await res.json();

            if(!res.ok){
                setMsg(data.error || data.message || "Error signing in")
                throw new Error(data.error || data.message || "Error signing in")
            }

            console.log("User : ", data.data.user);

            setUser(data.data.user);
            setToken(data.data.token);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSignIn(false);
        }
    }

    const signOut = async() => {

        try{

            setLoadingSignOut(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-out`,{
                method : "POST",
                headers : {
                    "Content-Type" : 'application/json'
                }
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in signing out");
            }

            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');

        }catch(err){
            console.error(err);
        }finally{
            setLoadingSignOut(false);
        }
    }


    

    return <AuthContext.Provider value={{
        user,
        setUser,
        token,
        signIn,
        loadingSignIn,
        msg,
        signOut,
        loadingSignOut
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuthContext = () => {

    const context = useContext(AuthContext);

    if(!context){
        throw new Error("Please use the useAuthContext hook inside the AuthProvider");
    }
    return context;
}