// starting point of application

const express = require('express')

require('./db/mongoose.js')

const UserRouter = require('./routers/user.js')
const TaskRouter = require('./routers/task.js')

const app = express();

const port = process.env.PORT;

// defining middleware between request and route handler
// next is specifically to register middleware
// app.use((req, res, next) => {
//     // console.log(req.method, req.path);

//     if(req.method === "GET"){
//         res.send('GET req are disabled')
//     }
//     else{
//         next();
//     }
//     // always call it and at last in function
//     // signifies that function's work is done and route handler should be called
//     // next();
// })

// middleware when site is in maintainence mode
// app.use((req, res, next) => {
//     res.status(503).send('Under Maintainance!, Please try again after some time')
// })


// will automatically parse json to object
app.use(express.json())

// //////////////////////////////////////////////
// ROUTING

// const router = new express.Router();

// router.get('/test', (req, res) => {
//     res.send('From another router')
// })

app.use(UserRouter);
app.use(TaskRouter);


// ////////////////////////////////////////////////////////

// file upload
const multer = require('multer')

const upload = multer({
    dest : 'images',
    limits : {
        fileSize : 1000000,
    },
    fileFilter(req, file, callback){
        // when file is not pdf
        // if(!file.originalname.endsWith('.pdf')){
        //     return callback(new Error('Please upload a pdf'))
        // }
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return callback(new Error('Please upload a word document'))
        }
        callback(undefined, true)

        // to send an error back
        // callback(new Error('File must be a pdf'))
        // // to accept file upload
        // callback(undefined, true);
        // // will reject upload without throwing error
        // callback(undefined, false);
    }
})

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// })

// handling error thrown from multer
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     res.status(400).send({
//         error : error.message,
//     });
// })

// ////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log('server is up and running on port', port);
})

// ////////////////////////////////////////////////////////

// async function my(){
//     const password = 'Red12345!'
//     const hashedPass = await bcrypt.hash(password, 8);

//     console.log(password, hashedPass)

//     const isMatch = await bcrypt.compare('Red12345!', hashedPass)
//     console.log(isMatch)
// }

// const jwt = require('jsonwebtoken');
// async function my(){
//     const token = jwt.sign({id : '123456red'}, 'mytoken')
//     // console.log(token)
//     const check = jwt.verify(token, 'mytoken')
//     console.log(check)
// }

// my();


// toJSON we can modify the object like methods we want it to have 

// const pet = {
//     name : 'hal',
// }
// pet.toJSON = function(){
//     // console.log(this);
//     // return this
//     return {}
// }
// console.log(JSON.stringify(pet))


// const Task = require('./models/task.js');
// const User = require('./models/user.js');

// const main = async() => {
//     const task = await Task.findById('60b67e740a12f835f23a0e37')
//     await task.populate('owner').execPopulate();
//     console.log(task.owner)
// }
// const main = async() => {
//     const user = await User.findById('60b67da16d34a132fee2a0c8')
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks)
// }
// main();
