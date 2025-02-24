const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./specs');

const options = {
    swaggerDefinition,
    apis: ['./server.js'], // Path to your API docs
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
