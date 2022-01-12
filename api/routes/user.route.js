const express = require("express");
const router = express.Router();

const userController=require('../controllers/user.controller');
const auth=require('../middleware/auth');

//routes for user
router.post('/signUp',userController.signUp);
router.post("/login", userController.login);
router.put('/updateProfile',auth,userController.updateProfile);
router.put("/updatePassword", auth, userController.changePassowrd);

//routes for articles
router.post("/createTask", auth, userController.createTask);
router.get('/viewTask/:taskID',auth,userController.viewTask);
router.put('/updateTask/:taskID',auth,userController.updateTask);
router.delete("/deleteTask/:taskID", auth, userController.deleteTask);
router.get("/allTasks", auth, userController.getAllTasks);
module.exports = router;