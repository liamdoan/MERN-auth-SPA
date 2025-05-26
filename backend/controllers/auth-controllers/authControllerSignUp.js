const userModel = require("../../database/models/userModel");
const { generateHashPassword } = require("../../utils/generateHashPassword");
const { generateVerificationToken } = require("../../utils/generateVerificationToken");
const { generateTokenAndSetCookies } = require("../../utils/generateTokenAndSetCookies");
const { sendVerificationEmail } = require("../../mailtrap/emailServices");

module.exports.signUp = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        if (!name || !email || !password ) {
            throw new Error ("all field required")
        }

        const userExisted = await userModel.findOne({email});
        if (userExisted) {
            return res.status(400).json({
                message: "user has existed!"
            })
        };

        const user = new userModel({
            email,
            password: await generateHashPassword(password), //hashPassword
            name,
            authProvider: 'manual',
            verificationToken: generateVerificationToken(), //verification code
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000
        });
        
        await user.save();

        //generate jwt
        generateTokenAndSetCookies(res, user._id);

        await sendVerificationEmail(user.email, user.verificationToken)

        res.status(201).json({
            message: "user created!",
            user: {
                ...user._doc
            }
        })
    } catch(error) {
        res.status(400).json({
            message: error.message,
        })
    }
};
