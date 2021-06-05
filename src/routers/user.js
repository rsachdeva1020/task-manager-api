const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user.js')

// importing middleware
const auth = require('../middleware/auth.js')

// importing email function
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account.js')

const router = express.Router();

// router.get('/test', (req, res) => {
//     res.send('from new file')
// })


// app.post('/users', (req, res) => {
//     const user = new User( req.body );

//     user.save().then((success) => {
//         res.send(user)
//     }).catch((err) => {
//         res.status(400).send(err);
//         // res.send(err);
//     })
//     // console.log(req.body)
//     // res.send('testing');
// })
router.post('/users', async(req, res) => {
    const user = new User( req.body );

    try{
        await user.save()

        sendWelcomeEmail(user.email, user.name);

        const token = await user.generateAuthToken();

        res.status(201).send({
            user,
            token,
        })
    }
    catch(e){
        res.status(400).send(e);
    }
})

// login with existing account
// function will found account email and password
router.post('/users/login', async (req, res) => {
    try{
        // findByCredentials -> our own method, created in user model
        // console.log(req.body.email)
        const user = await User.findByCredentials(req.body.email, req.body.password);

        // our own method to generate tokens
        const token = await user.generateAuthToken();

        res.send({
            user,
            token,
        })
    }
    catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res,) => {
    try{
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token)
        await req.user.save();

        res.send();
    } 
    catch (e) {
        res.status(500).send();
    }
})

// logging out all sessions
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// getting all users 
// router.get('/users', (req,res) => {
//     User.find({}).then((success) => {
//         res.send(success);
//     }).catch((err) => {
//         res.status(500).send();
//     })
// })
// router.get('/users', auth ,async(req, res) => {
//     try{
//         const data = await User.find({});
//         res.send(data)
//     }
//     catch(e){
//         res.status(500).send();
//     }
// })
router.get('/users/me', auth ,async(req, res) => {
    res.send(req.user)
})

// getting user by an id
// req.params has all parameters passed in url after /:
// router.get('/users/:id', (req,res) => {
//     const _id = req.params.id;
//     // console.log(req.params)
//     User.findById(_id).then((success) => {
//         if(!success)
//             return res.status(404).send();
            
//         res.send(success);
//     }).catch((err) => {
//         res.status(500).send();
//     })
// })
// router.get('/users/:id', async(req,res) => {
//     try{
//         const _id = req.params.id;
//         const data = await User.findById(_id);
//         res.send(data);
//     }
//     catch(err){
//         res.status(500).send();
//     }
// })

// to update
// router.patch('/users/:id', async(req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedToUpdate = ['name', 'email', 'age', 'password'];
//     const isValidOperation = updates.every(item => allowedToUpdate.includes(item) )

//     if(!isValidOperation){
//         return res.status(400).send({
//             error : 'Invalid Updates',
//         })
//     }
//     const _id = req.params.id;
//     try{
//         // findByIdAndUpdate bypasses Middleware so we cannot use it

//         // const user = await User.findByIdAndUpdate(_id, req.body, {
//         //     new : true,     //will return info after updating
//         //     runValidators : true,
//         // })

//         const user = await User.findById(_id);
//         updates.forEach(item => user[item] = req.body[item])
//         await user.save();        

//         if(!user)
//             return res.status(404).send();
//         res.send(user);
//     }
//     catch(e){
//         res.status(400).send(e);
//     }
// })
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedToUpdate = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every(item => allowedToUpdate.includes(item) )

    if(!isValidOperation){
        return res.status(400).send({
            error : 'Invalid Updates',
        })
    }

    try{
        updates.forEach(item => req.user[item] = req.body[item])
        await req.user.save();        

        res.send(req.user);
    }
    catch(e){
        res.status(400).send(e);
    }
})

// to delete
// router.delete('/users/:id', auth, async(req, res) => {
//     const _id = req.params.id;

//     try{
//         const user = await User.findByIdAndDelete(_id);
//         if(!user)
//             return res.status(404).send()
//         res.send(user);
//     }
//     catch(e){
//         res.status(500).send(e);
//     }
// })
router.delete('/users/me', auth, async(req, res) => {
    try{
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    }
    catch(e){
        res.status(500).send(e);
    }
})

const upload = multer({
    limits : {
        fileSize : 1000000,
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload only image'))
        }
        callback(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width : 250,
        height : 250,
    }).png().toBuffer();
    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        error : error.message,
    })
})

router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error();
        }

        // setting header (key, value)
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch(error){
        res.status(404).send();
    }
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})


module.exports = router;