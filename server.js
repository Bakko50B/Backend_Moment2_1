/**
 * Skal till ett REST-API med Nodejs och Express
 * Av Mattias Dahlgren, mattias.dahlgren@miun.se
 * 
 * Reviderat och uppdaterat 
 * Av Torbjörn Lundberg, tolu2403@student.miun.se
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();         //ENV
const mysql = require("mysql");     //Databasanslutning

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());            // Använd JSON-data i anropen
app.use(cors());                    // Aktivera CORS middleware för alla rutter

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



/** ------ Rutter (Routes) ------ */
// Rutter för allmän hälsning
// GET /api/
app.get('/api/', (req, res) => {
    res.json({ message: 'Detta är ett API producerat för kursen Backendutveckling på mittuniversitet<br>Av Torbjörn Lundberg' });
});

// Rutt för att hämta arbetserfarenhet
// GET /api/workexp
app.get('/api/workexp', (req, res) => {
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

// Rutt för att införa ny arbetserfarenhet
// POST /api/workexp
app.post('/api/workexp', (req, res) => {
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
});


// Rutt för att uppdatera arbetserfarenhet
// PUT  
app.put('/api/workexp/:id', (req, res) => {
    const workExpId = req.params.id;
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate || "";
    let description = req.body.description || "";

    let errors = {
        message: "",
        detail: "",
        http_response: {}
    };

    // Kontrollera att alla obligatoriska fält är ifyllda
    if (!companyname || !jobtitle || !location || !startdate) {
        errors.message = "All mandatory fields must be filled in!";
        errors.detail = "Companyname, jobtitle, location, and startdate need to be filled out before updating the database!";
        errors.http_response.message = "Bad request!";
        errors.http_response.code = 400;

        res.status(400).json(errors);
        return;
    }
    // Delar upp frågan denna gång
    const query = `
        UPDATE workexp
        SET companyname = ?, jobtitle = ?, location = ?, startdate = ?, enddate = ?, description = ?
        WHERE id = ?;
    `;
    const values = [companyname, jobtitle, location, startdate, enddate || "", description || "", workExpId];

    // Utför SQL-frågan
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error("Something went wrong::", error);
            res.status(500).json({ ERROR: "Something went wrong: " + error });
            return;
        } else {
            if (results.affectedRows > 0) {
                res.json({
                    message: `Post with id ${workExpId} has been updated.`,
                    data: {
                        companyname: companyname,
                        jobtitle: jobtitle,
                        location: location,
                        startdate: startdate,
                        enddate: enddate,
                        description: description
                    }
                });
            } else {
                res.status(404).json({ message: `No post with ${workExpId} found.` });
            }
        }
    });
});

// Rutt för att ta bort en enskild post ur databasen
// DELETE /api/workexp/:id
app.delete('/api/workexp/:id', (req, res) => {
    const workExpId = req.params.id;
    const query = 'DELETE FROM workexp WHERE id = ?';

    connection.query(query, [workExpId], (err, results) => {
        if (err) {
            console.error('An error occurred during DELETE:', err);
            res.status(500).json({ message: 'An error occurred during delete.' });
        } else {
            if (results.affectedRows > 0) {
                res.json({ message: `Post with id ${workExpId} has been deleted.` });
            } else {
                res.status(404).json({ message: `No post with ${workExpId} found.` });
            }
        }
    });
});

// Om ingen av ovanstående rutter fångar upp anropet
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Starta servern
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});