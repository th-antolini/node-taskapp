const User = require('../models/User')
const Task = require('../models/Task')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')

const UserController = {
    async list(req, res) {
        try {
            const users = await User.find({})
            
            if (users.length == 0) {
                return res.status(404).send('No users found')
            }
    
            return res.send(users)
        } catch (e) {
            return res.status(500).send(e)
        }
    },
    async show(req, res) {
        try {
            if (!req.query.id) {
                return res.status(400).send('User id not provided')
            }
    
            const user = await User.findById(req.query.id)
    
            if (!user) {
                return res.status(404).send('User not found')
            }
    
            await user.populate('tasks').execPopulate()
    
            return res.send(user)
        } catch (e) {
            return res.status(500).send(e)
        }
    },
    async save(req, res) {
        try {
            if (!req.body._id) {
                req.body._id = new ObjectId()
            }
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 8)
            }
            var user = await User.findByIdAndUpdate(req.body._id, req.body, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true
            })
        
            if (!user) {
                return res.status(404).send('User not found')
            }
    
            return res.send(user)
        } catch (e) {
            return res.status(500).send(e)
        }
    },
    async delete(req, res) {
        try {
            if (!req.query.id) {
                return res.status(400).send('User id not provided')
            }
    
            const user = await User.findByIdAndDelete(req.query.id)
    
            await Task.deleteMany({ user: user.id })
    
            if (!user) {
                return res.status(404).send('User not found')
            }
    
            return res.send('User deleted')
        } catch (e) {
            return res.status(500).send(e)
        }
    }
}

module.exports = UserController