import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs"
import mongoose from "mongoose";
// import encrypt from "mongoose-encryption"
import md5 from 'md5';


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs')

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then((response)=>{
  console.log(`MONGO DB IS CONNECTED at HOST ${response.connection.host}`)
})

// **********************************************************
const userSchema = new mongoose.Schema( {
  email : {
    type : String,
    unique : true
  },
  password : String
}) ;
// userSchema.plugin(encrypt,{secret : process.env.SECRET, encryptedFields : ["password"] })
const User = new mongoose.model("User",userSchema)
// **********************************************************

//******************************************* Get
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});



//******************************************* Post

app.post("/register", (req, res) => {
  const newUser = new User({
    email : req.body.username,
    password : md5(req.body.password)
  })

  newUser.save().then(()=>{
    res.render("secrets")
    console.log("SuccessFully Created New User")

  }).catch((err)=>{
     console.log("Please Use the Other email Bcoz It's alread exist",err)
     res.redirect("/register")
  })
})


app.post("/login", (req, res) => {
  
  const username = req.body.username 
  const password = md5(req.body.password) ;

  User.findOne({email : username})
  .then((response)=>{
    console.log(response)
    if(response?.password == password)
    {
      res.render("secrets")
      console.log("SuccessFully Login")
    }
    else
    {
      res.redirect("/login")
    }
  })
});




// *********************************step-2*********************************

// app.get("/submit", (req, res) => {
//   res.render("submit.ejs");
// });

// app.get("/logout", (req, res) => {
//   res.render("home.ejs");
// });

// app.post("/submit", (req, res) => {
//     console.log(req.body);
//   });

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
