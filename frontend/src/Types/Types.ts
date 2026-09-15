/* =========================
   CATEGORY
========================= */

export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: CategoryImage;
  createdAt: string;
  updatedAt: string;
}


/* =========================
   CLOTHING
========================= */

export type Gender = "HOMME" | "FEMME" | "UNISEXE";

export interface ClothingImage {
  url: string;
  publicId: string;
}

export interface Clothing {
  _id: string;

  name: string;
  description: string;

  gender: Gender;

  price: number;
  discountPrice: number | null;

  category: Category;

  images: ClothingImage[];

  active: boolean;

  createdAt: string;
  updatedAt: string;
}


/* =========================
   VARIANT
========================= */

export interface Variant {
  _id: string;

  clothing: Clothing;

  color: string;
  size: string;
  quantity: number;

  createdAt: string;
  updatedAt: string;
}


/* =========================
   ORDER
========================= */

export type OrderStatus =
  | "EN_PREPARATION"
  | "EXPEDIEE"
  | "LIVREE"
  | "ANNULEE";

export interface OrderItem {
  clothing: Clothing;
  variant: string;

  name: string;
  size: string;
  color: string;

  price: number;
  quantity: number;
}

export interface Order {
  _id: string;

  firstName: string;
  lastName: string;

  address: string;
  phone: string;
  wilaya: string;

  items: OrderItem[];

  totalPrice: number;
  deliveryFee: number;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}


export interface ClothingFilterType{
    gender : string,
    category: string,
    minPrice : number,
    maxPrice : number,
    search : string,
    discount : string,
    sort : string,
}