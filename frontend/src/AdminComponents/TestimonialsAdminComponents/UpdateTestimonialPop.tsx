
import { useAdminTestimonialsContext } from "../../AdminContexts/AdminTestimonialsContext";
import { memo } from "react";


const UpdateTestimonialPop = () => {

    const {setShowUpdateTestimonialPop, updateTestimonial, loadingUpdateTestimonial,
        testimonialDetails, setTestimonialDetails
    } = useAdminTestimonialsContext();
    
   
    
        const handleCreate = async() => {
    
            if(!testimonialDetails?.fullName || testimonialDetails?.fullName.trim() === "") return;
            if(!testimonialDetails.message || testimonialDetails.message.trim() === "") return;
            if(testimonialDetails?.active !== false && testimonialDetails?.active !== true) return;
    
    
            await updateTestimonial(testimonialDetails._id,testimonialDetails.fullName, testimonialDetails.message, testimonialDetails.rating, testimonialDetails.active);
    
        }

        const handleChange = (e : React.ChangeEvent<HTMLSelectElement| HTMLInputElement| HTMLTextAreaElement>) => {

            const {name, value, type} = e.target;

            if(name === "active"){
                if(value === "true"){
                    setTestimonialDetails({
                        ...testimonialDetails!,
                        active : true
                    });
                }else{
                     setTestimonialDetails({
                        ...testimonialDetails!,
                        active : false
                    });
                }
                return;
            }

            setTestimonialDetails({
                ...testimonialDetails!,
                [name] : type === "number" ? Number(value) : value
            });
        }
    
        return(
            <div  className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
                <div
                
                    onClick={(e) => e.stopPropagation()}
                    className="w-[800px] h-[500px] bg-white flex flex-col rounded-[10px] overflow-y-auto"
                >
    
                    <div className="px-4 py-2 flex flex-row w-full justify-between items-center
                   border-b border-b-gray-300
                   ">
                        <p
                         className="text-[1.5em] font-bold text-[#263f28]"
                        >Modifier un Avis Client</p>
    
                        <span
                            onClick={() => setShowUpdateTestimonialPop(false)}
                            className="text-[2em] cursor-pointer 
                     transition-opacity duration-200 hover:opacity-80 active:opacity-60
                     ">&times;</span>
                    </div>
    
                    <div className="p-4 flex flex-col gap-3">
    
                        <div className="flex flex-col gap-1">
                            <label htmlFor="fullName"
                                className="text-[15px] font-[600]"
                            >Nom Complet*</label>
                            <input
                                type="text"
                                name="fullName"
                                value={testimonialDetails?.fullName}
                                placeholder="Ex: Rezgui Yanis"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px]
                        bg-gray-100
                        "
                           required
                            />
                        </div>
    
    
                          <div className="flex flex-col gap-1">
                            <label htmlFor="message"
                                className="text-[15px] font-[600]"
                            >Message*</label>
                            <textarea
                                name="message"
                                value={testimonialDetails?.message}
                                placeholder="Ex: Acceuil Chaleureux, produits frais..."
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px]
                        bg-gray-100
                        "
                           required
                            />
                        </div>
    
    
                        <div className="flex flex-col gap-1">
                            <label
                                className="text-[15px] font-[600]"
                            >Note*</label>
                            <input
                                name="rating"
                                type="number"
                                min={1}
                                max={5}
                                step={0.5}
                                value={testimonialDetails?.rating}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px]
                        bg-gray-100
                        "
                           required
                            />
                        </div>
    
                         <div className="flex flex-col gap-1">
                            <label
                                className="text-[15px] font-[600]"
                            >Activer*</label>
                            <select
                                value={String(testimonialDetails?.active)}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px]
                        bg-gray-100
                        "
                            name="active"
                           required
                            >
                               <option value="false">Non</option>
                               <option value="true">Oui</option>
                            </select>
                        </div>
    
                        <button
                        className="bg-[#263f28] text-white font-bold text-[15px]
                    w-full cursor-pointer transition-opacity duration-200 hover:opacity-80
                    active:opacity-60 py-2 rounded-[5px] mt-5
                    "
                        disabled={loadingUpdateTestimonial}
                        onClick={handleCreate}
                        >
                            {loadingUpdateTestimonial ? "Modification...":  "Modifier"}
                        </button>
    
                    </div>
                </div>
            </div>
        );
}


export default memo(UpdateTestimonialPop);