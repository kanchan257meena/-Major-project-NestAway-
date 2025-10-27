const express=require("express");
const app = express();
const session = require('express-session');
const flash =require("connect-flash");
const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.listen(8080, () => {
  console.log("server start");
});


const sessoinOptions={
  secret: 'mySecretKey',    
  resave: false,                
  saveUninitialized: true,      
//   cookie: { maxAge: 60000 }     
};

app.use(session(sessoinOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let{name="null"}=req.query;
    // console.log(req.session);
    req.session.name=name;
    // res.send(name);
    req.flash("success","user registered");
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    // locals
    res.locals.msg=req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})

