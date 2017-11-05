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
                body: req.body.description,
                createdBy: req.body.createdBy
            });

            project.save((err) => {
                if (err) {
                    if (err.errors) {
                        if (err.errors.title) {
                            res.json({ success: false, message: err.errors.title.message });
                        } else {
                            if (err.errors.description) {
                                res.json({ success: false, message: err.errors.description.message });
                            } else {
                                res.json({ success: false, message: err });
                            }
                        }
                    } else {
                        res.json({ success: false, message: err });
                    }
                } else {
                    res.json({ success: true, message: 'Project saved!' });
                }
            });
        }
    });

    return router;
};