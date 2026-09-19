import { memo } from "react"
import { useAuthContext } from "../Contexts/AuthContext";
import InfosPerso from "../AdminComponents/AdminProfileComponents/InfosPerso";
import Security from "../AdminComponents/AdminProfileComponents/Security";


const AdminProfile = () => {

    const {user} = useAuthContext();

    return(
        <section className="min-h-screen flex flex-col w-full items-center bg-[#F7F4EE]">

            <h1 className="text-[2em] font-bold mt-10">
                Profil
            </h1>

            <p className="text-[17px] px-5 text-center">
                Gérez les informations de votre compte administrateur
                et vos paramètres de sécurité.
            </p>

            <InfosPerso/>
            <Security/>
        </section>
    )
}

export default memo(AdminProfile);