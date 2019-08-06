const Task = require('../models/Task')

const TaskController = {
    async list(req, res) {
        try {        
            const tasks = await Task.find({ user: req.user._id })
    
            if (tasks.length == 0) {
                return res.status(404).send('No tasks found')
            }
    
            return res.send(tasks)
        } catch (e) {
            return res.status(500).send(e)
        }
    },
    async show(req, res) {
        try {
            if (!req.query.id) {
                return res.status(400).send('Task id not provided')
            }
    
            const task = await Task.findById(req.query.id)
    
            if (!task) {
                return res.status(404).send('Task not found')
            }
    
            await task.populate('user').execPopulate()
    
            return res.send(task)
        } catch (e) {
            return res.status(500).send(e)
        }
    },
    async save(req, res) {
        try {
            if (req.body._id) {
                var task = await Task.findById(req.body._id)
            } else {
                var task = new Task(req.body)
            }
    
            if (!task) {
                return res.status(404).send('Task not found')
            }
    
            Object.keys(req.body).forEach((key) => task[key] = req.body[key])
    
            task.user = req.user._id
    
            await task.save()
    
            return res.send(task)
        } catch (e) {
            return res.status(500).send(e)
        }
    },
    async delete(req, res) {
        try {
            if (!req.query.id) {
                return res.status(400).send('Task id not provided')
            }
    
            const task = await Task.findByIdAndDelete(req.query.id)
    
            if (!task) {
                return res.status(404).send('Task not found')
            }
    
            return res.send(task)
        } catch (e) {
            return res.status(500).send(e)
        }
    }
}

module.exports = TaskController