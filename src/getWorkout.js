const express = require('express');
const port = 5000;
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    fs.readFile('../data/workout_list', 'utf-8', (err, workoutList) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        res.send(JSON.stringify(workoutList));
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});