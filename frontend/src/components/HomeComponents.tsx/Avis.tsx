import { memo } from "react"
import { useAdminTestimonialsContext } from "../../AdminContexts/AdminTestimonialsContext";
import RatingStars from "../../AdminComponents/TestimonialsAdminComponents/RatingStars";



const Avis = () => {

    const {activeTestimonials} = useAdminTestimonialsContext();
    return(
        <section  className="flex flex-col w-full py-10 px-10 bg-gray-100 justify-center items-center">
            
                   <p className="text-[#B89B72] text-[20px] font-semibold tracking-[0.25em] uppercase">
            AVIS CLIENTS
        </p>

        <h1 className="text-[#171717] text-[1.6em] font-bold text-center">
            Ils parlent de Nova Fashion
        </h1>

          <p className="text-gray-500 text-[1.1em] font-bold text-center mt-5">
            Découvrez les retours de ceux qui nous font confiance au quotidien.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-5 mt-10">
            {activeTestimonials.map((t)=>{
                return(
                    <div className="flex flex-col gap-2 p-3 bg-white border
                    border-gray-300 rounded-[10px] w-[300px] h-[200px] 
                     transition-transform duration-200 hover:scale-105
                    ">
                        <RatingStars rating={t.rating}/>
                        <p className="font-semibold text-[17px]">
                            {t.fullName}
                        </p>
                        <p className="text-[14px] font-[italic] leading-4.5 text-gray-700">
                            {t.message}
                        </p>
                    </div>
                )
            })}
          </div>

        </section>
    )
}


export default memo(Avis);