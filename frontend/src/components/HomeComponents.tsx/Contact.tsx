import { memo, useState } from "react"
import { useSettingsContext } from "../../Contexts/SettingsContext";
import {  Mail, Phone } from "lucide-react";




const Contact = () => {

    const {settings} = useSettingsContext();
    const [msg, setMsg] = useState<string | null>(null);

    const handleFormSublit = (e : React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const form = e.currentTarget;

        const formData = new FormData(form);

        const nom = formData.get("nom") as string;
        const email = formData.get("email") as string;
        const sujet = formData.get("sujet") as string;
        const message = formData.get("message") as string;

        if(!nom || !email || !sujet || !message) return;
        setMsg("Merci pour votre message !, Nous vous répondrons dés que possible")

    }

    return(
        <section className="flex flex-col w-full py-10 px-10 bg-gray-100 justify-center items-center gap-2">

          <h1 className="text-[#B89B72] font-semibold text-[2em]">
                       UNE QUESTION ? 
                    </h1>
                    <p className="text-[1.3em] font-bold text-center">
                        Nous sommes à votre écoute
                    </p>
          
            <p className="text-[1em] font-bold text-center">
                Une question sur un produit, une commande ou une livraison ? Envoyez-nous votre message. 
            </p>

            <div className="flex flex-row mt-10 gap-20 max-[800px]:flex-col
            max-[800px]:justify-center max-[800px]:items-center max-[800px]:gap-10
            ">
                <div className="flex flex-col gap-3 items-baseline max-[800px]:justify-center max-[800px]:items-center">
                <p className="text-[1.2em] font-semibold">
                    Parlons de votre besoin
                </p>

                <div className="flex flex-col gap-2 max-[800px]:justify-center max-[800px]:items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <Phone size={20}/>
                        <span>{settings?.contact?.phone}</span>
                    </div>

                     <div className="flex flex-row gap-2 items-center">
                        <Mail size={20}/>
                        <span>{settings?.contact?.email}</span>
                     </div>

                     <div className="flex flex-wrap items-center mt-2 gap-5">
                        {settings?.socialLinks.map((s)=>{
                            return(
                                <a href={s.url} target="_blank">
                                    <i className={`fa-brands fa-${s.name.toLocaleLowerCase()} text-[35px]
                                    transition-transform duration-200 hover:scale-105
                                    `}></i>
                                </a>
                            )
                        })}
                     </div>
                </div>
                </div>

                <form 
                onSubmit={handleFormSublit}
                className="flex flex-col gap-2 bg-white p-3 border-2 border-gray-400 rounded-[10px] w-[400px]"
                >
                    <h1 className="text-center font-semibold text-[1.2em] text-[#B89B72]">
                        Envoyez nous un message
                    </h1>

                    <div className="flex flex-col gap-1 mt-3">
                        <p className="text-[15px] font-[600]">
                            Nom*
                        </p>
                        <input 
                        type="text"
                        name="nom"
                        placeholder="Ex. Hamid Amar"
                        className="border border-gray-400 rounded-[5px] p-2 bg-gray-50 text-[15px]"
                        required
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-[15px] font-[600]">
                            Email*
                        </p>

                        <input type="email"
                        placeholder="Ex . hamid22@gmail.com"
                        name="email"
                        className="border border-gray-400 rounded-[5px] p-2 bg-gray-50 text-[15px]"
                        required
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-[15px] font-[600]">
                            Sujet*
                        </p>
                        <input 
                        type="text" 
                        name="sujet"
                        placeholder="Sujet"
                        className="border border-gray-400 rounded-[5px] p-2 bg-gray-50 text-[15px]"
                        required
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-[15px] font-[600]">
                            Message*
                        </p>

                        <textarea 
                        name="message" 
                        id=""
                        placeholder="Message..."
                        className="border border-gray-400 rounded-[5px] p-2 bg-gray-50 text-[15px]"
                        required
                        />
                    </div>

                    <div className="h-[30px] w-full flex justify-center items-center">
                        {msg && 
                          <p className="font-semibold text-[14px] text-green-700 text-center ">
                            {msg}
                          </p>
                        }
                    </div>

                    <button 
                    type="submit"
                    className="bg-[#B89B72] text-white py-2 rounded-[5px] 
                    cursor-pointer transition-opacity duration-200 hover:opacity-80
                    active:opacity-60 text-[15px] font-semibold
                    ">
                        Envoyer le message
                    </button>
                </form>
            </div>
        </section>
    )
}

export default memo(Contact);