const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Gender = require('../constants/Gender')
const GenderPreference = require('../constants/GenderPreference')

const interestSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  }
}, {
  _id: false
})

const photoSchema = new mongoose.Schema({
  cloudinaryPublicId: String,
  order: Number
}, {
  _id: false
})

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  gender: {
    type: String,
    enum: Object.values(Gender)
  },
  password: String,
  passwordResetToken: String,
  biography: String,
  lastSeen: {
    type: Date,
    default: Date.now
  },
  loc: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  interests: [interestSchema],
  photos: [photoSchema],
  fameRating: {
    type: Number,
    default: 0
  },
  minDistance: {
    type: Number,
    default: 0
  },
  maxDistance: {
    type: Number,
    default: 50
  },
  minAge: {
    type: Number,
    default: 18
  },
  maxAge: {
    type: Number,
    default: 99
  },
  minFameRating: {
    type: Number,
    default: 0
  },
  maxFameRating: {
    type: Number,
    default: 200
  },
  minTags: {
    type: Number,
    default: 0
  },
  maxTags: {
    type: Number,
    default: 10
  },
  genderPreference: {
    type: String,
    enum: Object.values(GenderPreference),
    default: GenderPreference.BISEXUAL
  },
  emailNotifications: {
    connect: {
      type: Boolean,
      default: true
    },
    disconnect: {
      type: Boolean,
      default: true
    },
    match: {
      type: Boolean,
      default: true
    },
    unmatch: {
      type: Boolean,
      default: true
    },
    block: {
      type: Boolean,
      default: true
    },
    unblock: {
      type: Boolean,
      default: true
    },
    profileView: {
      type: Boolean,
      default: true
    },
    report: {
      type: Boolean,
      default: true
    }
  },
  amountReports: {
    type: Number,
    default: 0
  }
})

userSchema.index({ loc: '2dsphere' })

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  next()
})

userSchema.statics.getAuthenticatedUser = async function (email, password) {
  const user = await this.findOne({
    email
  })

  if (!user || !user.password) {
    const error = new Error('not-found')
    error.statusCode = 404
    throw error
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    const error = new Error('not-found')
    error.statusCode = 404
    throw error
  }

  return user
}

const User = mongoose.model('Users', userSchema)

module.exports = User
