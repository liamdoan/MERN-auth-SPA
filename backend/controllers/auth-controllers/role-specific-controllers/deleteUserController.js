const userModel = require("../../../models/userModel");

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
