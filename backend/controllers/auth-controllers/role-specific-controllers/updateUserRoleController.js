const userModel = require("../../../models/userModel");

module.exports.updateUserRole = async (req, res) => {
    const {userId} = req.params;
    const {roles} = req.body;

    try {
        // In database, roles should be an array ["user", "manager, "admin"]
        if (!Array.isArray(roles)) {
            return res.status(400).json({
                message: "Wrong type of role data!"
            })
        };

        const validRoles = ["user", "manager", "admin"];
        if (!roles.every(role => validRoles.includes(role))) {
            return res.status(400).json({
                message: "Invalid roles!"
            })
        };

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(403).json({
                message: "No user found!"
            })
        };

        //avoid duplicated roles
        user.roles = [...new Set(roles)];

        await user.save();

        res.status(200).json({
            message: "User role updated ok!",
            user
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            messsage: error.message
        })
    }
}
