const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res) => {
  console.log('Accessing the login page');
  res.render('login', { errorMessage: '' });
});

router.get('/register', (req, res) => {
  console.log('Accessing the register page');
  res.render('register', { errorMessage: '' }); 
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error('Username already exists');
    }
    const user = new User({ username, password });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.render('register', { errorMessage: "Registration error: " + error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.username = user.username;
      console.log(user); 
      res.redirect('/reservations/dashboard'); 
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.render('login', { errorMessage: "Login error: " + error.message });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send("Logout error: " + err.message);
    } else {
      res.redirect('/'); 
    }
  });
});

module.exports = router;
