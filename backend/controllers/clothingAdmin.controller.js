import mongoose from "mongoose";
import Clothing from "../models/clothing.model.js";
import Variant from "../models/variant.model.js";
import Category from "../models/category.model.js";
import {
    uploadImage,
    deleteImage,
} from "../services/cloudinary.service.js";
import { notifyAdmins } from "../services/notifications.service.js";

// =====================================================
// CREATE CLOTHING (+ variantes optionnelles)
// =====================================================

export const createClothing = async (req, res, next) => {

    const session = await mongoose.startSession();
    let uploadedImages = [];

    try {

        const {
            name, 
            description,
            gender,
            price, 
            discountPrice,
            category,
            active,
            variants,
        } = req.body;

        // =========================
        // NOM
        // =========================

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Le nom du vêtement est requis",
            });
        }

        // =========================
        // DESCRIPTION
        // =========================

        if (
            !description ||
            typeof description !== "string" ||
            description.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "La description est requise",
            });
        }

        // =========================
        // GENRE
        // =========================

        const gendersValides = ["HOMME", "FEMME", "UNISEXE"];

        if (!gender || !gendersValides.includes(gender)) {
            return res.status(400).json({
                success: false,
                message: "Le genre est invalide",
            });
        }

        // =========================
        // PRIX
        // =========================

        const priceNumber = Number(price);

        if (price === undefined || isNaN(priceNumber) || priceNumber < 0) {
            return res.status(400).json({
                success: false,
                message: "Le prix est invalide",
            });
        }

        // =========================
        // PRIX REMISE
        // =========================

        let discountPriceNumber = null;

        if (
            discountPrice !== undefined &&
            discountPrice !== null &&
            discountPrice !== ""
        ) {

            discountPriceNumber = Number(discountPrice);

            if (isNaN(discountPriceNumber) || discountPriceNumber < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Le prix remisé est invalide",
                });
            }

            if (discountPriceNumber >= priceNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Le prix remisé doit être inférieur au prix",
                });
            }
        }

        // =========================
        // CATEGORIE
        // =========================

        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                success: false,
                message: "La catégorie est invalide",
            });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Catégorie introuvable",
            });
        }

        // =========================
        // VARIANTES (optionnelles)
        // =========================

        let parsedVariants = [];

        if (variants !== undefined) {

            try {
                parsedVariants =
                    typeof variants === "string"
                        ? JSON.parse(variants)
                        : variants;
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Le format des variantes est invalide",
                });
            }

            if (!Array.isArray(parsedVariants)) {
                return res.status(400).json({
                    success: false,
                    message: "Les variantes doivent être une liste",
                });
            }

            const seen = new Set();

            for (const v of parsedVariants) {

                if (
                    !v.color ||
                    typeof v.color !== "string" ||
                    v.color.trim() === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "La couleur d'une variante est requise",
                    });
                }

                if (
                    !v.size ||
                    typeof v.size !== "string" ||
                    v.size.trim() === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "La taille d'une variante est requise",
                    });
                }

                const qty = Number(v.quantity);

                if (v.quantity === undefined || isNaN(qty) || qty < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "La quantité d'une variante est invalide",
                    });
                }

                const key = `${v.color.trim().toLowerCase()}_${v.size
                    .trim()
                    .toLowerCase()}`;

                if (seen.has(key)) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Deux variantes ont la même couleur et la même taille",
                    });
                }

                seen.add(key);
            }
        }

        // =========================
        // UPLOAD IMAGES CLOUDINARY
        // =========================

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            uploadedImages = await Promise.all(
                req.files.map(uploadImage)
            );
        }

        // =========================
        // TRANSACTION : création
        // =========================

        session.startTransaction();

        const createdClothingArr = await Clothing.create(
            [
                {
                    name: name.trim(),
                    description: description.trim(),
                    gender,
                    price: priceNumber,
                    discountPrice: discountPriceNumber,
                    category,
                    images: uploadedImages.map((img) => ({
                        url: img.url,
                        publicId: img.publicId,
                    })),
                    active:
                        active !== undefined
                            ? active === "true" || active === true
                            : true,
                },
            ],
            { session }
        );

        const newClothing = createdClothingArr[0];

        let createdVariants = [];

        if (parsedVariants.length > 0) {

            const variantsToInsert = parsedVariants.map((v) => ({
                clothing: newClothing._id,
                color: v.color.trim(),
                size: v.size.trim(),
                quantity: Number(v.quantity),
            }));

            createdVariants = await Variant.insertMany(
                variantsToInsert,
                { session }
            );
        }

        await session.commitTransaction();

        await notifyAdmins({
    title: "Nouveau vêtement",
    message: `Le vêtement "${newClothing.name}" a été créé.`,
    type: "NEW_CLOTHING",
});

        const populatedClothing = await Clothing.findById(
            newClothing._id
        ).populate("category");

        return res.status(201).json({
            success: true,
            message: "Vêtement créé avec succès",
            data: {
                clothing: populatedClothing,
                variants: createdVariants,
            },
        });

    } catch (err) {

        await session.abortTransaction();

        // Rollback des images déjà uploadées sur Cloudinary
        if (uploadedImages.length > 0) {
            for (const img of uploadedImages) {
                try {
                    await deleteImage(img.publicId);
                } catch (cleanupErr) {
                    console.error(
                        "Erreur rollback image Cloudinary:",
                        cleanupErr
                    );
                }
            }
        }

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Une variante identique (couleur/taille) existe déjà",
            });
        }

        next(err);

    } finally {
        session.endSession();
    }
};

// =====================================================
// UPDATE CLOTHING (infos + images, pas les variantes)
// =====================================================

export const updateClothing = async (req, res, next) => {

    try {

        const clothingId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(clothingId)) {
            return res.status(400).json({
                success: false,
                message: "Identifiant du vêtement invalide",
            });
        }

        const clothing = await Clothing.findById(clothingId);

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Vêtement introuvable",
            });
        }

        const updates = {};

        const {
            name,
            description,
            gender,
            price,
            discountPrice,
            category,
            active,
            existingImageIds,
        } = req.body;

        // =========================
        // NOM
        // =========================

        if (name !== undefined) {

            if (typeof name !== "string" || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Le nom est invalide",
                });
            }

            updates.name = name.trim();
        }

        // =========================
        // DESCRIPTION
        // =========================

        if (description !== undefined) {

            if (
                typeof description !== "string" ||
                description.trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: "La description est invalide",
                });
            }

            updates.description = description.trim();
        }

        // =========================
        // GENRE
        // =========================

        if (gender !== undefined) {

            const gendersValides = ["HOMME", "FEMME", "UNISEXE"];

            if (!gendersValides.includes(gender)) {
                return res.status(400).json({
                    success: false,
                    message: "Le genre est invalide",
                });
            }

            updates.gender = gender;
        }

        // =========================
        // PRIX
        // =========================

        if (price !== undefined) {

            const priceNumber = Number(price);

            if (isNaN(priceNumber) || priceNumber < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Le prix est invalide",
                });
            }

            updates.price = priceNumber;
        }

        // =========================
        // PRIX REMISE
        // =========================

        if (discountPrice !== undefined) {

            if (discountPrice === null || discountPrice === "") {
                updates.discountPrice = null;
            } else {

                const discountPriceNumber = Number(discountPrice);

                const refPrice =
                    updates.price !== undefined
                        ? updates.price
                        : clothing.price;

                if (
                    isNaN(discountPriceNumber) ||
                    discountPriceNumber < 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Le prix remisé est invalide",
                    });
                }

                if (discountPriceNumber >= refPrice) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Le prix remisé doit être inférieur au prix",
                    });
                }

                updates.discountPrice = discountPriceNumber;
            }
        }

        // =========================
        // CATEGORIE
        // =========================

        if (category !== undefined) {

            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    success: false,
                    message: "La catégorie est invalide",
                });
            }

            const categoryExists = await Category.findById(category);

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Catégorie introuvable",
                });
            }

            updates.category = category;
        }

        // =========================
        // ACTIF
        // =========================

        if (active !== undefined) {
            updates.active = active === "true" || active === true;
        }

        // =========================
        // IMAGES : conservées / supprimées
        // =========================

        const currentImages = clothing.images;

        let parsedExistingIds = null;

        if (existingImageIds !== undefined) {

            try {
                parsedExistingIds =
                    typeof existingImageIds === "string"
                        ? JSON.parse(existingImageIds)
                        : existingImageIds;
            } catch {
                return res.status(400).json({
                    success: false,
                    message:
                        "Impossible de lire les images existantes",
                });
            }

            if (
                !Array.isArray(parsedExistingIds) ||
                !parsedExistingIds.every((id) => typeof id === "string")
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Le format des images existantes est invalide",
                });
            }
        }

        let keptImages = currentImages;

        if (parsedExistingIds !== null) {

            const imagesToDelete = currentImages.filter(
                (img) => !parsedExistingIds.includes(img._id.toString())
            );

            for (const img of imagesToDelete) {
                await deleteImage(img.publicId);
            }

            keptImages = currentImages.filter((img) =>
                parsedExistingIds.includes(img._id.toString())
            );
        }

        // =========================
        // NOUVELLES IMAGES
        // =========================

        let newImages = [];

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {

            const uploaded = await Promise.all(
                req.files.map(uploadImage)
            );

            newImages = uploaded.map((img) => ({
                url: img.url,
                publicId: img.publicId,
            }));
        }

        if (parsedExistingIds !== null || newImages.length > 0) {
            updates.images = [...keptImages, ...newImages];
        }

        // =========================
        // AUCUNE MODIFICATION
        // =========================

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Aucune modification fournie",
            });
        }

        const updatedClothing = await Clothing.findByIdAndUpdate(
            clothingId,
            updates,
            { new: true }
        ).populate("category");

        return res.status(200).json({
            success: true,
            message: "Vêtement mis à jour avec succès",
            data: updatedClothing,
        });

    } catch (err) {
        next(err);
    }
};

// =====================================================
// DELETE CLOTHING (+ variantes + images Cloudinary)
// =====================================================

export const deleteClothing = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {

        const clothingId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(clothingId)) {
            return res.status(400).json({
                success: false,
                message: "Identifiant du vêtement invalide",
            });
        }

        const clothing = await Clothing.findById(clothingId);

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Vêtement introuvable",
            });
        }

        session.startTransaction();

        await Variant.deleteMany(
            { clothing: clothingId },
            { session }
        );

        await Clothing.findByIdAndDelete(
            clothingId,
            { session }
        );

        await session.commitTransaction();

        // Suppression des images Cloudinary une fois la
        // transaction validée (évite les images orphelines
        // supprimées trop tôt en cas d'échec de la transaction).
        if (clothing.images && clothing.images.length > 0) {
            for (const img of clothing.images) {
                try {
                    await deleteImage(img.publicId);
                } catch (cleanupErr) {
                    console.error(
                        "Erreur suppression image Cloudinary:",
                        cleanupErr
                    );
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Vêtement et ses variantes supprimés avec succès",
            data: clothingId,
        });

    } catch (err) {

        await session.abortTransaction();
        next(err);

    } finally {
        session.endSession();
    }
};