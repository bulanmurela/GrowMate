// File: controllers/stockController.js
const Product = require('../models/Product');
const HistoricalStock = require('../models/HistoricalStock'); // Uses the corrected model

const recordDailyStocks = async (req, res) => {
    console.log('--- API HIT: /api/stocks/record-daily ---');
    const { date, productIds } = req.body;
    const loggedInUsername = req.user?.username; // User performing the action

    if (!loggedInUsername) {
        console.log('recordDailyStocks: Unauthorized - User not authenticated.');
        return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    if (!date || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
        console.log('recordDailyStocks: Bad Request - Date and productIds array required.');
        return res.status(400).json({ message: 'Date and a non-empty array of productIds are required.' });
    }

    let formattedDate;
    try {
        const recordDateObj = new Date(date);
        if (isNaN(recordDateObj.getTime())) throw new Error('Invalid date format.');
        formattedDate = recordDateObj.toISOString().split('T')[0];
    } catch (e) {
        console.log('recordDailyStocks: Bad Request - Invalid date format.');
        return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    console.log(`recordDailyStocks: Processing for user '${loggedInUsername}', date '${formattedDate}', productIds:`, productIds);

    let successfulRecords = 0;
    let failedRecords = 0;
    const errors = [];

    try {
        for (const pId of productIds) { // Renamed productId to pId to avoid conflict with product.id
            try {
                // Fetch the product details (including its original owning username if needed)
                const product = await Product.findOne({
                    where: {
                        id: pId, // Assuming product.id in Product table is what pId refers to
                        username: loggedInUsername // Ensure the product belongs to the user initiating snapshot
                    }
                });

                if (!product) {
                    console.warn(`recordDailyStocks: Product with ID ${pId} not found for user ${loggedInUsername}. Skipping.`);
                    errors.push(`Product ID ${pId} not found or not accessible by user ${loggedInUsername}.`);
                    failedRecords++;
                    continue;
                }

                // Data for upsert. This needs to match the fields in your HistoricalStock model
                // (which now matches your 'stocks' DB table)
                await HistoricalStock.upsert({
                    product_id: product.id,        // The ID of the product from 'product' table
                    product_name: product.name,    // The name of the product
                    date: formattedDate,
                    recorded_stock: product.stock, // Current stock from the 'product' table
                    username: loggedInUsername     // The user WHO IS PERFORMING THE "HARI BARU" ACTION
                                                   // If the username in 'stocks' table is meant to be the product's owner,
                                                   // then use product.username (but your table has it separate)
                });
                // Sequelize will handle 'created_at' automatically.

                successfulRecords++;
                console.log(`recordDailyStocks: Upserted stock for Product ID: ${product.id} ('${product.name}')`);

            } catch (loopError) {
                console.error(`recordDailyStocks: Error processing product ID ${pId}:`, loopError.message, loopError.stack);
                errors.push(`Failed for Product ID ${pId}: ${loopError.message}`);
                failedRecords++;
            }
        }

        // ... (rest of your response handling logic) ...
        if (successfulRecords > 0) {
            return res.status(201).json({
                message: `Successfully recorded/updated daily stock for ${successfulRecords} product(s) for user ${loggedInUsername}. ${failedRecords > 0 ? `${failedRecords} failed.` : ''}`,
                errors: errors.length > 0 ? errors : undefined,
            });
        } else if (errors.length > 0) {
             return res.status(400).json({
                message: 'No daily stock data was successfully recorded due to errors.',
                errors,
            });
        } else {
             return res.status(400).json({
                message: 'No products found to process for this user or an unknown issue occurred.',
            });
        }

    } catch (err) {
        console.error('recordDailyStocks: Server error:', err.message, err.stack);
        return res.status(500).json({ message: 'Server error during daily stock recording.', error: err.message });
    }
};

module.exports = {
    recordDailyStocks
};