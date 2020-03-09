const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgress Client Setup
const { Pool } = require('pg');

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient.query('CREATE TABLE IF NOT EXISTS values(number INT)')
    .catch(ex => console.log(ex));

// Redis Client Setup
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000  // if we ever lose connection, try it every 1s
});

redisClient.on("error", function (error) {
    console.error('Error occured', error);
});

const redisPublisher = redisClient.duplicate(); // sub means subscription

// Express Route handlers
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    console.log('Entered');
    try {
        redisClient.hgetall('values', (err, values) => {
            console.log('In get all callback');
            res.send(values);
        });
    } catch (ex) {
        console.log('Exception', ex);
    }
});

app.post('/values', async (req, res) => {
    const { index } = req.body;

    if (index > 40) {
        res.status(422).send('Index to high!');
    }

    redisClient.hmset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, err => {
    console.log('Listening');
})
