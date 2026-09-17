import { Outlet } from "react-router-dom"
import  { memo } from "react"
import Header from "../components/BaseComponents/Header";


const PublicLayout = () => {


    return(
        <>
          <Header/>

          <main className="pt-[80px]  w-full">
            <Outlet/>
          </main>
        
        </>
    ) 
}


export default memo(PublicLayout);