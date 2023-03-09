const express = require('express');
const user = require('../models/UserDetails');
const app = express();
app.use(express.json());
var router = express.Router();
const path = require('path');
const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        console.log(file,'FILE');
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename : function(req,file,cb){
        let ext = path.extname(file.originalname);
        console.log('ext', ext);
        cb(null,Date.now() + ext)
    }
})


const upload = multer({ storage : storage ,
    fileFilter : function(req,file,callback){
        if(
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg'
        ){
            callback(null,true)
        }else{
            console.log('only jpg and png are supported')
            callback(null,false)
        }
    }
});

// route for : check if user is already registered or not
router.post('/checkuser', async (req,res)=>{
    try{
        const {email} = req.body;
        const User = await user.findOne({email: email});
        if(User)
        {
            return res.send({status:true,message:'successfull response from backend'});
        }
        else
        {
            return res.send({status:false})
        }
    }catch(err){
        return res.status(500).send(err);
    }
    })



// Route for: send user data to backend
router.post('/userdetails',async (req,res) =>{
    const body = req.body;
    let User;
    let newUserDetails = {
        id: body.id,
        name : body.name,
        firstName:body.given_name,
        lastName:body.family_name,
        Mobile:body.mobile,
        Gender:body.gender,
        DateofBirth:moment(body.dob).format('YYYY-MM-DD'),
        image:body.picture,
        aboutme : body.aboutme,
        loginTime:body.loginTime,
        lastlogin : body.lastlogin,
        email:body.email
    }
    try{
        // Check whether user with same email  already exists
      User = await user.findOne({email: body.email});
      if(User)
      {
        return res.status(400).json({success,error:'User with this email already exists'});
      }

    User = new user(newUserDetails);
    await User.save();
    }
catch(error){
    res.status(500).send(error);
    }
}
)

// Route for: update data in database
router.patch('/updatedata', upload.single('image'),async (req,res)=>{
    try{
        const body = req.body;
        let User;
        let updatedUserDetails = {
        id: body.id,
        name : body.name,
        firstName:body.firstName,
        lastName:body.lastName,
        Mobile:body.Mobile,
        Gender:body.Gender,
        DateofBirth:moment(body.DateofBirth).format('YYYY-MM-DD'),
        aboutme : body.aboutme,
        lastlogin : body.lastlogin
    }
    if(req.file){
        updatedUserDetails.image = req.file.filename;
    }
    User = await user.findOne({email: body.email});
    if(User)
    {
        if(User.email !== body.email) return res.status(401).send('Not allowed');
        User = await user.findOneAndUpdate({email: body.email},{$set : updatedUserDetails});
        await User.save();
        return res.status(200).send('successfull response');
    }
    else{
        console.log('User not found');
        return res.status(404);
    }
}catch(error){
    res.status(500).send(error);
}
})




// // Route for : update login time in database
router.patch('/updatelogintime',async (req,res)=>{
    try{
        const body = req.body;
        let User;
        let updatedUserDetails = {
            lastlogin : body.lastlogin
        }
        User = await user.findOne({email: body.email});
        if(User)
        {
            User = await user.findOneAndUpdate({email: body.email},{$set : updatedUserDetails});
            await User.save();
            return res.status(200).send('successfull response');
        }
        else{
            return res.status(404);
        }
    } catch(error){
        res.status(500).send(error);
    }
    })

    // Route for: Get users data
    router.get('/fetchdata', async (req,res)=>{
    try{
        const totalResults = await user.countDocuments();
        
        const User = await user.find().sort('firstName');
        res.json({User,totalResults});
    } catch(error){
        res.status(500).send(error);
    }
    })

    // Route for: Get users data according to search criteria
    router.get('/fetchsearchdata/:key', async (req,res)=>{
        try{
            const key = req.params.key;
        const regexKey = new RegExp(key, 'i');
        const searchCriteria = 
         {
            '$or': [
            {'firstName': {$regex: regexKey}},
            {'lastName': {$regex: regexKey}},
            {'email': {$regex: regexKey}},
            {'Mobile': {$regex: regexKey}}
            ]
        }
            const User = await user.find(searchCriteria).sort('firstName');
            const totalResults = User.length;
            res.json({User,totalResults});
        }catch(error){
            res.status(500).send(error);
        }
    })

    // route for ; get particular user data
    router.get('/fetchdata/:email', async (req,res)=>{
        try{
            const User = await user.findOne({email : req.params.email});
            res.json(User);
        }catch(error){
            res.status(500).send(error);
        }
    })


module.exports = router;