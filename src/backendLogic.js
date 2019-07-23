const express = require('express');
const port = 5000;
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);
const cors = require('cors');
let workoutList;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    fs.readFile(`${path.parse(appRoot).dir}/data/workout_list.json`, 'utf-8', (err, data) => {
        //Save data as an array
        workoutList = JSON.parse(data).workouts;

        //Select workout randomly from the array
        const selectedWorkout = workoutList[Math.floor(Math.random() * workoutList.length)];
        res.send(JSON.stringify(selectedWorkout));
    });
});

app.post('/check_login_info', (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
    res.send(JSON.stringify("hello"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});