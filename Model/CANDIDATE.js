const mongoose = require('mongoose');
const CandidateSchema = mongoose.Schema(
 {
    name:{
        required: true,
        type:String
    },
    age:{
        required:true,
        type:String
    },
    partyname:{
        unique:true,
        required:true,
        type:String,
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            votedAt:{
                type:Date,
                default:Date.now(),
            }
        }
    ],
  votecount:{
    type:Number,
    default:0
  }


 }
)


 
const candidate = mongoose.model('candidate' ,CandidateSchema );
module.exports = candidate;