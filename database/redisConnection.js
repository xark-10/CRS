const  redis = require ('redis')
require("dotenv").config();


//connection to redis 
const redisClient = redis.createClient({host: process.env.REDIS_HOST,port: process.env.REDIS_PORT});

redisClient.on('connect',function(){
    console.log(`Redis Client Connected at port ${process.env.REDIS_PORT}`)
})

module.exports = redisClient