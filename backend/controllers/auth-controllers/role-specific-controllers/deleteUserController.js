const userModel = require("../../../database/models/userModel");

module.exports.deleteUser = async (req, res) => {
    const {userId} = req.params;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(403).json({
                message: "User not found!"
            })
        };

        await userModel.findByIdAndDelete(userId);

        // clear auth cookie with same settings as login
        // similar flow to logout controller
        res.cookie('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: process.env.NODE_ENV === "production" ? '.vercel.app' : undefined,
            maxAge: 0 // makes cookie expire immediately
        });

        return res.status(200).json({
            message: "User deleted ok!"
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: error.message
        })
    }
}
