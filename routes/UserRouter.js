import express from 'express';
import passport from 'passport';
import User from '../model/User.js';
import bcrypt from 'bcrypt';
const router = express.Router();
const saltRounds = 10; 

router.get('/', (req, res) => {
  res.send('Home Page');
});

router.get('/login', (req, res) => {
  res.send('Login Page');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

router.get('/signup', (req, res) => {
  res.send('Signup Page');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    if (!password) {
      throw new Error('Password is missing.');
    }

    console.log('Password:', password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error signing up');
  }
});

router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Dashboard Page');
  } else {
    res.redirect('/login');
  }
});

export default router;
