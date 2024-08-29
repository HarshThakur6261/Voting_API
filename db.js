require('dotenv').config()
const mongoose = require('mongoose');
const URL = process.env.URL ||'mongodb+srv://thakurharsh345:9630@schoolmanagement.gub2yvn.mongodb.net/Voting'

  mongoose.connect(URL, {})
   

let db = mongoose.connection;
db.on('connected' , () =>{
    console.log("database connected")
})
module.exports = db;