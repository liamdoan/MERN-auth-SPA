const userModel = require("../models/userModel");

module.exports.verifyAdminRole = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);

        if(!user || !user.roles.includes("admin")) {
            return res.status(403).json({
                message: "Admin authorization failed! Admin access only!"
            })
        };

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
