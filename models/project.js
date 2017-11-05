const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthChecker = (title) => {

    if (!title) {
        return false;
    } else {
        if (title.length < 3 || title.length > 50) {
            return false;
        } else {
            return true;
        }
    }
};

const titleValidators = [{
    validator: titleLengthChecker,
    message: 'title must be at least 3 characters but no more than 50'
}];

let descriptionLengthChecker = (description) => {

    if (!description) {
        return false;
    } else {
        if (description.length < 3 || description.length > 500) {
            return false;
        } else {
            return true;
        }
    }
};

const descriptionValidators = [{
    validator: descriptionLengthChecker,
    message: 'Description must be at least 3 characters but no more than 500'
}];

// Project Model Definition
const projectSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    description: { type: String, required: true, validate: descriptionValidators },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    developers: [{
        developerName: { type: String }
    }]
});


module.exports = mongoose.model('Project', projectSchema);