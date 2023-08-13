// const mongoose = require('mongoose');
import mongoose from "mongoose";


const BookSchema = new mongoose.Schema({
    bookname :{
        type : 'String',
        required: true
    },
    booktitle : {
        type : 'String',
        required : true,
    },
    class : {
        type : 'String',
        required : true
    },
    subject : {
        type : 'String',
        required : true
    },
  pdffile:{
    type:'String',
    required :true
  },
  description:{
    type:'String',
    required :false
  }
}, 
{
    timestamps : true
}
);

const Book = mongoose.model('Book' , BookSchema);
export default Book;