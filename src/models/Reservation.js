const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    resName: { type: String, required: true }, // Name for whom the reservation is made
    notes: { type: String }, // Additional notes for the reservation
    smoking: { type: Boolean, default: false }, // Smoking area preference
    children: { type: Boolean, default: false } // Indicates if the reservation needs to be child-friendly
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
