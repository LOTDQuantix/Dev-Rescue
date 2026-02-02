require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for all routes (since frontend is file:// or another port)
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// Database Connection
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase connection
});

app.get('/api/problems', async (req, res) => {
    try {
        console.log('Fetching data from Supabase...');
        const client = await pool.connect();

        // Fetch all problems
        const problemsRes = await client.query('SELECT * FROM problems');
        const problems = problemsRes.rows;

        // Fetch all solutions
        const solutionsRes = await client.query('SELECT * FROM solutions');
        const solutions = solutionsRes.rows;

        client.release();

        console.log(`Fetched ${problems.length} problems and ${solutions.length} solutions.`);

        // Map solutions to problems
        const data = problems.map(prob => {
            return {
                ...prob,
                // The DB column is 'platforms' (array), but frontend expects 'platform' (array) or mapped?
                // Let's check problems.json. It had "platform": ["Git"].
                // My schema inspection said 'platforms'.
                // I should map 'platforms' back to 'platform' to keep frontend happy.
                platform: prob.platforms,

                // Attach solutions
                solutions: solutions.filter(s => s.problem_id === prob.id).map(s => ({
                    label: s.label,
                    commands: s.commands,
                    explanation: s.explanation,
                    when_to_use: s.when_to_use,
                    undo_or_recovery: s.undo_or_recovery,
                    risk_level: s.risk_level
                }))
            };
        });

        res.json(data);

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve frontend check
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/problems`);
});
