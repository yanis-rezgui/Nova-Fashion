import { memo, useState } from "react"


const BonReducation = () => {

    const [code, setCode] = useState<string>("");

    return(
        <div className="bg-white border border-gray-300 p-4 flex
        flex-row items-center justify-center  w-[400px] rounded-[5px] shadow-2xl
        max-[420px]:w-[300px]
        ">
          <input 
          type="text" 
          name="code"
          placeholder="Mon bon de réduction"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          className="h-[40px] border border-gray-300 bg-gray-50 text-[14px] px-3 w-full"
          />
          <button 
          onClick={()=>setCode("")}
          className="h-[40px] border border-gray-300 bg-gray-50 w-[80px] bg-gray-100 text-[15px]
          cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
          ">
            Ajouter
          </button>
        </div>
    )
}

export default memo(BonReducation);