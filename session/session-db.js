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

function duplicateUserName(newUserName, parsedResultSet) {
    for (let i = 0; i < parsedResultSet.length; ++i) {
        if (parsedResultSet[i][0] == newUserName) {
            return true;
        }
    }

    return false;
}

function duplicateCompany(newCompanyName, parsedResultSet) {
    if (parsedResultSet == undefined) {
        return false;
    }
    for (let i = 0; i < parsedResultSet.length; ++i) {
        if (parsedResultSet[i][0] == newCompanyName) {
            return true;
        }
    }

    return false;
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



//
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    multipleStatements: true
});

function connect() {
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

function closeConnection() {
    connection.close();
}

var createUserTable = `CREATE TABLE IF NOT EXISTS user(
    username varchar(50) NOT NULL,
    firstname varchar(20) NOT NULL,
    lastname varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    PRIMARY KEY(username ))`

function insertUser(userData) {
    connect();


    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01;SELECT username FROM user;`, function(err, result) {
        if (err) console.log(err);
        let duplicate = duplicateUserName(userData.username, parseResultSet(result));
        if (duplicate) {
            throw "Duplicate username";
        }
    });

    const queryStatement = `CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createUserTable}; INSERT INTO user VALUES("${userData.username}", 
    "${userData.firstname}", "${userData.lastname}", "${userData.password}");`;

    connection.query(queryStatement, function(err, result) {
        if (err) console.log(err);
        console.log(result);

        //closeConnection();
    });
}

function validateUser(userCredentials, next) {
    connect();

    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createUserTable}; SELECT * FROM user WHERE username LIKE
    "%${userCredentials.username}%" AND password =  ${userCredentials.password};`, function(err, result) {
        if (err) console.log(err);

        //closeConnection();
        next(result[1].length);
    });
}

var createCSVLogTable = `CREATE TABLE IF NOT EXIST Csvlog (
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

function insertCsvItem(username, csvItem) {
    connect();
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

    connection.query(queryStatement, function(err, result) {
        if (err) console.log(err);;
        const output = JSON.stringify(result);
        console.log("DB returned after insertion: " + output);
    });
}

var createCompanyDataBase = `CREATE TABLE IF NOT EXISTS Company(
    Companyid int NOT NULL AUTO_INCREMENT,
    Companyname VARCHAR(30) NOT NULL,
    Companyindustry VARCHAR(30),
    Companydescription VARCHAR(50),
    PRIMARY KEY(Companyid, Companyname))`

function insertCompany(companyDetails) {
    connect();

    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createCompanyDataBase};SELECT Companyname FROM company;`, function(err, result) {
        if (err) console.log(err);
        let duplicate = duplicateCompany(companyDetails[0], parseResultSet(result));
        if (duplicate) {
            throw "Duplicate comapny name";
        }
    });

    const queryStatement = `CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createCompanyDataBase};INSERT INTO Company(Companyname, Companyindustry, Companydescription) VALUES(${formatStringItem(companyDetails[0])}, 
        ${formatStringItem(companyDetails[1])}, 
        ${formatStringItem(companyDetails[2])});`;

    connection.query(queryStatement, function(err, result) {
        if (err) console.log(err);
        console.log(result);

        //closeConnection();
    });
}

function retrieveCardDetails(username, res) {
    connect();
    connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01; ${createCSVLogTable};SELECT DISTINCT Accounttype, Accountnumber FROM csvlog WHERE username = ${formatStringItem(username)};`, function(err, result) {
        // console.log(parseResultSet(result));
        const cards = parseResultSet(result);
        const cardDetails = [];
        for (let i = 0; i < cards.length; ++i) {
            //console.log(`USE dtc01; SELECT Transactiondate, Chequenumber, Description1, Description2, Cad, Usd  FROM csvlog WHERE Accounttype = ${formatStringItem(cards[i][0])} AND Accountnumber = ${formatStringItem(cards[i][1])};`);
            connection.query(`CREATE DATABASE IF NOT EXISTS dtc01; ${createCSVLogTable};USE dtc01; SELECT *  FROM csvlog WHERE Accounttype = ${formatStringItem(cards[i][0])} AND Accountnumber = ${formatStringItem(cards[i][1])};`, function(err, result) {
                cardDetails.push(parseResultSet(result));
                //console.log(parseResultSet(result));
                if (i == cards.length - 1) {
                    //console.log(cardDetails);
                    res.send(cardDetails);
                }
            });
        }
    });
}






module.exports = {
    insertUser,
    validateUser,
    insertCsvItem,
    insertCompany,
    retrieveCardDetails
}