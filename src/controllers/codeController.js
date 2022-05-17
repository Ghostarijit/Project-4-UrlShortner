
const urlModel = require("../models/urlModel")


const urlCode = async (req, res) => { 
    try {
        // find a document match to the code in req.params.code
        Code = req.params.urlCode


        let url = await urlModel.findOne({ urlCode: Code })
        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.longUrl)
        } else {
            // else return a not found 404 status
            return res.status(404).json('No URL Found')
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
}


module.exports.urlCode = urlCode