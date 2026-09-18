import { createContext, useContext, useEffect, useState } from "react";
import type { Testimonial } from "../Types/Types";
import { useAuthContext } from "../Contexts/AuthContext";



interface AdminTestimonialsContextType{

    testimonials : Testimonial[];
    activeTestimonials : Testimonial[];
    inactiveTestimonials : Testimonial[];
    loadingTestimonials : boolean;
    getTestimonials : ()=>Promise<void>;

    addTestimonial : (fullName : string, message : string, rating : number, active : boolean)=>Promise<void>;
    loadingAddTestimonial : boolean;
    showAddTestimonialPop : boolean;
    setShowAddTestimonialPop : (b : boolean)=>void;

        updateTestimonial : (id : string,fullName : string, message : string, rating : number, active : boolean)=>Promise<void>;
    loadingUpdateTestimonial : boolean;
    showUpdateTestimonialPop : boolean;
    setShowUpdateTestimonialPop : (b : boolean)=>void;
    testimonialDetails : Testimonial | null;
    setTestimonialDetails : (t : Testimonial | null)=>void;


            deleteTestimonial : (id : string)=>Promise<void>;
    loadingDeleteTestimonial : boolean;
    showDeleteTestimonialPop : boolean;
    setShowDeleteTestimonialPop : (b : boolean)=>void;

    loadingActiveTestimonials : boolean;
    getActiveTestimonials : ()=>Promise<void>;
    



}


const AdminTestimonialsContext = createContext<AdminTestimonialsContextType | null>(null);

export const AdminTestimonialsProvider = ({children} : {children : React.ReactNode}) => {

    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [activeTestimonials, setActiveTestimonials] = useState<Testimonial[]>([]);
    const [inactiveTestimonials, setInactiveTestimonials] = useState<Testimonial[]>([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState<boolean>(false);
                                                                                         
    const [loadingActiveTestimonials, setLoadingActiveTestimonials] = useState<boolean>(false);
    

    const [testimonialDetails, setTestimonialDetails] = useState<Testimonial | null>(()=>{
        const saved = localStorage.getItem('testimonialDetails');

        return saved ? JSON.parse(saved) : null
    });

    useEffect(()=>{
        localStorage.setItem('testimonialDetails', JSON.stringify(testimonialDetails));
    }, []);

    const [loadingAddTestimonial, setLoadingAddTestimonial] = useState<boolean>(false);
    const [showAddTestimonialPop, setShowAddTestimonialPop] = useState<boolean>(false);

        const [loadingUpdateTestimonial, setLoadingUpdateTestimonial] = useState<boolean>(false);
    const [showUpdateTestimonialPop, setShowUpdateTestimonialPop] = useState<boolean>(false);

            const [loadingDeleteTestimonial, setLoadingDeleteTestimonial] = useState<boolean>(false);
    const [showDeleteTestimonialPop, setShowDeleteTestimonialPop] = useState<boolean>(false);

    const {token} = useAuthContext();

    const getTestimonials = async() => {

        setLoadingTestimonials(true);
        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/testimonials/`, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                }
            });

            const data = await res.json();
            
            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting all testimonials");

            }

            setTestimonials(data.data.testimonials);
            setActiveTestimonials(data.data.activeTestimonials);
            setInactiveTestimonials(data.data.inactiveTestimonials);

            console.log(data.data.testimonials, data.data.activeTestimonials, data.data.inactiveTestimonials)

        }catch(err){
            console.error(err);
        }finally{
            setLoadingTestimonials(false);
        }
    }


    const addTestimonial = async(fullName : string, message : string, rating : number, active : boolean) =>{

        setLoadingAddTestimonial(true);
        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/testimonials/`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({fullName,message,rating,active})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in adding testimonial");
            }

            await getTestimonials();
            setShowAddTestimonialPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingAddTestimonial(false);
        }
    }


        const updateTestimonial = async(id : string,fullName : string, message : string, rating : number, active : boolean) =>{

        setLoadingUpdateTestimonial(true);
        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/testimonials/${id}`, {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({fullName,message,rating,active})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in adding testimonial");
            }

            await getTestimonials();
            setShowUpdateTestimonialPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdateTestimonial(false);
        }
    }


            const deleteTestimonial = async(id : string) =>{

        setLoadingDeleteTestimonial(true);
        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/testimonials/${id}`, {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
               
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in adding testimonial");
            }

            await getTestimonials();
            setShowDeleteTestimonialPop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingDeleteTestimonial(false);
        }
    }


    const getActiveTestimonials = async() => {
        setLoadingActiveTestimonials(true);
           try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/testimonials/active`, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                   
                }
            });

            const data = await res.json();
            
            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting all testimonials");

            }

        

            console.log(data.data);
            setActiveTestimonials(data.data);

        }catch(err){
            console.error(err);
        }finally{
            setLoadingActiveTestimonials(false);
        }
    }

    useEffect(()=>{
       if(token) getTestimonials();
    }, []);

    useEffect(()=>{
        getActiveTestimonials();
    }, []);



    return <AdminTestimonialsContext.Provider value={{
            testimonials,
    activeTestimonials,
    inactiveTestimonials,
    loadingTestimonials ,
    getTestimonials,
        addTestimonial,
    loadingAddTestimonial,
    showAddTestimonialPop,
    setShowAddTestimonialPop,

            updateTestimonial,
    loadingUpdateTestimonial,
    showUpdateTestimonialPop,
    setShowUpdateTestimonialPop,

                deleteTestimonial,
    loadingDeleteTestimonial,
    showDeleteTestimonialPop ,
    setShowDeleteTestimonialPop,
    testimonialDetails,
    setTestimonialDetails,


       loadingActiveTestimonials,
    getActiveTestimonials,

    }}>
        {children}
    </AdminTestimonialsContext.Provider>
}


export const useAdminTestimonialsContext = () => {

    const context = useContext(AdminTestimonialsContext);

    if(!context){
        throw new Error("Error please use the useAdminTestimonialsContext inside a AdminTestimonialsProvider ");
    }

    return context;
}