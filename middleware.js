const Listing = require('./models/listing.js');
const Review = require('./models/reviews.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');

// Check if user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to create a new listing.');
        return res.redirect('/login');
    }
    next();
};

// Save redirect URL for after login
module.exports.saveRedirectUrl = (req, res, next) =>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Check if user owns the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }
    if(!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Check if user owns the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Validate listing data
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

// Validate review data
module.exports.validateReview = (req ,res ,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};
