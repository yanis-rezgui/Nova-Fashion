
import  { memo, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Bell, BrickWallShield, ChartBarBig, Cog, LogOut, MessageSquareQuote, Package, Shirt, Tags, User } from "lucide-react";
import { useAuthContext } from "../Contexts/AuthContext";


const AdminHeader = () => {

     const [showSide, setShowSide] = useState<boolean>(()=>{
        const saved = localStorage.getItem('showSide');

        return saved ? JSON.parse(saved) : false;
    });

    const {signOut} = useAuthContext();
    

    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.setItem('showSide', JSON.stringify(showSide));
    }, [showSide]);

    


    return(
        <>
        <header className="w-full flex flex-row items-center px-5 h-[60px] w-full bg-[#F7F4EE]
         text-[#171717] fixed top-0 z-50 shadow-2xl">
            
            <div className="flex flex-row gap-5 items-center max-[600px]:gap-3">
               <div 
               onClick={()=>setShowSide(prev => !prev)}
               className="text-[1.8em]  max-[600px]:text-[1.5em] font-bold cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60">
                &#9776;</div>
               <div className="text-[1.2em] max-[600px]:text-[1.2em] font-bold flex flex-row items-center gap-2">
                Nova Fashion Panneau Admin <BrickWallShield size={27}/>
                </div>
            </div>



        </header>

 
          <AnimatePresence>
          {showSide &&
           

           <motion.nav
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -250, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
           
           className="flex flex-col  h-[calc(100%-60px)]  bg-white shadow-2xl z-50 fixed left-0 w-[250px] mt-[60px]">
 
              <div className="flex flex-col gap-1 p-3 border-b border-b-gray-300">
                
                <div className="flex flex-row gap-3 text-[1.6em] text-[#171717] items-center font-bold
                
                ">
                Nova Fashion
                </div>

                

                 <div className="text-[14px] font-sans text-gray-600 leading-5 p-2">
                    Gérez facilement l’ensemble de votre boutique Nova Fashion depuis cet espace. Gérez vos produits et variantes, suivez les commandes, surveillez les stocks et gardez une vue d’ensemble sur l’activité de votre boutique.

                    
                </div>
              </div>

              <nav className="overflow-y-auto space-y-1 h-[150px] border-b border-b-gray-300 text-[#222344]">
                <h3 className="text-[15px] text-[#222344] font-semibold p-2">MENU PRINCIPALE</h3>
                  <div className="flex flex-col gap-0">
                    <div
                    onClick={()=>navigate('/admin/dashboard')}
                    style={{backgroundColor : location.pathname === "/admin/dashboard" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/dashboard" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[16px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <ChartBarBig size={25}/>
                        <p>Dashboard</p>
                    </div>


                     <div
                    onClick={()=>navigate('/admin/notifications')}
                    style={{backgroundColor : location.pathname === "/admin/notifications" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/notifications" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[16px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <Bell size={25}/>
                        <p>Notifications</p>
                    </div>

                    <div
                    onClick={()=>navigate('/admin/clothes')}
                    style={{backgroundColor : location.pathname === "/admin/clothes" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/clothes" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[16px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <Shirt size={25}/>
                        <p>Vos Vétements</p>
                    </div>

                     <div
                    onClick={()=>navigate('/admin/orders')}
                    style={{backgroundColor : location.pathname === "/admin/orders" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/orders" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[16px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <Package size={25}/>
                        <p>Commandes</p>
                    </div>

                    <div
                    onClick={()=>navigate('/admin/categories')}
                    style={{backgroundColor : location.pathname === "/admin/categories" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/categories" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[16px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <Tags size={25}/>
                        <p>Categories</p>
                    </div>


                    <div
                    onClick={()=>navigate('/admin/testimonials')}
                    style={{backgroundColor : location.pathname === "/admin/testimonials" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/testimonials" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[16px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <MessageSquareQuote size={25}/>
                        <p>Avis Clients</p>
                    </div>





                  </div>
              </nav>
 
               <div className="flex flex-col w-full">
                <h3 className="text-[15px] text-gray-800 font-semibold p-2">PARAMETRES</h3>
 
                  <div className="flex flex-col gap-0 mt-2">

                    <div
                    onClick={()=>navigate('/admin/general')}
                    style={{backgroundColor : location.pathname === "/admin/general" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/general" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[17px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <Cog size={25}/>
                        <p>Général</p>
                    </div>
                    <div
                    onClick={()=>navigate('/admin/profile')}
                    style={{backgroundColor : location.pathname === "/admin/profile" ? "#f3f4f6" : "",
                           fontWeight : location.pathname === "/admin/profile" ? "600" : "400"
                     }}
                    className="p-3 flex flex-row items-center gap-2 text-[17px] transition-all duration-200 hover:bg-gray-100 cursor-pointer">
                        <User size={25}/>
                        <p>Profile</p>
                    </div>

                    <div
                    onClick={signOut}
                    className="p-3 flex flex-row items-center gap-2 text-red-600 text-[17px] transition-all duration-200 hover:bg-red-400/20 cursor-pointer">
                        <LogOut size={25}/>
                        <p>Déconnexion</p>
                    </div>
                  </div>
               </div>
              


           </motion.nav>
          }

          </AnimatePresence>
        </>
    )
}


export default memo(AdminHeader);