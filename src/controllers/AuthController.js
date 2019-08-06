const User = require('../models/Task')

const AuthController = {
    async login(req, res) {
        try {
            const user = await User.findByCredentials(req.body)
            const token = await user.generateAuthToken()
            return res.send({ user, token })
        } catch (e) {
            return res.status(500).send()
        }
    },
    async logout(req, res) {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token
            })
    
            await req.user.save()
    
            return res.send('Logged out successfully')
        } catch (e) {
            return res.status(500).send()
        }
    },
    async logoutAll(req, res) {
        try {
            req.user.tokens = []
    
            await req.user.save()
    
            return res.send('Logged out successfully')
        } catch (e) {
            return res.status(500).send()
        }
    }
}

module.exports = AuthController