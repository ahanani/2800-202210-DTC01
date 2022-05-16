CREATE TABLE Company(
     Companyid int NOT NULL AUTO_INCREMENT,
     Companyname VARCHAR(30) NOT NULL,
     Companyindustry VARCHAR(30),
     Companydescription VARCHAR(50),
     PRIMARY KEY(Companyid, Companyname));