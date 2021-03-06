const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const { use } = require('passport');
const { propfind } = require('../routes');


module.exports = function (passport) {

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/auth/facebook/callback",      
        enableProof: true,
        profileFields: ['id', 'displayName', 'name', 'gender', 'photos']        
        //passReqToCallback: true
      },
      async (accessToken, refreshToken, profile, done) => {
        // You have the access token here!
        console.log(profile);

        const newUser = {
            Id : profile.googleId,
            displayName : profile.displayName,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            image : profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
        };

        try {
            let user = await User.findOne({Id : profile.id});
               if(user)
               {
                done(null, user);
               }
               else
               {
                user = await User.create(newUser);
                done(null, user);
               }
        } catch (err) {
            console.error(err);
          }
      }
    ));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            
            const newUser = {
                Id : profile.id,
                displayName : profile.displayName,
                firstName : profile.name.givenName,
                lastName : profile.name.familyName,
                image : profile.photos[0].value
            };
            try {
               let user = await User.findOne({Id : profile.id}).lean();
               if(user)
               {
                done(null, user);
               }
               else
               {
                user = await User.create(newUser);
                done(null, user);
               }
            } catch (error) {
                console.error(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {   
        done(null, { _id: user._id });
    });

    passport.deserializeUser((_id, done) => {
        User.findById(_id, (err, user) => done(err, user));
    });

};

