import { Outlet } from "react-router-dom"
import  { memo } from "react"
import Header from "../components/BaseComponents/Header";
import Footer from "../components/HomeComponents.tsx/Footer";


const PublicLayout = () => {


    return(
        <>
          <Header/>

          <main className="pt-[80px]  w-full">
            <Outlet/>
          </main>
          <Footer/>
        </>
    ) 
}


export default memo(PublicLayout);