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

// router.post('/userlogin', passport.authenticate('local', {
//   successRedirect: console.log("logged in"),
//   failureRedirect: '/userlogin'
// }), (req, res) => {return res});


router.post('/userlogin', (req, res, next) => {
  // Authenticate using Passport's local strategy
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).send('Authentication failed');
    }

    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.redirect('/userlogin'); // Redirect to login page upon failure
    }

    // Custom handling upon successful authentication
    console.log(user);
    
    // You can perform additional actions here
    
    // Return the user details as the response
    const { password, ...userInfo } = user;
    return res.send(userInfo); // Send response with user details
  })(req, res, next);
});

router.get('/signup', (req, res) => {
  res.send('Signup Page');
});

router.post('/signup', async (req, res) => {
  console.log(req);
  const username = req.body.username;
  const phone = req.body.phone;
  const phoneString = phone.toString();
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!password) {
      throw new Error('Password is missing.');
    }

    console.log('Password:', password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, mobile: phoneString, username, password: hashedPassword });
    await newUser.save();
    return res.send({ message: 'User Signup Successfully' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Handle duplicate email error
      console.error('Email is already registered:', error);
      return res.status(400).send('Email is already registered');
    }

    console.error('Error signing up:', error);
    res.status(500).send('Error signing up');
  }
});




// Logout functionality
router.get('/logout', (req, res) => {
  try {
    req.logout(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send('Error logging out'); // Handle errors during logout
      } else {
        console.log("logged out successfulyy");
        res.send('Logged out successfully'); // Send a response after successful logout
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error logging out'); // Handle other errors
  }
});




router.get('/auth', (req, res) => {
  if (req.isAuthenticated()) {
   return res.send(true);
    res.send('Dashboard Page');
  } else {
   return res.send(false);
    res.redirect('/login');
  }
});

export default router;
