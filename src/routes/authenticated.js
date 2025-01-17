const jwt = require('jwt-simple')
const Todo = require('../models/task');

// Secret key for JWT
const SECRET_KEY = '1838dwkjecweiufy2389edyi';

// Middleware for basic authentication
const basicAuthenticate = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    next();
};

const validateToken = (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required for validation.' });
    }
    try {
        const decoded = jwt.decode(token, SECRET_KEY);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next();
};

module.exports = function (app) {
    app.post('/basic-auth', 
        basicAuthenticate, 
        (req, res) => {
            return res.json({ message: 'Congratulations. You have been authenticated!' });
        }
    );

    app.post('/generate-token', (req, res) => {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required to generate a token.' });
        }
        const payload = { username };
        const token = jwt.encode(payload, SECRET_KEY);
        return res.json({ token });
    });

    app.post('/validate-token', 
        validateToken,
        (req, res) => {
            return res.json({ message: 'Token is valid' });
        }
    );

    app.get('/todos', 
        validateToken,
        async (req, res) => {
            try {
                const page = parseInt(req.query.page) || process.env.DEFAULT_PAGE;
                const limit = parseInt(req.query.limit) || process.env.DEFAULT_LIMIT;
                const skip = (page - 1) * limit;

                // Get sort options
                const sortField = req.query.sortBy || 'createdAt';
                const sortOrder = req.query.order || 'asc';
                const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

                const todos = await Todo.find().sort(sortOptions).skip(skip).limit(limit);

                // Get total todo count for pagination metadata
                const totalTodos = await Todo.countDocuments();

                res.json({
                    todos,
                    pagination: {
                        totalTodos,
                        currentPage: page,
                        totalPages: Math.ceil(totalTodos / limit),
                        limit,
                    },
                });
            } catch (err) {
                return res.status(500).json({ error: 'Failed to fetch todos' });
            }
        }
    );

    app.get('/todos/search', 
        validateToken,
        async (req, res) => {
            try {
                // Parse filter parameters
                const filterQuery = {};
                if (req.query.status) {
                    filterQuery.status = req.query.status;
                }

                const todos = await Todo.find(filterQuery);

                res.json(todos);
            } catch (err) {
                return res.status(500).json({ error: 'Failed to fetch todos by status filtering' });
            }
        }
    );

    app.get('/todos/:id',
        validateToken, 
        async (req, res) => {
            try {
                const todo = await Todo.findById(req.params.id);
                if (!todo) {
                    return res.status(404).json({ error: 'Todo not found' });
                }
                return res.json(todo);
            } catch (err) {
                return res.status(500).json({ error: 'An error occurred while fetching the todo' });
            }
        }
    );

    app.post('/todos', 
        validateToken,
        async (req, res) => {
        try {
            const { title, description, status } = req.body;
    
            if (!title) {
                return res.status(400).json({ error: 'Title is required.' });
            }
    
            const newTodo = new Todo({ title, description, status });
            const savedTodo = await newTodo.save();
    
            res.status(201).json({ _id: savedTodo._id });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create todo' });
        }
    });

    app.put('/todos/:id', 
        validateToken,
        async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
    
            if (updateData.status && !['Pending', 'In Progress', 'Completed'].includes(updateData.status)) {
                return res.status(400).json({ error: 'Invalid status value.' });
            }
    
            // Find and update the todo
            const updatedTodo = await Todo.findByIdAndUpdate(
                id,
                updateData,
                { new: true } // Return the updated document
            );
    
            if (!updatedTodo) {
                return res.status(404).json({ error: 'Todo not found.' });
            }
    
            res.status(201).json(updatedTodo);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update todo.' });
        }
    });

    app.delete('/todos/:id', 
        validateToken,
        async (req, res) => {
        try {
            const { id } = req.params;
    
            const deletedTodo = await Todo.findByIdAndDelete(id);
    
            if (!deletedTodo) {
                return res.status(404).json({ error: 'Todo not found.' });
            }
    
            res.status(204).json();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete todo.' });
        }
    });
}
