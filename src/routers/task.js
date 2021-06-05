
const express = require('express');

const Task = require('../models/task.js')

const auth = require('../middleware/auth.js')

const router = new express.Router();


// router.post('/tasks', (req, res) => {
//     const task = new Task( req.body );
//     task.save().then((success) => {
//         res.status(201).send(task)
//     }).catch((err) => {
//         res.status(400).send(err);
//     })
// })
router.post('/tasks', auth, async(req, res) => {
    // const task = new Task( req.body );
    const task = new Task({
        ...req.body,
        owner : req.user._id,
    })
    try{
        await task.save();
        res.status(201).send(task);
    }
    catch(e){
        res.status(400).send(e);
    }
})

// router.get('/tasks', (req, res) => {
//     Task.find({}).then((success) => {
//         res.send(success)
//     }).catch((err) => {
//         res.status(500).send(err);
//     })
// })
// router.get('/tasks', async(req, res) => {
//     try{
//         const data = await Task.find({});
//         res.send(data)
//     }
//     catch(e){
//         res.status(500).send();
//     }
// })
// router.get('/tasks', auth, async(req, res) => {
//     try{
//         await req.user.populate('tasks').execPopulate();
//         // const tasks = await Task.find({
//             // owner : req.user._id
//         // });
//         res.send(req.user.tasks)
//     }
//     catch(e){
//         res.status(500).send();
//     }
// })
// GET/tasks?sortBy=createdAt_desc
// GET/tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async(req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true' ? true : false;
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try{
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),      // will fetch only 2 tasks in one go
                skip : parseInt(req.query.skip),        // will skip first gin results
                sort, //: {
                    //createdAt : -1,              // asc -> 1 ||||| desc -> -1
                    // completed : 1,
                // }
            }
        }).execPopulate();
        // const tasks = await Task.find({
            // owner : req.user._id
        // });
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send();
    }
})


// router.get('/tasks/:id', (req, res) => {
//     const _id = req.params.id;

//     Task.findById(_id).then((success) => {
//         if(!success)
//             return res.status(404).send();
//         res.send(success)
//     }).catch((err) => {
//         res.status(500).send(err);
//     })
// })
// router.get('/tasks/:id', async(req, res) => {
//     const _id = req.params.id;
//     try{
//         const data = await Task.findById(_id);
//         // if(!data)
//         //     return res.status(404).send()
//         res.send(data)
//     }
//     catch(e){
//         res.status(500).send(e);
//     }
// })
router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;
    try{
        const task = await Task.findOne({
            _id,
            owner : req.user._id,
        })
        if(!task)
            return res.status(404).send();
        res.send(task)
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;

    const allowedToUpdate = ['description', 'completed'];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every(item => allowedToUpdate.includes(item))

    if(!isValidOperation)
        return res.status(400).send({ error : 'Invalid Updates'})

    try{
        // const task = await Task.findByIdAndUpdate(_id, req.body, {
        //     new : true,
        //     runValidators : true,
        // })
        // const task = await Task.findById(_id);
        const task = await Task.findOne({
            _id : req.params.id,
            owner : req.user._id,
        });

        if(!task)
            return res.status(404).send();
            

        updates.forEach(item => task[item] = req.body[item])

        await task.save();

        res.send(task)
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try{
        // const task = await Task.findByIdAndDelete(_id);
        const task = await Task.findByIdAndDelete({
            owner : req.user._id,
            _id : req.params.id,
        });
        
        if(!task)
            return res.status(404).send();
        res.send(task);
    }
    catch(e){
        res.status(500).send();
    }
})


module.exports = router;