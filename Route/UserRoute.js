const express = require('express');
const router = express.Router();
const USER = require('./../Model/USER')
const {jwtAuthmiddleware , genratetoken} = require('./../jwt');
const candidate = require('../Model/CANDIDATE');

//signup
router.post('/signup' , async(req , res) =>{
    try {
        const data = req.body;
        const adminUser = await USER.findOne({role: "admin"})
        if(adminUser && data.role == "admin"){
           return res.status(403).json({message:"admin already exists"});
        }
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }
        const user = new USER(data);
        const alreadyexist = await USER.findOne({adharnumber:user.adharnumber});
        if(alreadyexist){
            return res.status(403).json({message:"user with adhar already exist"});
        }
        
        let response = await user.save();
        console.log("data saved")
        console.log(response.id)
        const payload ={
            id: response.id,
        }
        const token = await genratetoken(payload);
        res.status(200).json({user: response , token: token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
});

//login
router.post('/login/:adharnumber/:password', async(req , res) =>{
    try {
        const adharnumber = req.params.adharnumber;
        const password = req.params.password;
        const user = await USER.findOne({adharnumber: adharnumber});
        console.log(user)
        if(!user){
            return res.status(404).json({message: "incorrect id or password"});
        };
        
        let  isMatch = await user.Compare(password);
        console.log(isMatch);
        if( !isMatch){
            return res.status(404).json({message: "incorrect id or password"});
        };
        console.log(user.id)
        const payload = {
            id:user.id,
        }
        const token = await genratetoken(payload);
        console.log("login  succesfull");
        res.status(200).json({user: user , token: token})
       
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
} );

//vote
router.get('/vote/:candidateID' , jwtAuthmiddleware , async(req, res) =>{
    try {
        const CandidateID = req.params.candidateID;
        const Candidate = await candidate.findById(CandidateID);
        if(!candidate){
            return res.status(404).json({message : "wrong candidate id"})
        }
        const payload = req.payload;
        const user = await USER.findById(payload.id)
        if(!user){
            return res.json({message :"user not found"});
        }
        if(user.role =="admin"){
            return res.json({message : "admin cannot vote"})
        }
        console.log(user.isVoted)
        if(user.isVoted){
            return res.json({message :"you already voted "});
        }
        console.log(user.id)
        Candidate.votes.push({user: user.id});
        Candidate.votecount++;
        await Candidate.save();
        user.isVoted = true;
        await user.save()

        res.json({message :" voted successfully"})
      
    } catch (error) {
        console.log(error);
        res.json({message : error})
    }
   
} );






module.exports = router;

