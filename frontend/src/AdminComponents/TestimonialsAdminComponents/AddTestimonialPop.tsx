import  { memo, useState } from "react";
import { useAdminTestimonialsContext } from "../../AdminContexts/AdminTestimonialsContext";


const AddTestimonialPop = () => {

    const {setShowAddTestimonialPop, addTestimonial, loadingAddTestimonial} = useAdminTestimonialsContext();

    const [fullName, setFullName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [rating, setRating] = useState<number>(1);
    const [active, setActive] = useState<string>("false");

    const handleCreate = async() => {

        if(!fullName || fullName.trim() === "") return;
        if(!message || message.trim() === "") return;
        if(active !== "false" && active !== "true") return;

        const boolActive = active === "true";

        await addTestimonial(fullName, message, rating, boolActive);

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
                    >Nouvel Avis Client</p>

                    <span
                        onClick={() => setShowAddTestimonialPop(false)}
                        className="text-[2em] cursor-pointer 
                 transition-opacity duration-200 hover:opacity-80 active:opacity-60
                 ">&times;</span>
                </div>

                <div className="p-4 flex flex-col gap-3">

                    <div className="flex flex-col gap-1">
                        <label htmlFor="title"
                            className="text-[15px] font-[600]"
                        >Nom Complet*</label>
                        <input
                            type="text"
                            name="title"
                            value={fullName}
                            placeholder="Ex: Rezgui Yanis"
                            onChange={(e)=>setFullName(e.target.value)}
                            className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px]
                    bg-gray-100
                    "
                       required
                        />
                    </div>


                      <div className="flex flex-col gap-1">
                        <label htmlFor="title"
                            className="text-[15px] font-[600]"
                        >Message*</label>
                        <textarea
                            name="title"
                            value={message}
                            placeholder="Ex: Acceuil Chaleureux, produits frais..."
                            onChange={(e)=>setMessage(e.target.value)}
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
                            
                            type="number"
                            min={1}
                            max={5}
                            step={0.5}
                            value={rating}
                            onChange={(e)=>setRating(Number(e.target.value))}
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
                            value={active}
                            onChange={(e)=>setActive(e.target.value)}
                            className="w-full border border-gray-300 rounded-[5px] p-2 text-[15px]
                    bg-gray-100
                    "
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
                    disabled={loadingAddTestimonial}
                    onClick={handleCreate}
                    >
                        {loadingAddTestimonial ? "Creation...":  "Créer"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default memo(AddTestimonialPop);