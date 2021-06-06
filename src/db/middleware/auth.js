const jwt = require('jsonwebtoken');


const Register = require('../../models/teacherRegisters');


const auth = async (req,res,next) =>{
    
    try{
     
        const Reqcookie = req.cookies.jwt;
        const verifyUser = jwt.verify(Reqcookie,"agasaajhdaquq265qmsajs211212daa");
        console.log(verifyUser);

        const user = await Register.Teacher.findOne({_id:verifyUser._id});
        console.log(user);
        req.user = user;
        req.token = Reqcookie;
        next();
    } catch (error) {
        res.status(401).send(error);
    }

   
}


module.exports = auth;