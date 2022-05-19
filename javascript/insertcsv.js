const fs = require('fs');
const mysql = require('mysql');
const parsemod = require('csv-parse');
const formidable = require('formidable');
const parse = parsemod.parse;

function csvParser(path, next) {
    let csvData = [];
    fs.createReadStream(path)
        .pipe(parse({ delimiter: ',' }))
        .on('data', function(csvrow) {
            csvData.push(csvrow);
        })
        .on('end', function() {
            next(csvData);

        }).on('error', (err) => console.log(err));

}

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    multipleStatements: true
});

function formatStringItem(str) {
    if (str == undefined || str == '') {
        return ' NULL ';
    }
    let copy = str;
    for (let i = 0; i < copy.length; ++i) {
        str = str.replace('"', " ");
        str = str.replace("'", ' ');
    }
    return '"' + str + '"'
}

function formatDate(unformattedDate) {
    let date = new Date(unformattedDate);
    let formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    return '"' + formattedDate + '"';
}

function formatFloatItem(float) {

    if (float == undefined || float == '') {
        return 'NULL';
    }
    return parseFloat(float);
}


var createCSVLogTable = `CREATE TABLE IF NOT EXISTS Csvlog (
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

function formatResult(arr) {
    let result = [];
    for (let i = 1; i < arr.length; ++i) {
        let obj = {}
        for (let j = 0; j < arr[i].length; ++j) {
            obj[arr[0][j]] = arr[i][j];
        }
        result.push(obj);
    }

    return result;
}

function insertPurchase(req, res, username) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, file) {
        let filepath = file.fileupload.filepath;
        let newpath = __dirname + '/' + file.fileupload.originalFilename;

        fs.rename(filepath, newpath, function() {
            csvParser(newpath, (result) => {

                result = formatResult(result);

                fs.unlinkSync(newpath)

                for (let i = 0; i < result.length; ++i) {
                    insertCsvItem(username, result[i]);
                }
                res.send(result);
            });

        });
    });
}

function insertCompany(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, file) {
        let filepath = file.fileupload.filepath;
        let newpath = __dirname + '/' + file.fileupload.originalFilename;

        fs.rename(filepath, newpath, function() {
            csvParser(newpath, (result) => {

                fs.unlinkSync(newpath)

                for (let i = 1; i < result.length; ++i) {
                    sessiondb.insertCompany(result[i]);
                }

                res.send(result);
            });

        });
    });
}

function insertCsvItem(username, csvItem) {
    const queryStatement = `CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createCSVLogTable}; INSERT INTO csvlog(Username, Accounttype, Accountnumber, 
    Transactiondate, Chequenumber, Description1, Description2, Cad, Usd) VALUES(
    ${formatStringItem(username)},
    ${formatStringItem(csvItem["Account Type"])},
    ${formatStringItem(csvItem["Account Number"])},
    ${formatDate(csvItem["Transaction Date"])},
    ${formatStringItem(csvItem["Cheque Number"])},
    ${formatStringItem(csvItem["Description 1"])},
    ${formatStringItem(csvItem["Description 2"])},
    ${formatFloatItem(csvItem["CAD$"])}, 
    ${formatFloatItem(csvItem["USD$"])});`

    connection.query(queryStatement, function (err, result) {
        if (err) console.log(err);;
        const output = JSON.stringify(result);
        console.log("DB returned after insertion: " + output);
    });
}

module.exports = { insertPurchase, insertCompany };