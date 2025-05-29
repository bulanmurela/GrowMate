// File: controllers/analysisController.js
const sequelize = require('../config/database'); // Your Sequelize instance
const { QueryTypes } = require('sequelize');
// No need to import Product or HistoricalStock models if only using raw queries here

const getAnalysisProductNames = async (req, res) => {
    const username = req.user?.username;
    if (!username) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        console.log("analysisController: getAnalysisProductNames - Attempting query with cast");
        const results = await sequelize.query(
            `SELECT DISTINCT s.product_name
             FROM public.stocks s
             INNER JOIN public.product p ON s.product_id::BIGINT = p.id  -- CAST s.product_id
             WHERE p.username = $1
             ORDER BY s.product_name ASC`,
            {
                bind: [username],
                type: QueryTypes.SELECT
            }
        );
        console.log("analysisController: getAnalysisProductNames - Query successful, rows:", results.length);
        res.json(results.map(row => row.product_name)); // Send back an array of names

    } catch (err) {
        console.error("Error fetching distinct product names for analysis:", err.message, err.stack);
        res.status(500).json({ message: "Error fetching product names for analysis", error: err.message });
    }
};

const getStockTrendsForAnalysis = async (req, res) => {
    const username = req.user?.username;
    if (!username) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        console.log("analysisController: getStockTrendsForAnalysis - Attempting query with cast");
        const rawData = await sequelize.query(
            `SELECT s.date, s.product_name, s.recorded_stock
             FROM public.stocks s
             INNER JOIN public.product p ON s.product_id::BIGINT = p.id  -- CAST s.product_id
             WHERE p.username = $1
             ORDER BY s.date ASC, s.product_name ASC;`,
            {
                bind: [username],
                type: QueryTypes.SELECT
            }
        );
        console.log("analysisController: getStockTrendsForAnalysis - Raw data from DB rows:", rawData.length);

        if (rawData.length === 0) {
            return res.json([]);
        }
        const dateMap = new Map();
        rawData.forEach(row => {
            const dateObj = new Date(row.date); // Assuming row.date is a string or Date object
            const dateStr = dateObj.toISOString().split('T')[0];
            if (!dateMap.has(dateStr)) {
                dateMap.set(dateStr, { date: dateStr });
            }
            const dayData = dateMap.get(dateStr);
            dayData[row.product_name] = row.recorded_stock;
        });
        const sortedTrends = Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log("analysisController: getStockTrendsForAnalysis - Processed sortedTrends:", sortedTrends.length);
        res.json(sortedTrends);

    } catch (err) {
        console.error("Error fetching stock trends for analysis:", err.message, err.stack);
        res.status(500).json({ message: "Error fetching stock trends for analysis", error: err.message });
    }
};

const getForecastDataForAnalysis = async (req, res) => {
    const username = req.user?.username;
    if (!username) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        console.log(`analysisController: getForecastDataForAnalysis - Fetching for user: ${username}`);
        const rawForecastData = await sequelize.query(
            `SELECT f.forecast_date, f.product_name, f.predicted_stock
             FROM public.forecast f
             INNER JOIN public.product p ON f.product_id::BIGINT = p.id  -- CAST f.product_id
             WHERE p.username = $1
             ORDER BY f.product_name ASC, f.forecast_date ASC;`,
            {
                bind: [username],
                type: QueryTypes.SELECT
            }
        );
        console.log("analysisController: getForecastDataForAnalysis - Raw data from DB rows:", rawForecastData.length);

        if (rawForecastData.length === 0) {
            console.log("analysisController: getForecastDataForAnalysis - No forecast data found for this user after join.");
            return res.json([]);
        }

        const forecastMap = new Map();
        rawForecastData.forEach(row => {
            const dateObj = new Date(row.forecast_date); // Assuming row.forecast_date is string or Date
            const dateStr = dateObj.toISOString().split('T')[0];

            if (!forecastMap.has(dateStr)) {
                forecastMap.set(dateStr, { date: dateStr });
            }
            const dayData = forecastMap.get(dateStr);
            dayData[`${row.product_name}_forecast`] = row.predicted_stock;
        });

        const sortedForecasts = Array.from(forecastMap.values())
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        console.log("analysisController: getForecastDataForAnalysis - Processed sortedForecasts to be sent:", sortedForecasts.length);
        res.json(sortedForecasts);

    } catch (err) {
        console.error("Error fetching forecast data for analysis:", err.message, err.stack);
        res.status(500).json({ message: "Error fetching forecast data", error: err.message });
    }
};

module.exports = {
    getAnalysisProductNames,
    getStockTrendsForAnalysis,
    getForecastDataForAnalysis
};