const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const appRoot = path.resolve(__dirname);
const cors = require('cors');
const util = require('util');
const mysql = require('mysql');
const HttpStatus = require('http-status-codes');

const port = 5000;
const INVALID_USER = 'INVALID_USER';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const WRONG_PASSWORD = 'WRONG_PASSWORD';
const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
const ALREADY_USED_ID = 'ALREADY_USED_ID';
const AVAILABLE_ID = 'AVAILABLE_ID';

const pool = mysql.createPool({
    host: "localhost",
    user: "bananapizzza",
    password: "1234",
    database: "random_workout"
});

const readFileAsync = util.promisify(fs.readFile);
const rootPath = path.parse(appRoot).dir;
const queryDBAsync = util.promisify(pool.query).bind(pool);

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
    const username = req.body.username;
    const password = req.body.password;

    switch (await checkLoginInfo(username, password)) {
        case LOGIN_SUCCESS:
            res.send(JSON.stringify(LOGIN_SUCCESS));
            break;
        case WRONG_PASSWORD:
            res.statusCode = HttpStatus.UNAUTHORIZED;
            res.send(JSON.stringify(WRONG_PASSWORD));
            break;
        case INVALID_USER:
            res.statusCode = HttpStatus.UNAUTHORIZED;
            res.send(JSON.stringify(INVALID_USER));
            break;
    }
});

//For signing up
app.post('/sign_up', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    switch (await checkSignUpInfo(username)) {
        case AVAILABLE_ID:
            //Add the new user to the json
            await addNewUserToDB(username, password);
            console.log("sign up success");
            res.send(JSON.stringify(SIGN_UP_SUCCESS));
            break;
        case ALREADY_USED_ID:
            console.log("already used id");
            res.statusCode = HttpStatus.CONFLICT;
            res.send(JSON.stringify(ALREADY_USED_ID));
            break;
    }
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

async function checkLoginInfo(username, password) {
    return await (async () => {
        try {
            const sql = `SELECT password from users WHERE username=?`;
            const queryResult = await queryDBAsync(sql, username);

            if (queryResult.length === 0) {
                return INVALID_USER;
            } else if (queryResult[0].password === password) {
                return LOGIN_SUCCESS;
            } else {
                return WRONG_PASSWORD;
            }
        } catch (err) {
            console.log("checkLoginInfo err" + err);
        }
    })();
}

async function checkSignUpInfo(username) {
    return await (async () => {
        try {
            const sql = `SELECT * from users WHERE username=?`;
            const queryResult = await queryDBAsync(sql, username);
            if (queryResult.length > 0) {
                return ALREADY_USED_ID;
            } else {
                return AVAILABLE_ID;
            }
        } catch (err) {
            console.log("checkSignUpInfo err: " + err);
        }
    })();
}

async function addNewUserToDB(username, password) {
    return await (async () => {
        try {
            const values = [username, password];
            const sql = `INSERT INTO users(username, password) VALUES (?, ?)`;
            await queryDBAsync(sql, values);
            console.log("Added new user to DB");
        } catch (err) {
            console.log("addNewUserToDB err: " + err);
        }
    })();
}