const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Field tidak boleh kosong' });
    }

    // Hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword // Simpan yang sudah di-hash
    });

    return res.status(201).json({ message: 'User berhasil dibuat', user });
  } catch (error) {
    console.error('Error saat register:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password salah" });
    }

    // Kirim data user TANPA password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    };

    res.json({ 
      message: "Login berhasil",
      user: userData 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
