import Hero from "../models/hero.model.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";


// =====================================================
// GET HERO
// =====================================================

export const getHero = async (req, res, next) => {
    try {
        const hero = await Hero.findOne().lean();

        if (!hero) {
            return res.status(404).json({
                success: false,
                message: "Hero not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: hero
        });

    } catch (err) {
        next(err);
    }
};


// =====================================================
// CREATE HERO
// =====================================================

export const createHero = async (req, res, next) => {

    const uploadedImages = [];

    try {

        // =================================================
        // CHECK EXISTING HERO
        // =================================================

        const existingHero = await Hero.findOne();

        if (existingHero) {
            return res.status(409).json({
                success: false,
                message: "Hero already exists"
            });
        }

        // =================================================
        // BODY
        // =================================================

        let slides;
        let featuredProducts;

        try {
            slides = typeof req.body.slides === "string"
                ? JSON.parse(req.body.slides)
                : req.body.slides;

            featuredProducts = typeof req.body.featuredProducts === "string"
                ? JSON.parse(req.body.featuredProducts)
                : req.body.featuredProducts;

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON data"
            });
        }

        // =================================================
        // VALIDATION
        // =================================================

        if (!Array.isArray(slides)) {
            return res.status(400).json({
                success: false,
                message: "Slides must be an array"
            });
        }

        if (slides.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Hero must contain at least 3 slides"
            });
        }

        if (!Array.isArray(featuredProducts)) {
            return res.status(400).json({
                success: false,
                message: "Featured products must be an array"
            });
        }

        if (featuredProducts.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Hero must contain exactly 2 featured products"
            });
        }

        // =================================================
        // FILES
        // =================================================

        const slideImages = req.files?.slideImages || [];
        const featuredProductImages = req.files?.featuredProductImages || [];

        if (slideImages.length !== slides.length) {
            return res.status(400).json({
                success: false,
                message: "Each slide must have an image"
            });
        }

        if (featuredProductImages.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Each featured product must have an image"
            });
        }

        // =================================================
        // UPLOAD SLIDE IMAGES
        // =================================================

        const createdSlides = [];

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];

            const uploadedImage = await uploadImage(
                slideImages[i],
                "NovaFashion/Hero/Slides"
            );

            uploadedImages.push(uploadedImage.publicId);

            createdSlides.push({
                kicker: slide.kicker,
                title: slide.title,
                description: slide.description,
                cta: slide.cta,
                image: {
                    url: uploadedImage.url,
                    publicId: uploadedImage.publicId
                }
            });
        }

        // =================================================
        // UPLOAD FEATURED PRODUCT IMAGES
        // =================================================

        const createdFeaturedProducts = [];

        for (let i = 0; i < featuredProducts.length; i++) {
            const product = featuredProducts[i];

            const uploadedImage = await uploadImage(
                featuredProductImages[i],
                "NovaFashion/Hero/FeaturedProducts"
            );

            uploadedImages.push(uploadedImage.publicId);

            createdFeaturedProducts.push({
                name: product.name,
                category: product.category,
                price: Number(product.price),
                image: {
                    url: uploadedImage.url,
                    publicId: uploadedImage.publicId
                }
            });
        }

        // =================================================
        // CREATE HERO
        // =================================================

        const hero = await Hero.create({
            slides: createdSlides,
            featuredProducts: createdFeaturedProducts
        });

        return res.status(201).json({
            success: true,
            message: "Hero created successfully",
            data: hero
        });

    } catch (err) {

        // Rollback Cloudinary si la création DB échoue
        if (uploadedImages.length > 0) {
            await Promise.allSettled(
                uploadedImages.map((publicId) => deleteImage(publicId))
            );
        }

        next(err);
    }
};


// =====================================================
// UPDATE HERO
// =====================================================

export const updateHero = async (req, res, next) => {

    const newlyUploadedImages = [];

    try {

        // =================================================
        // GET HERO
        // =================================================

        const hero = await Hero.findOne();

        if (!hero) {
            return res.status(404).json({
                success: false,
                message: "Hero not found"
            });
        }

        // =================================================
        // BODY
        // =================================================

        let slides;
        let featuredProducts;

        try {
            slides = typeof req.body.slides === "string"
                ? JSON.parse(req.body.slides)
                : req.body.slides;

            featuredProducts = typeof req.body.featuredProducts === "string"
                ? JSON.parse(req.body.featuredProducts)
                : req.body.featuredProducts;

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON data"
            });
        }

        // =================================================
        // VALIDATION
        // =================================================

        if (!Array.isArray(slides)) {
            return res.status(400).json({
                success: false,
                message: "Slides must be an array"
            });
        }

        if (slides.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Hero must contain at least 3 slides"
            });
        }

        if (!Array.isArray(featuredProducts)) {
            return res.status(400).json({
                success: false,
                message: "Featured products must be an array"
            });
        }

        if (featuredProducts.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Hero must contain exactly 2 featured products"
            });
        }

        // =================================================
        // FILES
        // =================================================

        const slideImages = req.files?.slideImages || [];
        const featuredProductImages = req.files?.featuredProductImages || [];

        // =================================================
        // SLIDE IMAGE INDEXES
        // =================================================
        //
        // slides:
        // [ slide 0 -> ancienne image, slide 1 -> nouvelle image, slide 2 -> ancienne image ]
        // slideImageIndexes = [1]
        // slideImages[0] correspond donc au slide 1.
        // =================================================

        let slideImageIndexes = [];

        if (req.body.slideImageIndexes) {
            slideImageIndexes = typeof req.body.slideImageIndexes === "string"
                ? JSON.parse(req.body.slideImageIndexes)
                : req.body.slideImageIndexes;
        }

        let featuredProductImageIndexes = [];

        if (req.body.featuredProductImageIndexes) {
            featuredProductImageIndexes = typeof req.body.featuredProductImageIndexes === "string"
                ? JSON.parse(req.body.featuredProductImageIndexes)
                : req.body.featuredProductImageIndexes;
        }

        // =================================================
        // VALIDATE SLIDE IMAGE INDEXES
        // =================================================

        if (!Array.isArray(slideImageIndexes) || slideImageIndexes.length !== slideImages.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid slide image indexes"
            });
        }

        for (const index of slideImageIndexes) {
            if (!Number.isInteger(index) || index < 0 || index >= slides.length) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid slide image index"
                });
            }
        }

        // =================================================
        // VALIDATE FEATURED IMAGE INDEXES
        // =================================================

        if (!Array.isArray(featuredProductImageIndexes) || featuredProductImageIndexes.length !== featuredProductImages.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid featured product image indexes"
            });
        }

        for (const index of featuredProductImageIndexes) {
            if (!Number.isInteger(index) || index < 0 || index >= featuredProducts.length) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid featured product image index"
                });
            }
        }

        // =================================================
        // REFERENCE MAPS (pour retrouver les anciennes images)
        // =================================================

        const oldSlidesById = new Map(
            hero.slides.map((s) => [s._id.toString(), s])
        );

        const newSlideIds = slides
            .filter((slide) => slide._id)
            .map((slide) => slide._id.toString());

        const deletedSlides = hero.slides.filter(
            (oldSlide) => !newSlideIds.includes(oldSlide._id.toString())
        );

        // =================================================
        // UPLOAD NEW SLIDE IMAGES
        // =================================================

        const uploadedSlideImages = {};

        for (let i = 0; i < slideImages.length; i++) {
            const slideIndex = slideImageIndexes[i];

            const uploadedImage = await uploadImage(
                slideImages[i],
                "NovaFashion/Hero/Slides"
            );

            newlyUploadedImages.push(uploadedImage.publicId);
            uploadedSlideImages[slideIndex] = uploadedImage;
        }

        // =================================================
        // BUILD NEW SLIDES + collecte des images à supprimer
        // =================================================

        const updatedSlides = [];
        const slideImagesToDelete = [];

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            let image;

            if (uploadedSlideImages[i]) {

                image = {
                    url: uploadedSlideImages[i].url,
                    publicId: uploadedSlideImages[i].publicId
                };

                // Image remplacée -> l'ancienne devient orpheline, à supprimer
                const oldSlide = slide._id
                    ? oldSlidesById.get(slide._id.toString())
                    : null;

                if (oldSlide?.image?.publicId) {
                    slideImagesToDelete.push(oldSlide.image.publicId);
                }

            } else if (slide.image?.url && slide.image?.publicId) {

                image = {
                    url: slide.image.url,
                    publicId: slide.image.publicId
                };

            } else {

                return res.status(400).json({
                    success: false,
                    message: `Image is required for slide ${i + 1}`
                });
            }

            updatedSlides.push({
                ...(slide._id ? { _id: slide._id } : {}),
                kicker: slide.kicker,
                title: slide.title,
                description: slide.description,
                cta: slide.cta,
                image
            });
        }

        // Slides carrément supprimés -> leur image aussi
        for (const deletedSlide of deletedSlides) {
            if (deletedSlide.image?.publicId) {
                slideImagesToDelete.push(deletedSlide.image.publicId);
            }
        }

        // =================================================
        // UPLOAD NEW FEATURED PRODUCT IMAGES
        // =================================================

        const uploadedFeaturedImages = {};

        for (let i = 0; i < featuredProductImages.length; i++) {
            const productIndex = featuredProductImageIndexes[i];

            const uploadedImage = await uploadImage(
                featuredProductImages[i],
                "NovaFashion/Hero/FeaturedProducts"
            );

            newlyUploadedImages.push(uploadedImage.publicId);
            uploadedFeaturedImages[productIndex] = uploadedImage;
        }

        // =================================================
        // BUILD FEATURED PRODUCTS + collecte des images à supprimer
        // =================================================

        const updatedFeaturedProducts = [];
        const featuredImagesToDelete = [];

        for (let i = 0; i < featuredProducts.length; i++) {
            const product = featuredProducts[i];
            let image;

            if (uploadedFeaturedImages[i]) {

                image = {
                    url: uploadedFeaturedImages[i].url,
                    publicId: uploadedFeaturedImages[i].publicId
                };

                // Image remplacée -> supprimer l'ancienne (retrouvée via l'ancien doc, par _id ou par index)
                const oldProduct = product._id
                    ? hero.featuredProducts.find((p) => p._id.toString() === product._id.toString())
                    : hero.featuredProducts[i];

                if (oldProduct?.image?.publicId) {
                    featuredImagesToDelete.push(oldProduct.image.publicId);
                }

            } else if (product.image?.url && product.image?.publicId) {

                image = {
                    url: product.image.url,
                    publicId: product.image.publicId
                };

            } else {

                return res.status(400).json({
                    success: false,
                    message: `Image is required for featured product ${i + 1}`
                });
            }

            updatedFeaturedProducts.push({
                ...(product._id ? { _id: product._id } : {}),
                name: product.name,
                category: product.category,
                price: Number(product.price),
                image
            });
        }

        // =================================================
        // UPDATE DATABASE
        // =================================================

        hero.slides = updatedSlides;
        hero.featuredProducts = updatedFeaturedProducts;

        await hero.save();

        // =================================================
        // DELETE OLD / REPLACED IMAGES (best-effort, après save réussi)
        // =================================================

        const allImagesToDelete = [...slideImagesToDelete, ...featuredImagesToDelete];

        if (allImagesToDelete.length > 0) {
            const results = await Promise.allSettled(
                allImagesToDelete.map((publicId) => deleteImage(publicId))
            );

            results.forEach((result, i) => {
                if (result.status === "rejected") {
                    console.error(
                        `Failed to delete old Cloudinary image ${allImagesToDelete[i]}:`,
                        result.reason
                    );
                }
            });
        }

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,
            message: "Hero updated successfully",
            data: hero
        });

    } catch (err) {

        // Rollback des images tout juste uploadées si la sauvegarde échoue
        if (newlyUploadedImages.length > 0) {
            await Promise.allSettled(
                newlyUploadedImages.map((publicId) => deleteImage(publicId))
            );
        }

        next(err);
    }
};