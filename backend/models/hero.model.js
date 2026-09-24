import mongoose from "mongoose"



const heroSlideSchema = new mongoose.Schema(
    {
        image : {
            url : {
                type : String,
                required : true,
                trim : true
            },
            publicId : {
                type : String,
                required: true,
                trim: true
            }
        },
        kicker : {
            type : String,
            required : true,
            trim : true
        },
        title : {
            type : String,
            trim : true,
            required : true
        },
        description : {
            type : String,
            required : true,
            trim : true
        },
        cta : {
            type : String,
            required : true,
            trim : true
        }
    },
    {_id : true}
)


const featuredProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        image: {
            url: {
                type: String,
                required: true,
                trim: true,
            },

            publicId: {
                type: String,
                required: true,
                trim: true,
            },
        },
    },
    {
        _id: true,
    }
);

const heroSchema = new mongoose.Schema({
    slides : {
        type : [heroSlideSchema],
        required : true,
        validate: {
                validator: (slides) => slides.length >= 3,
                message: "Hero must contain at least 3 slides.",
            },
    },
    featuredProducts: {
            type: [featuredProductSchema],

            required: true,

            validate: {
                validator: (products) => products.length === 2,
                message: "Hero must contain exactly 2 featured products.",
            },
    },
},
{timestamps : true}
)

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;