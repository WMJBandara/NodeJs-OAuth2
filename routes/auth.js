const express = require('express');
const passport = require('passport');
const router = express.Router();

//@desc auth with facebook
//@route Get /auth/facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['name', 'gender', 'picture.type(large)']}));

//@desc Dashbord
//route get /auth/facebook/callback
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/'
    }),
    (req, res) => {
        res.redirect('/dashboard');
    });



//@desc auth with google
//@route Get /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//@desc Dashboard
//@route Get auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate(
        'google',
        {
            failureRedirect: '/'
        }),
    (req, res) => {
        res.redirect('/dashboard');
    });


router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;