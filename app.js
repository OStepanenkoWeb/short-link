const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const auth_routes = require('./routs/auth_routes');
const link_routes = require('./routs/link_routes');
const redirect_routes = require('./routs/redirect_routes');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/link', link_routes);
app.use('/api/auth', auth_routes);
app.use('/t', redirect_routes);

if(process.env.NODE_ENV === 'production') {
    app.use('/t', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (request, response) => {
        response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
const PORT = config.get('port') || 5000;
const MONGO_URL = config.get('mongoUrl');

async function start() {
    console.log(PORT, MONGO_URL);
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
    } catch (error) {
        console.log(`Server error - ${error.message}`);
        process.exit(1)
    }
}

start();