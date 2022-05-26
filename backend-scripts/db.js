//***DB UTILITIES FUNCTIONS***
function parseResultSet(resultset) {

    if (resultset == undefined) {
        //throw "SQL tables EMPTY";
        return undefined;
    }

    parsedResult = [];

    for (let i = 0; i < resultset[1].length; ++i) {

        parsedResult.push(Object.values(resultset[1][i]));
    }

    return parsedResult;
}

// function duplicateUserName(newUserName, parsedResultSet) {
//     for (let i = 0; i < parsedResultSet.length; ++i) {
//         if (parsedResultSet[i][0] == newUserName) {
//             return true;
//         }
//     }

//     return false;
// }


function duplicateUserName(newUserName, parsedResultSet) {
    for (let i = 0; i < parsedResultSet.length; ++i) {
        if (parsedResultSet[i].username == newUserName) {
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
    let d = unformattedDate.split('/');
    let year = d[2];
    let month = (d[0].length == 1) ? '0' + d[0] : d[0];
    let day = (d[1].length == 1) ? '0' + d[1] : d[1];
    let condition = new Date(`${year}-${month}-${day}`);
    if (condition == 'Invalid Date') {
        throw "Invalid Date";
    }
    return `"${year}-${month}-${day}"`;
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
//***DB UTILITIES FUNCTIONS***

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "amin5",
    password: "MySql1000$",
    multipleStatements: true
});

function connect() {
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}
connect();

function closeConnection() {
    connection.close();
}


//throws excpetion
function insertUser(userData, next) {
    connection.query(`SELECT username FROM user;`, function(err, result) {

        if (err) console.log(err);
        if (result.length != 0) {
            //let duplicate = duplicateUserName(userData.username, parseResultSet(result));
            let duplicate = duplicateUserName(userData.username, (result));

            if (duplicate) {
                next("duplicate");
                return;
            }
        }
        const insertUserStatement = `INSERT INTO user VALUES(${formatStringItem(userData.username)}, 
        ${formatStringItem(userData.firstname)}, ${formatStringItem(userData.lastname)}, ${formatStringItem(userData.password)});`;
        connection.query(insertUserStatement, function(err, result) {
            if (err) console.log(err);
            console.log(result);
            next();
        });
    });
}

//throws exception
function insertCompany(companyData) {
    connection.query(`USE dtc01; SELECT Companyname FROM company;`, function(err, result) {
        if (err) console.log(err);
        let duplicate = duplicateCompany(companyData.companyname, parseResultSet(result));
        if (duplicate) {
            throw "Duplicate comapny name";
        }
    });

    const insertCompanyStatement = `USE dtc01; INSERT INTO Company(Companyname, Companyindustry, Companydescription) 
        VALUES(${formatStringItem(companyData.companyname)}, ${formatStringItem(companyData.companyindustry)}, 
        ${formatStringItem(companyData.companydescription)});`;

    connection.query(queryStatement, function(err, result) {
        if (err) console.log(err);
    });
}

function insertCsvItem(username, csvItemData) {
    const insertCsvItemStatement = `USE dtc01; INSERT INTO csvlog(Username, Accounttype, Accountnumber, 
    Transactiondate, Chequenumber, Description1, Description2, Cad, Usd) VALUES(
    ${formatStringItem(username)},
    ${formatStringItem(csvItemData["Account Type"])},
    ${formatStringItem(csvItemData["Account Number"])},
    ${formatDate(csvItemData["Transaction Date"])},
    ${formatStringItem(csvItemData["Cheque Number"])},
    ${formatStringItem(csvItemData["Description 1"])},
    ${formatStringItem(csvItemData["Description 2"])},
    ${formatFloatItem(csvItemData["CAD$"])}, 
    ${formatFloatItem(csvItemData["USD$"])});`

    connection.query(insertCsvItemStatement, function(err, result) {
        if (err) console.log(err);
    });
}


function createTables() {
    const database = `CREATE DATABASE IF NOT EXISTS dtc01; USE dtc01;`;
    const userTable = `CREATE TABLE IF NOT EXISTS User(
    username varchar(50) NOT NULL,
    firstname varchar(20) NOT NULL,
    lastname varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    PRIMARY KEY(username));`;
    const csvlogTable = `CREATE TABLE IF NOT EXISTS Csvlog (
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
        PRIMARY KEY(Purchaseid, Username));`;
    const companyTable = `CREATE TABLE IF NOT EXISTS Company(
            Companyid int NOT NULL AUTO_INCREMENT,
            Companyname VARCHAR(30) NOT NULL,
            Companyindustry VARCHAR(30),
            Companydescription VARCHAR(50),
            PRIMARY KEY(Companyid, Companyname));`;

    connection.query(database + userTable + csvlogTable + companyTable, function(err, result) {
        if (err)
            console.log(err);
    });
}


function retrieveCardDetails(req, res) {
    connection.query(`USE dtc01;SELECT DISTINCT Accounttype, Accountnumber FROM csvlog WHERE username = ${formatStringItem(req.session.username)};`, function(err, result) {
        const cards = parseResultSet(result);
        const cardDetails = [];
        for (let i = 0; i < cards.length; ++i) {
            connection.query(`USE dtc01; SELECT * FROM csvlog WHERE Accounttype = ${formatStringItem(cards[i][0])} AND Accountnumber = ${formatStringItem(cards[i][1])};`, function(err, result) {
                cardDetails.push(parseResultSet(result));
                if (i == cards.length - 1) {
                    res.send(cardDetails);
                }
            });
        }
    });
}


function retrieveUserDetails(req, res, next) {
    const getUserDetailsStatement = `USE dtc01; SELECT * FROM user WHERE username = ${formatStringItem(req.session.username)};`
    connection.query(getUserDetailsStatement,
        function(err, result) {
            if (err)
                console.log(err);
            next(result[1][0]);
        })
}

function validateUser(req, res, next) {
    const getUserDetailsStatement = `USE dtc01; SELECT * FROM user WHERE username = "${req.body.username}" AND password = "${req.body.password}";`
    connection.query(getUserDetailsStatement,
        function(err, result) {
            if (err)
                console.log(err);
            next(result[1][0]);
        })
}

function retrievePurchaseDetails(req, res, next) {
    let getPurchaseDetailsStatement = `USE dtc01;
     SELECT * FROM Csvlog WHERE Username LIKE "%${req.session.username}%" AND 
    Transactiondate LIKE "%${req.params.date}";`

    if (req.params.date == undefined) {
        getPurchaseDetailsStatement = `USE dtc01;
     SELECT * FROM Csvlog WHERE Username LIKE "%${req.session.username}%";`
    }

    connection.query(getPurchaseDetailsStatement,
        function(err, result) {
            if (err)
                console.log(err);
            // console.log("$$$", result[1], "$$$");
            next(result[1]);
        })
}

function retrieveInsightDetails(req, res, next) {

    let getInsightDetailsStatement = "USE dtc01; SELECT WEEK(Transactiondate) AS Week, SUM(Cad) FROM csvlog WHERE MONTH(Transactiondate) IN (04, 05) GROUP BY WEEK(Transactiondate) ORDER BY WEEK(Transactiondate) DESC LIMIT 4";
    connection.query(getInsightDetailsStatement,
        function(err, result) {
            if (err)
                console.log(err);
            next(result[1]);
        });
}

function updateUserDetails(req, res, next) {
    const updateUSerDetailsStatement = `USE dtc01; UPDATE user SET firstname = ${formatStringItem(req.body.firstName)}, lastname = ${formatStringItem(req.body.lastName)}, 
    password = ${formatStringItem(req.body.password)} WHERE username = ${formatStringItem(req.session.username)};`
    connection.query(updateUSerDetailsStatement,
        function(err, result) {
            if (err)
                console.log(err);
            next();
        })
}











module.exports = {
    createTables,
    insertUser,
    retrieveCardDetails,
    insertCompany,
    insertCsvItem,
    retrieveUserDetails,
    closeConnection,
    validateUser,
    retrievePurchaseDetails,
    updateUserDetails,
    retrieveInsightDetails
};