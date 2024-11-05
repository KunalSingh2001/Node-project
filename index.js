const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'testdb'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// Create a new user
app.post('/users', (req, res) => {
    const user = { name: req.body.name, email: req.body.email };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, (err, result) => {
        if (err) throw err;
        res.send({ id: result.insertId, ...user });
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.put('/users/:id', (req, res) => {
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [req.body.name, req.body.email, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ id: req.params.id, name: req.body.name, email: req.body.email });
    });
});

app.delete('/users/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ message: 'User deleted' });
    });
});