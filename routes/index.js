const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');
//@desc Login/Landing page
//@route Get /
router.get('/', ensureGuest, (req, res) => {
    res.render('login',
        {
            layout: 'login',
            title: "hello world...!"
        });
});

//@desc Dashboard
//@route Get /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        console.log(req.user);
        console.log("User id :" + req.user.id);
        console.log("User _id :" + req.user._id);
        
        const stories = await Story.find({user : req.user.id}).lean(); //
        res.render("dashboard", {
            name: req.firstName,
            stories
        });
    } catch (error) {
        console.error(error);
        res.redirect('errors/500');
    }
});

module.exports = router;