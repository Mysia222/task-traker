const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

module.exports = (router) => {

    router.post('/register', (req, res) => {

        const options = {
            auth: {
                api_user: 'tasktraker', // Sendgrid username
                api_key: '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' // Sendgrid password
            }
        }

        const client = nodemailer.createTransport(sgTransport(options));


        if (!req.body.email || !req.body.username || !req.body.password || !req.body.role) {
            res.json({ success: false, message: 'You must provide email/password/name/role' });
        } else {

            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password,
                role: req.body.role.toLowerCase(),
                emailtoken: jwt.sign({ username: this.username, email: this.email }, config.secret, { expiresIn: '24h' })
            });

            user.save((err) => {

                if (err) {

                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Username or e-mail already exists' });
                    } else {

                        if (err.errors) {

                            if (err.errors.email) {
                                res.json({ success: false, message: err.errors.email.message });
                            } else {

                                if (err.errors.username) {
                                    res.json({ success: false, message: err.errors.username.message });
                                } else {

                                    if (err.errors.password) {
                                        res.json({ success: false, message: err.errors.password.message });
                                    } else {
                                        res.json({ success: false, message: err });
                                    }
                                }
                            }
                        } else {
                            res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                        }
                    }
                } else {


                    var transporter = nodemailer.createTransport({
                        host: 'localhost',
                        port: 8080,
                        secure: true,
                        auth: {
                            user: 'username',
                            pass: 'password'
                        },
                        gzip: true
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Hello ✔', // Subject line
                        text: `Hello ${user.username}!Thank you for registration! Please click on the link below for your 
                        activation: http://localhost:8080/activate/`,
                        html: `Hello ${user.username}!<br>Thank you for registration! Please click on the link below for your 
                        activation: <br> <a href="http://localhost:8080/activate/${user.emailtoken}"> http://localhost:8080/activate/ </a>`

                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });


                    res.json({ success: true, message: 'Acount registered! Please check your email for activation link!' });
                }
            });
        }
    });

    router.put('/activate/:token', function(req, res) {
        User.findOne({ emailtoken: req.params.token }, function(err, user) {
            if (err) throw err;
            var token = req.params.token;

            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                } else {
                    user.emailtoken = false;
                    user.active = true;

                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {

                            var email = {
                                from: 'Test Track Staff',
                                to: user.email,
                                subject: 'Localhost Account Activated',
                                text: `Hello ${user.username}, Your account has been successfully activated!`,
                                html: `Hello<strong> ${user.username}</strong>,<br><br>Your account has been successfully activated!`
                            };

                            client.sendMail(email, function(err, info) {
                                if (err) console.log(err);
                            });
                            res.json({ success: true, message: 'Account activated!' });
                        }
                    });
                }
            });
        });
    });





    router.post('/login', (req, res) => {

        if (!req.body.username || !req.body.role || !req.body.password) {
            res.json({ success: false, message: 'No username/password/role was provided' });
        } else {
            User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Username not found.' });
                    } else {
                        const validPassword = user.comparePassword(req.body.password);

                        if (!validPassword) {
                            res.json({ success: false, message: 'Password invalid' });
                        } else {
                            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                            res.json({
                                success: true,
                                message: 'Success!',
                                token: token,
                                user: {
                                    username: user.username,
                                    role: user.role
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'No token provided' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Token invalid: ' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email role').exec((err, user) => {
            // Check if error connecting
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
                } else {
                    res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
                }
            }
        });
    });

    return router;
}