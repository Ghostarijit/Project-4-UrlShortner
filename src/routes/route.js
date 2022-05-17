const express = require("express");
const router = express.Router();
//const internshipController = require("../controllers/internshipController");
//const collageController =require("../controllers/collageController")
//const getController = require("../controllers/getInternshipController")
const postUrl = require("../controllers/urlController")

const code = require("../controllers/codeController")




//const { validatecollage, validateInternship } = require('../middleware/valid');

//router.post("/functionup/colleges",validatecollage,collageController.createCollage);

router.post("/url/shorten",postUrl.urlCreate);

router.get("/:urlCode",code.urlCode)

module.exports = router; 