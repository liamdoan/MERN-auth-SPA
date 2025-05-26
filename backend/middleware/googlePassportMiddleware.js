const passport = require('passport');

module.exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
});

module.exports.authenticateGoogleCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
});
