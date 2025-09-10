const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database using the URL from Azure's environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Define the API endpoint that the app will call
app.get('/api/monument', async (req, res) => {
  const monumentId = req.query.id; // Get the id from the URL (e.g., ?id=india-gate)

  if (!monumentId) {
    return res.status(400).json({ error: 'Please provide a monument ID.' });
  }

  try {
    // Query the database to find the monument
    const result = await pool.query('SELECT * FROM monuments WHERE id = $1', [monumentId]);

    if (result.rows.length > 0) {
      // If found, send the data back as JSON
      res.json(result.rows[0]);
    } else {
      // If not found, send a 404 error
      res.status(404).json({ error: 'Monument not found.' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server and make it listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});