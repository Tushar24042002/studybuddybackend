import express  from "express";
import mysql from "mysql";
import cors from 'cors';
import mongoose from "mongoose";
// import databaseConfig from "../Backend/config/mongoose.js";
import databaseConfig from "./config/mongoose.js";
import Admin from "./model/Admin.js";

import Books  from "./model/books.js";
import { MongoClient }  from "mongodb";


const uri = 'mongodb+srv://tushargupta24042002:Tushar24042002@cluster0.xoo7rki.mongodb.net/studybuddy?retryWrites=true&w=majority';
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
app.use(express.urlencoded({extended : false}));
// var auth = false;
// const authFunction=(auth)=>{
//     auth = true;
// }
const storage = multer.diskStorage({
    destination : (req,res,cb)=>{
        cb(null,'../Frontend/public/assets/images/ncertBooks')
    },
    filename :(req,file,cb)=>{
        cb(null, req.body.subject+"_"+req.body.class+ "_" + "" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage :storage
})


const syllabuSstorage = multer.diskStorage({
    destination : (req,res,cb)=>{
        cb(null,'../public/assets/images/ncertSyllabus')
    },
    filename :(req,file,cb)=>{
        cb(null, file.fieldname + "" + Date.now() + path.extname(file.originalname));
    }
})

const uploadSyllabus = multer({
    storage :syllabuSstorage
})

// const db = mysql.createConnection({
//     host :"localhost",
//     user:"vhfaxmrm_admin",
//     password:"P-fc)8xS%iBp",
//     database:"vhfaxmrm_studybuddy"
// })

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


const db = mysql.createConnection({
    host :"localhost",
    user:"root",
    password:"",
    database:"studybuddy"
})
// app.get('/', function(req, res){
//     res.sendfile('index.ejs');
// });

// app.get("/",(req,res)=>{
//     const sql = "SELECT * FROM `admin`";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })



// login url

  
  // Handle login
  app.post('/login', async (req, res) => {
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


// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     if (username && password) {
//       db.query(
//         'SELECT * FROM admin WHERE username = ? AND password = ?',
//         [username, password],
//         (err, results) => {
//           if (err) {
//             throw err;
//           }
//           if (results.length > 0) {
//             const user = results[0];
//             const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key');
//             res.json({ Login : true, token , results});
//           } else {
//             res.status(401).json({ error: 'Invalid username or password' });
//           }
//         }
//       );
//     } else {
//       res.status(400).json({ error: 'Please enter username and password' });
//     }
//   });
  


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


// app.get("/books",(req,res)=>{

//     const sql = "SELECT * FROM `books`";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })


app.get("/books", async (req, res) => {
  try {
      const books = await Books.find({});
      console.log(books + " not updates");
      return res.json(books);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching data from database" });
  }
});






app.get("/backendSyllabusView",(req,res)=>{

    const sql = "SELECT * FROM `syllabus`";
    // res.sendFile(__dirname +"/books");
    db.query(sql,(err,result)=>{
        if(err) return res.json({Message : "Error in connecting database"});
        // res.sendFile("books");
        return res.json(result);
    })
})






// app.get("/edit-books/:id&:files", (req,res)=>{
//     const {id,files} = req.params;
//     const sql = "SELECT * FROM `books` WHERE id = ? ";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,[id],function(error, result){
//         if(error) throw error;
//         console.log(result);
//         // res.render(__dirname + "/edit", {labs:result});
//         return res.json(result);
//     })
// })






app.get("/edit-books/:id&:files", async (req, res) => {
  try {
      const { id } = req.params;

      // Find the book with the specified _id
      const book = await Books.findOne({ _id: id });

      if (!book) {
          return res.status(404).json({ message: "Book not found" });
      }

      return res.json(book);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching data from database" });
  }
});




// app.post('/edit-books/:id&:files', upload.single("image"), function(req, res, next) {
//     var id= req.params.id;
//     var files= req.params.files;
//   console.log(req.file);
//     if(req.file){
//       var updateData = {
//         bookname : req.body.bookname,
//         booktitle : req.body.booktitle,
//         class : req.body.class,
//         pdffile : req.file.filename,
//         subject : req.body.subject,
//         description : req.body.description,
//       }
//       unlink(`../public/assets/images/ncertBooks/${files}`, (err) => {
//           if (err) throw err;
//           console.log('path/file.txt was deleted');
//         });
//      }
//     else{
//         var updateData = {
//             bookname : req.body.bookname,
//             booktitle : req.body.booktitle,
//             class : req.body.class,
//             subject : req.body.subject,
//             description : req.body.description,
//           }
//     }
//       // var updateData=req.body;
//       console.log(req.file + ""+updateData);
//         var sql = `UPDATE books SET ? WHERE id= ?`;
//         db.query(sql, [updateData, id], function (err, data) {
//         if (err) throw err;
//         console.log(data.affectedRows + " record(s) updated");
//         res.redirect('/books');
//       });
  
     
//     // res.redirect('/data');
//   });

app.post('/edit-books/:id&:files', upload.single("image"), async (req, res, next) => {
  try {
      const id = req.params.id;
      const files = req.params.files;

      let updateData = {
          bookname: req.body.bookname,
          booktitle: req.body.booktitle,
          class: req.body.class,
          subject: req.body.subject,
          description: req.body.description,
      };

      if (req.file) {
          updateData.pdffile = req.file.filename;

          if (files) {
              // Delete the previous image file
              unlink(`../Frontend/public/assets/images/ncertBooks/${files}`, (err) => {
                  if (err) throw err;
                  console.log('Previous image file was deleted');
              });
          }
      }

      const updateResult = await Books.updateOne({ _id: id }, { $set: updateData });

      if (updateResult.matchedCount === 0) {
          return res.status(404).json({ message: "Book not found" });
      }

      return res.json({ message: "Book updated successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Error updating book" });
  }
});




// app.delete("/books/delete/:id&:files",(req,res)=>{
//     const {id,files} = req.params;
//     unlink(`../public/assets/images/ncertBooks/${files}`, (err) => {
//         if (err) throw err;
//         console.log('path/file.txt was deleted');
//       });
//     const sqlRemove = "DELETE FROM `books` WHERE id = ?";
//     db.query(sqlRemove,id,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         return res.json(result);
//     })
// })


app.delete("/books/delete/:id&:files", async (req, res) => {
  try {
      const { id, files } = req.params;

      // Delete the image file
      unlink(`../Frontend/public/assets/images/ncertBooks/${files}`, (err) => {
          if (err) throw err;
          console.log('Image file was deleted');
      });

      const deleteResult = await Books.deleteOne({ _id: id });

      if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ message: "Book not found" });
      }

      return res.json({ message: "Book deleted successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Error deleting book" });
  }
});


// app.get("/books6",(req,res)=>{

//     const sql = "SELECT * FROM `books` WHERE Class=6";
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         return res.json(result);
//     })
// })


// app.get("/scienceBooks6",(req,res)=>{
//     const {subject} = "Science";
//     const sql = "SELECT * FROM `books` WHERE Class=6 AND Subject=Science";
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         return res.json(result);
//     })
// })


app.get("/books6", async (req, res) => {
    try {
      const books = await Books.find({ Class: 6 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  
  app.get("/scienceBooks6", async (req, res) => {
    try {
      const subject = "Science";
      const books = await Books.find({ Class: 6, Subject: subject });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  



// app.get("/books7",(req,res)=>{
//     const sql = "SELECT * FROM `books` WHERE Class=7";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })




// app.get("/books12",(req,res)=>{
//     const sql = "SELECT * FROM `books` WHERE Class=12";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })




// app.get("/books11",(req,res)=>{
//     const sql = "SELECT * FROM `books` WHERE Class=11";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })



// app.get("/books10",(req,res)=>{
//     const sql = "SELECT * FROM `books` WHERE Class=10";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })




// app.get("/books9",(req,res)=>{
//     const sql = "SELECT * FROM `books` WHERE Class=9";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })



// app.get("/books8",(req,res)=>{
//     const sql = "SELECT * FROM `books` WHERE Class=8";
//     // res.sendFile(__dirname +"/books");
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         // res.sendFile("books");
//         return res.json(result);
//     })
// })


app.get("/books7", async (req, res) => {
    try {
      const books = await Books.find({ Class: 7 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  
  app.get("/books12", async (req, res) => {
    try {
      const books = await Books.find({ Class: 12 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  
  app.get("/books11", async (req, res) => {
    try {
      const books = await Books.find({ Class: 11 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  
  app.get("/books10", async (req, res) => {
    try {
      const books = await Books.find({ Class: 10 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  
  app.get("/books9", async (req, res) => {
    try {
      const books = await Books.find({ Class: 9 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  
  app.get("/books8", async (req, res) => {
    try {
      const books = await Books.find({ Class: 8 });
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ Message: "Error in connecting database" });
    }
  });
  

// app.post("/books", upload.single("image") ,(req,res)=>{
//     const sql ="INSERT INTO `books`( `bookname`, `booktitle`, `class`, `subject`, `pdffile`, `description`) VALUES(?)";
//     console.log(req.body);
//     console.log(req.file);
//     const values =[
//         req.body.bookname,
//         req.body.booktitle,
//         req.body.class,
//         req.body.subject,
//         req.file.filename,
//         req.body.description       
//     ];
//     // const image = ;
//     db.query(sql,[values],(err,result)=>{
//         // if(req.files.uploadfilefile){
//             console.log(req.file, req.body)
//         // }
//         if(err) return res.json(err);
//         return res.json(result);   
//     })
// })

app.post("/books", upload.single("image"), async (req, res) => {
  try {
      await client.connect();
      // const database = client.db("yourdbname"); // Update with your database name
      // const collection = database.collection("books");

      const bookDocument = {
          bookname: req.body.bookname,
          booktitle: req.body.booktitle,
          class: req.body.class,
          subject: req.body.subject,
          pdffile: req.file.filename,
          description: req.body.description,
      };

      const result = await Books.create(bookDocument);
      console.log(result);
      console.log("Inserted document with _id:", result._id);

      return res.json(result);
  } catch (err) {
      console.error(err);
      return res.json(err);
  } finally {
      await client.close();
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




app.post("/login",(req,res)=>{
const username = req.body.username;
const password = req.body.password;
const sql = "SELECT * FROM `admin` WHERE username =? AND password = ?";
// res.sendFile(__dirname +"/books");
console.log(sql);
db.query(sql,[username,password],(err,result)=>{
    if(err) return res.send({Message : "Error in Authentication database"});
    // res.sendFile("books");
    // authFunction(true);
    return res.send(result);
})
   
})

const appPort = 8081;
app.listen(process.env.PORT || appPort,()=>{
    console.log("listening");
})