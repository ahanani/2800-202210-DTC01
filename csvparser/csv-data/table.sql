CREATE TABLE Csvlog (
    Purchaseid int NOT NULL AUTO_INCREMENT,
    Accounttype VARCHAR(10),
    Accountnumber VARCHAR(3),
    Transactiondate DATE NOT NULL,
    Chequenumber VARCHAR(20),
    Description1 VARCHAR(50),
    Description2 VARCHAR(50),
    Cad int,
    Usd int,
    PRIMARY KEY(Purchaseid));