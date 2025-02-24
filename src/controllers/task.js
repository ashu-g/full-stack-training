const Todo = require('../models/task');

async function getAllTasks(req, res) {
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

async function searchTasks(req, res) {
    try {
        // Parse filter parameters
        const filterQuery = {};
        if (req.query.status) {
            filterQuery.status = req.query.status;
        }
        if (req.query.title) {
            filterQuery.title = req.query.title;
        }
        if (req.query.description) {
            filterQuery.description = req.query.description;
        }

        const todos = await Todo.find(filterQuery);

        res.json(todos);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch todos by status filtering' });
    }
}

async function getTaskById(req, res) {
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

async function createTask(req, res) {
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
}

async function updateTask(req, res) {
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
}

async function deleteTask(req, res) {
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
}

async function uploadTaskImage(req, res) {
    try {
        const { id } = req.params;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const updatedTask = await Todo.findByIdAndUpdate(
            id,
            { image: imagePath },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task image updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ error: `File upload failed: ${error}` });
    }
}

module.exports = {
    getAllTasks,
    searchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    uploadTaskImage
};