const db = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new db.Schema({
    username: {
        type: String,
        default: null,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        default: null,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        default: null,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can\'t contain the word \'password\'')
            }
        }
    },
    age: {
        type: Number,
        default: null,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()

    delete user.password
    delete user.tokens

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'test')

    this.tokens = this.tokens.concat({ token })

    await this.save()
    
    return token
}

userSchema.statics.findByCredentials = async (credentials) => {
    const user = await User.findOne({
        $or: [
            { email: credentials.email },
            { username: credentials.username }
        ]
    })

    if (!user) {
        throw new Error('Unable to login')
    }

    if (!await bcrypt.compare(credentials.password, user.password)) {
        throw new Error('Unable to login')
    }

    return user
}

const User = db.model('User', userSchema)

module.exports = User