const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');

require("./db/conn");

const Register = require("./models/teacherRegisters");
const auth = require('./db/middleware/auth');
const Studentauth = require('./db/middleware/Studentauth');
const { json } = require("express");
const hbs = require("hbs");
const AssignQuestion = require('./AssignQuestion');
const Assign = require('../src/Methods/CheckQuestions');
const Reassign = require('../src/Methods/Reassign');

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../Template/views");
const images_path = path.join(__dirname, "./images")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.use(express.static(images_path));
app.set("view engine", "hbs");
app.set("views", template_path);

const port = process.env.PORT || 3000;




//
app.get("/login", (req, res) => {

    res.render("Login");
});

app.get("/profile", auth, (req, res) => {
    console.log(`${req.cookies.jwt} this is our cookie`);
    const user = req.user;
    res.render("Profile", { user });
});

app.get("/SignUp", (req, res) => {

    res.render("SignUp");
});

app.get("/studentlogin", (req, res) => {
    res.render("studentLogin");
});

app.get("/studentSignUp", (req, res) => {
    res.render("studentSignUp");
});

app.get("/studentHome", Studentauth, (req, res) => {
    console.log(`${req.cookies.jwt} this is our cookie`);
    const user = req.user;
    //console.log(user);
    res.render("studentHome");
});

app.get("/askQuestion", Studentauth, (req, res) => {
    console.log(`${req.cookies.jwt} this is our cookie`);
    const user = req.user;
    //console.log(user);
    res.render("AskQues");
});

app.get("/studentProfile", Studentauth, (req, res) => {
    console.log(`${req.cookies.jwt} this is our cookie`);
    const user = req.user;
    //console.log(user);
    res.render("studentProfile", { user });
});

app.get("/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");

        req.user.tokens = req.user.tokens.filter((currelem) => {
            return currelem.token !== req.token;
        });

        console.log("logout successfully");
        await req.user.save();
        res.render("Login");
    }
    catch (error) {
        res.status(500).send(error);
    }
});

app.get("/studentlogout", Studentauth, async (req, res) => {
    try {
        res.clearCookie("jwt");

        req.user.tokens = req.user.tokens.filter((currelem) => {
            return currelem.token !== req.token;
        });

        console.log("logout successfully");
        await req.user.save();
        res.render("studentLogin");
    }
    catch (error) {
        res.status(500).send(error);
    }
});

app.post("/register", async (req, res) => {

    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const teacherRegister = new Register.Teacher({
                name: req.body.name,
                subject: req.body.subject,
                education: req.body.education,
                email: req.body.email,
                age: req.body.age,
                phone: req.body.phone,
                city: req.body.city,
                password: req.body.password,
                cpassword: req.body.password
            });


            const token = await teacherRegister.generateAuthToken();
            console.log(token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 5000000),
                httpOnly: true
            });
            //Hash Password
            const registered = await teacherRegister.save();
            res.status(201).render("Login");
        }
        else {
            res.send("Password are not matching");
        }
    }
    catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

///student Registeration
app.post("/studentregister", async (req, res) => {

    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const StudentRegister = new Register.Student({
                name: req.body.name,
                education: req.body.education,
                school: req.body.school,
                class: req.body.class,
                email: req.body.email,
                age: req.body.age,
                phone: req.body.phone,
                city: req.body.city,
                password: req.body.password,
                cpassword: req.body.password
            });

            const token = await StudentRegister.generateAuthToken();
            console.log(token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 5000000),
                httpOnly: true
            });

            const Registered = await StudentRegister.save();
            res.status(201).render("studentLogin");
        }
        else {
            res.status(400).send("Password are Not Matching");
        }
    }
    catch (error) {
        console.log(error);
    }
})

app.post("/studentlogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const usermail = await Register.Student.findOne({ email: email });

        const isMatch = bcrypt.compare(password, usermail.password);

        const token = await usermail.generateAuthToken();
        console.log(token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000000),
            httpOnly: true
        });

        if (isMatch) {
            res.status(201).render("studentHome");
        }
        else {
            res.send("password are Not matching");
        }


    }
    catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})
//login check
app.post("/login", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const usermail = await Register.Teacher.findOne({ email: email });

        const isMatch = bcrypt.compare(password, usermail.password)


        const token = await usermail.generateAuthToken();
        console.log(token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true
        });

        if (isMatch) {
            res.status(201).render("index");
        }
        else {
            res.send("password are Not matching");
        }


    }
    catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});


//for Asking Question
app.post('/sendQuestion', Studentauth, async (req, res) => {

    try {
        const AskedQuestion = new Register.Question({
            question: req.body.question,
            subject: req.body.subject,
            askedBy: req.user._id,
        });
        const Asked = await AskedQuestion.save();
        AssignQuestion(Asked).then((result) => {

            if (result) {
                res.status(200).render('studentHome');
            } else {
                res.status(200).render('TeacherNotFound');
            }
        })
            .catch((err) => {
                console.log(err);
            })


    }
    catch (error) {
        res.status(400).send(error);
        console.log(error);
    }



})
app.get('/AskedQuesByYou', Studentauth, (req, res) => {

    const user = req.user;
    Register.Question.find({ askedBy: user._id }, (err, Questions) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(Questions);
            res.render('AskedQuesByYou', { Questions });
        }

    }
    );


});

app.get('/AskedQuestion', auth, (req, res) => {

    const user = req.user;
    Register.Question.findOne({ assignedTo: user._id }, (err, Question) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(Question);
            if (Question) {
                res.render('AskedQuestion', { Question });
            }
            else {
                console.log('else');
                res.render('AskedQuestion');

            }

        }

    }
    );

});
app.post('/sendAnswer', auth, (req, res) => {

    const user = req.user;
    Register.Question.findOneAndUpdate({ assignedTo: user._id, answered: false }, { answer: req.body.answer, answered: true }, (err, Question) => {
        if (err) {
            console.log(err);
        }
        else {
            Register.Teacher.findOneAndUpdate({_id:user._id},{available:true},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.render('AskedQuestion', { Question });
            }  
            });
            
        }
    })

});

app.get('/ViewQuestion', Studentauth, (req, res) => {

    res.render('ViewQuestion');

});

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});

setInterval(() => {
    Assign();
}, 3000);



setInterval(() => {
    Reassign();
}, 3000);

