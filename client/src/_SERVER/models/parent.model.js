const mongoose = require('mongoose')

const Schema = mongoose.Schema

const parentSchema = new Schema({
  studentId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  gender: {
    type: Boolean,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  classRoom: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  note: {
    type: String
  },
  father: {
    name: {
      type: String
    },
    yearOfBirth: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    note: {
      type: String
    }
  },
  mother: {
    name: {
      type: String
    },
    yearOfBirth: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    note: {
      type: String
    }
  },
  score: {
    math: {
      quickTest: {
        type: Number
      },
      finalExam: {
        type: Number
      }
    },
    literature: {
      quickTest: {
        type: Number
      },
      finalExam: {
        type: Number
      }
    }
  },
  refreshToken: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    required: true
  }
})

const Parent = mongoose.model('Parent', parentSchema)

module.exports = Parent