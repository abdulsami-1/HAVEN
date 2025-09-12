const Joi = require('joi');

// Listing validation schema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().valid(
            'Rooms','Cities','Mountains','Pools','Beach','Amazing views','Lakefront','Tiny homes','Treehouses','Luxe'
        ).required(),
        image: Joi.string().allow("", null),
    }).required()
})

// Review validation schema
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})
