module.exports = function (app) {
    app.get('/', 
        (req, res) => {
            return res.json({ message: 'Welcome to full stack server.' });
        }
    );

    app.get('/healthCheck', 
        (req, res) => {
            return res.json({message: 'all good...'})
        }
    )

    app.get('/no-auth', 
        (req, res) => {
            return res.json({ message: 'This is a public route. No auth required.' });
        }
    );
}
