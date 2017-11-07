const express = require('express');
const app = express();
const router = express.Router(); // Creates a new router object.
const port = process.env.PORT || 8080; // Allows heroku to set port

const DB_URI = "mongodb://localhost:27017/traker";
const mongoose = require('mongoose');
const path = require('path');
//routes
const authentication = require('./routes/authentication')(router);
const projects = require('./routes/projects')(router);
const developers = require('./routes/developers')(router);

const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect(DB_URI);
mongoose.connection.once('connected', function() {
    console.log("Database connected to " + DB_URI);
});
mongoose.connection.on('error', function(err) {
    console.log("MongoDB connection error: " + err);
});
mongoose.connection.once('disconnected', function() {
    console.log("Database disconnected");
});


app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Use routes in application
app.use('/authentication', authentication);
app.use('/projects', projects);
app.use('/developers', developers);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, function() {
    console.log(`listening on port ${port}...`)
})