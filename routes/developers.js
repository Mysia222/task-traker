const User = require('../models/user');
const Project = require('../models/project');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {



    router.get('/allDevelopers', (req, res) => {

        User.find({ role: 'developer' }, (err, developers) => {

            if (err) {
                res.json({ success: false, message: err });
            } else {

                if (!developers) {
                    res.json({ success: false, message: 'No developers found.' });
                } else {
                    res.json({ success: true, developers: developers });
                }
            }
        }).sort({ '_id': -1 });
    });


    router.put('/addDeveloper', (req, res) => {

        if (!req.body.id) {
            res.json({ success: false, message: 'No Project id provided' });
        } else {
            Project.findOne({ _id: req.body.id }, (err, project) => {

                if (err) {
                    res.json({ success: false, message: 'Not a valid Project id' });
                } else {

                    if (!project) {
                        res.json({ success: false, message: 'Project id was not found.' });
                    } else {

                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {

                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user.' });
                                } else {

                                    if (user.username !== project.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to adding developer.' });
                                    } else {
                                        project.developers.push({
                                            developerName: req.body.developer,
                                        });

                                        project.save((err) => {
                                            if (err) {
                                                if (err.errors) {
                                                    res.json({ success: false, message: 'Please ensure form is filled out properly' });
                                                } else {
                                                    res.json({ success: false, message: err });
                                                }
                                            } else {
                                                res.json({ success: true, message: 'Project Updated!' });
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }

    });

    return router;
};