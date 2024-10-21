const express = require('express');
const { body, validationResult } = require('express-validator');
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

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path} from ${req.ip}`);
    next();
});

app.use('/static', express.static(path.join(__dirname, '..', 'static')))

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

app.get('/tasks', (_req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
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
    res.status(201).json(newTask);
});

app.patch('/toggle/:id', (req, res) => {
    tasks
        .filter(task => task.id == req.params.id)
        .forEach(task => task.completed = !task.completed);

    res.statusCode = 204;
    res.end();
});

app.delete('/delete/:id', (req, res) => {
    tasks = tasks.filter(task => task.id != req.params.id);
    res.statusCode = 204;
    res.end();
});

app.use((_req, res) => {
    console.log('Could not handle request.');
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 Not found');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});