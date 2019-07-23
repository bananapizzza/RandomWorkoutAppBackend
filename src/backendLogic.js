const express = require('express');
const port = 5000;
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    fs.readFile(`${path.parse(appRoot).dir}/data/workout_list.json`, 'utf-8', (err, data) => {
        //Save data as an array
        const workoutList = JSON.parse(data).workouts;

        //Select workout randomly from the array
        const selectedWorkout = workoutList[Math.floor(Math.random() * workoutList.length)];
        res.send(JSON.stringify(selectedWorkout));
    });
});

app.post('/check_login_info', (req, res) => {
    fs.readFile(`${path.parse(appRoot).dir}/data/user_list.json`, 'utf-8', (err, data) => {
        const userList = JSON.parse(data).users;
        let isValidUser = false;
        for(i=0; i<userList.length; i++){
            if(userList[i].username === req.body.username){
                isValidUser = true;
                if(userList[i].password === req.body.password) {
                    res.send(JSON.stringify("Login Success"));
                } else {
                    res.statusCode = 401;
                    res.send(JSON.stringify("Wrong Password"));
                }
            }
        }
        if(!isValidUser){
            res.statusCode = 400;
            res.send(JSON.stringify("Invalid User"));
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});