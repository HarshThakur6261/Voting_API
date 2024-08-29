const express = require('express');
const app = express();
const db = require('./db');

const UserRouter = require('./Route/UserRoute');
const candidateRouter = require('./Route/CandidateRoute')
app.use(express.json());
app.use('/user' , UserRouter);
app.use('/candidate' , candidateRouter);








app.listen('3000' , () =>{
    console.log("sever hosted on localhost:3000")
})