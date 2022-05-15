const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const sessiondb = require('./session-db');
const email = require('./email');
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var users = []

function userVal(username, userDetails) {
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



//validateUser

//serving public file
//app.use(express.static(__dirname));

const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));


app.get('/', (req, res) => {
    if (req.session.userid) {
        res.send(`<p>Welcome User ${req.session.userid}</p> <a href=\'/logout'>click to logout</a>`);
    } else
        res.sendFile('views/index.html', { root: __dirname })
});
//usernames.includes(req.body.username) && passwords.includes(req.body.password)


app.post('/user', (req, res) => {
    sessiondb.validateUser({ username: req.body.username, password: req.body.password }, function(valid) {

        console.log(req.body.username, req.body.password);

        if (valid) {
            req.session.userid = req.body.username;
            console.log(req.session)
            res.send(`<p>Welcome User ${req.session.userid}</p> <a href=\'/logout'>click to logout</a>`);
        } else {
            res.send('Invalid username or password');
        }

    });
})


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});



app.get('/signuppage', (req, res) => {
    res.sendFile('views/signup.html', { root: __dirname })
});



app.post('/makeaccount', (req, res) => {

    if (req.body.username == undefined || req.body.firstname == undefined || req.body.lastname == undefined ||
        req.body.password == undefined) {
        res.send('form not completed');
    }

    userVal(req.body.username, [req.body.firstname, req.body.lastname, req.body.password]);

    const emailBody = `<a href = "localhost:5000/registeraccount/${req.body.username}">Validate Email</a>`;

    email.sentEmail(req.body.username, 'Dollar Track Email Validation', emailBody);
    res.send('check your email');
});

app.get('/registeraccount/:username', (req, res) => {

    console.log(req.params.username, "received!!!");

    const userDetails = getUserDetails(req.params.username);

    if (!userDetails) {
        res.send('session expired');

    } else {

        sessiondb.insertUser({
            username: req.params.username,
            firstname: userDetails[req.params.username][0],
            lastname: userDetails[req.params.username][1],
            password: userDetails[req.params.username][2]
        });

        res.send('user validated');
    }
});


// app.post('/createaccount', (req, res) => {

//     if (req.body.username == undefined || req.body.firstname == undefined || req.body.lastname == undefined ||
//         req.body.password == undefined) {
//         res.send('form not completed');
//     }

//     sessiondb.insertUser({
//         username: req.body.username,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         password: req.body.password
//     });

//     res.send('created');
// });


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));