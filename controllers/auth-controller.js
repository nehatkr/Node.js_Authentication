const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
  try {
    // extract user information from our request body
    const { username, email, password, role } = req.body;

    // check if the user is already exists in our database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already exists either with same username or same email. Please try with a different  username or a different email",
      });
    }
    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user and save in your database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user!. Please try again leter",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has occured! please try again",
    });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; //getting the field value from the frontend
    console.log("Request body:", req.body);

    // first find if the current user is exists in database or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        massage: "User dosen't exists",
      });
    }

    // if the password is correct  or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        massage: "Invalid crendentials!",
      });
    }

    // create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    // returning the token back
    res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error has occured! please try again",
    });
  }
};
//  change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId; //this will get the current user id

    //  extract old and new password;
    const { oldPassword, newPassword } = req.body;

    // find the current loggedin user
    const user = await User.findById(userId);

    // if user is present or not
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // check if the old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.ststus(400).json({
        success: false,
        message: "Old password is not correct ! please try again",
      });
    }

    // hash the new password here
    const salt = await bcrypt.genSalt(10);
    const neHashedPassword = await bcrypt.hash(newPassword, salt);

    // update user password
    user.password = neHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      massage: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! please try again",
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  changePassword,
};
