import  { memo } from "react"
import { useAdminTestimonialsContext } from "../AdminContexts/AdminTestimonialsContext";
import TestimonialCard from "../AdminComponents/TestimonialsAdminComponents/TestimonialCard";
import AddCloth from "./AddCloth";
import AddTestimonialPop from "../AdminComponents/TestimonialsAdminComponents/AddTestimonialPop";
import UpdateTestimonialPop from "../AdminComponents/TestimonialsAdminComponents/UpdateTestimonialPop";
import DeleteTestimonialPop from "../AdminComponents/TestimonialsAdminComponents/DeleteTestimonialPop";



const Testimonials = () => {

   const {setShowAddTestimonialPop, testimonials,

    showAddTestimonialPop,
    showDeleteTestimonialPop,
    showUpdateTestimonialPop
   } = useAdminTestimonialsContext();

    return(
        <>
        <section className="flex flex-col w-full items-center min-h-screen bg-[#F7F4EE]">

              <h1 className="text-[2em] mt-10 font-bold"> 
                Avis Clients
             </h1>

             <p className="text-[1.1em] text-gray-800 mt-2">
                Gérez les témoignages et retours de vos clients
             </p>

             <button className="bg-[#B89B72] py-2 text-white font-bold border-0 mt-5
           cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 px-4"
           onClick={()=>setShowAddTestimonialPop(true)}
           >
                + Ajouter un Avis
             </button>

            <div className="flex flex-wrap gap-5 justify-center items-center gap-5 mt-10 mb-10">
             {testimonials.map((t)=>{
                return(
                    <TestimonialCard testimonial={t} key={t._id}/>
                )
             })}
             </div>
        </section>

        {showAddTestimonialPop && <AddTestimonialPop/>}
        {showUpdateTestimonialPop && <UpdateTestimonialPop/>}
        {showDeleteTestimonialPop && <DeleteTestimonialPop/>}

        </>
    )
}

export default memo(Testimonials);