
const urlModel = require("../models/urlModel")
const shortId = require('shortid')
const validUrl = require('valid-url')
const baseUrl = 'http://localhost:3000'





const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    14628,
  "redis-14628.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("tLbVn8IGvdFUd8sis3Jkfnl0LkhWk39D", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

redisClient.on("ready", async function () {
    console.log("Connected to Redis and ready");
  });



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
const urlCreate = async function (req, res) {
    const { longUrl } = req.body // destructure the longUrl from req.body.longUrl   

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortId.generate()

    // check long url if valid using the validUrl.isUri method
    if (validUrl.isUri(longUrl)) {
        try {
          //Fetch the data in redis-------------

        let checkUrl = await GET_ASYNC(`${longUrl}`)

        if (checkUrl) {
            return res.status(200).send({ status: true, "data": JSON.parse(checkUrl) })
        }

            let url = await urlModel.findOne({ longUrl })

            // url exist and return the respose
            
                if(url) {
                 
                    return res.status(200).send({status: true, data: url})
                }  else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                // invoking the Url model and saving to the DB
                let url = {
                    longUrl,
                    shortUrl,
                    urlCode,
                }
                const code = await urlModel.create(url)

                //SET GENERATE DATA IN CACHE-------------------------------
              await SET_ASYNC(`${longUrl}`, JSON.stringify(code), "EX", 50)

                res.status(201).send({ status: true, message: "You already created Short Url for this Long Url", data: code });

            }

            
        }
        // exception handler
        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json('Invalid longUrl')
    }
}

module.exports.urlCreate = urlCreate;