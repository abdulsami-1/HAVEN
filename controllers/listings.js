const Listing = require('../models/listing.js');
const axios = require("axios");
const mapTilerToken = process.env.MAPTILER_API_KEY;

// Geocode location using MapTiler API
async function geocode(location) {
    try {
        if (!location || !location.trim()) {
            return [0, 0]; // Default coordinates for empty location
        }
        
        const response = await axios.get(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(location.trim())}.json`,
            {
                params: { key: mapTilerToken },
                timeout: 5000 // 5 second timeout
            }
        );
        
        if (response.data.features && response.data.features.length > 0) {
            return response.data.features[0].geometry.coordinates;
        }
        
        return [0, 0]; // Fallback if no features found
    } catch (err) {
        // Log error for debugging but don't expose to user
        console.error("Geocoding failed:", err.message);
        return [0, 0]; // Fallback coordinates
    }
}

// Display all listings with filters
module.exports.index = async (req, res) => {
    const { category, q, loc, start, end } = req.query;
    const query = {};
    if (category) query.category = category;
    if (q && q.trim()) {
        const regex = new RegExp(q.trim(), 'i');
        query.$or = [
            { title: regex },
            { description: regex },
            { location: regex },
            { country: regex }
        ];
    }
    if (loc && loc.trim()) {
        const locRegex = new RegExp(loc.trim(), 'i');
        query.$or = (query.$or || []).concat([{ location: locRegex }, { country: locRegex }]);
    }
    const allListings = await Listing.find(query).select('title price location country image category');
    res.render('listings/index', { allListings, showSearch: true, selectedCategory: category || '', searchQ: q || '', loc: loc || '', start: start || '', end: end || '' })
}

// Provide search suggestions
module.exports.suggest = async (req, res) => {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json([]);
    const regex = new RegExp(q.trim(), 'i');
    const docs = await Listing.find({ $or: [ { title: regex }, { location: regex }, { country: regex } ] }).limit(8).select('title location country');
    const suggestions = [];
    for (const d of docs) {
        if (d.title) suggestions.push(d.title);
        if (d.location) suggestions.push(d.location);
        if (d.country) suggestions.push(d.country);
    }
    const unique = [...new Set(suggestions)];
    res.json(unique.slice(0, 10));
}

// Render new listing form
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

// Show individual listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash('error', 'The requested listing was not found.');
        return res.redirect('/listings');
    }
    // Debug info removed for production
    res.render('listings/show.ejs', { listing });
}

// Create new listing
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const coords = await geocode(req.body.listing.location);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = { type: "Point", coordinates: coords };

    let savedListing = await newListing.save();
    // Listing saved successfully

    req.flash('success', 'New listing created successfully!');
    res.redirect('/listings');
}


// Render edit form
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'The requested listing was not found.');
        return res.redirect('/listings');
    }
    let origionalImageUrl = listing.image.url;
    origionalImageUrl = origionalImageUrl.replace('/upload', '/upload/h_100,w_250');
    res.render('listings/edit.ejs', { listing, origionalImageUrl });
}


// Update existing listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // Preserve category if not provided
    if (!req.body.listing.category) {
        const existing = await Listing.findById(id).select('category');
        if (existing && existing.category) {
            req.body.listing.category = existing.category;
        }
    }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash('success', 'listing updated successfully!');
    res.redirect(`/listings/${id}`);
}


// Delete listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // Listing deleted successfully
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
}
