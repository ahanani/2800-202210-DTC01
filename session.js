const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mysql = require("mysql2")
const db = require('./db');
const email = require('./session/email');
const insertcsv = require('./javascript/insertcsv');
const app = express();
//const {stat} = require('fs');
const fs = require('fs');
//const {request} = require('http');
const http = require('http');
app.set('view engine', 'ejs');
<<<<<<< HEAD
const PORT = process.env.PORT || 5000;
=======
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"password",
    // database:"heroku_7255b02c2ab7559",
    multipleStatements: true
});

//CLEARDB_DATABASE_URL: mysql://b58f9cb389635c:e429fc2a@us-cdbr-east-05.cleardb.net/heroku_7255b02c2ab7559?reconnect=true
>>>>>>> be7f789a6671e8b4a5654ebbbd9c0a54e60cdd84

app.use(express.static("html"));
app.use(express.static("css"));
app.use(express.static("javascript"));
app.use(express.static("resource"));
app.use(express.static("session"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
<<<<<<< HEAD
app.use(cookieParser("thisismysecrctekeyfhrgfgrfrty84fwir767"))
=======

>>>>>>> be7f789a6671e8b4a5654ebbbd9c0a54e60cdd84
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    resave: true,
}));


let users = [];

function storeUserDetailsTemp(username, userDetails) {
    const obj = {};
    obj[username] = userDetails;
    users.push(obj);
    setTimeout(function() {
        for (let i = 0; i < users.length; ++i) {
            if (users[i][username]) {
                users[i] = undefined;
            }
        }
    }, 1000 * 60 * 60);
}

function getUserDetails(username) {
    for (let i = 0; i < users.length; ++i) {
        if (users[i][username]) {
            const result = users[i];
            users[i] = undefined;
            return result;
        }
    }

    return undefined;
}

function userAuthentication(req, res, next) {
    if (req.session.loginStatus) {
        next();
    } else {
        res.status(401).send("Access denied!");
    }
}


function duplicateUserName(newUserName, parsedResultSet) {
    for (let i = 0; i < parsedResultSet.length; ++i) {
        if (parsedResultSet[i][0] == newUserName) {
            return true;
        }
    }

    return false;
}

function parseResultSet(resultset) {

    if (resultset == undefined) {
        return undefined;
    }

    parsedResult = [];

    for (let i = 0; i < resultset[1].length; ++i) {

        parsedResult.push(Object.values(resultset[1][i]));
    }

    return parsedResult;
}

// function insertUser(userData) {
//     connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01;SELECT username FROM user;`, function(err, result) {
//         if (err) console.log(err);
//         let duplicate = duplicateUserName(userData.username, parseResultSet(result));
//         if (duplicate) {
//             throw "Duplicate username";
//         }
//     });

//     const queryStatement = `CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createUserTable}; INSERT INTO user VALUES("${userData.username}", 
//     "${userData.firstname}", "${userData.lastname}", "${userData.password}");`;

//     connection.query(queryStatement, function(err, result) {
//         if (err) console.log(err);
//         console.log(result);
//     });
// }

var createUserTable = `CREATE TABLE IF NOT EXISTS user(
    username varchar(50) NOT NULL,
    firstname varchar(20) NOT NULL,
    lastname varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    PRIMARY KEY(username ))`;

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/html/login.html')
});

app.post("/user", (req, res) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createUserTable}; SELECT * FROM user WHERE username =
            "${req.body.username}" AND password =  "${req.body.password}";`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(`${result[3].length} matches found!`);
        if (result[3].length > 0) {
            req.session.loginStatus = true;
            req.session.user = req.body.username;
            let results = Object.values(result[3][0]);
            req.session.name = results[1];
            res.redirect(`/landingPage/${results[1]}`);
        } else {
            req.session.loginStatus = false;
            res.status(401);
        }
    });
});

app.get("/signUpPage", (req, res) => {
    res.sendFile(`${__dirname}/html/signup.html`);
});

app.get("/landingPage/:user", userAuthentication, (req, res) => {
    console.log(`Sent landing page html to ${req.params.user}`);
    res.render(__dirname + "/views/landingPage.ejs", {
        user: `${req.params.user}`
    });
});

app.get("/addCardButton", userAuthentication, (req, res) => {
    res.status(200).send();
});

app.get("/addCard", userAuthentication, (req, res) => {
    res.render(__dirname + "/views/upload.ejs", {
        user: `${req.session.name}`
    });
    res.send();
});

app.get("/logout", userAuthentication, (req, res) => {
    req.session.destroy();
    console.log(`Distroyed session with id ${req.sessionID}`);
    res.redirect("/");
});


app.post('/uploadfile', userAuthentication, (req, res) => {
    insertcsv.insertPurchase(req, res, req.session.user);
});

// app.get('/report', userAuthentication, (req, res) => {
//     console.log("This happens!");
//     res.render(__dirname + "/views/reports.ejs", {
//         user: `${req.session.name}`
//     }, (err, html) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send(html);
//     });
//     res.send();
// });

let createCsvLog = `CREATE TABLE IF NOT EXISTS Csvlog (
    Purchaseid int NOT NULL AUTO_INCREMENT,
    Username VARCHAR(30) NOT NULL,
    Accounttype VARCHAR(10),
    Accountnumber VARCHAR(3),
    Transactiondate DATE NOT NULL,
    Chequenumber VARCHAR(20),
    Description1 VARCHAR(100),
    Description2 VARCHAR(100),
    Cad DECIMAL(6,2),
    Usd DECIMAL(6,2),
    PRIMARY KEY(Purchaseid, Username))`

app.get("/userDetails/:date", userAuthentication, (req, res) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createCsvLog}; 
    SELECT * FROM Csvlog WHERE Username LIKE "%${req.session.user}%" AND 
    Transactiondate LIKE "%${req.params.date}";`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result[3]);
    })

});

app.get("/chartData", userAuthentication, (req, res) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createCsvLog}; 
    SELECT * FROM Csvlog WHERE Username LIKE "%${req.session.user}%"`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result[3]);
    })

});

app.post("/userProfileButton", userAuthentication, (req, res) => {
    res.status(200).send();
});

app.get("/userProfile", (req, res) => {
    res.sendFile(__dirname + "/html/profilePage.html");
});

app.get("/userProfileDetails", userAuthentication, (req, res) => {
    connection.query(`USE dtc01; SELECT * FROM user WHERE username LIKE '%${req.session.user}%'`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result[1]);
    });
});

app.post("/editDataBase", userAuthentication, (req, res) => {
    connection.query(`USE dtc01; UPDATE user SET firstname = '${req.body.firstName}', lastname = '${req.body.lastName}' WHERE username LIKE '%${req.session.user}%'`, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
});


app.post('/makeaccount', (req, res) => {

    if (req.body.username == undefined || req.body.firstname == undefined || req.body.lastname == undefined ||
        req.body.password == undefined) {
        res.send('form not completed');
    }


    storeUserDetailsTemp(req.body.username, [req.body.firstname, req.body.lastname, req.body.password]);
    const emailBody = `/registeraccount/${req.body.username}`;


    email.sentEmail(req.body.username, 'Dollar Track Email Validation', emailBody);
    res.send('check your email');
});

app.get('/registeraccount/:username', (req, res) => {

    const userDetails = getUserDetails(req.params.username);

    if (!userDetails) {
        res.send('session expired');

    } else {
        insertUser({
            username: req.params.username,
            firstname: userDetails[req.params.username][0],
            lastname: userDetails[req.params.username][1],
            password: userDetails[req.params.username][2]
        });

        res.redirect("/");
    }
});

app.get("/insight", userAuthentication, function(req, res) {
    res.sendFile(__dirname + '/html/insight.html');
});

<<<<<<< HEAD
app.get("/insight/data", function(req, res) {
    connection.query("SELECT WEEK(Transactiondate) AS Week, SUM(Cad) FROM csvlog WHERE MONTH(Transactiondate) IN (04, 05) GROUP BY WEEK(Transactiondate) ORDER BY WEEK(Transactiondate) DESC LIMIT 4;", function(err, result, fields) {
=======
app.get("/insight/data", function (req, res) {
    connection.query("USE dtc01; SELECT WEEK(Transactiondate) AS Week, SUM(Cad) FROM csvlog WHERE MONTH(Transactiondate) IN (04, 05) GROUP BY WEEK(Transactiondate) ORDER BY WEEK(Transactiondate) DESC LIMIT 4;", function (err, result, fields) {
>>>>>>> be7f789a6671e8b4a5654ebbbd9c0a54e60cdd84
        if (err) throw err;
        console.log(result[0]["SUM(Cad)"]);
        res.send(result)
    });
});

app.get("/expenses", userAuthentication, function(req, res) {
    res.sendFile(__dirname + '/html/expenses.html');
})

app.get("/expenses/data", userAuthentication, function(req, res) {
    connection.query("SELECT * FROM Csvlog ORDER BY Purchaseid DESC", function(err, result, fields) {
        if (err) throw err;
        console.log(result[0].Purchaseid);
        res.send(result);
    });
})

app.get("/report", userAuthentication,function(req,res){
    res.sendFile(__dirname + '/html/report.html');
});

app.get("/chart", userAuthentication,function(req,res){
    res.sendFile(__dirname + '/html/chart.html');
});

// app.get('/adminlogin', function (req, res) {
//     res.sendFile('views/admin-login.html', {
//         root: __dirname
//     })
// });


// app.post('/adminpage', (req, res) => {
//     sessiondb.validateUser({
//         username: req.body.username,
//         password: req.body.password
//     }, function (valid) {

//         console.log(req.body.username, req.body.password);

//         if (valid && req.body.username == 'admin') {
//             req.session.userid = req.body.username;
//             let usernamevalue = req.session.userid;
//             res.render('admin-page');
//         } else {
//             res.send('Invalid username or password');
//         }

//     });
// })

// app.post('/adminupload', function (req, res) {

//     if (req.session.userid == 'admin') {

//         insertcsv.insertCompany(req, res);
//     } else
//         res.sendFile('views/admin-login.html', {
//             root: __dirname
//         })

// });


// app.get('/carddetails', (req, res) => {
//     if (req.session.userid) {
//         sessiondb.retrieveCardDetails(req.session.userid, res)
//     } else
//         res.send('Error user not logged in')
// });


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));