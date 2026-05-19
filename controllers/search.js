const Listing = require('../models/listing');

// Search listings by query
module.exports.searchListings = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.redirect('/listings');
    }

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
        ]
    });

    res.render('listings/index', { allListings, showSearch: true });
};
