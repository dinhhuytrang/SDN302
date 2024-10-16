const User = require('../models/User.models');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { SUBJECT_RESET_ACCOUNT, TEXT_RESET_ACCOUNT, HTML_RESET_ACCOUNT } = require('../constant/Constant');
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
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const userId = req.user.id; // Assuming req.user contains the authenticated user data
    const user = await User.findById(userId).populate("role").exec(); // Similar to your signin structure

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Ensure the new password is different from the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }

    // Password strength validation
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

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Optionally, you can invalidate the current tokens by deleting the refresh token
    res.clearCookie("refreshToken");

    // Send success response
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

//generate access token : chứa thông tin user trả về, muốn nó trả về cái gì thì thêm vào object
//thiếu hạn sử dụng, nếu không thì nó sẽ mặc định là 15 phút :       expiresIn: "15m",
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "15m",
    },
  );
}


// Generate refresh token
async function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id}, 
   process.env.JWT_SECRET,
  { expiresIn: "7d" });

  user.refreshToken = token;
  await user.save();

  return token;
}

// Request refresh token
async function requestRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "You're not Authenticated." });

    const foundUser = await User.findOne({ refreshToken }).populate("role").exec();
    if (!foundUser) return res.status(403).json({ message: "Refresh token is not valid" });

    jwt.verify(refreshToken,  process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.status(403).json({ message: "Refresh token is not valid" });

      const newAccessToken = generateAccessToken(foundUser);
      const newRefreshToken = await generateRefreshToken(foundUser);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        path: "/",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Sign in action
async function signin(req, res, next) {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({ email }).populate("role").exec();
    if (!user) return res.status(404).json({ message: "Email and User not found." });

    //validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Wrong password" });

    //check status account
    if (user.statusAccount !== 1) { 
      console.log("Account is locked by system");
      //send mail notify user
      return res.status(401).json({ message: "Your account is locked by system." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      path: "/",
    });

    // Redirect to homepage after successful login
    // res.redirect('/');

    const responsePayload = {
      message: "Logged in successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,  
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        birthday: user.birthday,
      }
    };

    res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
}


module.exports = { getUsers, signin, createUser, changePassword, verifyEmail, resetAccount };
