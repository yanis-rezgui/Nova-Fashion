import { memo, useState } from "react"
import { useAdminUsersContext } from "../../AdminContexts/AdminUsersContext";


const Security = () => {


    const [oldPassword, setOldPassword] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");

    const {updatePassword, loadingUpdatePassword} = useAdminUsersContext();


    const [modifier, setModifier] = useState<boolean>(false);

    const handleUpdatePassword = async() => {
        if(!oldPassword || oldPassword.trim() ===""){
            return;
        }

        if(!password1 || password1.trim() === ""){
            return;
        }

        if(!password2 || password2.trim() === ""){
            return;
        }

        await updatePassword(oldPassword, password1, password2);
    }

    return(
                <div className="flex flex-col bg-white w-[800px] mt-10 border
        border-gray-300 rounded-[10px] max-[850px]:w-[600px]
        max-[650px]:w-[300px] mb-10
        ">

            <div className="flex flex-col gap-2 p-3 border-b border-b-gray-300">
                <h1 className="font-bold text-[1.1em]">
                    Sécurité
                </h1>
                <p className="text-[15px] text-gray-700">
                    Modifiez le mot de passe de votre compte administrateur.
                </p>
            </div>

            <div className="p-3 flex flex-col gap-3">
                
                <div className="w-full flex flex-col gap-1">
                    <p className="text-[15px] font-bold">
                        Mot de passe actuel
                    </p>
                    <input 
                    type="text" 
                    placeholder="Mot de passe actuel"
                    value={oldPassword}
                    onChange={(e)=>setOldPassword(e.target.value)}
                    className="border border-gray-300 p-2 text-[15px] bg-gray-50 rounded-[5px]"
                    disabled={!modifier}
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <p className="text-[15px] font-bold">
                        Nouveau mot de passe
                    </p>
                    <input 
                    type="text" 
                    placeholder="Nouveau mot de passe "
                    value={password1}
                    onChange={(e)=>setPassword1(e.target.value)}
                     className="border border-gray-300 p-2 text-[15px] bg-gray-50 rounded-[5px]"
                     disabled={!modifier}
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <p className="text-[15px] font-bold">
                        Confirmer le nouveau mot de passe
                    </p>
                    <input 
                    type="text" 
                    value={password2}
                    placeholder="Confirmer le nouveau mot de passe"
                    onChange={(e)=>setPassword2(e.target.value)}
                     className="border border-gray-300 p-2 text-[15px] bg-gray-50 rounded-[5px]"
                     disabled={!modifier}
                    />
                </div>

                <div className="flex flex-row w-full justify-between mt-2 max-[650px]:flex-col
                max-[650px]:justify-center max-[650px]:items-center
                ">
                    <div></div>
                    {modifier ? 
                     <div className="flex flex-row items-center gap-2 max-[650px]:flex-col
                max-[650px]:justify-center max-[650px]:items-center">
                        <button
                        disabled={loadingUpdatePassword}
                        onClick={handleUpdatePassword}
                        className="bg-[#B89B72] text-white text-[14px] font-[600] px-2 py-2 rounded-[5px]
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    max-[650px]:w-full
                    "
                        >
                            {loadingUpdatePassword ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>

                        <button 
                        className="bg-red-600 text-white text-[14px] font-[600] px-2 py-2 rounded-[5px]
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    max-[650px]:w-full
                    "
                        onClick={()=>setModifier(false)}>
                            Annuler
                        </button>
                     </div>
                     :
                      <button 
                    className="bg-[#B89B72] text-white text-[15px] font-[600] px-4 py-2 rounded-[5px]
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    "
                    onClick={()=>{
                        setModifier(prev => !prev)
                    }}>
                        Modifier
                    </button>
                     }
                   
                </div>
            </div>
        </div>
    )
}


export default memo(Security);