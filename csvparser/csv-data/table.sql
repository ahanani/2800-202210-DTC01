CREATE TABLE Csvlog (
    Purchaseid int NOT NULL AUTO_INCREMENT,
    Accounttype VARCHAR(10),
    Accountnumber VARCHAR(3),
    Transactiondate DATE NOT NULL,
    Chequenumber VARCHAR(20),
    Description1 VARCHAR(100),
    Description2 VARCHAR(100),
    Cad DECIMAL(6,2),
    Usd DECIMAL(6,2),
    PRIMARY KEY(Purchaseid));