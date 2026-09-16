import { memo } from "react"
import CartItems from "../components/CartComponents/CartItems";
import CartTotal from "../components/CartComponents/CartTotal";
import BonReducation from "../components/CartComponents/BonReducation";
import AideCommande from "../components/CartComponents/AideCommande";
import { useCartcontext } from "../Contexts/CartContext";
import ResetCartPop from "../components/CartComponents/ResetCartPop";
import { Link } from "react-router-dom";



const Cart = () => {

    const {setResetCartPop, resetCartPop, cart} = useCartcontext();
    

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">

          {cart.length === 0 ?
          
             <>
             <h3 className="font-bold text-[2em] mt-10">Panier</h3>
            <div className="flex flex-col justify-center items-center w-[900px]
            bg-white shadow-2xl py-10 mt-5 gap-3 max-[950px]:w-[600px]
            max-[650px]:w-[300px]
            ">
                 <h3 className="text-[1.5em] text-center">VOTRE PANIER EST TRISTEMENT <strong>VIDE</strong></h3>
                 <p className="text-[2.5em] font-black">
                    :-)
                 </p>
                 <p className="text-[1.2em] text-center">
                    Il est peut-être temps de trouver votre prochaine pièce préférée ?
                 </p>
                 <Link to="/boutique" className="bg-[#B89B72] py-2 text-white font-bold border-0 mt-3
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 px-4">
                    Trouvez vos vétement!
                 </Link>

            </div>
            </>
            :
           
           <>
          <div className="mt-15 flex flex-col gap-2 mb-10">
            <h1 className="text-[1.3em] font-bold
            max-[1000px]:text-center
            ">Récapitulatif de mon panier</h1>
            <div className="flex flex-row items-start gap-5 max-[1000px]:flex-col max-[1000px]:items-center">
            <CartItems/>
            <div className="flex flex-col gap-5">
                <CartTotal/>
                <BonReducation/>
                <AideCommande/>
            </div>
            </div>

          </div>

          <button className="flex flex-row justify-center items-center gap-2
          bg-[#B89B72] text-white border-0 rounded-full py-3 px-5
          text-[15px] font-[600] fixed bottom-3 right-1 cursor-pointer
          "
          onClick={()=>setResetCartPop(true)}
          >
            Reinitialiser le panier <i className="fa-solid fa-arrows-rotate text-[17px]"></i>
          </button>

          {resetCartPop && <ResetCartPop setShowDeletePop={setResetCartPop}/>}
          </>
}
        </section>
    )
}

export default memo(Cart);