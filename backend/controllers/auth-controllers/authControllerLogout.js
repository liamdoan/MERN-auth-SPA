module.exports.logOut = async (req, res) => {
    // Clear cookie with matching settings
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: process.env.NODE_ENV === "production" ? '.vercel.app' : undefined,
        maxAge: 0 // make cookie expire immediately
    });

    res.status(200).json({
        message: "Logout ok!"
    });
};
