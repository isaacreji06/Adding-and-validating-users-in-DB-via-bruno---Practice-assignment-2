const express = require('express');
const { resolve } = require('path');
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const app = express();
const port = 3010;
const UserModel=require("./schema.js")
app.use(express.static('static'));
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
require("dotenv").config()
const mongoUrl=process.env.mongoDBUrl
mongoose.connect(mongoUrl)
.then(()=>{
  console.log("connected to the database")
})
.catch((er)=>{
  console.log("error connecting to the database",er)
})

app.post('/login',async(req,res)=>{
  const {email,password}=req.body
  try{
    const checkIfUserExists=await UserModel.findOne({email})
    if (!checkIfUserExists){
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }
    const passwordMatch=await bcrypt.compare(password,checkIfUserExists.password)
    if (passwordMatch){
      res.status(200).json({message:"successfully logged in",success:true})
    }
    else{
      res.status(401).json({message:"invalid credentials",success:false})
    }
  }
  catch(er){
    res.status(500).json({message:"internal server error",error:er.message,success:false})
  }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
