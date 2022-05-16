const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const sessiondb = require('./session-db');
const email = require('./email');
const insertcsv = require('./insertcsv');
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 5000;

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





const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));


app.get('/', (req, res) => {
    if (req.session.userid) {
        //res.send(`<p>Welcome User ${req.session.userid}</p> <a href=\'/logout'>click to logout</a>`);
        //res.sendFile('views/upload.html', { root: __dirname });
        let usernamevalue = req.session.userid;
        res.render('upload.ejs', { username: usernamevalue });
    } else
        res.sendFile('views/index.html', { root: __dirname })
});


app.post('/uploadfile', (req, res) => {
    if (req.session.userid) {

        insertcsv.insertPurchase(req, res, req.session.userid);
    } else
        res.sendFile('views/index.html', { root: __dirname })
});



app.post('/user', (req, res) => {
    sessiondb.validateUser({ username: req.body.username, password: req.body.password }, function(valid) {

        console.log(req.body.username, req.body.password);

        if (valid) {
            req.session.userid = req.body.username;
            //res.send(`<p>Welcome User ${req.session.userid}</p> <a href=\'/logout'>click to logout</a>`);
            //res.sendFile('views/upload.html', { root: __dirname });
            let usernamevalue = req.session.userid;
            res.render('upload', { username: usernamevalue });
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

    // const emailBody = `<a href = "localhost:5000/registeraccount/${req.body.username}">Validate Email</a>`;
    const emailBody = `localhost:5000/registeraccount/${req.body.username}`;


    email.sentEmail(req.body.username, 'Dollar Track Email Validation', emailBody);
    res.send('check your email');
});

app.get('/registeraccount/:username', (req, res) => {

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
///////////

app.get('/adminlogin', function(req, res) {
    res.sendFile('views/admin-login.html', { root: __dirname })
});


app.post('/adminpage', (req, res) => {
    sessiondb.validateUser({ username: req.body.username, password: req.body.password }, function(valid) {

        console.log(req.body.username, req.body.password);

        if (valid && req.body.username == 'admin') {
            req.session.userid = req.body.username;
            let usernamevalue = req.session.userid;
            res.render('admin-page');
        } else {
            res.send('Invalid username or password');
        }

    });
})
app.post('/adminupload', function(req, res) {

    if (req.session.userid == 'admin') {

        insertcsv.insertCompany(req, res);
    } else
        res.sendFile('views/admin-login.html', { root: __dirname })

});


app.get('/carddetails', (req, res) => {
    if (req.session.userid) {
        sessiondb.retrieveCardDetails(req.session.userid, res)
    } else
        res.send('Error user not logged in')
});


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));