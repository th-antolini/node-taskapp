const express = require('express')
const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')
const TaskController = require('./controllers/TaskController')

const router = new express.Router()

router.post('/login', AuthController.login)

router.post('/logout', AuthController.logout)

router.post('/logoutAll', AuthController.logoutAll)

router.get('/users', UserController.list)

router.get('/user', UserController.show)

router.post('/user', UserController.save)

router.delete('/user', UserController.delete)

router.get('/tasks', TaskController.list)

router.get('/task', TaskController.show)

router.post('/task', TaskController.save)

router.delete('/task', TaskController.delete)

module.exports = router