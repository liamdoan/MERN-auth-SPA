const { sendWelcomeEmail } = require("../../mailtrap/emailServices");
const userModel = require("../../database/models/userModel");

module.exports.verifyEmail = async (req, res) => {
    const {verificationCode} = req.body;
    
    try {
        const user = await userModel.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if(!user) {
            return res.status(400).json({
                message: "invalid or expired verification code!"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            message: "verification code ok!",
            user: user._doc
        })
    } catch (error) {
        res.status(500).json({
            message: "Something wrong, cna not verify email with code!"
        })
    }
}
