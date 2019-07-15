const express = require('express');
const port = 5000;
const http = require('http');
const fs = require('fs');
const app = express();

const httpServer = http.createServer((req, res) => {
    fs.readFile('../data/workout_list', 'utf-8', (err, workoutList) => {
        if(!err){
            res.writeHead(200, {'Access-Control-Allow-Origin':'*'});
            res.end(JSON.stringify(workoutList));
        } else {
            res.writeHead(404, {'Access-Control-Allow-Origin':'*'});
            res.end(JSON.stringify(err));
        }
    });
});

httpServer.listen(port);

//TODO: Change to use express

// app.get('/', (req, res) => {
//     fs.readFile('../data/workout_list', 'utf-8', (err, workoutList) => {
//         res.send(workoutList);
//         console.log(workoutList);
//     });
// });
//
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });