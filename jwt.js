const jwt = require('jsonwebtoken')
require('dotenv').config();


const jwtAuthmiddleware = (req , res , next) => {
    try {
        console.log("ente");
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decoded =  jwt.verify(token , process.env.SECRET_KEY);
        console.log(decoded)
        req.payload = decoded;
        next()
    } catch (error) {
        res.status(500).json({message: "intenal server error"})
    }
}
const genratetoken = (payload) =>{
    return jwt.sign(payload ,process.env.SECRET_KEY);
}

module.exports = {
    genratetoken,
    jwtAuthmiddleware
};