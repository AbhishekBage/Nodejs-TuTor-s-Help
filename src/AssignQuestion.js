const  mongoose  = require("mongoose");
const Register = require('./models/teacherRegisters');


const change = async (Question,teacher)=>{
  try{
      const Ques = await Register.Question.findOneAndUpdate({_id:Question._id},{assignedTo:teacher._id,assigned:true});
    }
    catch(err){
        console.log(err);
    }
  }

const AssignQuestion = async (Question) => {

    try{
        
          const teacher = await  Register.Teacher.findOneAndUpdate({available:true,subject:Question.subject},{available:false}); 
          console.log(teacher);
          //console.log(Question);
    
          if(teacher)
          {
            change(Question,teacher);
            return true; 
            
          }else{
            return false;
          }
          
         
        }
    catch(err){
         console.log(err);
    }
    

}

module.exports = AssignQuestion;