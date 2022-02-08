const  redis = require ('redis')
require("dotenv").config();


//connection to redis 
const redisClient = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);

redisClient.on('connect',function(){
    console.log(`Redis Client Connected at port ${process.env.REDIS_PORT}`)
})

module.exports = redisClient