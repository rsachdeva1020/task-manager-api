// to generate Task model


const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema(
    {
        description : {
            type : String,
            required : true,
            trim : true,
        },
        completed : {
            type : Boolean,
            default : false,
    
        },
        owner : {
            // storing is of user who created it
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            // reference from this field to another model
            ref : 'User',
        }
    },
    {
        timestamps : true,
    }
)


const Task = mongoose.model(
    'Task',
    taskSchema
)


module.exports = Task;