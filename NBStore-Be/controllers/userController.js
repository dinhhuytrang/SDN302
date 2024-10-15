const User = require('../models/User.models');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const sendEmail = require('../sendEmail/sendEmail')
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
  const { username, password, name, email, phone, address, birthday } = req.body;
  try {
    // Validation logic
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is existed' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is existed' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    if (phone.length != 10) {
      return res.status(400).json({ message: "Phone must has 10 numbers" });
    }
    const hasUppercasePw = /[A-Z]/.test(password);
    const hasLowercasePw = /[a-z]/.test(password);
    const hasNumberPw = /[0-9]/.test(password);
    const hasSpecialCharPw = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercasePw || !hasLowercasePw || !hasNumberPw || !hasSpecialCharPw) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const phoneRegex = /^[0-9]{10}$/; // Điều chỉnh regex theo định dạng số điện thoại bạn cần
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ. Vui lòng nhập lại.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      address,
      birthday,
      token, // Store the token in the database
      isActiveEmail: false, // Initially set to false
    });

    const savedUser = await newUser.save();

    // Send verification email
    const verificationLink = `http://localhost:${process.env.PORT}/api/users/verify-email?token=${token}&email=${email}`;
    await sendEmail(email, 'Verify Your Email', '', `
      <h1>Welcome to our system</h1>
      <p>To complete your registration, please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify your email</a>
    `);

    res.status(201).json({ message: 'User created, verification email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ham verifyEmail
const verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  try {
    // Tìm người dùng với email và token phù hợp
    const user = await User.findOne({ email, token: token });

    if (!user) {
      return res.status(400).json({ message: 'Token hoặc email không hợp lệ.' });
    }

    // Cập nhật trạng thái xác thực của người dùng
    user.isActiveEmail = true;
    user.token = null;  // Xóa token sau khi sử dụng
    await user.save();

    // Chuyển hướng đến trang đăng nhập sau khi xác thực thành công
    res.redirect(`http://localhost:3000/account/login`);  // Chuyển đến trang đăng nhập của bạn
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

module.exports = { getUsers, createUser, changePassword, verifyEmail };
