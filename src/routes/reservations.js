const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

router.get('/new', (req, res) => {
    res.render('reservation', { errorMessage: '' });
});

router.post('/new', async (req, res) => {
    try {
        const { resName, date, time, numberOfPeople, notes, smoking, children } = req.body;
        const newReservation = new Reservation({
            resName,
            date,
            time,
            numberOfPeople,
            notes,
            smoking: smoking === 'on',
            children: children === 'on'
        });
        await newReservation.save();
        res.redirect('/reservations/dashboard');
    } catch (error) {
        res.status(500).render('reservation', { errorMessage: "Error creating reservation: " + error.message });
    }
});

router.get('/dashboard', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('dashboard', { reservations, errorMessage: '' });
    } catch (error) {
        res.status(500).render('dashboard', { errorMessage: "Error retrieving reservations: " + error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (reservation) {
            res.render('reservationDetails', { reservation, errorMessage: '' });
        } else {
            res.status(404).render('dashboard', { errorMessage: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).render('dashboard', { errorMessage: "Error retrieving reservation: " + error.message });
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (reservation) {
            res.render('editReservation', { reservation, errorMessage: '' });
        } else {
            res.status(404).render('dashboard', { errorMessage: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).render('editReservation', { errorMessage: "Error retrieving reservation: " + error.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { resName, date, time, numberOfPeople, notes, smoking, children } = req.body;
        await Reservation.findByIdAndUpdate(req.params.id, {
            resName,
            date,
            time,
            numberOfPeople,
            notes,
            smoking: smoking === 'on',
            children: children === 'on'
        }, { new: true });
        res.redirect('/reservations/dashboard');
    } catch (error) {
        res.status(500).render('editReservation', { errorMessage: "Error updating reservation: " + error.message });
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/reservations/dashboard');
    } catch (error) {
        res.status(500).render('dashboard', { errorMessage: "Error deleting reservation: " + error.message });
    }
});

module.exports = router;
