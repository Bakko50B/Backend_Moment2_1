const mysql = require("mysql");
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.error("Connection failed " + error);
        return;
    } else {
        console.log("Connected to mysql");
    }
});

//skapa databas
connection.query("CREATE DATABASE IF NOT EXISTS cv", (error, results) => {
    if (error) {
        throw error;
    }
    else {
        console.log("Database created" + results);
    }
});

// connection.query("CREATE TABLE IF NOT EXISTS `cv`.`workexp` (`id` INT NOT NULL AUTO_INCREMENT , `companyname` INT(64) NOT NULL , `jobtitle` INT(64) NOT NULL , `location` INT(64) NOT NULL , `startdate` INT NOT NULL , `enddate` INT NULL , `description` INT NULL , `postcreated` INT NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;;", 
//     (error, result) => {
//         if (error) {
//             throw error;
//         }
//         else {
//             console.log("Database table created");
//         }
//     }
// );

connection.query(`
    CREATE TABLE IF NOT EXISTS cv.workexp (
        id INT NOT NULL AUTO_INCREMENT,
        companyname VARCHAR(64) NOT NULL,
        jobtitle VARCHAR(64) NOT NULL,
        location VARCHAR(64) NOT NULL,
        startdate DATE NOT NULL,
        enddate DATE NULL,
        description TEXT NULL,
        postcreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_swedish_ci;
`, 
(error, result) => {
    if (error) {
        throw error;
    } else {
        console.log('Database table created');
    }
});

// Kör INSERTS till tabellen
connection.query(
    "INSERT INTO workexp (companyname, jobtitle, location, startdate, enddate, description) VALUES (?, ?, ?, ?, ?, ?)",
    ['Tidningstjänst', 'Tidningsutdelare', 'Sandviken', '1980-06-15', '1980-07-05', 'Utdelning av morgontidningar i distrikt Klangberget, Sandviken'],
    (error, result) => {
        if (error) {
            throw error;
        } else {
            console.log('Row inserted into workexp table');
        }
    }
);

connection.query(
    "INSERT INTO workexp (companyname, jobtitle, location, startdate, enddate, description) VALUES (?, ?, ?, ?, ?, ?)",
    ['Tidningstjänst', 'Tidningsutdelare', 'Sandviken', '1981-06-13', '1981-07-15', 'Utdelning av morgontidningar i distrikt Klangberget, Sandviken'],
    (error, result) => {
        if (error) {
            throw error;
        } else {
            console.log('Row inserted into workexp table');
        }
    }
);
