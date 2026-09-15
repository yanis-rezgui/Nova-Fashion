import { Route, Routes } from "react-router-dom"
import Header from "./components/BaseComponents/Header"
import Home from "./Pages/Home"
import { ClothingProvider } from "./Contexts/ClothingContext"
import Boutique from "./Pages/Boutique"
import { CategoriesProvider } from "./Contexts/CategoriesContext"
import { FavoritesProvider } from "./Contexts/FavoritesContext"


function App() {
 

  return (
    <>
       <ClothingProvider>
        <CategoriesProvider>
          <FavoritesProvider>
       <Routes>
        
          <Route path="/" element={
            <>
              <Header/>
              <Home/>
            </>
          }/>
          
          <Route path="/boutique" element={
            <>
              <Header/>
              <Boutique/>
            </>
          }/>
       </Routes>
       </FavoritesProvider>
       </CategoriesProvider>
       </ClothingProvider>
    </>
  )
}

export default App
