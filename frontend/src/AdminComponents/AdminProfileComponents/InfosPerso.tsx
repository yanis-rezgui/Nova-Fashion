import { memo, useState } from "react";
import { useAuthContext } from "../../Contexts/AuthContext"
import { useAdminUsersContext } from "../../AdminContexts/AdminUsersContext";


const InfosPerso = () => {

    const {user} = useAuthContext();
    const [firstName, setFirstName] = useState<string>(user!.firstName)
    const [lastName, setLastName] = useState<string>(user!.lastName)
    const [email, setEmail] = useState<string>(user!.email);

    const {loadingUpdateUser, updateUser} = useAdminUsersContext();

    const [modifier, setModifier] = useState<boolean>(false);

    const handleModify = async() => {
         
        if(!firstName || firstName.trim() === "") return;
        if(!lastName || lastName.trim() === "") return;
        if(!email || email.trim() === "") return;

        await updateUser(firstName, lastName, email);
        setModifier(false)
    }

    return(
        <div className="flex flex-col bg-white w-[800px] mt-10 border
        border-gray-300 rounded-[10px] max-[850px]:w-[600px]
        max-[650px]:w-[300px]
        ">

            <div className="flex flex-col gap-2 p-3 border-b border-b-gray-300">
                <h1 className="font-bold text-[1.1em]">
                    Informations personnelles
                </h1>
                <p className="text-[15px] text-gray-700">
                    Modifiez les informations associées à votre compte.
                </p>
            </div>

            <div className="p-3 flex flex-col gap-3">
                
                <div className="w-full flex flex-col gap-1">
                    <p className="text-[15px] font-bold">
                        Prénom
                    </p>
                    <input 
                    type="text" 
                    value={firstName}
                    onChange={(e)=>setFirstName(e.target.value)}
                    className="border border-gray-300 p-2 text-[15px] bg-gray-50 rounded-[5px]"
                    disabled={!modifier}
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <p className="text-[15px] font-bold">
                        Nom
                    </p>
                    <input 
                    type="text" 
                    value={lastName}
                    onChange={(e)=>setLastName(e.target.value)}
                     className="border border-gray-300 p-2 text-[15px] bg-gray-50 rounded-[5px]"
                     disabled={!modifier}
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <p className="text-[15px] font-bold">
                        Email
                    </p>
                    <input 
                    type="text" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
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
                        disabled={loadingUpdateUser}
                        onClick={handleModify}
                        className="bg-[#B89B72] text-white text-[14px] font-[600] px-2 py-2 rounded-[5px]
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    max-[650px]:w-full
                    "
                        >
                            {loadingUpdateUser ? "Enregistrement..." : "Enregistrer les modifications"}
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

export default memo(InfosPerso);