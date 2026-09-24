import  { memo } from "react"
import { useOrderContext } from "../../Contexts/OrderContext";


const OrderInfo = () => {

    const {orderDetail, setOrderDetail} = useOrderContext();
    return(
        <div className="bg-white border border-gray-300 p-5 flex flex-col gap-4 w-[800px]
        rounded-[5px] max-[1300px]:w-[500px] max-[550px]:w-[320px]
        ">
           <h3 className="text-[1.3em] font-[600]">
            Détails de facturation
           </h3>

           <div className="flex flex-col gap-1 w-full">
            <label htmlFor="firstName"
            className="text-[16px] font-[600]"
            >Prénom*</label>
            <input 
            type="text" 
            name="firstName"
            value={orderDetail.firstName}
            onChange={(e)=>setOrderDetail({...orderDetail, firstName : e.target.value})}
            className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px]"
            placeholder="Ex : Karim"
            required
            />
           </div>

           <div className="flex flex-col gap-1 w-full">
            <label htmlFor="lastName"
            className="text-[16px] font-[600]"
            >Nom*</label>
              <input 
            type="text" 
            name="lastName"
            value={orderDetail.lastName}
            onChange={(e)=>setOrderDetail({...orderDetail, lastName : e.target.value})}
            placeholder="Ex : Boudif"
            className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px]"
            required
            />
           </div>

           <div className="flex flex-col gap-1 w-full">
            <label htmlFor="address"
            className="text-[16px] font-[600]"
            >Adresse*</label>
              <input 
            type="text" 
            name="address"
            className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px]"
            value={orderDetail.address}
            onChange={(e)=>setOrderDetail({...orderDetail, address : e.target.value})}
            placeholder="26 chemin du stage, Hussein Dey"
            required
            />
           </div>

            <div className="flex flex-col gap-1 w-full">
            <label htmlFor="address"
            className="text-[16px] font-[600]"
            >Wilaya*</label>
                 <select 
                     name="wilaya" 
                     value={orderDetail.wilaya}
                     className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px]"
                     onChange={(e)=>setOrderDetail({...orderDetail, wilaya : e.target.value})}
                     required>
  <option value="">-- Choisir une wilaya --</option>
  <option value="Adrar">01 - Adrar</option>
  <option value="Chlef">02 - Chlef</option>
  <option value="Laghouat">03 - Laghouat</option>
  <option value="Oum El Bouaghi">04 - Oum El Bouaghi</option>
  <option value="Batna">05 - Batna</option>
  <option value="Béjaïa">06 - Béjaïa</option>
  <option value="Biskra">07 - Biskra</option>
  <option value="Béchar">08 - Béchar</option>
  <option value="Blida">09 - Blida</option>
  <option value="Bouira">10 - Bouira</option>
  <option value="Tamanrasset">11 - Tamanrasset</option>
  <option value="Tébessa">12 - Tébessa</option>
  <option value="Tlemcen">13 - Tlemcen</option>
  <option value="Tiaret">14 - Tiaret</option>
  <option value="Tizi Ouzou">15 - Tizi Ouzou</option>
  <option value="Alger">16 - Alger</option>
  <option value="Djelfa">17 - Djelfa</option>
  <option value="Jijel">18 - Jijel</option>
  <option value="Sétif">19 - Sétif</option>
  <option value="Saïda">20 - Saïda</option>
  <option value="Skikda">21 - Skikda</option>
  <option value="Sidi Bel Abbès">22 - Sidi Bel Abbès</option>
  <option value="Annaba">23 - Annaba</option>
  <option value="Guelma">24 - Guelma</option>
  <option value="Constantine">25 - Constantine</option>
  <option value="Médéa">26 - Médéa</option>
  <option value="Mostaganem">27 - Mostaganem</option>
  <option value="M'Sila">28 - M'Sila</option>
  <option value="Mascara">29 - Mascara</option>
  <option value="Ouargla">30 - Ouargla</option>
  <option value="Oran">31 - Oran</option>
  <option value="El Bayadh">32 - El Bayadh</option>
  <option value="Illizi">33 - Illizi</option>
  <option value="Bordj Bou Arreridj">34 - Bordj Bou Arreridj</option>
  <option value="Boumerdès">35 - Boumerdès</option>
  <option value="El Tarf">36 - El Tarf</option>
  <option value="Tindouf">37 - Tindouf</option>
  <option value="Tissemsilt">38 - Tissemsilt</option>
  <option value="El Oued">39 - El Oued</option>
  <option value="Khenchela">40 - Khenchela</option>
  <option value="Souk Ahras">41 - Souk Ahras</option>
  <option value="Tipaza">42 - Tipaza</option>
  <option value="Mila">43 - Mila</option>
  <option value="Aïn Defla">44 - Aïn Defla</option>
  <option value="Naâma">45 - Naâma</option>
  <option value="Aïn Témouchent">46 - Aïn Témouchent</option>
  <option value="Ghardaïa">47 - Ghardaïa</option>
  <option value="Relizane">48 - Relizane</option>
  <option value="Timimoun">49 - Timimoun</option>
  <option value="Bordj Badji Mokhtar">50 - Bordj Badji Mokhtar</option>
  <option value="Ouled Djellal">51 - Ouled Djellal</option>
  <option value="Béni Abbès">52 - Béni Abbès</option>
  <option value="In Salah">53 - In Salah</option>
  <option value="In Guezzam">54 - In Guezzam</option>
  <option value="Touggourt">55 - Touggourt</option>
  <option value="Djanet">56 - Djanet</option>
  <option value="El M'Ghair">57 - El M'Ghair</option>
  <option value="El Meniaa">58 - El Meniaa</option>
</select>
           </div>

                <div className="flex flex-col gap-1 w-full">
            <label htmlFor="phone"
            className="text-[16px] font-[600]"
            >Téléphone*</label>
              <input 
            type="text" 
            name="phone"
            value={orderDetail.phone}
            onChange={(e)=>setOrderDetail({...orderDetail, phone : e.target.value})}
            placeholder="Ex : 0687904323"
            className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px]"
            required
            />
           </div>
        </div>
    )
}

export default memo(OrderInfo);