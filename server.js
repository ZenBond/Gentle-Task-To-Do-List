const bcrypt = require('bcrypt');
const {Pool} = require('pg');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

app.use((express.static("public")))
app.use(express.json());

//hash password middleware
app.use(async (req, res, next) => {
    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
    }
    next();
})

//get all route
app.get('/api/:endpoint', async (req, res, next) => {
    try {
        const {endpoint} = req.params;
        console.log(endpoint)

        let query;
        switch (endpoint) {
            case 'users':
                query = `Select id, username FROM ${endpoint}`;
                break;
            case 'tasks':
                query = `SELECT * FROM ${endpoint}`;
                break;
            default:
                res.status(404).send('NOT FOUND 🙃');
                return;
        }
        const result = await pool.query(query);
        res.status(200).send(result.rows);
    } catch (err) {
        next (err)
    }
})

//get 1
app.get('/api/:endpoint/:id', async (req, res, next) =>{
    try {
        const {id, endpoint} = req.params;
        if (isNaN(id)) {
            errorMessage()
        }
        let query;
        let values;
        switch (endpoint) {
            case 'users':
                query = `SELECT users.id, users.username, tasks.*
                FROM users
                LEFT JOIN tasks ON users.id = tasks.user_id
                WHERE users.id = $1`;
                values = [id]
                break;
            case 'tasks':
                query = `SELECT tasks.*, users.id as user_id, users.username
                FROM tasks
                LEFT JOIN users ON tasks.user_id = users.id
                WHERE tasks.id = $1`;
                values = [id]
                break;
            default:
                res.status(404).send('NOT FOUND 🙃');
                return;
        }
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            errorMessage()
        }
        res.status(200).send(result.rows);
    } catch(err) {
        next(err)
    }
})

//post route 
app.post('/api/:endpoint', async (req, res, next) => {
    try {
        const { endpoint } = req.params;
        const { username, password, email, title, description, user_id } = req.body;

        let query;
        let values;
        switch(endpoint) {
            case 'users':
                query=`INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING id, username`;
                values=[username, email, password]
                break;
            case 'tasks':
                query=`INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *`;
                values=[title, description, user_id]
                break;
            default:
                res.status(404).send('NOT FOUND 🙃');
                return;
        }
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err)
    }
})



app.use((req,res,next) => {
    const err = new Error('NOT FOUND ☹️');
    err.status = 404;
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status).json({error: err.message});
})

app.listen(PORT, (req, res) => {
    console.log(`Listening in on port: ${PORT}`)
})

function errorMessage() {
    const err = new Error('NOT FOUND 🙃');
    err.status = 404;
    throw err;
}