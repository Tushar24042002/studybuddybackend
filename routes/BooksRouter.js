import express from 'express';
import { unlink } from 'node:fs';
import multer from 'multer';
import path from 'path';
import Books from '../model/books.js';
import fs from "fs";
const router = express.Router();
const BASE_URL = './assets/';
const ncertBooksFolderPath = `${BASE_URL}/ncertBooks`;
if (!fs.existsSync(ncertBooksFolderPath)) {
  fs.mkdirSync(ncertBooksFolderPath);
}
import { MongoClient }  from "mongodb";
const uri = "mongodb://localhost/studybuddy";
// const uri = 'mongodb+srv://tushargupta24042002:Tushar24042002@cluster0.xoo7rki.mongodb.net/studybuddy?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ncertBooksFolderPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.body.subject}_${req.body.class}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});


// Now you can use the 'upload' middleware to handle file uploads


const upload = multer({
    storage :storage
})

router.get("/books", async (req, res) => {
try {
    const books = await Books.find({});
    console.log(books + " not updates");
    return res.json(books);
} catch (error) {
    return res.status(500).json({ message: "Error fetching data from database" });
}
});






router.get("/backendSyllabusView",(req,res)=>{

  const sql = "SELECT * FROM `syllabus`";
  // res.sendFile(__dirname +"/books");
  db.query(sql,(err,result)=>{
      if(err) return res.json({Message : "Error in connecting database"});
      // res.sendFile("books");
      return res.json(result);
  })
})






// router.get("/edit-books/:id&:files", (req,res)=>{
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






router.get("/edit-books/:id&:files", async (req, res) => {
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




// router.post('/edit-books/:id&:files', upload.single("image"), function(req, res, next) {
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

router.post('/edit-books/:id&:files', upload.single("image"), async (req, res, next) => {
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
            unlink(`${ncertBooksFolderPath}/${files}`, (err) => {
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




// router.delete("/books/delete/:id&:files",(req,res)=>{
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


router.delete("/books/delete/:id&:files", async (req, res) => {
try {
    const { id, files } = req.params;

    // Delete the image file
    unlink(`${ncertBooksFolderPath}/${files}`, (err) => {
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


// router.get("/books6",(req,res)=>{

//     const sql = "SELECT * FROM `books` WHERE class=6";
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         return res.json(result);
//     })
// })


// router.get("/scienceBooks6",(req,res)=>{
//     const {subject} = "Science";
//     const sql = "SELECT * FROM `books` WHERE class=6 AND Subject=Science";
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message : "Error in connecting database"});
//         return res.json(result);
//     })
// })


router.get("/books6", async (req, res) => {
  try {
    const books = await Books.find({ class: '6' });
    console.log(books);
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});

router.get("/scienceBooks6", async (req, res) => {
  try {
    const subject = "Science";
    const books = await Books.find({ class: '6', subject: subject });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});







router.get("/books7", async (req, res) => {
  try {
    const books = await Books.find({ class: '7' });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});

router.get("/books12", async (req, res) => {
  try {
    const books = await Books.find({ class: '12' });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});

router.get("/books11", async (req, res) => {
  try {
    const books = await Books.find({ class: '11' });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});

router.get("/books10", async (req, res) => {
  try {
    const books = await Books.find({ class: '10' });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});

router.get("/books9", async (req, res) => {
  try {
    const books = await Books.find({ class: '9' });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});

router.get("/books8", async (req, res) => {
  try {
    const books = await Books.find({ class: '8' });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ Message: "Error in connecting database" });
  }
});




router.post("/books", upload.single("image"), async (req, res) => {
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


export default router;
