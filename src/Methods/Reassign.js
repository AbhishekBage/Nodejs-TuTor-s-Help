
const Register = require('../models/teacherRegisters');
const AssignQuestion = require('../AssignQuestion');
const Reassign = async () =>{
    const date = new Date();
    const presentTime = date.getTime();
    Register.Question.findOne({answered:false,expireTime:{ $lt:presentTime }},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result)
            {
              AssignQuestion(result).then((data)=>{
  
                  if(data){
                      console.log('Question:'+result._id+' has been assigned');
                  }else
                  {
                      console.log('Notifiy User Question Cant be Reassign');
                  }
              })
            }
        }
    })
}

module.exports = Reassign;