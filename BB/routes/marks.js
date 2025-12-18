// routes/marks.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const gradeToPoints = require('../utils/gradePoints');

// POST /api/marks/upload
router.post('/upload', protect, authorize('Teacher', 'HOD'), async (req, res) => {
  const { studentId, semester, subjects } = req.body;

  // subjects = [{ subjectName, subjectCode, credits, grade, marks }]

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Remove old record for this semester if exists
    student.academics = student.academics.filter(s => s.semester !== semester);

    let totalPoints = 0;
    let totalCredits = 0;
    let earnedCredits = 0;
    let backlogs = 0;

    const processedSubjects = subjects.map(sub => {
      const gp = gradeToPoints[sub.grade];
      const creditPoints = gp * sub.credits;

      totalPoints += creditPoints;
      totalCredits += sub.credits;

      if (gp > 0) earnedCredits += sub.credits;
      if (['F', 'Ab'].includes(sub.grade)) backlogs++;

      return {
        ...sub,
        gradePoints: gp
      };
    });

    const sgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;

    // Push new semester record
    student.academics.push({
      semester,
      subjects: processedSubjects,
      sgpa,
      totalCredits,
      earnedCredits,
      backlogsThisSem: backlogs
    });

    // Update current backlogs
    student.currentBacklogs = backlogs;

    // Recalculate CGPA
    const completedSems = student.academics.filter(s => s.sgpa > 0);
    if (completedSems.length > 0) {
      const totalGradePoints = completedSems.reduce((acc, sem) => acc + (sem.sgpa * sem.totalCredits), 0);
      const totalCompletedCredits = completedSems.reduce((acc, sem) => acc + sem.totalCredits, 0);
      student.cgpa = totalCompletedCredits > 0 ? Number((totalGradePoints / totalCompletedCredits).toFixed(2)) : 0;
    }

    // Update risk if backlogs or low SGPA
    if (backlogs > 0 || sgpa < 5.0) {
      student.isAtRisk = true;
      student.riskLevel = backlogs >= 3 || sgpa < 4.0 ? 'Critical' : 'High';
      student.riskScore = Math.min(100, student.riskScore + 25);
    }

    await student.save();

    res.json({
      success: true,
      message: 'Marks uploaded & CGPA updated',
      data: {
        student: student.name,
        semester,
        sgpa,
        cgpa: student.cgpa,
        backlogsThisSem: backlogs,
        currentBacklogs: student.currentBacklogs
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
