const express = require('express');
const morgan = require('morgan');
const path = require('path')
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use('/static', express.static(path.join(__dirname, '..', 'static')))
app.use(tasksRouter);

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

app.use((_req, res) => {
    console.log('Could not handle request.');
    res.status(404)
        .setHeader('Content-Type', 'text/plain')
        .end('404 not found');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});