const User = require('../controllers/userController');

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

module.exports = {
  getUsers,
  createUser
};
