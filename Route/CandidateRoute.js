const express = require('express');
const router = express.Router();
const Candidate = require('./../Model/CANDIDATE')
const jet = require("../jwt")
const USER = require('./../Model/USER');
const {jwtAuthmiddleware , genratetoken} = require('./../jwt')

const checkadmin = async(userid) =>{
    try {
        const user = await USER.findById(userid);
        if(user.role == "admin"){
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

//get candidate list
router.get("/" , async(req , res) =>{
    try {
        const data = await Candidate.find();
        console.log("data fetched successfull");
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
});

//vote count 
router.get('/votecount' , async(req , res) =>{
    try {
        const candidates = await Candidate.find().sort({votecount : 'desc'});
        const votecount = candidates.map((val) =>{
            return {
                party: val.name,
                Votecount: val.votecount
            }
        })
        res.json(votecount);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
} )

//add a candidate
router.post("/" ,jwtAuthmiddleware ,async(req, res) =>{
   try {
     if(!(await checkadmin(req.payload.id))){
        return res.status(403).json({message: 'user does not have admin role'});

     }
    const data = req.body;
    const candidate = new Candidate(data);
    let response = await candidate.save();
    res.status(200).json({message :"candidate added successfully" , response:response})

   } catch (error) {
    console.log(error)
    res.status(500).json({message: "internal server error"})
   }
});
// delete 
router.delete('/:CandidateID' , jwtAuthmiddleware,async(req , res) =>{
    try {
        const user = await USER.findById(req.payload.id);
        if(user.role != "admin"){
            return res.json({message : "you are not admin"});
        }
        const candidateID = req.params.CandidateID;
        const candidate = await Candidate.findByIdAndDelete(candidateID);
        res.json({message : "candidate deleted successfully"});

    } catch (error) {
        console.log(error)
    res.status(500).json({message: "internal server error"})
    }
});
//update existing candidate
router.put('/:candidateID' ,jwtAuthmiddleware , async(req , res) =>{
    try {
        
        if(!(await checkadmin(req.payload.id))){
    
            return res.json({message : "you are not admin"})
        }
        const candidateID = req.params.candidateID;
        const updatedata = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID , updatedata ,{
            new: true,
            runValidatores: true,
        });
        if(!response){
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json({response : response , message : "updated successfully"});
     


    } catch (error) {
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
})

module.exports = router;