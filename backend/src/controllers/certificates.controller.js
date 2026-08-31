const crypto = require('crypto');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { notifyUser } = require('./notifications.controller');
const { logAction } = require('../utils/auditLog');

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `ELMK-${year}-${random}`;
}

function generateVerificationCode() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

// GET /api/v1/certificates/me  (Student — list own certificates)
const myCertificates = asyncHandler(async (req, res) => {
  const certificates = await prisma.certificate.findMany({
    where: { studentId: req.user.id },
    orderBy: { issuedAt: 'desc' },
  });
  res.json({ data: certificates });
});

// POST /api/v1/certificates  (Admin/Teacher issues a certificate — SRS §10.1 flow)
// Eligibility is checked here rather than assuming every request qualifies,
// per the SRS note: "Certificate issuance must check the configured
// eligibility/business rules rather than merely assuming every lesson view
// qualifies." This starter rule checks quiz pass state; refine per-institution.
const issueCertificate = asyncHandler(async (req, res) => {
  const { studentId, title, institutionName, quizAttemptId, metadata } = req.body;

  if (quizAttemptId) {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: Number(quizAttemptId) },
      include: { quiz: true },
    });
    if (!attempt || attempt.studentId !== Number(studentId)) {
      throw ApiError.badRequest('Quiz attempt does not belong to this student.');
    }
    if (attempt.quiz.passingScore && attempt.score < attempt.quiz.passingScore) {
      throw ApiError.forbidden('Student has not met the passing score for this certificate.');
    }
  }

  const certificate = await prisma.certificate.create({
    data: {
      studentId: Number(studentId),
      title,
      institutionName: institutionName || null,
      certificateNumber: generateCertificateNumber(),
      verificationCode: generateVerificationCode(),
      metadata: metadata || (quizAttemptId ? { quizAttemptId: Number(quizAttemptId) } : null),
      status: 'ISSUED',
    },
  });

  await notifyUser(certificate.studentId, 'ACCOUNT_SECURITY', `Certificate issued: ${title}`, {
    certificateId: certificate.id,
  });

  await logAction(req.user.id, 'certificate.issue', { entity: 'Certificate', entityId: certificate.id });

  res.status(201).json({ data: certificate });
});

// GET /api/v1/certificates/verify/:code  (PUBLIC — no auth required)
const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: req.params.code },
    include: { student: { select: { fullName: true } } },
  });

  if (!certificate) {
    return res.status(404).json({ valid: false, message: 'No certificate found for this code.' });
  }

  res.json({
    valid: certificate.status === 'ISSUED',
    data: {
      certificateNumber: certificate.certificateNumber,
      title: certificate.title,
      institutionName: certificate.institutionName,
      studentName: certificate.student.fullName,
      status: certificate.status,
      issuedAt: certificate.issuedAt,
      revokedAt: certificate.revokedAt,
    },
  });
});

// PATCH /api/v1/certificates/:id/revoke  (Admin)
const revokeCertificate = asyncHandler(async (req, res) => {
  const certificate = await prisma.certificate.update({
    where: { id: Number(req.params.id) },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });

  await logAction(req.user.id, 'certificate.revoke', { entity: 'Certificate', entityId: certificate.id });

  res.json({ data: certificate });
});

module.exports = { myCertificates, issueCertificate, verifyCertificate, revokeCertificate };
