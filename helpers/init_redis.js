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

module.exports = client
