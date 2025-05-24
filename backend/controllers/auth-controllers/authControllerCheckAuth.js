const userModel = require("../../database/models/userModel")

module.exports.checkAuth = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found!"
            })
        };

        res.status(200).json({
            message: "User found!",
            user: {
                ...user._doc
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: error.message
        });
    }
}
