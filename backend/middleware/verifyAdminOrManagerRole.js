const userModel = require("../models/userModel");

module.exports.verifyAdminOrManagerRole = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(403).json({
                message: "No user found!"
            });
        }

        if (user.roles.includes("admin") || user.roles.includes("manager")) {
            return next();
        }

        return res.status(403).json({
            message: "Authorization failed! Admin and manager access only!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}
