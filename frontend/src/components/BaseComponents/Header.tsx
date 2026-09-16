import { memo, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCartcontext } from "../../Contexts/CartContext";

const Header = () => {

    const location = useLocation();

    const [showNav, setShowNav] = useState<boolean>(false);

    const pages = [
        {
            href : "/",
            name : "Accueil",
        },
        {
            href : "/boutique",
            name : "Boutique",
        },
        {
            href : "/favoris",
            name : "Favoris"
        }
    ]

    const {totalCartItems} = useCartcontext();

    return(

        <>
        
        <header className="flex flex-row justify-between w-full items-center font-['Cormorant Garamond'] fixed
        top-0 h-[80px] bg-[#F7F4EE] text-[#171717] px-4 shadow-2xl z-50
        ">

            <Link to="/" className="text-[2em] font-bold">
                Nova Fashion
            </Link>

            <nav className="flex flex-row items-center gap-5 max-[600px]:hidden">
                <Link to="/" style={{
                    fontSize : location.pathname === "/" ? "19px" : "17px",
                    fontWeight : location.pathname === "/" ? "600" : "500",
                   
                }}>
                   Accueil
                 </Link> 

                <Link to="/boutique" style={{
                    fontSize : location.pathname === "/boutique" ? "19px" : "17px",
                    fontWeight : location.pathname === "/boutique" ? "600" : "500",
                   
                }}>
                   Boutique
                </Link>

                <Link to="/favoris" style={{
                    fontSize : location.pathname === "/favoris" ? "19px" : "17px",
                    fontWeight : location.pathname === "/favoris" ? "600" : "500",
                 
                }}>
                   Favoris
                </Link>

                <Link to="/panier">
                  <div className="relative">
                      <i
                          className={`fa-solid fa-cart-shopping ${
                              location.pathname === "/panier"
                                  ? "text-[30px]"
                                  : "text-[25px]"
                          }`}
                      ></i>

                      <span
                          className="absolute h-[17px] w-[17px] flex justify-center items-center
                          bg-red-600 text-white rounded-full text-[12px] font-bold
                          right-[-5px] top-[-10px]"
                      >
                          {totalCartItems()}
                      </span>
                  </div>
              </Link>
            </nav>

           
                 <div className="hidden max-[600px]:block" onClick={()=>setShowNav(prev => !prev)}>
                <i className="fa-solid fa-bars text-[2em] text-[#171717] cursor-pointer transition-opacity 
                duration-200 hover:opacity-80 active:opacity-60
                "></i>
                </div>
            
        </header>

         {/* Mobile navigation */}
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="
              hidden max-[600px]:flex
              flex-col
              fixed top-[60px] left-0
              w-full
              bg-[#F7F4EE] text-[#171717]
              z-40
              p-5
              gap-1
              shadow-xl
              border-t border-[#cdad7d]/10
            "
          >
            {pages.map((p, index) => {
              const isActive = location.pathname === p.href;

              return (
                <motion.div
                  key={p.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.25 }}
                >
                  <Link
                    to={p.href}
                    onClick={() => setShowNav(false)}
                    className={`
                      flex items-center justify-between
                      cursor-pointer px-3 py-3 rounded-[5px]
                      transition-colors duration-200
                      
                      ${
                        isActive
                          ? "bg-[#171717]/10 text-[#171717] font-semibold"
                          : "text-[#171717] font-medium hover:bg-white/5"
                      }
                    `}
                  >
                    {p.name}
                    {isActive && <span className="w-[6px] h-[6px] rounded-full bg-[#171717]" />}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: pages.length * 0.07, duration: 0.25 }}
              className="mt-2"
            >
              <Link
                to="/panier"
                onClick={() => setShowNav(false)}
                className="
                  flex flex-row gap-4 items-center justify-center
                  bg-[#171717] text-[#F7F4EE]
                  text-[15px] font-[600]
                  px-3 py-3 rounded-[5px]
                "
              >
                <span
                className="text-[18px]"
                >Panier</span> <i className="fa-solid fa-cart-shopping text-[1.3em]"></i>
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      </>
    )
}

export default memo(Header);