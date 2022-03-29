const  redis = require ('redis')
require("dotenv").config();


//connection to redis 
const redisClient = redis.createClient("crs.tr6gd5.0001.use1.cache.amazonaws.com:6379");

redisClient.on('connect',function(){
    console.log(`Redis Client Connected at port ${process.env.REDIS_PORT}`)
})

module.exports = redisClient