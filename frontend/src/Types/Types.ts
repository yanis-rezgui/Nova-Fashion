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



/* =========================
   HERO
========================= */

export interface HeroImage {
  url: string;
  publicId: string;
}

export interface HeroSlide {
  _id: string;
  kicker: string;
  title: string;
  description: string;
  cta: string;
  image: HeroImage;
}

export interface HeroFeaturedProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: HeroImage;
}

export interface Hero {
  _id: string;
  slides: HeroSlide[];
  featuredProducts: HeroFeaturedProduct[];
  createdAt: string;
  updatedAt: string;
}


/* =========================
   HERO - ADMIN INPUTS
========================= */

// Champs texte d'un slide (utilisés à la création ET à la mise à jour)
export interface HeroSlideInput {
  _id?: string;           // présent uniquement en update, pour un slide existant
  kicker: string;
  title: string;
  description: string;
  cta: string;
  image?: HeroImage;      // image existante conservée (update uniquement, si pas de nouveau fichier)
}

export interface HeroFeaturedProductInput {
  _id?: string;
  name: string;
  category: string;
  price: number;
  image?: HeroImage;
}

// Payload pour la création : chaque slide/produit doit avoir un fichier image au même index
export interface CreateHeroPayload {
  slides: Omit<HeroSlideInput, "_id" | "image">[];
  featuredProducts: Omit<HeroFeaturedProductInput, "_id" | "image">[];
  slideImages: File[];             // même longueur que slides
  featuredProductImages: File[];   // toujours 2 fichiers
}

// Payload pour la mise à jour : les fichiers sont optionnels, reliés par index
export interface UpdateHeroPayload {
  slides: HeroSlideInput[];
  featuredProducts: HeroFeaturedProductInput[];
  slideImages: File[];                    // uniquement les NOUVELLES images
  slideImageIndexes: number[];            // slideImages[i] remplace slides[slideImageIndexes[i]]
  featuredProductImages: File[];          // uniquement les NOUVELLES images
  featuredProductImageIndexes: number[];  // idem pour featuredProducts
}