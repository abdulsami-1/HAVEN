// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const reviewRouter = require('./routes/review.js');
const listingRouter = require('./routes/listing.js');
const userRouter = require('./routes/user.js');

const dbURL = process.env.ATLASDB_URL;

// Configure view engine and middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

// Connect to MongoDB
main().catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
});

async function main() {
    mongoose.set('strictQuery', true);
    
    const atlasOptions = {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority',
        tls: true,
        tlsAllowInvalidHostnames: false,
        tlsAllowInvalidCertificates: false
    };
    
    if (dbURL && dbURL !== 'undefined') {
        await mongoose.connect(dbURL, atlasOptions);
    } else {
        const localDB = 'mongodb://127.0.0.1:27017/haven-local';
        await mongoose.connect(localDB, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });
    }
}

// Session store setup
const store = MongoStore.create({
    mongoUrl: dbURL || 'mongodb://127.0.0.1:27017/haven-local',
    crypto: {
        secret: process.env.SECRET || 'fallback-secret',
    },
    touchAfter: 24 * 3600
});

store.on("error", () => {
    // Session store connection handled internally
});

const sessionOptions = {
    store,
    secret: process.env.SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Configure authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Handle 404 errors
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, 'Page not found!'));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', {message});
});

// Start server
app.listen(8080);
