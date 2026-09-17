import { Route, Routes } from "react-router-dom"
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
import { AuthProvider } from "./Contexts/AuthContext"
import PublicRoute from "./Layouts/PublicRoute"
import PublicLayout from "./Layouts/PublicLayout"
import Login from "./Pages/Login"
import AdminRoute from "./Layouts/AdminRoute"
import AdminLayout from "./Layouts/AdminLayout"
import Dashboard from "./AdminPages/Dashboard"
import Clothes from "./AdminPages/Clothes"
import { AdminClothingProvider } from "./AdminContexts/AdminClothingContext"
import ClothAdminDetails from "./AdminPages/ClothAdminDetails"


function App() {
 

  return (
    <>
       <ClothingProvider>
        <CategoriesProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrderProvider>
                <AuthProvider>
                  <AdminClothingProvider>

       <Routes>

        <Route element={
          <PublicRoute>
            <PublicLayout/>
          </PublicRoute>
        }>

        
        
          <Route path="/" element={
            <>
             
              <Home/>
            </>
          }/>
          
          <Route path="/boutique" element={
            <>
             
              <Boutique/>
            </>
          }/>

          <Route path="/clothDetails/:id" element={
            <>
           
            <ClothDetails/>
            </>
          }/>

          <Route path="/panier" element={
            <>
             
              <Cart/>
            </>
          }/>

          <Route path="/order" element={
            <>
              
               <Order/>
            </>
          }/>

          <Route path="/favoris" element={
            <>
             
              <Favoris/>
            </>
          }/>

          <Route path="/login" element={
            <Login/>
          }/>

          </Route>

          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout/>
            </AdminRoute>
          }>
              <Route path="dashboard" element={
                <Dashboard/>
              }/>

              <Route path="clothes" element={<Clothes/>}/>
              <Route path="cloth/:id" element={<ClothAdminDetails/>}/>
          </Route>
       </Routes>
       </AdminClothingProvider>
       </AuthProvider>
       </OrderProvider>
       </CartProvider>
       </FavoritesProvider>
       </CategoriesProvider>
       </ClothingProvider>
    </>
  )
}

export default App
