const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const db = require("./csvparser/db");

app.use(express.static('javascript'));
app.use(express.static('css'));
app.use(express.static('resource'));
app.use(express.static('html'));




let connection = mysql.createConnection({
    host:"us-cdbr-east-05.cleardb.net",
    user:"b4340ddf7668cd",
    password:"2f4f0497",
    database:"heroku_efc2db8e4f0d9a8",
    multipleStatements: true
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/html/login.html');
})

app.get("/users", function (req, res) {
    let userId = (req.query.id).trim();
    let userPassword = req.query.password;

    connection.connect(function (err) {
        connection.query(`SELECT * FROM users`, function(err, result) {
            let value = Object.values(JSON.parse(JSON.stringify(result)));
            value.forEach(user => {
                if (userId === user.name && userPassword === user.password) {
                    console.log("Found the user!");
                }
            })
        });
    });
});


app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening to port 3000!");
    }
})

app.get("/expenses/", function (req, res) {
    res.sendFile(__dirname + '/html/expenses.html');
})

app.get("/expenses/data", function (req, res) {
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "0000",
        database: "dtc01"
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM csvlog ORDER BY Purchaseid DESC", function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].Purchaseid);
            res.send(result)
        });
    });
    // res.sendFile(__dirname + '/html/expenses.html');

})

app.get("/insight", function (req, res) {
    res.sendFile(__dirname + '/html/insight.html');
    });