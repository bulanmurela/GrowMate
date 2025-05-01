// controllers/trendController.js
const axios = require('axios');

// Get Google Trends data
exports.getTrends = async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/api/trends', {
      params: { term: req.query.term || 'business' }
    });

    res.status(200).json({
      trends: response.data
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trends from Python API' });
  }
};