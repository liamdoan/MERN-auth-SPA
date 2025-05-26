const passport = require('passport');

module.exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
});

module.exports.authenticateGoogleCallback = passport.authenticate('google', {
    failureRedirect: `${process.env.DEVELOPMENT_CLIENT_URL}/login`,
    session: false
});
