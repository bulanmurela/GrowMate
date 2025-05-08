const User = require('../models/User');

const updateUser = async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;
    const userId = req.user.id;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username dan email harus diisi' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, phone, address },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateUser };
