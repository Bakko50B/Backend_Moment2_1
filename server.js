/**
 * Skal till ett REST-API med Nodejs och Express
 * Av Mattias Dahlgren, mattias.dahlgren@miun.se
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();         //ENV
const mysql = require("mysql");     //Databasanslutning

const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.json());            // Använd JSON-data i anropen
app.use(cors());                    // Aktivera CORS middleware för alla rutter

/** ------ Rutter (Routes) ------ */
// GET /api
app.get('/api', (req, res) => {
        //Get cv
    connection.query('SELECT * FROM workexp', (error, results) => {
        if (error) {
            res.status(500).json({ ERROR: "Something went wrong: " + error });
            return;
        }
        else {
            if (results.length === 0) {
                res.status(404).json({ message: "No workexperience found!" });
            }
            else {
                res.json(results);
            }
        }
    });
});

// GET /api/users
app.get('/api/users', (req, res) => {
    res.json({ message: 'GET request to api/users' });
});

// POST /api/users
app.post('/api', (req, res) => {
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate || "";
    let description = req.body.description || "";

    let errors = {
        message: "",
        detail: "",
        http_response: {

        }
    };

    if (!companyname || !jobtitle || !location || !startdate) {
        errors.message = "All mandatory fields must be filled in!"
        errors.detail = "Companyname, jobtitle, location and startdate need to be filled out before insertion into database!"

        errors.http_response.message = "Bad request!";
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return
    }

    //Add workexperience to database
    connection.query(`INSERT INTO workexp (companyname, jobtitle, location, startdate, enddate, description) VALUES (?, ?, ?, ?, ?, ?);`,
        [companyname, jobtitle, location, startdate, enddate, description], (error, results) => {
            if (error) {
                res.status(500).json({ ERROR: "Something went wrong: " + error });
                return;
            }
            else {
                console.log("Query executed: " + JSON.stringify(results));
        
                let workexperience = {
                    companyname: companyname,
                    jobtitle: jobtitle,
                    location: location,
                    startdate: startdate,
                    enddate: enddate,
                    description: description
                };
        
                res.json({ message: "New workexperience added", data: workexperience });
            }
        });
    

    // res.json({ message: 'POST request to api/users' });
});


// POST /api/users
app.post('/api/users', (req, res) => {
    res.json({ message: 'POST request to api/users' });
});

// PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
    res.json({ message: 'PUT request to /users - with id: ' + req.params.id });
});


// DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
    res.json({ message: 'DELETE request to /users - with id: ' + req.params.id });
});

// Om ingen av ovanstående rutter fångar upp anropet
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Starta servern
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});