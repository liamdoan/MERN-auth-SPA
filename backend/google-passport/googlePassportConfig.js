const passport = require('passport');
const userModel = require('../database/models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.DEVELOPMENT_SERVER_URL}/api/auth/google/callback`,
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                let user = await userModel.findOne({ email });

                if (user) {
                    // if user exists but uses local login
                    if (user.authProvider !== 'google') {
                        return done(null, false, {
                        message: `Please log in using ${user.authProvider}`,
                        });
                    }
                } else {
                    // create a new user without password
                    user = new userModel({
                        name,
                        email,
                        password: null,
                        authProvider: 'google',
                        isVerified: true,
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
