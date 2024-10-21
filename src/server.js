const express = require('express');
const { body, validationResult } = require('express-validator');
const morgan = require('morgan');
const path = require('path')
const app = express();

let tasks = [
    {
        id: 1,
        description: "Buy groceries",
        completed: true,
    },
    {
        id: 2,
        description: "Cook dinner",
        completed: false,
    },
    {
        id: 3,
        description: "Do the dishes",
        completed: false,
    },
    {
        id: 4,
        description: "Work out",
        completed: false,
    }
];
let counter = tasks.length;

app.use(express.json());
app.use(morgan('combined'));
app.use('/static', express.static(path.join(__dirname, '..', 'static')))

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

app.get('/tasks', (_req, res) => {
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .end(JSON.stringify(tasks));
});

app.post('/tasks', [
    body('description')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Description cannot be empty.')
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newTask = {
        id: ++counter,
        description: req.body.description,
        completed: false,
    };

    tasks.push(newTask);
    res.status(201).json(JSON.stringify(newTask));
});

app.patch('/toggle/:id', (req, res) => {
    const task = tasks.find(task => task.id == req.params.id);
    task.completed = !task.completed;
    res.status(204).end();
});

app.delete('/delete/:id', (req, res) => {
    tasks = tasks.filter(task => task.id != req.params.id);
    res.status(204).end();
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