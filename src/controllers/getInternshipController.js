const mongoose = require('mongoose');

const collegeModel = require("../models/collageModel")
const internModel = require("../models/InternshipModel")



const getColleges = async function(req, res) {
    try {
        let data1 = req.query

        const name = data1.name

        if (Object.keys(data1).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter Data" })

        }
        if (name == undefined) {
            return res.status(400).send({ status: false, msg: "Please Enter CollegeName and you Must Write Key Value is # name # " })

        }
        if (!name) {
            return res.status(400).send({ status: false, msg: "Please Provide Some Value of Name" })
        }
        if (!/^[a-zA-z , ;]{2,30}$/.test(name)) {
            return res.status(400).send({ status: false, msg: "Please Enter Valied Format CollegeName" })
        }
        let check = await collegeModel.findOne({ name:name.toLowerCase()})
        if (!check) {
            return res.status(400).send({ status: false, msg: "Thise College Doesn't Exist" })
        }
        let id = check._id

        let findintern = await internModel.find({ collegeId: id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })

        if (!findintern.length) {
            return res.status(400).send({ status: false, msg: "there is No intern In the College" })
        }

        let Doc = {
            name: name.toLowerCase(),
            fullName: check.fullName,
            logoLink: check.logoLink,
            interests: findintern
        }
        return res.status(200).send({ status: true, data: Doc })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}




module.exports.getColleges = getColleges
