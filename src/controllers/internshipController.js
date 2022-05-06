const InternshipModel = require('../models/InternshipModel');
const collegeModel = require("../models/collageModel");

const createInternship = async function(req, res) {
    try {
        let data = req.body;

        let CollgeFullName = data.collegeName.trim()

        let checkCollege = await collegeModel.findOne({ name: CollgeFullName, isDeleted: false }) /*Check College Full Name From DB*/

        if (!checkCollege) return res.status(400).send({ status: false, message: `${CollgeFullName} : No such college Name Not Found!` });

        let college_Id = checkCollege._id /*Get College Id from CheckCollege*/

        data.collegeId = college_Id /*Insert CollegeId in Data Object*/

        const saveInterData = await InternshipModel.create(data); /*Create Intern here*/

        return res.status(201).send({ status: true, message: `Successfully applied for internship at ${CollgeFullName}.`, data: saveInterData })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};

module.exports.createInternship = createInternship