const jwt = require('jwt-simple')
const { userRegistration, userLogin } = require('../controllers/login');

// Middleware for basic authentication
const basicAuthenticate = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    next();
};

module.exports = function (app) {
    app.get('/', 
        (req, res) => {
            return res.json({ message: 'Welcome to full stack server.' });
        }
    );

    app.get('/ping', 
        (req, res) => {
            return res.json({message: 'Ping successful.'})
        }
    )

    app.get('/no-auth', 
        (req, res) => {
            return res.json({ message: 'This is a public route. No auth required.' });
        }
    );

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
        const token = jwt.encode(payload, process.env.SECRET_KEY);
        return res.json({ token });
    });

    app.post('/register', userRegistration);
    app.post('/login', userLogin);
}
