import { memo } from "react"
import type { CartItem } from "../../Types/Types"
import { useCartcontext } from "../../Contexts/CartContext"


const CartItem = ({item} : {item : CartItem}) => {

    const {increaseQuantity, decreaseQuantity, deleteItem} = useCartcontext();

    return(
        <div className="flex flex-row gap-5 items-start p-5 border-b border-b-gray-300 relative
        max-[600px]:flex-col max-[600px]:items-center
        ">
          <img src={item.clothing.images[0].url} alt="cloth_image" 
          className="w-[200px] h-[200px] object-contain"
          />
          <div className="flex flex-col ">
            <h3 className="text-[1.2em] font-[600]">
                {item.name}
            </h3>
            <p className="text-[15px] text-gray-800">
                {item.clothing.category.name}
            </p>
            <p className="text-[18px] font-[600]">
                {item.price} DA
            </p>
            <div className="flex flex-row items-center gap-3 mt-2">
                <div className="flex flex-row items-start gap-2">
                    <p className="text-[15px] font-[600]">Couleur:</p>
                    <div style={{
                        backgroundColor : `${item.color}`
                    }}
                    className="h-[20px] w-[20px] rounded-full"
                    >
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2">
                    <p className="text-[15px] font-[600]">Taille:</p>
                    <p className="text-[16px] font-[500]">
                        {item.size}
                    </p>
                </div>
            </div>

            <div className="flex flex-row items-center gap-2 mt-5">
                    <p className="text-[15px] font-[600]">Quantité:</p>

                    <div className="flex flex-row gap-0 h-[30px] items-center  ">
                        <div className="h-[40px] w-[40px] text-[16px] bg-gray-100 flex justify-center items-center
                        border border-gray-300
                        ">
                            {item.quantity}
                        </div>
                        <div className="flex flex-col justify-center items-center gap-0">
                            <button className="h-[20px] w-[20px] bg-gray-100 text-[14px] border border-gray-300
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            "
                            onClick={()=>increaseQuantity(item.variant)}
                            >
                                <i className="fa-solid fa-chevron-up"></i>
                            </button>


                            <button className="h-[20px] w-[20px] bg-gray-100 text-[14px] border border-gray-300
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            "
                            onClick={()=>decreaseQuantity(item.variant)}
                            >
                                <i className="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                   
                </div>
          </div>

          <button className="absolute top-3 right-3 text-gray-500 text-[1.5em]
          cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
          
          "
          onClick={()=>deleteItem(item.variant)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>

          
        </div>
    )
}

export default memo(CartItem);