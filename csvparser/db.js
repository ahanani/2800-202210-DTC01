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



function insert(purchaseDetails){
  const queryStatement = `USE dtc01; INSERT INTO csvlog(Accounttype, Accountnumber, Transactiondate, Chequenumber, Description1, Description2, Cad, Usd)\
  VALUES('${purchaseDetails["Account Type"] == '' ? ' NULL ': purchaseDetails["Account Type"]}',
  ${purchaseDetails["Account Number"] == '' ? ' NULL ': purchaseDetails["Account Number"]},
  '${purchaseDetails["Transaction Date"] == '' ? ' NULL ': purchaseDetails["Transaction Date"]}',
  ${purchaseDetails["Cheque Number"] == '' ? ' NULL ': purchaseDetails["Cheque Number"]},
   '${purchaseDetails["Description 1"] == '' ? ' NULL ': purchaseDetails["Description 1"]}',
    ${purchaseDetails["Description 2"] == '' ? ' NULL ': purchaseDetails["Description 2"]},
    ${parseFloat(purchaseDetails["CAD$"]) == NaN ? ' NULL ': parseFloat(purchaseDetails["CAD$"])}, 
    ${' NULL '});`//parseFloat(purchaseDetails["USD$"]) == NaN ? ' NULL ' : parseFloat(purchaseDetails["USD$"])
  connection.query(queryStatement, function (err, result) {
    if (err) throw err;
    const output = JSON.stringify(result);
    console.log("Result: " + output);
  });
}


module.exports = {
  insert, connect
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


