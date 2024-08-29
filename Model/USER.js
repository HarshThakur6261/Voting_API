const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema(
 {
    name:{
        required: true,
        type:String
    },
    age:{
        required:true,
        type:String
    },
    adharnumber:{
        unique:true,
        required:true,
        type:Number,
    },
    password:{
         required:true,
         type:String,
    },
    role:{
       type:String,
       enum:['voter' , 'admin'],
       default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false,
    }
 }
)
UserSchema.pre('save' ,async function (next) {
    const user = this;
   try {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(user.password , salt);
      user.password = hashedpassword;
      next();
   } catch (error) {
       console.log(error);
   }
})

UserSchema.methods.Compare = async function(password){
    console.log("enter")
   return bcrypt.compare(password , this.password);
}
 



const user = mongoose.model('user' ,UserSchema );
module.exports = user;