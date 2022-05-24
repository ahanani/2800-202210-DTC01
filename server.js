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




const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "dtc01"
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/html/login.html');
})

app.get("/users", function (req, res) {
    let userId = (req.query.id).trim();
    let userPassword = req.query.password;

    connection.connect(function (err) {
        connection.query(`SELECT * FROM users`, function (err, result) {
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
    con.query("SELECT * FROM csvlog ORDER BY Purchaseid DESC", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].Purchaseid);
        res.send(result)
    });
    // res.sendFile(__dirname + '/html/expenses.html');

})

app.get("/insight", function (req, res) {
    res.sendFile(__dirname + '/html/insight.html');
});


app.get("/insight/data", function (req, res) {
    con.query("SELECT WEEK(Transactiondate) AS Week, SUM(Cad) FROM csvlog WHERE MONTH(Transactiondate) IN (04, 05) GROUP BY WEEK(Transactiondate) ORDER BY WEEK(Transactiondate) DESC LIMIT 4", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]["SUM(Cad)"]);
        res.send(result)
    });

    // res.sendFile(__dirname + '/html/expenses.html');

})

app.get("/report", function (req, res) {
    res.sendFile(__dirname + '/html/report.html');
});

app.get("/chart", function (req, res) {
    res.sendFile(__dirname + '/html/chart.html');
});