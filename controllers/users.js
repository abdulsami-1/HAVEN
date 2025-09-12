const User = require('../models/user.js');

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

// Handle user registration
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Registration successful! Please log in.');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}


// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

// Handle user login
module.exports.login  = async (req, res) => {
    req.flash('success', 'Login successful!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

// Handle user logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logout successful!');
        res.redirect('/listings');
    });
}
