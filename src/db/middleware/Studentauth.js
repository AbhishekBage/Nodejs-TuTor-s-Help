const jwt = require('jsonwebtoken');
const Register = require('../../models/teacherRegisters');


const Studentauth = async (req,res,next) =>{
    
    try{
     
        const Reqcookie = req.cookies.jwt;
        const verifyUser = jwt.verify(Reqcookie,"agasaajhdaquq265qmsajs211212daa");
        console.log(verifyUser);

        const user = await Register.Student.findOne({_id:verifyUser._id});
        console.log(user);
        req.user = user;
        req.token = Reqcookie;
        next();
    } catch (error) {
        res.status(401).send(error);
    }

   
}

module.exports = Studentauth;