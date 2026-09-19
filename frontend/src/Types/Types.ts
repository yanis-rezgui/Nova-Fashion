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
  _id: string;
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

export interface PlaceOrder{
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  wilaya: string;
}
export interface ClothingFilterType{
    gender : string,
    category: string,
    minPrice : number,
    maxPrice : number,
    search : string,
    discount : string,
    sort : string,
    stock : string,
}

export interface CartItem{
  clothing : Clothing;
  variant : string;
  name : string;
  size : string;
  color: string;
  price: number;
  quantity : number;
}

export interface User{
  _id : string; 
  firstName : string;
  lastName : string;
  email : string;
  password? : string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderFilterType {

    search: string;

    status: string;

    tri:
        | "all"
        | "today"
        | "yesterday"
        | "last_7_days"
        | "last_30_days"
        | "this_month"
        | "last_month"
        | "custom";

    startDate: string;

    endDate: string;

    sort:
        | "newest"
        | "oldest";
}


export interface OrderStats {

    totalOrders: number;

    preparationOrders: number;

    shippedOrders: number;

    deliveredOrders: number;

    cancelledOrders: number;

    revenue: number;

    productsSold: number;
}


export type Testimonial = {
  _id: string;
  fullName: string;
  message: string;
  rating: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};


export type Settings = {
    _id: string;

    shopName: string;

    shipping: {
        algerPrice: number;
        outsideAlgerPrice: number;
    };

    contact: {
        phone: string;
        email: string;
    };

    socialLinks: {
        name: string;
        url: string;
    }[];

    createdAt: string;
    updatedAt: string;
};

export type NotificationType =

    | "NEW_ORDER"

    | "ORDER_CANCELLED"

    | "ORDER_DELIVERED"

    | "NEW_CATEGORY"

    | "NEW_CLOTHING";


export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    userId: string;
    createdAt: string;
}

export interface NotificationsPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface NotificationsStats {
    total: number;
    unread: number;
    read: number;
}
