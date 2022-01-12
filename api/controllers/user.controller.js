const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const User=require('../models/user.model');
const Article=require('../models/article.model');

const userValidator=require('../validators/user.validator');
const taskValidator=require('../validators/task.validator');

exports.signUp=async(req,res)=>{
    const {name,userName,email,password,address,phoneNumber}=req.body;
    try{
        const validator=userValidator.userSchema;
        const value=await validator.validateAsync({
            name,userName,email,phoneNumber,password,address
        })
        const checkEmail=await User.find({email:email});
        const checkUsername = await User.find({ userName: userName });
        if(checkEmail.length>0){
            res.status(409).json({'msg':'Email already exist'})
        }
        else if (checkUsername.length>0) {
            res.status(409).json({ msg: "userName already exist" });
        }
        else{
            let encryptedPassword = await Bcrypt.hash(value.password, 10);
            const newUser = await new User({
              name: value.name,
              userName: value.userName,
              email: value.email,
              phoneNumber: value.phoneNumber,
              password: encryptedPassword,
              address:value.address
            }).save();

            res.status(200).json({'msg':'User Registered'})
        }
    }
    catch(err){
        if(err.details){
            res.status(400).json({ msg: err.details[0].message });
        }
        else{
          console.log(err)
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Check we have an email
  if (!email) {
    return res.status(422).send({
      msg: "Missing email.",
    });
  }
  try {
    // Step 1 - Verify a user with the email exists
    const user = await User.findOne({ email });
    var passwordCheck ;

    //checking user exists or not
    if (!user) {
      return res.status(404).send({
        msg: "User does not exists",
      });
    } else {
      passwordCheck = await Bcrypt.compare(password, user.password);
      //checking password is correct or not
      if (!passwordCheck) {
        return res.status(401).send({
          msg: "wrong Password",
        });
      }
    }

    if (email && passwordCheck ) {
      let payload = { ID: user._id };
      let accessToken = jwt.sign(payload, process.env.SecretToken, {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      });
      res.status(200).send({
        user: user,
        token: accessToken,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("interal server error");
  }
};


exports.updateProfile=async(req,res)=>{
  const {name,userName,phoneNumber,address}=req.body;
  try{
    const validator = userValidator.userSchema;
    const value = await validator.validateAsync({
      name,
      userName,
      email:req.USER.email,
      phoneNumber,
      password:req.USER.password,
      address,
    });
    const updateProfile=await User.updateOne(
      {_id:req.USER._id},
      value
    );
    res.status(200).json({'msg':'Profile Updated'})
  }
  catch(err){
    if (err.details) {
      res.status(400).json({ msg: err.details[0].message });
    } else {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
}

exports.changePassowrd=async(req,res)=>{
  const {oldPassword,newPassword}=req.body;
  if(oldPassword && newPassword){
    let passwordCheck = await Bcrypt.compare(oldPassword, req.USER.password);
    if(oldPassword==newPassword){
      res.status(403).json({'msg':'new password must be different'})
    }
    else if(passwordCheck==false){
      res.status(403).json({ msg: "old password is wrong" });
    }
    else{
      try{
        let encryptedPassword = await Bcrypt.hash(newPassword, 10);
        const updatePassword=await User.updateOne(
          {_id:req.USER._id},
          {
            $set:{
              password:encryptedPassword
            }
          }
        );
        res.status(200).json({'msg':'Password updated'})
      }
      catch(err){
        res.status(500).json({'msg':'internal server error'})
      }
    }
  }
  else{
    res.status(400).json({'msg':'Fill all fields'});
  }
}

exports.createTask=async(req,res)=>{
  const {articleName,description,articleBody}=req.body;
  try{
        const validator = taskValidator.taskSchema;
        const value = await validator.validateAsync({
          articleName,description,articleBody
        });
        const newArticle =await new Article({
          articleName: value.articleName,
          description: value.description,
          articleBody: value.articleBody,
          authorID: req.USER._id,
        }).save();

        res.status(200).json({'msg':'Article Posted','resposne':newArticle})

  }
  catch(err){
        if (err.details) {
          res.status(400).json({ msg: err.details[0].message });
        } else {
          res.status(500).json({ msg: "Internal Server Error" });
        }
  }
}

exports.viewTask=async(req,res)=>{
  const taskID  = req.params.taskID;
  try{
    // console.log(taskID)
    const getData=await Article.findById(taskID).populate('authorID','userName email');
    res.status(200).json(getData);
  }
  catch(err){
    res.status(500).json({'msg':'Internal Server Error'});
  }
}

exports.updateTask = async (req, res) => {
  const { articleName, description, articleBody } = req.body;
  const taskID=req.params.taskID;
  try {
    const validator = taskValidator.taskSchema;
    const value = await validator.validateAsync({
      articleName,
      description,
      articleBody,
    });
    const updateArticle=await Article.updateOne(
      {_id:taskID},value
    )

    res.status(200).json({ msg: "Article Updated"});
  } catch (err) {
    if (err.details) {
      res.status(400).json({ msg: err.details[0].message });
    } else {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};

exports.deleteTask = async (req, res) => {
  const taskID = req.params.taskID;
  try {
    const deleteArticle = await Article.deleteOne({ _id: taskID });

    res.status(200).json({ msg: "Article Deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getAllTasks=async(req,res)=>{
  if(req.query.search){
    const search = new RegExp(escapeRegex(req.query.search), "gi");
    try {
      const getData = await Article.find({ authorID: req.USER._id,articleName:search });
      res.status(200).json(getData);
    } catch (err) {
      res.status(500).json({ msg: "internal server error" });
    }
  }
  else{
    try{
      const getData = await Article.find({ authorID: req.USER._id });
      res.status(200).json(getData);
    }
    catch(err){
      res.status(500).json({'msg':'internal server error'})
    }
  }
}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};