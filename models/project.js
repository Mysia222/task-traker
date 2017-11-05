const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


let usernameLengthChecker = (username) => {

    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

// Array of Username validators
const usernameValidators = [{
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 15'
}];

let passwordLengthChecker = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Check password length
        if (password.length < 6 || password.length > 35) {
            return false; // Return error if passord length requirement is not met
        } else {
            return true; // Return password as valid
        }
    }
};

// Array of Password validators
const passwordValidators = [{
    validator: passwordLengthChecker,
    message: 'Password must be at least 6 characters but no more than 35'
}, ];


// Validate Function to check comment length
let tastLengthChecker = (comment) => {
    // Check if comment exists
    if (!comment[0]) {
      return false; // Return error
    } else {
      // Check comment length
      if (comment[0].length < 1 || comment[0].length > 200) {
        return false; // Return error if comment length requirement is not met
      } else {
        return true; // Return comment as valid
      }
    }
  };
  
  // Array of Comment validators
  const taskValidators = [
    // First comment validator
    {
      validator: commentLengthChecker,
      message: 'Comments may not exceed 200 characters.'
    }
  ];



// User Model Definition
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators },
    active: { type: Boolean, required: true, default: false },
    emailtoken: { type: String, required: true, default: "afa4w5wSEfSD" },
    role: { type: String, default: "developer" }
});


userSchema.pre('save', function(next) {

    if (!this.isModified('password'))
        return next();

    // Apply encryption
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err); // Ensure no errors
        this.password = hash; // Apply encryption to password
        next(); // Exit middleware
    });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};


// Export Module/Schema
module.exports = mongoose.model('User', userSchema);