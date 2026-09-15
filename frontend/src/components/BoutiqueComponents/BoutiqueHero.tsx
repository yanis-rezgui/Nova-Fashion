import { memo } from "react"


const BoutiqueHero = () => {

    return(
        <div
            style={{ backgroundImage: "url('BoutiqueHero.jpeg')" }}
            className="bg-cover bg-center w-full flex items-center justify-center h-[650px] max-[750px]:h-[700px]"
        >

            <div
                className="
                    flex flex-col px-10 w-full h-full
                    bg-gradient-to-b from-black/70 via-black/45 to-black/60
                    gap-3
                    max-[1025px]:px-10
                    max-[780px]:px-5
                    max-[600px]:px-5
                    items-center
                "
            >

                <h1 className="text-[#F7F4EE] font-['Cormorant Garamond'] text-[2.2em]
                mt-15 font-[800]
                ">COLLECTION NOVA</h1>

                <h2 className="text-[#B89B72] text-[1.5em] font-[600] font-['Cormorant Garamond']">
                    Le style qui vous ressemble.
                </h2>

                <p className="text-[1.1em] text-[#F7F4EE] w-[700px] text-center
                max-[750px]:w-[400px] max-[450px]:w-[320px]
                ">
                    Découvrez une collection de pièces soigneusement sélectionnées, 
                    conçues pour s'adapter à votre style unique et vous accompagner
                     au quotidien. Entre coupes intemporelles, matières d'exception
                      et détails raffinés, composez des looks uniques qui vous
                       ressemblent et affirment votre personnalité.
                </p>

                <a href="#collection"
                className="bg-[#B89B72] text-[#F7F4EE] px-5 py-2 rounded-[5px] font-[500]
                cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-5
                "
                >
                    Explorer la collection
                </a>
            </div>
        </div>
    )
}


export default memo(BoutiqueHero);