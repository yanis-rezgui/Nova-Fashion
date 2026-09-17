import  { memo } from "react"
import { Outlet } from "react-router-dom"
import AdminHeader from "../AdminComponents/AdminHeader";




const AdminLayout = () => {

    return(
        <>
          <AdminHeader/>
         
          <main className="w-full pt-[60px]">
            <Outlet/>
          </main>
        </>
    );
} 

export default memo(AdminLayout); 