const User = require('../models/User');

const updateUser = async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;
    const currentUsername = req.user.username;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username dan email harus diisi' });
    }

    const user = await User.findOne({ where: { username: currentUsername } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.update({ username, email, phone, address });

    res.json({
      message: 'Profil berhasil diperbarui',
      user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateUser };
