import Category from "../models/category.model.js";

import {
    uploadImage,
    deleteImage,
} from "../services/cloudinary.service.js";
import { notifyAdmins } from "../services/notifications.service.js";


// =====================================================
// CREATE CATEGORY
// =====================================================

export const createCategory = async (req, res, next) => {

    try {

        const { name, description } = req.body;

        // =========================
        // VALIDATION
        // =========================

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        if (!description || description.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category description is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Category image is required",
            });
        }

        // =========================
        // UPLOAD IMAGE
        // =========================

        const uploadedImage = await uploadImage(req.file);

        // =========================
        // CREATE CATEGORY
        // =========================

        const newCategory = await Category.create({
            name: name.trim(),
            description: description.trim(),

            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            },
        });

        await notifyAdmins({
    title: "Nouvelle catégorie",
    message: `La catégorie "${newCategory.name}" a été créée.`,
    type: "NEW_CATEGORY",
});

        // =========================
        // RESPONSE
        // =========================

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory,
        });

    } catch (err) {

        next(err);

    }
};


// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategory = async (req, res, next) => {

    try {

        const id = req.params.id;
        const { name, description } = req.body;

        // =========================
        // FIND CATEGORY
        // =========================

        const existingCategory = await Category.findById(id);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // =========================
        // DATA TO UPDATE
        // =========================

        const updates = {};

        if (name && name.trim() !== "") {
            updates.name = name.trim();
        }

        if (description && description.trim() !== "") {
            updates.description = description.trim();
        }

        // =========================
        // IMAGE
        // =========================

        if (req.file) {

            // 1. Upload new image

            const uploadedImage = await uploadImage(req.file);

            // 2. Delete old image

            if (existingCategory.image?.publicId) {

                await deleteImage(
                    existingCategory.image.publicId
                );

            }

            // 3. Update image data

            updates.image = {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            };
        }

        // =========================
        // NOTHING TO UPDATE
        // =========================

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided for update",
            });
        }

        // =========================
        // UPDATE CATEGORY
        // =========================

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                $set: updates,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });

    } catch (err) {

        next(err);

    }
};


// =====================================================
// DELETE CATEGORY
// =====================================================

export const deleteCategory = async (req, res, next) => {

    try {

        const categoryId = req.params.id;

        // =========================
        // FIND CATEGORY
        // =========================

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // =========================
        // DELETE CLOUDINARY IMAGE
        // =========================

        if (category.image?.publicId) {

            await deleteImage(
                category.image.publicId
            );

        }

        // =========================
        // DELETE CATEGORY
        // =========================

        await category.deleteOne();

        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
        });

    } catch (err) {

        next(err);

    }
};