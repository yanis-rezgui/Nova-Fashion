import connectToDatabase from "../database/mongodb.js";
import Category from "../models/category.model.js";
import Clothing from "../models/clothing.model.js";
import Variant from "../models/variant.model.js";
import Settings from "../models/settings.model.js";


const settingsData = {
    shopName: "Nova Fashion",

    shipping: {
        algerPrice: 500,
        outsideAlgerPrice: 800
    },

    contact: {
        phone: "0550 12 34 56",
        email: "contact@novafashion.dz"
    },

    socialLinks: [
        {
            name: "Instagram",
            url: "https://instagram.com/nova.fashion"
        },
        {
            name: "Facebook",
            url: "https://facebook.com/nova.fashion"
        },
        {
            name: "TikTok",
            url: "https://tiktok.com/@nova.fashion"
        }
    ]
};


export const seedSettings = async () => {

    try {

        await connectToDatabase();

        /*
         * 1. Nettoyage des anciens settings
         */

        await Settings.deleteMany({});

        console.log("🗑️ Existing settings deleted.");


        /*
         * 2. Création du seul Settings
         */

        const settings = await Settings.create(settingsData);

        console.log("✅ Settings created successfully!");

        console.log(`
        Shop: ${settings.shopName}

        Shipping:
        - Alger: ${settings.shipping.algerPrice} DA
        - Outside Alger: ${settings.shipping.outsideAlgerPrice} DA

        Contact:
        - Phone: ${settings.contact.phone}
        - Email: ${settings.contact.email}

        Social links:
        ${settings.socialLinks
            .map((social) => `- ${social.name}: ${social.url}`)
            .join("\n        ")}
        `);


        process.exit(0);

    } catch (error) {

        console.error("❌ Settings seed error:", error);

        process.exit(1);
    }
};