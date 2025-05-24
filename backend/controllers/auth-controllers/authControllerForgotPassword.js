const { sendPasswordResetEmail } = require("../../mailtrap/emailServices");
const userModel = require("../../database/models/userModel");
const { generateResetToken } = require("../../utils/generateResetToken");

module.exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.status(400).json({
                message: "No user found! Make sure you enter correct email."
            })
        };

        const resetToken = generateResetToken();
        const resetTokenExpiredTime = Date.now() + 1*60*60*1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiredTime;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.DEVELOPMENT_CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            message: "Reset password link has been sent!"
        })
    } catch (error) {
        console.log("Login error: ", error);
        res.status(400).json({
            message: error.message
        });
    }
}
