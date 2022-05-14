const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const sessiondb = require('./session-db');
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

app.post('/createaccount', (req, res) => {

    if (req.body.username == undefined || req.body.firstname == undefined || req.body.lastname == undefined ||
        req.body.password == undefined) {
        res.send('form not completed');
    }

    sessiondb.insertUser({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    });

    res.send('created');
});


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));