import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { sendEmailVerification, sendWelcomeEmail, sendResetPasswordEmail, sendPasswordResetSuccessEmail } from "../nodemailer/Email.js"
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All Fields must be required");
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiration: Date.now() + 24 * 60 * 60 * 1000, //24 hrs
    });
    await user.save();

    sendEmailVerification(user.email, verificationToken);

    generateTokenAndSetCookies(res, user._id);

    return res
      .status(201)
      .json({
        message: "User created successfully",
        success: true,
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.message, success: false });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({verificationToken: code});
    if (!user) {
      return res.status(400).json({ success: false, message: "Inavlid or Expired Code"});
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiration = undefined;
    await user.save();

    // Send a welcome email after verification
    await sendWelcomeEmail(user.email, user.name);
    return res.status(200).json({ success: true, message: "Email Verifed Successfully", user: { ...user._doc, password: undefined }});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Ensure email and password are provided
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({email});
    // Ensure user has a password field before comparing
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect Password" });
    }
    generateTokenAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    return res.status(200).json({ 
      success: true, 
      message: "Logged In Successfully", 
      user: { ...user._doc, password:undefined } 
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({ email: email});
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiresAt;
    await user.save();
    sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    return res.status(200).json({ success: true, message: "Reset Password Email sent" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const {token} = req.params;
    const {password} = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset password token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    await sendPasswordResetSuccessEmail(user.email);
    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
    
  }
}

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged Out Successfully" });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(401).json({ success: false, message: "User Not Found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}


