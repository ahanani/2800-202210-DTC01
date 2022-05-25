const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const db = require('./backend-scripts/db');
const email = require('./backend-scripts/email');
const insertcsv = require('./backend-scripts/insertcsv');
const app = express();
const fs = require('fs');
const http = require('http');
app.set('view engine', 'ejs');
app.use(express.static('public'))
const PORT = process.env.PORT || 5000;



app.use(express.static("html"));
app.use(express.static("css"));
app.use(express.static("javascript"));
app.use(express.static("resource"));
app.use(express.static("session"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieParser("thisismysecrctekeyfhrgfgrfrty84fwir767"))
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

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/html/login.html')
});

app.post('/user', (req, res) => {
    db.validateUser(req, res, (userinfo) => {
        if (userinfo != undefined) {
            req.session.loginStatus = true;
            req.session.username = req.body.username;
            //res.redirect(`/landingPage/${results[1]}`);
            res.redirect('/landingPage');
        } else {
            res.status(401).send("Incorrect password or username");
        }
    });
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
            //res.redirect(`/landingPage/${results[1]}`);
            res.redirect('/landingPage');
        } else {
            req.session.loginStatus = false;
            res.status(401);
        }
    });
});

// app.get("/signUpPage", (req, res) => {
//     res.sendFile(`${__dirname}/html/signup.html`);
// });

app.get("/landingPage", userAuthentication, (req, res) => {
    res.render("landingPage.ejs", { user: req.session.username });
});

app.get("/addCardButton", userAuthentication, (req, res) => {
    res.status(200).send("added card button");
});

app.get("/addCard", userAuthentication, (req, res) => {

    res.render("upload.ejs", { user: req.session.username });
});

app.get("/logout", userAuthentication, (req, res) => {
    req.session.destroy();
    console.log(`Distroyed session with id ${req.sessionID}`);
    res.redirect("/");
});


app.post('/uploadfile', userAuthentication, (req, res) => {
    insertcsv.processPurchase(req, res, () => {
        res.send("uploaded the file");
    });
});

app.get("/userDetails/:date", userAuthentication, (req, res) => {
    db.retrievePurchaseDetails(req, res, (data) => {
        res.json(data);
    });
});

app.get("/chartData", userAuthentication, (req, res) => {
    db.retrievePurchaseDetails(req, res, (data) => {
        res.json(data);
    });
});

app.post("/userProfileButton", userAuthentication, (req, res) => {
    res.status(200).send();
});

app.get("/userProfile", (req, res) => {
    res.sendFile(__dirname + "/html/profilePage.html");
});

app.get("/userProfileDetails", userAuthentication, (req, res) => {
    db.retrieveUserDetails(req, res, (data) => { res.json(data) });
});

app.post("/editDataBase", userAuthentication, (req, res) => {
    db.updateUserDetails(req, res, () => res.send("updated user details"));
});


app.post('/makeaccount', (req, res) => {

    if (req.body.username == undefined || req.body.firstname == undefined || req.body.lastname == undefined ||
        req.body.password == undefined) {
        res.send('form not completed');
    } else {
        storeUserDetailsTemp(req.body.username, [req.body.firstname, req.body.lastname, req.body.password]);
        const emailBody = `/registeraccount/${req.body.username}`;
        email.sentEmail(req.body.username, 'Dollar Track Email Validation', emailBody);
        res.send('check your email');
    }
});

app.get('/registeraccount/:username', (req, res) => {
    const userDetails = getUserDetails(req.params.username);
    if (!userDetails) {
        res.send('session expired');

    } else {
        db.insertUser({
            username: req.params.username,
            firstname: userDetails[req.params.username][0],
            lastname: userDetails[req.params.username][1],
            password: userDetails[req.params.username][2]
        }, () => res.redirect("/"));
    }
});

app.get("/insight", userAuthentication, function(req, res) {
    res.sendFile(__dirname + '/html/insight.html');
});


app.get("/insight/data", function(req, res) {
    connection.query("USE dtc01; SELECT WEEK(Transactiondate) AS Week, SUM(Cad) FROM csvlog WHERE MONTH(Transactiondate) IN (04, 05) GROUP BY WEEK(Transactiondate) ORDER BY WEEK(Transactiondate) DESC LIMIT 4;", function(err, result, fields) {
        if (err) throw err;
        console.log(result[0]["SUM(Cad)"]);
        res.send(result)
    });
});

app.get("/expenses", userAuthentication, function(req, res) {
    res.sendFile(__dirname + '/html/expenses.html');
})

app.get("/expenses/data", userAuthentication, function(req, res) {
    db.retrievePurchaseDetails(req, res, (data) => res.json(data));
})

app.get("/report", userAuthentication, function(req, res) {
    res.sendFile(__dirname + '/html/report.html');
});

app.get("/chart", userAuthentication, function(req, res) {
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


app.listen(PORT, () => {
    db.createTables();
    console.log(`Server Running at port ${PORT}`)
});