import  { memo } from "react"
import type { Testimonial } from "../../Types/Types"
import RatingStars from "./RatingStars";
import { useAdminTestimonialsContext } from "../../AdminContexts/AdminTestimonialsContext";



const TestimonialCard = ({testimonial} : {testimonial : Testimonial}) => {

    const {setTestimonialDetails, setShowUpdateTestimonialPop, setShowDeleteTestimonialPop} = useAdminTestimonialsContext();

    return(
        <div className="bg-white w-[250px] border border-gray-300 rounded-[5px] p-2
        flex flex-col gap-2 transition-transform duration-200 hover:scale-105
        "
        >
           <p className="text-[1.2em] font-bold">
            {testimonial.fullName}</p>

           <RatingStars rating={testimonial.rating}/>

           <p
           className="text-[14px] text-gray-700"
           >{testimonial.message}</p>
           <p  style={{color : testimonial.active ? "green" : "red"}} 
           className="font-[500] underline"
           >
            {testimonial.active ? "Actif" : "Inactif"}
           </p>

                                <div className="flex gap-2 justify-center items-center w-full
                     mt-2
                     ">
                                            <button 
                                            onClick={()=>{
                                              setTestimonialDetails(testimonial);
                                              setShowUpdateTestimonialPop(true);
                                            }}
                                            className='bg-[#263f28] text-white text-[15px] font-bold w-[100px] rounded-[5px] h-[35px] cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60'>
                                               <i className="fa-solid fa-pen-to-square"></i> Modifier
                                            </button>

                                            <button
                                            onClick={()=>{
                                               setTestimonialDetails(testimonial);
                                               setShowDeleteTestimonialPop(true);
                                            }}
                                            className='bg-[#7e2c17] text-white text-[15px] font-bold w-[100px] rounded-[5px] h-[35px] cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60'>
                                               <i className="fa-solid fa-delete-left"></i> Delete
                                            </button>
                                        </div>
        </div>
    )
}

export default memo(TestimonialCard);