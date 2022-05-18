
const urlModel = require("../models/urlModel")

//const authorModel = require("../models/authorModel");
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


const urlCode = async (req, res) => {
    try {
        // find a document match to the code in req.params.code


      //  if (req.params.urlCode == undefined)
      //  return res.status(400).send({ status: false, message: "bookId is required." });
      //  Code = req.params.urlCode

       

        //let url = await urlModel.findOne({ urlCode: Code })
        //if (url) {
            // when valid we perform a redirect
           // return res.redirect(url.longUrl)
       // } else {
            // else return a not found 404 status
           // return res.status(404).json('No URL Found')
       // }
       
       // let cahcedCodeData = await GET_ASYNC(`${req.params.urlCode}`)
       // if(cahcedCodeData) {
       //   res.send(cahcedCodeData)
      //  } else {
         // let url = await urlModel.findOne(req.params.urlCode);
        //  await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(url))
        //  res.send({ data: url.longUrl });
       // }
        let Code=req.params.urlCode
        let cahcedUrlCode = await GET_ASYNC(`${Code}`)   
        if(cahcedUrlCode) {
            let parsedUrlCode=JSON.parse(cahcedUrlCode)
            res.redirect(302, parsedUrlCode.longUrl)
        } else {
            let urlData = await urlModel.findOne({urlCode : Code}).select({longUrl:1,shortUrl:1,urlCode:1,_id:0});
            if(!urlData) return res.status(400).send({status: true, message: "Invalid Urlcode."})
            await SET_ASYNC(`${Code}`, JSON.stringify(urlData), "EX", 30)
            return res.redirect(302, urlData.longUrl)
        }
    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
}


module.exports.urlCode = urlCode