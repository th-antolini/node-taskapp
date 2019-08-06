const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
    try {
        if(req.path != '/api/login') {
            if (req.path.includes('/api')) {
                const token = req.header('Authorization').replace('Bearer ', '')
                const decoded = jwt.verify(token, 'test')
                const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        
                if (!user) {
                    throw new Error()
                }

                req.token = token
                req.user = user
            }
        }
        next()
    } catch (e) {
        res.status(401).send({ error: 'Unauthorized' })
    }
}

module.exports = auth