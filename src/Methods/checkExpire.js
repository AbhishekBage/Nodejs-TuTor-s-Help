const Register = require('../models/teacherRegisters');

const date = new Date();
const presentTime = date.getTime();
const checkExpire = ()=>{
    Register.Question.findOne({expireTime:{ $lt:presentTime },answered:false},(err,result)=>{

        if(err)
        {
            console.log(err);
        }else
        {   if(result)
            {
                if(result.assigned){
                    Register.Teacher.findOneAndUpdate({_id:result.assignedTo},{available:true}).then((data)=>{
        
                      if(data){
                          console.log('Question:'+result._id+' has been Expired');
                      }
                  })
                  }
            }
            
        }
    })
}

module.exports = checkExpire;