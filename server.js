/**
 * Skal till ett REST-API med Nodejs och Express
 * Av Mattias Dahlgren, mattias.dahlgren@miun.se
 */
const express = require('express');
const cors = require('cors');
//ENV
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3500;


//Databasanslutning
const mysql = require("mysql");

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

// Använd JSON-data i anropen
app.use(express.json());

// Aktivera CORS middleware för alla rutter
app.use(cors());

/** ------ Rutter (Routes) ------ */

// GET /api
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to my copied REST API' });
});

// GET /api/users
app.get('/api/users', (req, res) => {
    res.json({ message: 'GET request to api/users' });
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