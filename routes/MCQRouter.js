import express from 'express';
import { unlink } from 'node:fs';
import multer from 'multer';
import path from 'path';
import Books from '../model/books.js';
import fs from "fs";
import csvParser from "csv-parser";
const router = express.Router();
import MCQ from "../model/mcq.js";

const BASE_URL = './assets/';
const mcqFolderPath = `${BASE_URL}/mcqs`;
if (!fs.existsSync(mcqFolderPath)) {
  fs.mkdirSync(mcqFolderPath);
}
import { MongoClient }  from "mongodb";
const uri = "mongodb://localhost/studybuddy";
// const uri = 'mongodb+srv://tushargupta24042002:Tushar24042002@cluster0.xoo7rki.mongodb.net/studybuddy?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mcqFolderPath);
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

router.get("/getMCQ/:classs&:sub", async (req, res) => {
  try {
      const { classs,sub } = req.params;
  
      // Find the book with the specified _id
      const mcqData = await MCQ.find({ className: classs,subject : sub });
  
      if (!mcqData) {
          return res.status(404).json({ message: "Book not found" });
      }
  
      return res.json(mcqData);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching data from database" });
  }
  });
  router.get("/getMCQ/:id", async (req, res) => {
    try {
      const {  id } = req.params;
  
      // Fetch data based on class and subject
      // For example, retrieve MCQ data for the specified class and subject
      const mcqData = await MCQ.find({ _id : id });
  
      if (!mcqData) {
        return res.status(404).json({ message: "MCQ data not found" });
      }
  
      return res.json(mcqData);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching data from database" });
    }
  });
  

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
            unlink(`${mcqFolderPath}/${files}`, (err) => {
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
    unlink(`${mcqFolderPath}/${files}`, (err) => {
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


router.get("/getMCQ/:id", async (req, res) => {
    const { id } = req.params;
  try {
    // const books = await Books.find({ class: '6' });
    const mcqs = await MCQ.find({ _id: id  });
    res.json(mcqs);

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






// Read the CSV file and store data in MongoDB
router.post("/createmcq", upload.single("image"), async (req, res) => {
    try {
      await client.connect();
  
      console.log(req.body);
  
      // Read the CSV file and store data in MongoDB
      const csvData = [];
  
      fs.createReadStream(`assets/mcqs/${req.file.filename}`)
        .pipe(csvParser())
        .on('data', (row) => {
          csvData.push(row);
        })
        .on('end', async () => {
          const mcqTests = [];
  
          const newMCQTest = {
            testName: '',
            subject: '',
            className: '',
            description :'',
            title :'',
            questions: []
          };
  
          csvData.forEach((row) => {
            newMCQTest.testName = row.testName;
            newMCQTest.subject = row.subject;
            newMCQTest.className = row.className;
            newMCQTest.description = req.body.description;
            newMCQTest.title = req.body.booktitle
  
            const questionOptions = [];
  
            for (let i = 1; i <= 4; i++) {
              questionOptions.push({
                text: row[`option${i}`],
                isCorrect: i === parseInt(row.correctIndex)
              });
            }
  
            newMCQTest.questions.push({
              questionText: row.questionText,
              options: questionOptions
            });
          });
  
          mcqTests.push(newMCQTest);
  
          try {
            await MCQ.insertMany(mcqTests);
            console.log('MCQ tests saved:', mcqTests);
          } catch (error) {
            console.error('Error saving MCQ tests:', error);
          }
  
          fs.unlink(`assets/mcqs/${req.file.filename}`, (unlinkError) => {
            if (unlinkError) {
              console.error('Error deleting CSV file:', unlinkError);
            } else {
              console.log('CSV file deleted.');
            }
          });
          return res.json("Created");
          // mongoose.connection.close();
        });
    } catch (err) {
      console.error(err);
      return res.json(err);
    } finally {
      await client.close();
    }
  });
  

export default router;
