const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//serving public file
//app.use(express.static(__dirname));

const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//username and password
const myusername = 'user1'
const mypassword = 'mypassword'

const usernames = ['u1', 'u2', 'u3'];
const passwords = ['p1', 'p2', 'p3']

// a variable to save a session
//var session;


app.get('/',(req,res) => {
    if(req.session.userid){
        res.send(`<p>Welcome User ${req.session.userid}</p> <a href=\'/logout'>click to logout</a>`);
    }else
    res.sendFile('views/index.html',{root:__dirname})
});

app.post('/user',(req,res) => {
    if(usernames.includes(req.body.username) && passwords.includes(req.body.password)){
        req.session.userid=req.body.username;
        console.log(req.session)
        res.send(`<p>Welcome User ${req.session.userid}</p> <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));








