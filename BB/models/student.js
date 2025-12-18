// models/Student.js
const mongoose = require('mongoose');

// ──────────────────────────────────────────────────────────────
// Student Schema – Dropout Prediction Ready
// ──────────────────────────────────────────────────────────────
// const studentSchema = new mongoose.Schema(
// 	{
// 		name: { type: String, required: true, trim: true },
// 		email: { type: String, required: true, unique: true, lowercase: true },
// 		rollNo: { type: String, required: true, unique: true },
// 		registrationNo: { type: String, unique: true, sparse: true },
// 		phone: { type: String, sparse: true },

// 		department: { type: String, required: true },
// 		program: { type: String, required: true },
// 		batch: { type: String, required: true },
// 		semester: { type: Number, required: true, min: 1, max: 10 },
// 		section: { type: String, required: true },

// 		totalClasses: { type: Number, default: 0 },
// 		attendedClasses: { type: Number, default: 0 },
// 		attendancePercentage: { type: Number, default: 0 },

// 		cgpa: { type: Number, default: 0, min: 0, max: 10 },
// 		currentBacklogs: { type: Number, default: 0 },
// 		totalBacklogsEver: { type: Number, default: 0 },

// 		isAtRisk: { type: Boolean, default: false },
// 		riskScore: { type: Number, default: 0, min: 0, max: 100 },
// 		riskLevel: {
// 			type: String,
// 			enum: ['Low', 'Medium', 'High', 'Critical'],
// 			default: 'Low',
// 		},

// 		warnings: [
// 			{
// 				date: { type: Date, default: Date.now },
// 				reason: String,
// 				givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
// 			},
// 		],

// 		feePending: { type: Boolean, default: false },
// 		scholarship: { type: Boolean, default: false },
// 		familyIncome: { type: String, enum: ['Low', 'Medium', 'High', null], default: null },
// 		distanceFromCollege: { type: Number },
// 		travelTime: { type: Number },

// 		lastLogin: { type: Date },
// 		loginStreak: { type: Number, default: 0 },

// 		registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
// 		role: { type: String, default: 'student' },
// 		academics: [
// 			{
// 				semester: { type: Number, required: true },
// 				subjects: [
// 					{
// 						subjectName: { type: String, required: true },
// 						subjectCode: { type: String, required: true },
// 						credits: { type: Number, required: true },
// 						grade: {
// 							type: String,
// 							enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'F', 'Ab'],
// 							required: true,
// 						},
// 						gradePoints: { type: Number }, // Auto-filled
// 						marks: { type: Number, min: 0, max: 100 },
// 					},
// 				],
// 				sgpa: { type: Number, min: 0, max: 10 },
// 				totalCredits: Number,
// 				earnedCredits: Number,
// 				backlogsThisSem: { type: Number, default: 0 },
// 			},
// 		],

// 		// Keep these for quick access
// 		cgpa: { type: Number, default: 0 },
// 		currentBacklogs: { type: Number, default: 0 },
// 		totalBacklogsEver: { type: Number, default: 0 },
// 	},

// 	{ timestamps: true }
// );

// // CRITICAL: THIS IS THE ONLY CORRECT WAY
// studentSchema.pre('save', function (next) {
// 	if (this.totalClasses > 0) {
// 		this.attendancePercentage = Number(((this.attendedClasses / this.totalClasses) * 100).toFixed(2));
// 	} else {
// 		this.attendancePercentage = 0;
// 	}
// 	next();
// });

// If you ever need async work, use this format instead:
// studentSchema.pre('save', async function (next) {
//   // await something
//   next();
// });

// module.exports = mongoose.model('Student', studentSchema);



const gradeToPoints = {
	'O': 10,
	'A+': 9,
	'A': 8,
	'B+': 7,
	'B': 6,
	'C': 5,
	'F': 0,
	'Ab': 0,
};

const studentSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		rollNo: { type: String, required: true, unique: true },
		department: { type: String, required: true },
		program: { type: String, required: true },
		batch: { type: String, required: true },
		semester: { type: Number, required: true },
		section: { type: String, required: true },

		// Attendance
		totalClasses: { type: Number, default: 0 },
		attendedClasses: { type: Number, default: 0 },
		attendancePercentage: { type: Number, default: 0 },

		// NEW: Academic Records
		academics: [
			{
				semester: { type: Number, required: true },
				subjects: [
					{
						subjectName: { type: String, required: true },
						subjectCode: { type: String, required: true },
						credits: { type: Number, required: true },
						grade: {
							type: String,
							enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'F', 'Ab'],
							required: true,
						},
						gradePoints: { type: Number },
						marks: { type: Number, min: 0, max: 100 },
					},
				],
				sgpa: { type: Number, min: 0, max: 10 },
				totalCredits: Number,
				earnedCredits: Number,
				backlogsThisSem: { type: Number, default: 0 },
			},
		],

		// Quick access fields
		cgpa: { type: Number, default: 0 },
		currentBacklogs: { type: Number, default: 0 },
		totalBacklogsEver: { type: Number, default: 0 },
		riskScore: { type: Number, default: 0 },
		riskLevel: {
			type: String,
			enum: ['Low', 'Medium', 'High', 'Critical'],
			default: 'Low',
		},
		isAtRisk: { type: Boolean, default: false },
		feePending: { type: Boolean, default: false },

		registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
		role: { type: String, default: 'student' },
	},
	{ timestamps: true }
);

// // Auto-calculate attendance %
// studentSchema.pre('save', function (next) {
// 	if (this.totalClasses > 0) {
// 		this.attendancePercentage = Number(((this.attendedClasses / this.totalClasses) * 100).toFixed(2));
// 	}
// 	next();
// });

module.exports = mongoose.model('Student', studentSchema);
