import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Variant from "../models/variant.model.js";
import Clothing from "../models/clothing.model.js";
import { notifyAdmins } from "../services/notifications.service.js";
import { getIo } from "../socket/socket.js";

export const placeOrder = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const {
            firstName,
            lastName,
            address,
            wilaya,
            phone,
            items
        } = req.body;

        /* =========================
           1. Validation client
        ========================= */

        if (!firstName || firstName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Le prénom est requis"
            });
        }

        if (!lastName || lastName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Le nom est requis"
            });
        }

        if (!address || address.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "L'adresse est requise"
            });
        }

        if (!wilaya || wilaya.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "La wilaya est requise"
            });
        }

        if (
            !phone ||
            typeof phone !== "string" ||
            phone.trim() === "" ||
            !/^\d{10}$/.test(phone)
        ) {
            return res.status(400).json({
                success: false,
                message: "Le numéro de téléphone doit contenir exactement 10 chiffres"
            });
        }

        /* =========================
           2. Validation des items
        ========================= */

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Votre panier est vide"
            });
        }

        for (const item of items) {

            if (!item.clothing || !item.clothing._id) {
                return res.status(400).json({
                    success: false,
                    message: "Un article de la commande est invalide"
                });
            }

            if (!item.variant) {
                return res.status(400).json({
                    success: false,
                    message: "Une variante de la commande est invalide"
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(item.clothing._id) ||
                !mongoose.Types.ObjectId.isValid(item.variant)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Un produit ou une variante de la commande est invalide"
                });
            }

            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message: "La quantité d'un article doit être supérieure ou égale à 1"
                });
            }
        }

        /* =========================
           3. Vérifier les doublons
        ========================= */

        const quantityByVariant = new Map();

        for (const item of items) {

            const variantId = item.variant.toString();

            const currentQuantity =
                quantityByVariant.get(variantId) || 0;

            quantityByVariant.set(
                variantId,
                currentQuantity + item.quantity
            );
        }

        /*
         * Si le même variant apparaît plusieurs fois
         * dans le panier, on le refuse.
         */
        if (quantityByVariant.size !== items.length) {
            return res.status(400).json({
                success: false,
                message: "Votre panier contient un article en double. Veuillez actualiser votre panier."
            });
        }

        const variantIds = items.map(
            item => item.variant
        );

        const clothingIds = items.map(
            item => item.clothing._id
        );

        /* =========================
           4. Transaction MongoDB
        ========================= */

        session.startTransaction();

        const variants = await Variant.find({
            _id: { $in: variantIds }
        }).session(session);

        const clothings = await Clothing.find({
            _id: { $in: clothingIds }
        }).session(session);

        /* =========================
           5. Vérification des variantes
        ========================= */

        const orderItems = [];

        let totalPrice = 0;

        for (const item of items) {

            /* =========================
               Trouver la variante
            ========================= */

            const variant = variants.find(
                v =>
                    v._id.toString() ===
                    item.variant.toString()
            );

            if (!variant) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Une des variantes sélectionnées n'existe plus"
                });
            }

            /* =========================
               Trouver le vêtement
            ========================= */

            const clothing = clothings.find(
                c =>
                    c._id.toString() ===
                    item.clothing._id.toString()
            );

            if (!clothing) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Un des articles sélectionnés n'existe plus"
                });
            }

            /* =========================
               Vérifier relation
               variant / clothing
            ========================= */

            if (
                variant.clothing.toString() !==
                clothing._id.toString()
            ) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "La variante sélectionnée ne correspond pas au produit"
                });
            }

            /* =========================
               Vérifier produit actif
            ========================= */

            if (!clothing.active) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: `Le produit "${clothing.name}" n'est plus disponible`
                });
            }

            /* =========================
               Vérifier le stock
            ========================= */

            const requestedQuantity = item.quantity;

            if (variant.quantity < requestedQuantity) {
                await session.abortTransaction();

                if (variant.quantity === 0) {
                    return res.status(400).json({
                        success: false,
                        message: `"${clothing.name}" (${variant.size}) est actuellement en rupture de stock`
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: `Stock insuffisant pour "${clothing.name}" (${variant.size}). Il reste seulement ${variant.quantity} article(s) disponible(s)`
                });
            }

            /* =========================
               Prix officiel depuis DB
            ========================= */

            const price =
                clothing.discountPrice !== null &&
                clothing.discountPrice < clothing.price
                    ? clothing.discountPrice
                    : clothing.price;

            const itemTotal =
                price * requestedQuantity;

            totalPrice += itemTotal;

            /* =========================
               Snapshot commande
            ========================= */

            orderItems.push({
                clothing: clothing._id,
                variant: variant._id,
                name: clothing.name,
                size: variant.size,
                color: variant.color,
                price,
                quantity: requestedQuantity
            });
        }

        /* =========================
           6. Calcul livraison
        ========================= */

        const normalizedWilaya = wilaya
            .trim()
            .toLowerCase();

        const deliveryFee =
            normalizedWilaya === "alger" ||
            normalizedWilaya === "algiers"
                ? 400
                : 900;

        /* =========================
           7. Décrémentation du stock
        ========================= */

        for (const item of items) {

            const updatedVariant =
                await Variant.findOneAndUpdate(
                    {
                        _id: item.variant,
                        quantity: {
                            $gte: item.quantity
                        }
                    },
                    {
                        $inc: {
                            quantity: -item.quantity
                        }
                    },
                    {
                        new: true,
                        session
                    }
                );

            /*
             * Protection contre deux commandes
             * simultanées sur le même stock.
             */

            if (!updatedVariant) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Le stock d'un des articles vient d'être modifié. Veuillez actualiser votre panier et réessayer."
                });
            }
        }

        /* =========================
           8. Création de la commande
        ========================= */

        const order = await Order.create(
            [
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    address: address.trim(),
                    phone: phone.trim(),
                    wilaya: wilaya.trim(),
                    items: orderItems,
                    totalPrice,
                    deliveryFee,
                    status: "EN_PREPARATION"
                }
            ],
            { session }
        );

        /* =========================
           9. Valider transaction
        ========================= */

        await session.commitTransaction();

        const createdOrder = order[0];

        const io = getIo();

        io.to("admins").emit("order:created", {
            order: createdOrder,
        });

        await notifyAdmins({
    title: "Nouvelle commande",
    message: `Nouvelle commande de ${order[0].firstName} ${order[0].lastName}.`,
    type: "NEW_ORDER",
});

        return res.status(201).json({
            success: true,
            message: "Commande passée avec succès",
            data: order[0]
        });

    } catch (err) {

        await session.abortTransaction();

        next(err);

    } finally {

        session.endSession();
    }
};