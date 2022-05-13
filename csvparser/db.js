const mysql = require('mysql2'); 

var connection = mysql.createConnection({
  host: "localhost",
  user: "amin5",
  password: "MySql1000$",
  multipleStatements: true
});

function connect(){
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
}

function closeConnection(){
  connection.close();
}

function formatDate(unformattedDate){
  let date = new Date(unformattedDate);
  let formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
  return formattedDate;
}

function cleanString(str){
  let copy = str;
  for(let i = 0; i < copy.length; ++i){
    str = str.replace('"', " ");
    str = str.replace("'", ' ');
  }
  return str;
}


function insert(purchaseDetails){
  const queryStatement = `USE dtc01; INSERT INTO csvlog(Accounttype, Accountnumber, Transactiondate, Chequenumber, Description1, Description2, Cad, Usd)\
  VALUES('${purchaseDetails["Account Type"] == '' ? ' NULL ': purchaseDetails["Account Type"]}',
  ${purchaseDetails["Account Number"] == '' ? ' NULL ': purchaseDetails["Account Number"]},
  '${formatDate(purchaseDetails["Transaction Date"])}',
  ${purchaseDetails["Cheque Number"] == '' ? ' NULL ': purchaseDetails["Cheque Number"]},
   '${purchaseDetails["Description 1"] == '' ? ' NULL ': cleanString(purchaseDetails["Description 1"])}',
    ${purchaseDetails["Description 2"] == '' ? ' NULL ': cleanString(purchaseDetails["Description 2"])},
    ${purchaseDetails["CAD$"] == '' ? ' NULL ': parseFloat(purchaseDetails["CAD$"])}, 
    ${purchaseDetails["USD$"] == '' ? ' NULL ' : parseFloat(purchaseDetails["USD$"])});`
  connection.query(queryStatement, function (err, result) {
    if (err) console.log(err);;
    const output = JSON.stringify(result);
    console.log("Result: " + output);
  });
}


//&&&&CUSTOM FUNCTIONS&&&&  

function getExpensesWithin(startDateString, endDateString, next){
  //SELECT * FROM table WHERE date_column >= '2014-01-01' AND date_column <= '2015-01-01';
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  if(startDate == 'Invalid Date' || endDate == 'Invalid Date'){
    throw 'Invalid Date given';
  }

  const queryStatement = `USE dtc01; SELECT SUM(Cad) FROM csvlog WHERE 
  Transactiondate >= '${formatDate(startDateString)}' AND Transactiondate <= '${formatDate(endDateString)}';`

  connection.query(queryStatement, function (err, result) {
    if (err) console.log(err);
    next(Object.values(result[1][0])[0]);
  });
}


module.exports = {
  insert, connect, closeConnection, getExpensesWithin
}

// connection.query(`USE dtc01; CREATE TABLE Csvlog (
//   Purchaseid int NOT NULL AUTO_INCREMENT,
//   Accounttype VARCHAR(10),
//   Accountnumber VARCHAR(3),
//   Transactiondate DATE NOT NULL,
//   Chequenumber VARCHAR(20),
//   Description1 VARCHAR(50),
//   Description2 VARCHAR(50),
//   Cad int,
//   Usd int,
//   PRIMARY KEY(Purchaseid));`, function (err, result) {
//     if (err) throw err;
//     const output = JSON.stringify(result);
//     console.log("Result: " + output);
//   });


