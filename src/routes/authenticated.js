const jwt = require('jwt-simple')
const upload = require('../middlewares/upload');
const { getAllTasks, searchTasks, getTaskById, createTask, updateTask, deleteTask, uploadTaskImage } = require('../controllers/task');

const validateToken = (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required for validation.' });
    }
    try {
        const decoded = jwt.decode(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next();
};

module.exports = function (app) {
    app.post('/validate-token', 
        validateToken,
        (req, res) => {
            return res.json({ message: 'Token is valid' });
        }
    );

    app.get('/todos', 
        validateToken,
        getAllTasks
    );

    app.get('/todos/search', 
        validateToken,
        searchTasks
    );

    app.get('/todos/:id',
        validateToken, 
        getTaskById
    );

    app.post('/todos', 
        validateToken,
        createTask
    );

    app.put('/todos/:id', 
        validateToken,
        updateTask
    );

    app.delete('/todos/:id', 
        validateToken,
        deleteTask
    );

    app.post('/todos/:id/upload',
        upload.single('image'),
        validateToken,
        uploadTaskImage
    )
}
