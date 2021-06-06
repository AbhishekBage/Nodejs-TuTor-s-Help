const Register = require('../models/teacherRegisters');
const AssignQuestion = require('../AssignQuestion');

const Assign = async ()=>{
   
    Register.Question.findOne({assigned:false},(err,result)=>{
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
                    console.log('Still Searching');
                }
            })
          }
      }
    });

}

const Reassign = async () =>{
    const date = new Date();
    const presentTime = date.getTime();
    Register.Question.findOne({answer:false,expireTime:{ $lt:presentTime }},(err,result)=>{
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

module.exports = Assign;