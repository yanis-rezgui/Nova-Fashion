import connectToDatabase from "../database/mongodb.js";
import Category from "../models/category.model.js";
import Clothing from "../models/clothing.model.js";
import Variant from "../models/variant.model.js";

const clothingData = {
  name: "T-Shirts Homme 100% Coton",

  description:
    "T-shirt homme 100% coton, confortable et polyvalent. Disponible en plusieurs couleurs et tailles, idéal pour un style quotidien.",

  price: 2500,

  discountPrice: null,

  images: [
    {
      url: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789385155/pull4_pxpocu.jpg",
      publicId: "pull4_pxpocu",
    },
    {
      url: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789385153/pull3_otvqik.jpg",
      publicId: "pull3_otvqik",
    },
    {
      url: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789385151/pull2_sts1dr.jpg",
      publicId: "pull2_sts1dr",
    },
    {
      url: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789385150/pull1_giabc6.jpg",
      publicId: "pull1_giabc6",
    },
  ],

  active: true,
  gender : "HOMME"
};

const variantsData = [
  // Noir
  {
    color: "#000000",
    size: "M",
    quantity: 2,
  },
  {
    color: "#000000",
    size: "XL",
    quantity: 2,
  },
  {
    color: "#000000",
    size: "XXL",
    quantity: 1,
  },

  // Blanc
  {
    color: "#FFFFFF",
    size: "M",
    quantity: 2,
  },
  {
    color: "#FFFFFF",
    size: "XL",
    quantity: 2,
  },
  {
    color: "#FFFFFF",
    size: "XXL",
    quantity: 1,
  },

  // Bordeaux
  {
    color: "#800020",
    size: "M",
    quantity: 2,
  },
  {
    color: "#800020",
    size: "XL",
    quantity: 2,
  },
  {
    color: "#800020",
    size: "XXL",
    quantity: 1,
  },

  // Gris clair
  {
    color: "#D3D3D3",
    size: "M",
    quantity: 2,
  },
  {
    color: "#D3D3D3",
    size: "XL",
    quantity: 2,
  },
  {
    color: "#D3D3D3",
    size: "XXL",
    quantity: 1,
  },

  // Gris souris
  {
    color: "#808080",
    size: "M",
    quantity: 2,
  },
  {
    color: "#808080",
    size: "XL",
    quantity: 2,
  },
  {
    color: "#808080",
    size: "XXL",
    quantity: 1,
  },
];

export const seedClothing = async () => {
  try {
    await connectToDatabase();

    /*
     * 1. Nettoyage
     */
    await Variant.deleteMany({});
    await Clothing.deleteMany({});

    /*
     * 2. Création / récupération de la catégorie
     */
    let category = await Category.findOne({
      name: "T-Shirts",
    });

    if (!category) {
     category = await Category.create({
    name: "T-Shirts",

    description:
        "Découvrez notre sélection de T-shirts pour homme, conçus pour offrir confort, qualité et style au quotidien.",

    image: {
        url: "https://res.cloudinary.com/dub4fhabm/image/upload/v1789386195/pullCategory_w9sclq.jpg",
        publicId: "pullCategory_w9sclq",
    },
});

      console.log("✅ Category 'T-Shirts' created!");
    } else {
      console.log("ℹ️ Category 'T-Shirts' already exists.");
    }

    /*
     * 3. Création du Clothing
     */
    const clothing = await Clothing.create({
      ...clothingData,
      category: category._id,
    });

    console.log(`✅ Clothing '${clothing.name}' created!`);

    /*
     * 4. Création des variants
     */
    const variants = variantsData.map((variant) => ({
      ...variant,
      clothing: clothing._id,
    }));

    await Variant.insertMany(variants);

    console.log(`✅ ${variants.length} variants created!`);

    console.log(`
    Product: ${clothing.name}
    Category: ${category.name}
    Price: ${clothing.price} DA
    Colors: 5
    Sizes: M, XL, XXL
    Total stock: 25
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

