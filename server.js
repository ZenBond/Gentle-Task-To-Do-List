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


app.get('/api/:endpoint', async (req, res, next) => {
    try {
        const {endpoint} = req.params;
        console.log(endpoint)

        let query;
        switch (endpoint) {
            case 'users':
                query = `Select username FROM ${endpoint}`;
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