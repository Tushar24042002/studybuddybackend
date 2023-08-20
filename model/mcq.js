// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  description :{
    type : String,
    required : false
  },
  title :{
    type : String,
    required : false
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true
      },
      options: [
        {
          text: {
            type: String,
            required: true
          },
          isCorrect: {
            type: Boolean,
            required: true
          }
        }
      ]
    }
  ]
});

const MCQ = mongoose.model('MCQ', mcqSchema);

export default MCQ;
