const  mongoose  = require("mongoose");
//const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongoose.Schema({

    name :{
        type:String,
        required:true
    },
    subject: {
        type:String,
        enum: ['English','Maths','Hindi','Physics','Chemistry','Biology','History','Economics','Civics'],
        required:true
    },
    education: {
        type:String,
        enum: ['Intermediate', 'Graduated', 'Post Graduate', 'PHD'],
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    age: {
        type:Number,
        required:true
    },
    phone: {
        type:Number,
        required:true,
        unique:true

    },
    city: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    cpassword: {
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
   }],
   Role:{
       type:String,
       default:'Teacher'
   },
   available:{
    type:Boolean,
    default:true
   }
    
    
});



teacherSchema.methods.generateAuthToken = async function(){
    try{
       const token = jwt.sign({_id:this._id},"agasaajhdaquq265qmsajs211212daa");
       this.tokens = this.tokens.concat({token:token})
       await this.save();
       return token;
    }
    catch(error){
        
        console.log(error);
    }
}

teacherSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword= await bcrypt.hash(this.cpassword, 10);
    }
  

  next()
})


//For Students
const studentSchema = new mongoose.Schema({

    name :{
        type:String,
        required:true
    },
   
    education: {
        type:String,
        enum: ['Intermediate', 'Graduated', 'Post Graduated', 'PHD'],
        required:true
    },
    school: {
        type:String,
        required:true
    },
    class: {
        type: String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    age: {
        type:Number,
        required:true
    },
    phone: {
        type:Number,
        required:true,
        unique:true

    },
    city: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    cpassword: {
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    Role:{
        type:String,
        default:'Student'
    }
    
});


studentSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword = await bcrypt.hash(this.cpassword, 10);
    }

    next()
});

//student Authentication
studentSchema.methods.generateAuthToken = async function(){
    try{
       const token = jwt.sign({_id:this._id},"agasaajhdaquq265qmsajs211212daa");
       this.tokens = this.tokens.concat({token:token})
       await this.save();
       return token;
    }
    catch(error){
        
        console.log(error);
    }
}

const QuestionSchema = new mongoose.Schema({

    question:{
        type:String,
        minLength:2,
        maxLength:1000,
    },
    answer:{
        type:String,
        minLength:1,
        maxLength:5000,
    },
    askedBy:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        enum: ['English','Maths','Hindi','Physics','Chemistry','Biology','History','Economics','Civics'],
        required:true
    },
    answered:{
        type:Boolean,
        default:false
    },
    assigned:{
        type:Boolean,
        default:false
    },
    assignedTo:{
        type:String,
    },
    createdTime:{
      type:Date,
     
    },
    reAssignTime:{
        type:Date,
       
    },
    expireTime:{
        type:Date,
       
    }
})

 QuestionSchema.pre('save',async function(next){
  
    
      const date = new Date();
      this.createdTime = date.getTime();
      this.expireTime = date.getTime() + 300000;
     
     next();
 });
//collection
const Question = new mongoose.model("Question",QuestionSchema);
const Teacher = new mongoose.model("Teacher",teacherSchema);
const Student = new mongoose.model("Student",studentSchema);

module.exports = {Teacher,
                 Student,
                 Question}