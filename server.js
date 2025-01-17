require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectToMongo } = require('./src/config/db');
const logger = require('./src/middlewares/logger'); 

// Create an instance of an Express app
const app = express();
const port = process.env.PORT || 3000;

connectToMongo();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(logger);

require('./src/routes/public')(app)
require('./src/routes/authenticated')(app)

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
