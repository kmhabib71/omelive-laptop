const User = require("../model/User");
const jwt = require("jsonwebtoken");
const handleGoogleAuthCallback = async (req, res) => {
  try {
    const { email, googleId } = req.user;
    console.log("User Data from Google Oath: ", req.user);

    let user = await User.findOne({ email: email });

    if (!user) {
      user = new User({ email, googleId });
      await user.save();
    } else {
      console.log("User already exists");
    }
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "7d",
    });

    res.cookie("mern_engine", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:3000/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  handleGoogleAuthCallback,
};
