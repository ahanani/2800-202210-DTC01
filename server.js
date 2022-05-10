const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");

app.use(express.static('javascript'));
app.use(express.static('css'));
app.use(express.static('resource'));

var users = [{"username" : "comp2800", "password" : "nothing"}]

// let coonnection = mysql.createConnection({
//     host = '127.0.0.1:3306',
//     user = 'root',
//     password = '',
//     database = 'COMP2800_Project'
// });

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/login.html');
})

app.get("/users", function (req, res) {
    let userId = (req.query.id).trim();
    let userPassword = req.query.password;

    users.forEach(user => {
        if (userId === user.username && userPassword === user.password) {
            console.log("User found!");
        } else {
            console.log("User not found!");
        }
    })
})

const port = 3000;
app.listen(port, (err) => {
    console.log(err);
})