

const jwt = require('jsonwebtoken')

// loading model
const User = require('../models/user.js')



const auth = async (req, res, next) => {
    try{
        // token info from header
        const token = req.header('Authorization').replace('Bearer ', '');
        // validates header
        // const decoded = jwt.verify(token, 'generatingToken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find that user
        const user = await User.findOne({ 
            _id : decoded._id,
            'tokens.token' : token,
        })

        if(!user)
            throw new Error();
        
        req.token = token;
        // 
        req.user = user;
        // console.log(user);
        next();
    }
    catch(e){
        res.status(401).send({error : 'Please authenticate'})
    }
}

module.exports = auth;