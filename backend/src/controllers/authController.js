const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require('sequelize');

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Field tidak boleh kosong' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username 
          ? 'Username sudah digunakan' 
          : 'Email sudah terdaftar' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword
    });

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { 
      expiresIn: '1h' 
    });

    return res.status(201).json({ message: 'User berhasil dibuat', token });
  } catch (error) {
    console.error('Error saat register:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
      const { username, email, password } = req.body;
      const user = await User.findOne({
          where: {
              [Op.or]: [
                  { username: username },
                  { email: email }
              ]
          }
      });

      if (!user) {
          return res.status(404).json({ error: "User tidak ditemukan" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Password salah" });
      }

      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { 
        expiresIn: '1h' 
      });

      // Kirim juga informasi username dan profilePicture (jika ada)
      res.json({
          message: "Login berhasil",
          token,
          username: user.username, // Pastikan kolom ini ada di model User
          email : user.email,
          profilePicture: user.profilePicture || null // Sesuaikan dengan nama kolom Anda
      });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};