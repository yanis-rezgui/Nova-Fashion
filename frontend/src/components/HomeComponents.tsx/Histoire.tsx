import { memo } from "react"



const Histoire = () => {

    const histoire = [
        "Nova Fashion est née de la volonté d'un groupe de jeunes passionnés par le textile et la mode de construire une marque différente.",
        "Animés par l'envie de proposer des vêtements accessibles, soignés et pensés pour durer, ils ont progressivement développé leur savoir-faire à travers différentes catégories : du t-shirt aux chemises, des jeans aux sweats, jusqu'aux pièces plus structurées.",
        "Au fil de leur parcours, leur ambition s'est également portée sur la maîtrise de leur production. Le concept Nova Fashion s'appuie ainsi sur une sélection de matières provenant de fournisseurs internationaux sélectionnés, ainsi que sur un savoir-faire développé autour de la confection et de la fabrication textile.",
        "Aujourd'hui, Nova Fashion imagine une mode pensée pour le quotidien, avec une attention particulière portée aux coupes, aux matières et aux détails.",

    ]

    return(
        <section className="flex flex-col w-full py-10 px-10 bg-white justify-center items-center"
        id="histoire"
        >

           <h1 className="text-[#B89B72] text-[25px] font-semibold tracking-[0.15em] uppercase text-center">
            L'histoire de Nova Fashion
           </h1>

           <div className="mt-5 flex flex-col gap-2 justify-center items-center w-[900px]
           max-[950px]:w-[600px] max-[650px]:w-[320px]
           ">
             {histoire.map((h,i)=>{
                return(
                    <p key={i} className="text-[16px] text-gray-800 text-center">
                        {h}
                    </p>
                )
             })}
           </div>

           <h2 className="text-[#B89B72] text-[20px] font-semibold tracking-[0.15em] uppercase mt-10">
              De la passion à la création.
           </h2>

           <p className="text-center text-[17px] text-gray-700 font-semibold mt-2">
            Notre objectif est simple : créer des vêtements dans lesquels chacun peut se sentir à l'aise, confiant et libre d'exprimer son style.
           </p>
           <p className="mt-5 text-[1.2em] font-bold tracking-[0.15em] uppercase text-center">
             Nova Fashion, Pensée avec passion. Créée pour durer.
           </p>
        </section>
    )
}

export default memo(Histoire);