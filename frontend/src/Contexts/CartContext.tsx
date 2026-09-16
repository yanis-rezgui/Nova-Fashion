import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, Clothing, Variant } from "../Types/Types";


interface CartContextType{
    cart : CartItem[];
    addToCart : (clothing : Clothing,variant : Variant, quantity : number)=>void;
    msg : string | null;
    increaseQuantity: (variantId: string) => void;
    decreaseQuantity: (variantId: string) => void;
    resetCart : ()=>void;
    totalCartItems : ()=>number;
    cartVariants : Variant[];
    getCartVariants : (variantIds : string[])=>Promise<void>;
    deleteItem : (variantId : string)=>void;
    totalPrice : ()=>number;
    resetCartPop : boolean;
    setResetCartPop : (b : boolean)=>void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({children} : {children : React.ReactNode}) => {

    const [cart, setCart] = useState<CartItem[]>(()=>{
        const saved = localStorage.getItem("cart");

        return saved ? JSON.parse(saved) : [];
    });

    const [resetCartPop, setResetCartPop] = useState<boolean>(false);

    const [cartVariants, setCartVariants] = useState<Variant[]>([]);

    const [msg, setMsg] = useState<string | null>(null);

        
    useEffect(()=>{
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    useEffect(()=>{
        console.log('cart: ', cart);
    }, []);


    const getCartVariants = async(variantIds: string[]) => {
        
        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/variants/`,{
                method : "POST",
                headers : {
                    "Content-Type" : 'application/json'
                },
                body : JSON.stringify({variantIds})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting variants");
            }

            setCartVariants(data.data);
            console.log('Cart variants : ', data.data);
        }catch(err){
            console.error(err);
        }
    }

                const variantIds = cart.map(item => item.variant);
            const variantIdsKey = variantIds.join(",");

            useEffect(() => {
                if (variantIds.length === 0) {
                    setCartVariants([]);
                    return;
                }

                getCartVariants(variantIds);
            }, [variantIdsKey]);

const addToCart = (
    clothing: Clothing,
    variant: Variant,
    quantity: number
) => {

    setMsg(null);

    setCart((currentCart) => {

        const existingItem = currentCart.find(
            item => item.variant === variant._id
        );

        if (existingItem) {

            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > variant.quantity) {
                setMsg(
                    `Stock insuffisant. Il reste ${
                        variant.quantity - existingItem.quantity
                    } article(s).`
                );

                return currentCart;
            }

            const updatedCart = currentCart.map(item => {

                if (item.variant !== variant._id) {
                    return item;
                }

                setMsg(
                    `(${quantity}) ${clothing.name} ajouté avec succès`
                );

                return {
                    ...item,
                    quantity: newQuantity
                };
            });

            

            return updatedCart;
        }

        if (quantity > variant.quantity) {

            setMsg(
                `Stock insuffisant. Il reste ${variant.quantity} article(s).`
            );

            return currentCart;
        }

        const newItem: CartItem = {
            clothing,
            variant: variant._id,
            name: clothing.name,
            size: variant.size,
            color: variant.color,
            price: clothing.discountPrice ?? clothing.price,
            quantity
        };

        const updatedCart = [
            ...currentCart,
            newItem
        ];

        setMsg(
            `(${quantity}) ${clothing.name} ajouté avec succès`
        );

        

        return updatedCart;
    });
};

const increaseQuantity = (variantId: string) => {

    const variant = cartVariants.find(
        variant => variant._id === variantId
    );

    if (!variant) {
        console.error("Variant not found");
        return;
    }

    setCart((currentCart) => {

        return currentCart.map((item) => {

            if (item.variant !== variantId) {
                return item;
            }

            // Stock maximum atteint
            if (item.quantity >= variant.quantity) {
                setMsg(
                    `Stock insuffisant. Il reste ${variant.quantity} article(s) disponible(s).`
                );

                return item;
            }

            return {
                ...item,
                quantity: item.quantity + 1
            };
        });
    });
};

    

const decreaseQuantity = (variantId: string) => {
    setCart((currentCart) => {
        return currentCart.map((item) => {
            if (item.variant !== variantId) {
                return item;
            }

            if (item.quantity === 1) {
                return item;
            }

            return {
                ...item,
                quantity: item.quantity - 1
            };
        });
    });
};

    const deleteItem = (variantId : string) => {

        setCart((currentCart)=>{
            return currentCart.filter((item)=>item.variant !== variantId)
        })
    }

    const totalCartItems = () => {

        let cpt = 0;

        cart.forEach((it)=>{
            cpt += it.quantity
        });

        return cpt
    }

    const totalPrice = () => {

        let cpt = 0;

        cart.forEach((it)=>{
            cpt += it.price*it.quantity
        });

        return cpt;
    }

    useEffect(() => {
    console.log("cart:", cart);
    console.log("cartVariants:", cartVariants);
}, [cart, cartVariants]);


    

    const resetCart = () => {

        setCart([]);
        setCartVariants([]);
        setResetCartPop(false)
    }
    return <CartContext.Provider value={{
        cart,
        addToCart,
        msg,
        increaseQuantity,
        decreaseQuantity,
        resetCart,
        totalCartItems,
        getCartVariants,
        cartVariants,
        deleteItem,
        totalPrice,
        resetCartPop,
        setResetCartPop
    }}>
        {children}
    </CartContext.Provider>
}


export const useCartcontext = () => {

    const context = useContext(CartContext);

    if(!context){
        throw new Error("Please use the useCartContext hook inside the CartProvider");
    }

    return context;
}