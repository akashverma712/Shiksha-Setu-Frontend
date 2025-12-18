// models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  department: { type: String, required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  role: { type: String, enum: ['Teacher', 'HOD'], default: 'Teacher' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
