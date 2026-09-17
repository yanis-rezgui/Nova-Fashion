import { Route, Routes } from "react-router-dom"
import Header from "./components/BaseComponents/Header"
import Home from "./Pages/Home"
import { ClothingProvider } from "./Contexts/ClothingContext"
import Boutique from "./Pages/Boutique"
import { CategoriesProvider } from "./Contexts/CategoriesContext"
import { FavoritesProvider } from "./Contexts/FavoritesContext"
import { CartProvider } from "./Contexts/CartContext"
import ClothDetails from "./Pages/ClothDetails"
import Cart from "./Pages/Cart"
import Order from "./Pages/Order"
import { OrderProvider } from "./Contexts/OrderContext"
import Favoris from "./Pages/Favoris"


function App() {
 

  return (
    <>
       <ClothingProvider>
        <CategoriesProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrderProvider>
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

          <Route path="/clothDetails/:id" element={
            <>
            <Header/>
            <ClothDetails/>
            </>
          }/>

          <Route path="/panier" element={
            <>
              <Header/>
              <Cart/>
            </>
          }/>

          <Route path="/order" element={
            <>
               <Header/>
               <Order/>
            </>
          }/>

          <Route path="/favoris" element={
            <>
              <Header/>
              <Favoris/>
            </>
          }/>
       </Routes>
       </OrderProvider>
       </CartProvider>
       </FavoritesProvider>
       </CategoriesProvider>
       </ClothingProvider>
    </>
  )
}

export default App
