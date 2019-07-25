const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);
const cors = require('cors');
const util = require('util');

const port = 5000;
const readFileAsync = util.promisify(fs.readFile);
const rootPath = path.parse(appRoot).dir;

app.use(express.json());
app.use(cors());

async function getFileContent(filePath) {
    let fileContent;
    try {
        fileContent = await readFileAsync(filePath, 'utf-8');
        return fileContent;
    } catch (err) {
        console.log('error: ', err);
    }
}

//For selecting workout randomly
app.get('/', async (req, res) => {
    const fileContent = await getFileContent(`${rootPath}/data/workout_list.json`);
    const workoutList = JSON.parse(fileContent).workouts;

    //Select workout randomly from the array
    const selectedWorkout = workoutList[Math.floor(Math.random() * workoutList.length)];
    res.send(JSON.stringify(selectedWorkout));
});

//TODO: After making logic for sign up, use crypto to encrypt password
//For checking login info
app.post('/check_login_info', async (req, res) => {
    const fileContent = await getFileContent(`${rootPath}/data/user_list.json`);
    const userList = JSON.parse(fileContent).users;
    let isValidUser = false;
    for (i = 0; i < userList.length; i++) {
        if (userList[i].username === req.body.username) {
            isValidUser = true;
            if (userList[i].password === req.body.password) {
                res.send(JSON.stringify("Login Success"));
            } else {
                res.statusCode = 401;
                res.send(JSON.stringify("Wrong Password"));
            }
        }
    }
    if (!isValidUser) {
        res.statusCode = 400;
        res.send(JSON.stringify("Invalid User"));
    }


});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});