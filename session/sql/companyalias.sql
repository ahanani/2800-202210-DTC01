CREATE TABLE Companyalias(
       Companyid int NOT NULL,
     Companyname VARCHAR(30) NOT NULL,
     alias VARCHAR(60) NOT NULL,
     PRIMARY KEY(Companyid, Companyname, alias),
     FOREIGN KEY (Companyid, Companyname) REFERENCES Company(Companyid, Companyname));