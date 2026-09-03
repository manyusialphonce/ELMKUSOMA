const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/reports/student/me  (Student's own learning summary)
const studentReport = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const [lessonsCompleted, lessonsInProgress, quizAttempts, submissions, attendanceCount, certificates] =
    await Promise.all([
      prisma.lessonProgress.count({ where: { studentId, completedAt: { not: null } } }),
      prisma.lessonProgress.count({ where: { studentId, completedAt: null } }),
      prisma.quizAttempt.findMany({ where: { studentId }, select: { score: true } }),
      prisma.assignmentSubmission.count({ where: { studentId, status: { in: ['SUBMITTED', 'LATE', 'GRADED'] } } }),
      prisma.attendance.count({ where: { studentId } }),
      prisma.certificate.count({ where: { studentId, status: 'ISSUED' } }),
    ]);

  const scores = quizAttempts.map((a) => a.score).filter((s) => s !== null);
  const averageQuizScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  res.json({
    data: {
      lessonsCompleted,
      lessonsInProgress,
      quizAttemptsCount: quizAttempts.length,
      averageQuizScore,
      assignmentsSubmitted: submissions,
      liveClassesAttended: attendanceCount,
      certificatesEarned: certificates,
    },
  });
});

// GET /api/v1/reports/teacher/me  (Teacher's teaching summary)
const teacherReport = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;

  const [liveClassesCount, recordingsCount, quizzesCount, assignmentsCount, lessonsCount, students] =
    await Promise.all([
      prisma.liveClass.count({ where: { teacherId } }),
      prisma.recording.count({ where: { uploadedById: teacherId } }),
      prisma.quiz.count({ where: { teacherId } }),
      prisma.assignment.count({ where: { teacherId } }),
      prisma.lesson.count({ where: { teacherId } }),
      prisma.attendance.findMany({
        where: { liveClass: { teacherId } },
        select: { studentId: true },
        distinct: ['studentId'],
      }),
    ]);

  // Average quiz score across all of this teacher's quizzes
  const attempts = await prisma.quizAttempt.findMany({
    where: { quiz: { teacherId } },
    select: { score: true },
  });
  const scores = attempts.map((a) => a.score).filter((s) => s !== null);
  const averageStudentScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  res.json({
    data: {
      liveClassesHeld: liveClassesCount,
      recordingsPublished: recordingsCount,
      quizzesCreated: quizzesCount,
      assignmentsCreated: assignmentsCount,
      lessonsPublished: lessonsCount,
      uniqueStudentsReached: students.length,
      averageStudentQuizScore: averageStudentScore,
    },
  });
});

// GET /api/v1/reports/admin/overview  (Admin — platform-wide numbers)
const adminOverview = asyncHandler(async (req, res) => {
  const [
    totalUsers, activeUsers, studentsCount, teachersCount, parentsCount, schoolsCount,
    activeSubscriptions, expiredSubscriptions, pendingVerifications, revenueAgg,
    liveClassesHeld, quizAttemptsCount, certificatesIssued,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { accountStatus: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.school.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { status: 'EXPIRED' } }),
    prisma.user.count({ where: { role: 'TEACHER', verificationStatus: 'PENDING' } }),
    prisma.payment.aggregate({ where: { status: 'SUCCESSFUL' }, _sum: { amount: true } }),
    prisma.liveClass.count({ where: { status: 'ENDED' } }),
    prisma.quizAttempt.count(),
    prisma.certificate.count({ where: { status: 'ISSUED' } }),
  ]);

  res.json({
    data: {
      users: { total: totalUsers, active: activeUsers, students: studentsCount, teachers: teachersCount, parents: parentsCount },
      schools: schoolsCount,
      subscriptions: { active: activeSubscriptions, expired: expiredSubscriptions },
      pendingTeacherVerifications: pendingVerifications,
      totalRevenue: revenueAgg._sum.amount || 0,
      liveClassesHeld,
      quizAttemptsCount,
      certificatesIssued,
    },
  });
});

// GET /api/v1/reports/admin/geography  (users/schools by region — SRS §22 Geography reports)
const geographyReport = asyncHandler(async (req, res) => {
  const [usersByRegion, schoolsByRegion] = await Promise.all([
    prisma.user.groupBy({ by: ['regionId'], _count: { id: true }, where: { regionId: { not: null } } }),
    prisma.school.groupBy({ by: ['regionId'], _count: { id: true } }),
  ]);

  const regions = await prisma.region.findMany({ select: { id: true, name: true } });
  const regionName = Object.fromEntries(regions.map((r) => [r.id, r.name]));

  res.json({
    data: {
      usersByRegion: usersByRegion.map((r) => ({ region: regionName[r.regionId], count: r._count.id })),
      schoolsByRegion: schoolsByRegion.map((r) => ({ region: regionName[r.regionId], count: r._count.id })),
    },
  });
});

// GET /api/v1/reports/teacher/students  (unique students who've interacted with this teacher's content)
const teacherStudents = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;

  const [attendees, quizStudents, submitters] = await Promise.all([
    prisma.attendance.findMany({
      where: { liveClass: { teacherId } },
      select: { student: { select: { id: true, fullName: true, email: true } } },
      distinct: ['studentId'],
    }),
    prisma.quizAttempt.findMany({
      where: { quiz: { teacherId } },
      select: { student: { select: { id: true, fullName: true, email: true } } },
      distinct: ['studentId'],
    }),
    prisma.assignmentSubmission.findMany({
      where: { assignment: { teacherId } },
      select: { student: { select: { id: true, fullName: true, email: true } } },
      distinct: ['studentId'],
    }),
  ]);

  const byId = new Map();
  [...attendees, ...quizStudents, ...submitters].forEach(({ student }) => {
    byId.set(student.id, student);
  });

  res.json({ data: Array.from(byId.values()) });
});

module.exports = { studentReport, teacherReport, adminOverview, geographyReport, teacherStudents };
