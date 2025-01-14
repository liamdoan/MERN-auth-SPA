const userModel = require("../../../models/userModel");

module.exports.getAllUsersData = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            message:  "Admin authorization ok! Welcome Admin!",
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
