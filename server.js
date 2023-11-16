
const {Pool} = require('pg');
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

app.use((express.static("public")))
app.use(express.json());
app.use(cors());




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
                query = `SELECT title, description, completed, created_at FROM ${endpoint}`;
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
                query = `SELECT users.id, users.username, tasks.title, tasks.description, tasks.completed, tasks.created_at
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
            case 'login':
                query=`SELECT id, username, password FROM users WHERE username = $1`;
                values=[username]
                break;
            default:
                res.status(404).send('NOT FOUND 🙃');
                return;
        }
        const result = await pool.query(query, values);

        if (endpoint === 'login') {
            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Could not find user' });
            }

            const user = result.rows[0];

            if (password === user.password) {
                return res.status(200).json({ message: 'Login successful', data: result.rows });
            } else {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
        }
        
        res.status(201).json(result.rows);
    } catch (err) {
        next(err)
    }
})


//Update route
app.put('/api/:endpoint/:id', async (req, res, next) => {
    try {
        const { id, endpoint } = req.params;
        const { username, password, email, title, description } = req.body;
        
        let query;
        let values;
        switch (endpoint) {
            case 'users':
                query=`UPDATE ${endpoint} SET username = $1 WHERE id = $2 RETURNING id, username`;
                values = [username, id];
                break;
            case 'tasks':
                query=`UPDATE ${endpoint} SET title = $1, description = $2 WHERE id = $3 RETURNING *`;
                values = [title, description, id];
                break;
            default:
                res.status(404).send('NOT FOUND 🙃');
                return;       
        }
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            errorMessage()
        }
        res.status(200).json(result.rows);
    } catch (err) {
        next(err)
    }
})

//delete route 
app.delete('/api/:endpoint/:id', async (req, res, next) => {
    try {
        const { id, endpoint } = req.params;

        let query;
        let successMessage;
        switch (endpoint) {
            case 'users':
                query=`DELETE from ${endpoint} WHERE id = $1 RETURNING id, username, email`;
                successMessage = `${endpoint} has been succesfully deleted.`
                break;
            case 'tasks':
                query=`DELETE from ${endpoint} WHERE id = $1 RETURNING *`;
                successMessage = `${endpoint} has been succesfully deleted.`
                break;
            default:
                res.status(404).send('NOT FOUND 🙃');
                return;
        }
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            errorMessage()
        }
        res.status(200).json({
            message: successMessage,
            data: result.rows
        });
    } catch(err) {
        next(err)
    }
})

app.use((req,res,next) => {
    const err = new Error('NOT FOUND ☹️');
    err.status = 404;
    next(err)
})

app.use((err, req, res, next) => {
    console.error(err.stack)

    const statusCode = err.status || 500;
    const errorMessage = statusCode === 500 ? 'Internal Server Error' : err.message;
    res.status(statusCode).json({error: errorMessage});
})

app.listen(PORT, (req, res) => {
    console.log(`Listening in on port: ${PORT}`)
})

function errorMessage() {
    const err = new Error('NOT FOUND 🙃');
    err.status = 404;
    throw err;
}