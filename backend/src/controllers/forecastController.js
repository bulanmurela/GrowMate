// File: controllers/forecastController.js
const { spawn } = require('child_process');
const path = require('path');

const generateForecasts = async (req, res) => {
    // const pythonExecutable = 'python3'; // OLD - This relies on system PATH

    // NEW - Replace with the ACTUAL FULL PATH from your working terminal
    const pythonExecutable = 'C:\\Users\\LEGION\\AppData\\Local\\Programs\\Python\\Python312\\python.exe'; // EXAMPLE - USE YOUR ACTUAL PATH
    // OR if it was a venv in your project:
    // const pythonExecutable = path.join(process.cwd(), '..', 'venv', 'Scripts', 'python.exe'); // Adjust relative path to venv if needed

    const scriptPath = path.join(process.cwd(), 'python_scripts', 'predict.py');

    console.log(`Attempting to run Python forecast script with EXPLICIT executable: ${pythonExecutable} ${scriptPath}`);
    // ... (rest of your spawn logic remains the same)

    const pythonProcess = spawn(pythonExecutable, [scriptPath]);

    let scriptOutput = '';
    let scriptError = '';

    pythonProcess.stdout.on('data', (data) => {
        const outputChunk = data.toString();
        console.log(`Python Script (stdout): ${outputChunk}`);
        scriptOutput += outputChunk;
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorChunk = data.toString();
        console.error(`Python Script (stderr): ${errorChunk}`);
        scriptError += errorChunk;
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script finished with code ${code}`);
        if (code === 0) {
            res.status(200).json({
                message: 'Forecast generation initiated and completed successfully.',
                details: 'Check server logs for Python script output. Forecast data is in the database.',
                pythonOutput: scriptOutput
            });
        } else {
            res.status(500).json({
                message: `Forecast generation script failed with code ${code}.`,
                error: 'Python script execution error. Check server logs for details.',
                pythonError: scriptError,
                pythonOutput: scriptOutput
            });
        }
    });

    pythonProcess.on('error', (err) => {
        console.error('Failed to start Python subprocess for forecasting.', err);
        res.status(500).json({
            message: 'Failed to start forecast generation process.',
            error: err.message
        });
    });
};

module.exports = {
    generateForecasts
};