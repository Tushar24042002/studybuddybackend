import express  from "express";
import mysql from "mysql";
import cors from 'cors';
import mongoose from "mongoose";
// import databaseConfig from "../Backend/config/mongoose.js";
import databaseConfig from "./config/mongoose.js";
import Admin from "./model/Admin.js";

import Books  from "./model/books.js";
import { MongoClient }  from "mongodb";
import booksRouter from './routes/BooksRouter.js';
import adminRouter from './routes/AdminRouter.js';
import MCQRouter from "./routes/MCQRouter.js";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// import 
import User from './model/User.js';
import UserRouter from "./routes/UserRouter.js"

const uri = "mongodb://localhost/studybuddy";

// const uri = 'mongodb+srv://tushargupta24042002:Tushar24042002@cluster0.xoo7rki.mongodb.net/studybuddy?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// import upload from 'express-fileupload';
// const upload = require('express-fileupload');
import session from 'express-session';
import jwt from'jsonwebtoken';
import multer from "multer";
import path from "path";
import { unlink } from 'node:fs';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(session({ secret: 'Tushar@2002', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/assets', express.static(path.join(__dirname, '/assets')));
// Now you can use __dirname as before
console.log(__dirname);

const assetsFolder = './assets'; // Adjust the path as needed

if (!fs.existsSync(assetsFolder)) {
  fs.mkdirSync(assetsFolder);
}

// Set the base URL for file storage
const BASE_URL = './assets/';





const syllabuSstorage = multer.diskStorage({
    destination : (req,res,cb)=>{
        cb(null,`${BASE_URL}/ncertSyllabus`)
    },
    filename :(req,file,cb)=>{
        cb(null, file.fieldname + "" + Date.now() + path.extname(file.originalname));
    }
})

const uploadSyllabus = multer({
    storage :syllabuSstorage
})


  


  app.get('/backendArea', (req, res) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
          res.status(401).json({ error: 'Invalid token' });
        } else {
          res.json({ message: `Welcome back, ${decoded.username}!` });
        }
      });
    } else {
      res.status(401).json({ error: 'Token not provided' });
    }
  });



  app.get('/home', (req, res) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
          res.status(401).json({ error: 'Invalid token' });
        } else {
          res.json({ message: `Welcome back, ${decoded.username}!` });
        }
      });
    } else {
      res.status(401).json({ error: 'Token not provided' });
    }
  });





app.post("/createSyllabus", uploadSyllabus.single("image") ,(req,res)=>{
    const sql ="INSERT INTO `syllabus`( `bookname`, `booktitle`, `class`, `subject`, `pdffile`, `description`) VALUES(?)";
    console.log(req.body);
    console.log(req.file);
    const values =[
        req.body.bookname,
        req.body.booktitle,
        req.body.class,
        req.body.subject,
        req.file.filename,
        req.body.description       
    ];
    // const image = ;
    db.query(sql,[values],(err,result)=>{
        // if(req.files.uploadfilefile){
            console.log(req.file, req.body)
        // }
        if(err) return res.json(err);
        return res.json(result);   
    })
})


passport.use(new LocalStrategy(async (email, password, done) => {
  console.log(email);
  try {
    const user = await User.findOne({ email: email });
    if (!user) return done(null, false, { message: 'Incorrect username.' });

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


app.use('/user', UserRouter);
app.use('/books', booksRouter);
app.use('/admin', adminRouter);
app.use('/mcq',MCQRouter);
const appPort = 8081;
app.listen(process.env.PORT || appPort,()=>{
    console.log("listening");
})