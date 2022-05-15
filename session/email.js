var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dollartrack.canada@gmail.com',
        pass: '$2022Dt$'
    }
});

function sentEmail(recipient, subject, body) {
    const mailOptions = {
        from: 'dollartrack.canada@gmail.com',
        to: `${recipient}`,
        subject: `${subject}`,
        html: `${body}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sentEmail };