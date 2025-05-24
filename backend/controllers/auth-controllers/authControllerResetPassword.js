const { sendPasswordResetEmailSuccess } = require("../../mailtrap/emailServices");
const userModel = require("../../database/models/userModel");
const { generateHashPassword } = require("../../utils/generateHashPassword");

module.exports.resetPassword = async (req, res) => {
    const {token} = req.params;
    const {newPassword} = req.body;

    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()} //make sure token is not expired yet
        });

        if (!user) {
            return res.status(400).json({
                message: "Token invalid or expired!"
            })
        };

        const newHashPassword = await generateHashPassword(newPassword);

        user.password = newHashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendPasswordResetEmailSuccess(user.email);

        res.status(200).json({
            message: "Password reset ok!"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}
