import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../model/Admin.js';
import multer from "multer";
import path from "path";
import { unlink } from 'node:fs';
const router = express.Router();

const predefinedAdmin = new Admin({
    username: 'studybuddy',
    password: 'Tushar@2002', // You should ideally hash passwords for security
  });
  
  predefinedAdmin
  .save()
  .then((admin) => {
    console.log('Predefined admin inserted:', admin);
  })
  .catch((err) => {
    console.error('Error inserting predefined admin:', err);
  });

  // Handle login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ username, password });
      if (admin) {
        const token = jwt.sign({ id: admin._id, username: admin.username }, 'tushar@2002');
        res.json({ Login: true, token, admin });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


export default router;
