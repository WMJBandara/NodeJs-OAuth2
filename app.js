const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const { required } = require('joi');
var methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

const PORT = process.env.PORT || 3000;

connectDB();
// Login
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}
// Handlebars helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');
// Handlebars
app.engine('hbs', exphbs({
    helpers : {
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select
    },
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

app.set('view engine', 'hbs');
//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection : mongoose.connection })
}));

// Passport middlewear
app.use(passport.initialize());
app.use(passport.session());
// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
  });

app.use(express.static('contents'));


//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
