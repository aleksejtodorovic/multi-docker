const keys = require('./keys.js');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHosts,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate(); // sub means subscription

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
    redisClient.hmset('values', message, fib(parseInt(message, 10))); // insert in hash called values
});
sub.subscribe('insert');