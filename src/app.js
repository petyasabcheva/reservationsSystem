require('dotenv').config(); // Ensure environment variables are read at the very top

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const User = require('./models/User');
const Reservation = require('./models/Reservation');

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: true 
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));


function setUserLocals(req, res, next) {
    if (req.session && req.session.userId) {
        res.locals.user = req.session.username;
    }
    next();
}

app.use(setUserLocals);


const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/reservations', reservationRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.render('home');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

