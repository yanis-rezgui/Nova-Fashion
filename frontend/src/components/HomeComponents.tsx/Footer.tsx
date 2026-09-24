import { memo } from "react"
import { Link } from "react-router-dom";
import { useSettingsContext } from "../../Contexts/SettingsContext";




const Footer = () => {

       const pages = [
    {
      name: "Accueil",
      href: "/",
    },
    {
      name: "Boutique",
      href: "/boutique",
    },
    {
      name: "Favoris",
      href: "/favoris",
    },
    {
      name: "Panier",
      href: "/panier",
    }
  ];

  const {settings} = useSettingsContext();

    return(
        <section className="flex flex-col w-full bg-[#171717] text-gray-100">
            
                <div className="flex flex-row w-full items-baseline justify-between  gap-5 py-10 px-10
            max-[1100px]:flex-col max-[1100px]:items-center max-[1100px]:gap-10
            ">

                <div className="flex flex-col gap-1 items-baseline 
                max-[1100px]:items-center
                ">
                    <h2 className="text-[2em] font-bold text-[#B89B72]">
                        NOVA FASHION
                    </h2>
                    
                    <img src="NOVA.png"
                    className="w-[150px] h-[150px] object-cover"
                    alt="" />

                    <p className="w-[270px] text-[15px] leading-5.5 max-[1100px]:text-center">
                        Votre style mérite des pièces qui vous ressemblent,

avec élégance, confort et simplicité. Nous sélectionnons

des vêtements pensés pour accompagner votre quotidien,

et vous permettre d’exprimer pleinement votre personnalité.
                    </p>
                    <div className="flex flex-row gap-5 mt-3 items-center">
                         {settings?.socialLinks.map((s)=>{
                            return(
                                <a href={s.url}>
                                    <i className={`fa-brands fa-${s.name.toLocaleLowerCase()} text-[2em] cursor-pointer 
                                    transition-transform duration-200 hover:scale-110
                                    `}></i>
                                </a>
                            )
                         })}
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <p className="text-[1.4em] font-bold">
                        Navigation
                    </p>

                    <div className="flex flex-col items-center gap-2 text-[16px]">
                        {pages.map((p)=>{
                            return(
                                <Link to={p.href}
                                
                                >{p.name}</Link>
                            )
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <p className="text-[1.4em] font-bold">
                        Contact
                    </p>

                    <div className="flex flex-col items-center gap-2">
                       
                                <div className="flex flex-row items-center gap-2">
                                    <i className="fa-solid fa-phone text-[1.3em]"></i>
                                    <p>{settings?.contact.phone}</p>
                                </div>
                          

                        <div className="flex flex-row items-center gap-2">
                            <i className="fa-solid fa-envelope text-[1.3em]"></i>
                            <p>{settings?.contact.email}</p>
                        </div>

                       

                        
                    </div>
                </div>


                <div className="flex flex-col gap-3 items-center" >
                    <p className="text-[1.4em] font-bold">
                        Légale
                    </p>

                    <div className="flex flex-col items-center gap-2">
                        <Link to="/privacy">Politique de confidentialité</Link>
                        <Link to="/mentions">Mentions légales</Link>
                    </div>
                </div> 


            </div>

            <div className="w-full  text-white flex flex-row items-center justify-between p-2 border-t
          border-t-gray-300 text-[15px] max-[600px]:flex-col max-[600px]:gap-2
          ">
            <p>
                &copy; 2026 <span className="text-[#B89B72] font-bold">NOVA FASHION</span>. Tous droits réservés.
            </p>

            <p>
                Site conçu et développé par <a  href="https://www.linkedin.com/in/yanis-rezgui/" target="_blank" className="underline">Yanis.</a>
            </p>
          </div>
        </section>
    )
}


export default memo(Footer);