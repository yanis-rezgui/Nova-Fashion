import  { memo, useState } from "react"
import { useAuthContext } from "../Contexts/AuthContext";




const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const {msg, signIn, loadingSignIn} = useAuthContext();

    const handleSignIn = async()  => {

        if(!email || email.trim() === ""){
            return;
        }

        if(!password || password.trim() === ""){
            return;
        }

        await signIn(email, password);
    }

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">

             <div className="bg-white w-[500px] rounded-[10px] shadow-2xl mt-15
             flex flex-col justify-center items-center p-5
             ">
               <h2
               className="text-[2em] font-bold"
               >Nova Fashion</h2>

               <p className="mt-3 text-[16px] text-center leading-5">
                Connectez-vous au panneau administrateur pour gerer votre boutique
               </p>

               <div className="flex flex-col gap-3 mt-4 w-full">
                  <div className="flex flex-col gap-1">
                    <p className="text-[1em] font-[600]">
                        Email
                    </p>
                    <input type="email" 
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded-[5px] bg-gray-50 text-[15px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[1em] font-[600]">
                        Password
                    </p>
                    <input type="password" 
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded-[5px] bg-gray-50 text-[15px]"
                    />
                  </div>
               </div>

               <div className="h-[30px] w-full flex justify-center items-center">
                  {msg && <p className="text-[15px]">
                       {msg}
                    </p>}
               </div>

               <button className="bg-[#B89B72] py-2 text-white font-bold border-0 mt-3
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 px-4
           w-full
           "
           onClick={handleSignIn}
           >
                {loadingSignIn ? "Connéxion..." : "Connectez-vous"}
               </button>
             </div>
        </section>
    )
}


export default memo(Login);