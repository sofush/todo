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

const getFile = function(file) {
    return path.join(__dirname, '..', `static/${file}`);
};

app.get('/static/:file', async (req, res) => {
    res.sendFile(getFile(req.params.file));
});

app.get('/', async (_req, res) => {
    res.sendFile(getFile('index.html'));
});

app.get('/tasks', async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
});

app.post('/add/:description', async (req, res) => {
    const description = req.params.description;

    if (description !== undefined) {
        tasks.push({
            id: ++counter,
            description: description,
            completed: false,
        });
    }

    res.redirect('/');
});

app.post('/toggle/:id', async (req, res) => {
    tasks
        .filter(task => task.id == req.params.id)
        .forEach(task => task.completed = !task.completed);
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    tasks = tasks.filter(task => task.id == req.params.id);
    res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});