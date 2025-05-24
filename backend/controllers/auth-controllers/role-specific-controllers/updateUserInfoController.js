const userModel = require("../../../database/models/userModel");

module.exports.updateUserInfo = async (req, res) => {
    const {userId} = req.params
    const {name, email} = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(403).json({
                message: "User not found!"
            })
        };

        if (name) {
            user.name = name;
        };

        // if updated email is the same as current email, skip this block
        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Wrong email format!"
                })
            };

            const existedUser = await userModel.findOne({email});

            if (existedUser && (existedUser._id.toString() !== user._id.toString())) {
                return res.status(400).json({
                    message: "Email has already existed!"
                })
            };

            user.email = email;
        }

        await user.save();

        res.status(200).json({
            message: "Info updated ok!",
            user: {
                ...user._doc
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
}
