// app.js

// ─── 1) SWALLOW DEP0170 WARNINGS ─────────────────────────────────────────────
const _origEmit = process.emitWarning;
process.emitWarning = (warning, type, code, ...args) => {
  if (type === 'DeprecationWarning' && code === 'DEP0170') return;
  return _origEmit.call(process, warning, type, code, ...args);
};

// ─── 2) REQUIRE & CONFIG ────────────────────────────────────────────────────
require('dotenv').config();
const express        = require('express');
const path           = require('path');
const mongoose       = require('mongoose');
const ejsMate        = require('ejs-mate');
const session        = require('express-session');
const flash          = require('connect-flash');
const ExpressError   = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const User           = require('./models/user');
const helmet         = require('helmet');
const mongoSanitize  = require('express-mongo-sanitize');
const MongoStore     = require('connect-mongo');

const userRoutes       = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes     = require('./routes/reviews');

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error('ERROR: DB_URL not set in .env');
  process.exit(1);
}

// ─── 3) CREATE EXPRESS APP & MIDDLEWARE ─────────────────────────────────────
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(helmet());

// Content Security Policy (same as before)
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dpm1itwcr/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// ─── 4) SESSION & FLASH ───────────────────────────────────────────────────────
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store  = MongoStore.create({
  mongoUrl: dbUrl,
  mongoOptions: {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  },
  touchAfter: 24 * 60 * 60,
  crypto: { secret }
});
store.on('error', err => console.error('SESSION STORE ERROR:', err));

app.use(session({
  store,
  name:   'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // enable in production
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 60 * 1000
  }
}));

app.use(flash());

// ─── 5) PASSPORT CONFIG ──────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up locals for all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success     = req.flash('success');
  res.locals.error       = req.flash('error');
  next();
});

// ─── 6) ROUTES ────────────────────────────────────────────────────────────────
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => res.render('home'));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// ─── 7) ERROR HANDLER ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

// ─── 8) CONNECT TO MONGODB ───────────────────────────────────────────────────
console.log('Connecting to MongoDB…');
mongoose.connect(dbUrl, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
  useCreateIndex:     true
})
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ─── 9) EXPORT FOR VERCEL ────────────────────────────────────────────────────
module.exports = app;
