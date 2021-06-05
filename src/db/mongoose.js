// to connect mongoose to database(mongodb)


const mongoose = require('mongoose');

// connecting to db
mongoose.connect(
    // 'mongodb://127.0.0.1:27017/task-manager-api',
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true, 
        // useUnifiedTopology: true,
        useCreateIndex : true,
        useFindAndModify : false,
    }
)












// creating model

// const User = mongoose.model(
//     'User',
//     {
//         name : {
//             type : String,
//             required : true,
//             trim : true,
//         },
//         email : {
//             type : String,
//             required : true,
//             trim : true,
//             lowercase : true,
//             validate(value){
//                 // now using validate library to check email
//                 if(!validator.isEmail(value)){
//                     throw new Error('Invalid Email')
//                 }
//             }
//         },
//         password : {
//             type : String,
//             required : true,
//             trim : true,
//             minLength : 7,
//             validate(value){
//                 // if(value.length<7){
//                 //     throw new Error("Password's length should be greater than 6")
//                 // }
//                 if(value.tolowerCase().includes('password')){
//                     throw new Error('Password should be stronger')
//                 }
//             }
//         },
//         age : {
//             type : Number,
//             default : 1,
//             validate(value){
//                 if(value < 1)
//                     throw new Error('Age must be greater than zero')
//             }
//         },
//     }
// )

// creating instance of model
// const me = new User(
//     {
//         name : ' Shubham',
//         email : 'rohan@g.COM    ',
//         password : 'asdasda',
//         // age : 20,
//     }
// )

// saving that instance to db
// me.save().then(
//     (success) => {
//         console.log(success);
//     }
// ).catch(
//     (error) => {
//         console.log('Errror!! ', error)
//     }
// )

// ////////////////////////////////////////////////////

const Task = mongoose.model('tasks', {
    description : {
        type : String,
        required : true,
        trim : true, 

    },
    completed : {
        type : Boolean,
        default : false,
    }
})

// const instance = new Task({
//     description : '   study again   ',
//     // completed : false,
// })

// instance.save().then((s) => {
//     console.log(s)
// }).catch((e) => {
//     console.log(e)
// })