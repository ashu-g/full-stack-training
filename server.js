require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { swaggerUi, swaggerSpec } = require('./src/middlewares/swagger/index');
const { connectToMongo } = require('./src/config/db');
const logger = require('./src/middlewares/logger'); 

// Create an instance of an Express app
const app = express();
const port = process.env.PORT || 3000;

connectToMongo();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(logger);
// Serve images from /uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./src/routes/public')(app)
require('./src/routes/authenticated')(app)

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
