const User = require('../models/user');
const Project = require('../models/project');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {


    router.post('/newProject', (req, res) => {

        if (!req.body.title || !req.body.description || !req.body.createdBy) {
            res.json({ success: false, message: 'Information is required.' });
        } else {
            const project = new Project({
                title: req.body.title,
                description: req.body.description,
                createdBy: req.body.createdBy
            });

            project.save((err) => {
                if (err) {
                    if (err.errors) {
                        if (err.errors.title) {
                            console.log("title");
                            res.json({ success: false, message: err.errors.title.message });
                        } else {
                            if (err.errors.description) {
                                console.log("description");
                                res.json({ success: false, message: err.errors.description.message });
                            } else {
                                console.log("ather");
                                res.json({ success: false, message: err });
                            }
                        }
                    } else {
                        console.log("d");
                        res.json({ success: false, message: err });
                    }
                } else {
                    res.json({ success: true, message: 'Project saved!' });
                }
            });
        }
    });

    router.get('/allProjects', (req, res) => {

        Project.find({}, (err, projects) => {

            if (err) {
                res.json({ success: false, message: err });
            } else {

                if (!projects) {
                    res.json({ success: false, message: 'No Projects found.' });
                } else {
                    res.json({ success: true, projects: projects });
                }
            }
        }).sort({ '_id': -1 });
    });


    router.get('/project/:id', (req, res) => {

        if (!req.params.id) {
            res.json({ success: false, message: 'No project ID was provided.' });
        } else {
            Project.findOne({ _id: req.params.id }, (err, project) => {

                if (err) {
                    res.json({ success: false, message: 'Not a valid project id' });
                } else {

                    if (!project) {
                        res.json({ success: false, message: 'Prore not found.' });
                    } else {
                        // Find the current user that is logged in
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {

                            if (err) {
                                res.json({ success: false, message: err });
                            } else {

                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {

                                    if (user.username !== project.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this project.' });
                                    } else {
                                        res.json({ success: true, project: project });
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