const express = require('express');
const port = 5000;
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);

app.get('/', (req, res) => {
    fs.readFile(`${path.parse(appRoot).dir}/data/workout_list`, 'utf-8', (err, workoutList) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        res.send(JSON.stringify(workoutList));
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});