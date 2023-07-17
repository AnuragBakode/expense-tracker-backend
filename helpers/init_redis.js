// const redis = require('redis')

// const client = redis.createClient({
//   port: 6379,
//   host: '127.0.0.1',
// })

// import { Redis } from "@upstash/redis"

// const { Redis } = require('@upstash/redis')

// const client = Redis.fromEnv()

// const redis = require('redis');

// const client = redis.createClient({
//   url: process.env.UPSTASH_REDIS_REST_URL,
// });

// client.on("error", function (err) {
//   throw err;
// });


// client.connect()
// client.set('foo', 'bar');


const { createClient } = require("redis")

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", function (err) {
  throw err;
});
client.on("connect", function () {
  console.log("connected")
})


// client.set("name", "bakode")



//client.on('connect', () => {
//   console.log('Client connected to redis...')
// })

// client.on('ready', () => {
//   console.log('Client connected to redis and ready to use...')
// })

// client.on('error', (err) => {
//   console.log(err.message)
// })

// client.on('end', () => {
//   console.log('Client disconnected from redis')
// })

// process.on('SIGINT', () => {
//   client.quit()
// })

module.exports = client
