const bcrypt = require("bcryptjs");
const saltRounds = 10; // The cost factor for hashing
const sendEmail = require('../sendEmail/sendEmail');
const { SUBJECT_RESET_ACCOUNT, TEXT_RESET_ACCOUNT, HTML_RESET_ACCOUNT } = require('../constant/Constant');
const User = require("../models/User.models");
require('dotenv').config();
// Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo người dùng mới
const createUser = async (req, res) => {
  const { username, password, name, email, phone, address, role } = req.body;
  try {
    const newUser = new User({
      username,
      password,
      name,
      email,
      phone,
      address,
      role
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm changepw
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

const resetAccount = async (req, res, next) => {
  const { email, username } = req.body

  try {
    const account = await User.findOne({ email: email, username: username })
    if (!account) {
      return res.status(404).json({ message: "account not found" })
    }
    const newPassword = Math.random().toString(36).slice(2, 10)
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    account.password = hashedPassword
    await account.save()

    const info = await sendEmail(email, SUBJECT_RESET_ACCOUNT, TEXT_RESET_ACCOUNT, HTML_RESET_ACCOUNT + `<b>${newPassword}</b>`);
    res.status(200).json({ message: "Email reset sent successfully", info })
  } catch (error) {
    next(error)
  }
}
module.exports = { getUsers, createUser, changePassword, resetAccount };
