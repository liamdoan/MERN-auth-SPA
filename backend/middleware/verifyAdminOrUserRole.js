const userModel = require("../models/userModel");

module.exports.verifyAdminOrUserRole = async (req, res, next) => {
    const { userId } = req.params; //userId of user to be modified
    try {
        const user = await userModel.findById(req.userId); //userId of logged in user

        if (!user) {
            return res.status(403).json({
                message: "No user found!"
            })
        };

        if (user.roles.includes("admin")) {
            return next();
        }

        if (userId !== req.userId) {
            return res.status(403).json({
                message: "You aren't either correct user or admin!"
            })
        };

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        })
    }
}
