import Settings from "../models/settings.model.js";

export const getSettings = async (req, res, next) => {
    try {

        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Aucune configuration trouvée"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Settings got successfully",
            data: settings
        });

    } catch (err) {
        next(err);
    }
};


export const updateSettings = async (req, res, next) => {
    try {

        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        const {
            shopName,
            shipping,
            contact,
            socialLinks
        } = req.body;


        // =====================================
        // Shop Name
        // =====================================

        if (shopName !== undefined) {

            if (
                typeof shopName !== "string" ||
                shopName.trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Shop name is required"
                });
            }

            if (shopName.trim().length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Shop name cannot exceed 100 characters"
                });
            }

            settings.shopName = shopName.trim();
        }


        // =====================================
        // Shipping
        // =====================================

        if (shipping !== undefined) {

            if (
                typeof shipping !== "object" ||
                shipping === null ||
                Array.isArray(shipping)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid shipping object"
                });
            }


            if (shipping.algerPrice !== undefined) {

                if (
                    typeof shipping.algerPrice !== "number" ||
                    !Number.isFinite(shipping.algerPrice) ||
                    shipping.algerPrice < 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Alger shipping price"
                    });
                }

                settings.shipping.algerPrice =
                    shipping.algerPrice;
            }


            if (shipping.outsideAlgerPrice !== undefined) {

                if (
                    typeof shipping.outsideAlgerPrice !== "number" ||
                    !Number.isFinite(shipping.outsideAlgerPrice) ||
                    shipping.outsideAlgerPrice < 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid outside Alger shipping price"
                    });
                }

                settings.shipping.outsideAlgerPrice =
                    shipping.outsideAlgerPrice;
            }
        }


        // =====================================
        // Contact
        // =====================================

        if (contact !== undefined) {

            if (
                typeof contact !== "object" ||
                contact === null ||
                Array.isArray(contact)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid contact object"
                });
            }


            if (contact.phone !== undefined) {

                if (
                    typeof contact.phone !== "string" ||
                    contact.phone.trim() === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Phone is required"
                    });
                }

                settings.contact.phone =
                    contact.phone.trim();
            }


            if (contact.email !== undefined) {

                if (
                    typeof contact.email !== "string" ||
                    contact.email.trim() === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Email is required"
                    });
                }

                const email = contact.email.trim().toLowerCase();

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid email address"
                    });
                }

                settings.contact.email = email;
            }
        }


        // =====================================
        // Social Links
        // =====================================

        if (socialLinks !== undefined) {

            if (!Array.isArray(socialLinks)) {
                return res.status(400).json({
                    success: false,
                    message: "Social links must be an array"
                });
            }


            for (const social of socialLinks) {

                if (
                    typeof social !== "object" ||
                    social === null
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid social link"
                    });
                }


                if (
                    typeof social.name !== "string" ||
                    social.name.trim() === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Social media name is required"
                    });
                }


                if (
                    typeof social.url !== "string" ||
                    social.url.trim() === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Social media URL is required"
                    });
                }
            }


            settings.socialLinks = socialLinks.map((social) => ({
                name: social.name.trim(),
                url: social.url.trim()
            }));
        }


        await settings.save();

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings
        });

    } catch (err) {
        next(err);
    }
};