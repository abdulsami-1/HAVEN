const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');
const { isLoggedIn } = require('../middleware.js');

// Root route - redirect to listings
router.get('/', (req, res) => {
    res.redirect('/listings');
});

// Static pages
router.get('/help', (req, res) => {
    res.render('help');
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('users/profile', { user: req.user });
});

router.get('/trips', isLoggedIn, (req, res) => {
    res.render('users/trips', { user: req.user });
});

// Footer links - coming soon pages
router.get(['/privacy','/terms','/sitemap','/aircover','/anti-discrimination','/disability-support','/hosting-resources','/community-forum','/newsroom','/careers','/get-the-app'], (req, res) => {
    const pathTitle = req.path.replace('/', '').replace(/-/g, ' ');
    const title = pathTitle.charAt(0).toUpperCase() + pathTitle.slice(1);
    res.render('coming-soon', { title });
});

// Authentication routes
router.route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route('/login')
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), userController.login);

router.get('/logout', userController.logout);

module.exports = router;
