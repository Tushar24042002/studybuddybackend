import mongoose from 'mongoose';

// const DB = 'mongodb+srv://tushargupta24042002:Tushar24042002@cluster0.xoo7rki.mongodb.net/studybuddy?retryWrites=true&w=majority';
const DB = "mongodb://localhost/studybuddy";
mongoose.connect(DB).then(() => {
    console.log('connection successful');
}).catch((err) => console.log("no connection " + err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function () {
    console.log('Connected to Database :: MongoDB');
});

export default db;
