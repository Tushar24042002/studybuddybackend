import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  dob: Date,           // Date of Birth (optional)
  educationLevel: String, // Education level (optional)
  schoolName: String, // School name (optional)
  email: String,      // Email address (optional)
  mobile: String      // Mobile number (optional)
});

// Method to check if the entered password is valid
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
