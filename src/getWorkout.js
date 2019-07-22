const express = require('express');
const port = 5000;
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);
let workoutList;

app.get('/', (req, res) => {
    fs.readFile(`${path.parse(appRoot).dir}/data/workout_list.json`, 'utf-8', (err, data) => {
        //Save data as an array
        workoutList = JSON.parse(data).workouts;

        //Select workout randomly from the array
        const selectedWorkout = workoutList[Math.floor(Math.random() * workoutList.length)];

        //Send the selected workout data
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        res.send(JSON.stringify(selectedWorkout));
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});