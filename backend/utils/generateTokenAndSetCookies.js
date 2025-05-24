const jwt = require('jsonwebtoken');

module.exports.generateTokenAndSetCookies = (res, userId) => {
    const token = jwt.sign({
        userId
    }, 
        process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    });
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: 'none', // Required for cross-domain cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days to match JWT
        path: '/', // Ensure cookie is available on all paths
        domain: process.env.NODE_ENV === "production" ? '.vercel.app' : undefined // Allow sharing between vercel.app subdomains
    });

    return token;
}