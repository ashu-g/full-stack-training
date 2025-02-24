const swaggerDefinition = {
    "openapi": "3.0.0",
    "info": {
        "title": "Task Management API",
        "version": "1.0.0",
        "description": "API documentation for full stack node project"
    },
    "servers": [
        {
            "url": "http://localhost:3000",
            "description": "Local server"
        }
    ],
    "paths": {
        "/todos": {
            "post": {
                "summary": "Create task",
                "description": "Create a new task.",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "title": { "type": "string" },
                                    "description": { "type": "string" },
                                    "status": { "type": "string" }
                                },
                                "required": ["title"]
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Returns id of the created task"
                    },
                    "400": {
                        "description": "Tiqtle is required"
                    }
                }
            }
        },
        "/todos/{id}/upload": {
            "post": {
                "summary": "Upload task image",
                "description": "Upload an image for a task.",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string" }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "image": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Task image updated successfully"
                    },
                    "404": {
                        "description": "Task not found"
                    }
                }
            }
        }
    }
}

module.exports = swaggerDefinition;