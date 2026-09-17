import mongoose from "mongoose";
import Variant from "../models/variant.model.js";
import Clothing from "../models/clothing.model.js";

// =====================================================
// ADD VARIANT
// =====================================================

export const addVariant = async (req, res, next) => {

    try {

        const { clothing, color, size, quantity } = req.body;

        if (!clothing || !mongoose.Types.ObjectId.isValid(clothing)) {
            return res.status(400).json({
                success: false,
                message: "Le vêtement est invalide",
            });
        }

        const clothingExists = await Clothing.findById(clothing);

        if (!clothingExists) {
            return res.status(404).json({
                success: false,
                message: "Vêtement introuvable",
            });
        }

        if (!color || typeof color !== "string" || color.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "La couleur est requise",
            });
        }

        if (!size || typeof size !== "string" || size.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "La taille est requise",
            });
        }

        const quantityNumber = Number(quantity);

        if (
            quantity === undefined ||
            isNaN(quantityNumber) ||
            quantityNumber < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "La quantité est invalide",
            });
        }

        const newVariant = await Variant.create({
            clothing,
            color: color.trim(),
            size: size.trim(),
            quantity: quantityNumber,
        });

        return res.status(201).json({
            success: true,
            message: "Variante ajoutée avec succès",
            data: newVariant,
        });

    } catch (err) {

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Cette variante (couleur/taille) existe déjà pour ce produit",
            });
        }

        next(err);
    }
};

// =====================================================
// UPDATE VARIANT
// =====================================================

export const updateVariant = async (req, res, next) => {

    try {

        const variantId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(variantId)) {
            return res.status(400).json({
                success: false,
                message: "Identifiant de la variante invalide",
            });
        }

        const variant = await Variant.findById(variantId);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variante introuvable",
            });
        }

        const updates = {};

        const { color, size, quantity } = req.body;

        if (color !== undefined) {

            if (typeof color !== "string" || color.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "La couleur est invalide",
                });
            }

            updates.color = color.trim();
        }

        if (size !== undefined) {

            if (typeof size !== "string" || size.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "La taille est invalide",
                });
            }

            updates.size = size.trim();
        }

        if (quantity !== undefined) {

            const quantityNumber = Number(quantity);

            if (isNaN(quantityNumber) || quantityNumber < 0) {
                return res.status(400).json({
                    success: false,
                    message: "La quantité est invalide",
                });
            }

            updates.quantity = quantityNumber;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Aucune modification fournie",
            });
        }

        const updatedVariant = await Variant.findByIdAndUpdate(
            variantId,
            updates,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Variante mise à jour avec succès",
            data: updatedVariant,
        });

    } catch (err) {

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Une variante avec cette couleur/taille existe déjà pour ce produit",
            });
        }

        next(err);
    }
};

// =====================================================
// DELETE VARIANT
// =====================================================

export const deleteVariant = async (req, res, next) => {

    try {

        const variantId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(variantId)) {
            return res.status(400).json({
                success: false,
                message: "Identifiant de la variante invalide",
            });
        }

        const variant = await Variant.findById(variantId);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variante introuvable",
            });
        }

        await Variant.findByIdAndDelete(variantId);

        return res.status(200).json({
            success: true,
            message: "Variante supprimée avec succès",
            data: variantId,
        });

    } catch (err) {
        next(err);
    }
};