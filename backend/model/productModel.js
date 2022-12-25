import mongoose from "mongoose";
import slug from 'mongoose-slug-generator';

mongoose.plugin(slug);

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        category: {type: String, require: true},
        description: {type: [String], require: true},
        image: {type: String, require: true},
        price: {type: Number, require: true},
        quantity: {type: Number, require: true},
        brand: {type: String, require: true},
        rating: {type: Number, require: true},
        reviews: {type: Number, require: true},
        customerReviews: [reviewSchema],
        slug: {type: String, slug:["name", "brand"], slug_padding_size: 5}
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;