const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");

app.use(express.static('javascript'));
app.use(express.static('css'));
app.use(express.static('resource'));

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'COMP2800_Project'
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/login.html');
})

app.get("/users", function (req, res) {
    let userId = (req.query.id).trim();
    let userPassword = req.query.password;

    connection.connect(function (err) {
        connection.query(`SELECT * FROM users`, function(err, result) {
            result = Object.values(JSON.parse(JSON.stringify(result)));
            result.forEach(user => {
                if (userId === user.name && userPassword === user.password) {
                    console.log("Found the user!");
                }
            })
        });
    });
});


app.listen(process.env.PORT || 3000, function (err) {
    if (err)
        console.log(err);
})