const express = require('express');
const path = require('path')
const app = express();

const port = 3000;

const getFile = function(file) {
    return path.join(__dirname, '..', `static/${file}`);
};

app.get('/static/:file', (req, res) => {
    res.sendFile(getFile(req.params.file));
});

app.get('/', (_req, res) => {
    res.sendFile(getFile('index.html'));
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});