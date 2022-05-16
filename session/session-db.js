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

function closeConnection() {
    connection.close();
}

function insertUser(userData) {
    connect();


    connection.query(`USE dtc01; SELECT username FROM user;`, function(err, result) {
        if (err) console.log(err);
        let duplicate = duplicateUserName(userData.username, parseResultSet(result));
        if (duplicate) {
            throw "Duplicate username";
        }
    });

    const queryStatement = `USE dtc01; INSERT INTO user VALUES("${userData.username}", 
    "${userData.firstname}", "${userData.lastname}", "${userData.password}");`;

    connection.query(queryStatement, function(err, result) {
        if (err) console.log(err);
        console.log(result);

        //closeConnection();
    });
}

function validateUser(userCredentials, next) {
    connect();

    connection.query(`USE dtc01; SELECT * FROM user WHERE username = 
    "${userCredentials.username}" AND password =  "${userCredentials.password}";`, function(err, result) {
        if (err) console.log(err);

        //closeConnection();
        next(result[1].length);
    });
}

function insertCsvItem(username, csvItem) {
    connect();
    const queryStatement = `USE dtc01; INSERT INTO csvlog(Username, Accounttype, Accountnumber, 
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

function insertCompany(companyName, companyDetails) {
    connect();

    connection.query(`USE dtc01; SELECT Companyname FROM company;`, function(err, result) {
        if (err) console.log(err);
        let duplicate = duplicateCompany(companyName, parseResultSet(result));
        if (duplicate) {
            throw "Duplicate comapny name";
        }
    });

    const queryStatement = `USE dtc01; INSERT INTO Company(Companyname, Companyindustry, Companydescription) VALUES(${formatStringItem(companyName)}, 
        ${formatStringItem(companyDetails.companyindustry)}, 
        ${formatStringItem(companyDetails.companydescription)});`;

    connection.query(queryStatement, function(err, result) {
        if (err) console.log(err);
        console.log(result);

        //closeConnection();
    });
}

insertCompany("burger king", { companyindustry: "fast food", companydescription: "junk fast food company" });


module.exports = {
    insertUser,
    validateUser,
    insertCsvItem,
    insertCompany

}