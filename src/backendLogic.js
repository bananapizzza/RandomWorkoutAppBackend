const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);
const cors = require('cors');
const util = require('util');

const port = 5000;
const INVALID_USER = 'INVALID_USER';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const WRONG_PASSWORD = 'WRONG_PASSWORD';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const rootPath = path.parse(appRoot).dir;

app.use(express.json());
app.use(cors());



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

    switch(await checkLoginInfo(userList, req.body.username, req.body.password)){
        case LOGIN_SUCCESS:
            res.send(JSON.stringify("Login Success"));
            break;
        case WRONG_PASSWORD:
            res.statusCode = 401;
            res.send(JSON.stringify("Wrong Password"));
            break;
        case INVALID_USER:
            res.statusCode = 400;
            res.send(JSON.stringify("Invalid User"));
            break;
    }
});

//For signing up
app.post('/sign_up', async (req, res) => {
    const fileContent = await getFileContent(`${rootPath}/data/user_list.json`);
    const jsonContent = JSON.parse(fileContent);
    jsonContent['users'].push({username: req.body.username, password: req.body.password});

   await writeFileAsync(`${rootPath}/data/user_list.json`, JSON.stringify(jsonContent));

    res.send(JSON.stringify("Sign Up Success"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

async function getFileContent(filePath) {
    let fileContent;
    try {
        fileContent = await readFileAsync(filePath, 'utf-8');
        return fileContent;
    } catch (err) {
        console.log('error: ', err);
    }
}

async function checkLoginInfo(userList, username, password){
    for (i = 0; i < userList.length; i++) {
        if (userList[i].username === username) {
            if (userList[i].password === password) {
                return LOGIN_SUCCESS;
            } else {
                return WRONG_PASSWORD;
            }
        }
    }
    return INVALID_USER;
}