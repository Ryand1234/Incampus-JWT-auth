const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('1. passport callback function fired:');
        console.log(profile);
        // User.findOne({'social.socialId': profile.id,'social.provider':'Google'},function(err,obj){ console.log(obj);});
        User.findOne({email:profile.emails[0].value}).then((currentUser) => {
            console.log('2. passport callback function fired:');
            console.log(profile);
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                // do something
                done(null, currentUser);
            } else {
                // if not, create user in our db
                console.log('3. passport callback function fired:');
                console.log(profile);
                new User({
                    
                    email : profile.emails[0].value,
                    name: profile.displayName,
                    username: profile.displayName,
                    isSocial:true,
                    profilePicture: profile._json.picture,
                    social:{
                        token: accessToken,
                        socialId: profile.id,
                        provider:'Google'
                    }
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    // do something
                    done(null, newUser);
                });
                console.log('4. passport callback function fired:');
                console.log(profile);
            }
        });
    })
);

passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
  },
  function(accessToken, refreshToken, profile, done) {
    const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`
    console.log('1. passport callback function fired:');
    console.log(picture);
    console.log(profile)
    User.findOne({email:profile.emails[0].value}).then((currentUser) => {
        console.log('2. passport callback function fired:');
        console.log(profile);
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            // do something
            done(null, currentUser);
        } else {
            // if not, create user in our db
            console.log('3. passport callback function fired:');
            console.log(profile);
            new User({
            
                email : profile.emails[0].value,
                name: profile.displayName,
                username: profile.displayName,
                isSocial:true,
                profilePicture: picture,
                social:{
                    token: accessToken,
                    socialId: profile.id,
                    provider:'Facebook'

                }
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                // do something
                done(null, newUser);
            });
            console.log('4. passport callback function fired:');
            console.log(profile);
        }
    });
  }
));