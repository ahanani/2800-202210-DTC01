
function parseResultSet(resultset) {

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












//
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "amin5",
  password: "MySql1000$",
  multipleStatements: true
});

function connect() {
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
}

function closeConnection() {
  connection.close();
}

function insertUser(userData) {
  connect();


  connection.query(`USE dtc01; SELECT username FROM user;`, function (err, result) {
    if (err) console.log(err);
    let duplicate = duplicateUserName(userData.username, parseResultSet(result));
    if(duplicate){
      throw "Duplicate username";
    }});



  const queryStatement = `USE dtc01; INSERT INTO user VALUES("${userData.username}", 
    "${userData.firstname}", "${userData.lastname}", "${userData.password}");`;

  connection.query(queryStatement, function (err, result) {
    if (err) console.log(err);
    console.log(result);
  
    closeConnection();
  });
}

insertUser({username:'sam@hotmail.com', firstname:"Sam", lastname:"Fun", password:"123"});



module.exports = {
  connect, closeConnection, insertUser
}


