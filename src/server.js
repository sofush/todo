const express = require('express');
const path = require('path')
const app = express();

app.use(express.json());

var tasks = [
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
var counter = tasks.length;

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

app.post('/tasks', (req, res) => {
    const { description } = req.body;

    if (!description.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Invalid input.');
    }

    const newTask = {
        id: ++counter,
        description: description,
        completed: false,
    };

    tasks.push(newTask);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newTask));
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

app.use((_req, _res) => {
    console.log('Could not handle request.');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});