const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');

// Listing schema definition
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: [
            'Rooms',
            'Cities',
            'Mountains',
            'Pools',
            'Beach',
            'Amazing views',
            'Lakefront',
            'Tiny homes',
            'Treehouses',
            'Luxe'
        ],
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Delete associated reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

