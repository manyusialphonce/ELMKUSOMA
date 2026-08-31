const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ELMKUSOMA reference data...');

  // --- 1. Country ---
  const tanzania = await prisma.country.upsert({
    where: { code: 'TZ' },
    update: {},
    create: { name: 'Tanzania', code: 'TZ' },
  });

  // --- 2. Regions (from founder's notes: Arusha, Kilimanjaro, Dar es Salaam,
  //     Iringa, Dodoma, Mwanza, Mbeya, Tanga, Kigoma) ---
  const regionNames = [
    'Arusha', 'Kilimanjaro', 'Dar es Salaam', 'Iringa', 'Dodoma',
    'Mwanza', 'Mbeya', 'Tanga', 'Kigoma',
  ];

  const regions = {};
  for (const name of regionNames) {
    regions[name] = await prisma.region.upsert({
      where: { countryId_name: { countryId: tanzania.id, name } },
      update: {},
      create: { countryId: tanzania.id, name },
    });
  }

  // A starter district per region (Dodoma shown explicitly in the sketch)
  for (const name of regionNames) {
    await prisma.district.upsert({
      where: { regionId_name: { regionId: regions[name].id, name: `${name} Mjini` } },
      update: {},
      create: { regionId: regions[name].id, name: `${name} Mjini` },
    });
  }

  // --- 3. Education Levels (Nursery -> University, per sketch + SRS §8) ---
  const levelDefs = [
    { name: 'Nursery', slug: 'nursery', sortOrder: 1 },
    { name: 'Primary', slug: 'primary', sortOrder: 2 },
    { name: 'Secondary', slug: 'secondary', sortOrder: 3 },
    { name: 'Advanced', slug: 'advanced', sortOrder: 4 },
    { name: 'VETA', slug: 'veta', sortOrder: 5 },
    { name: 'College', slug: 'college', sortOrder: 6 },
    { name: 'University', slug: 'university', sortOrder: 7 },
  ];

  const levels = {};
  for (const def of levelDefs) {
    levels[def.slug] = await prisma.educationLevel.upsert({
      where: { slug: def.slug },
      update: {},
      create: def,
    });
  }

  // --- 4. Classes per level, matching the founder's sketch exactly ---
  // Nursery: "Baby" groups (Baby 1, 2, 3)
  const nurseryClasses = ['Baby 1', 'Baby 2', 'Baby 3'];
  for (const [i, name] of nurseryClasses.entries()) {
    const exists = await prisma.schoolClass.findFirst({
      where: { educationLevelId: levels.nursery.id, name },
    });
    if (!exists) {
      await prisma.schoolClass.create({
        data: { educationLevelId: levels.nursery.id, name, sortOrder: i + 1 },
      });
    }
  }

  // Primary: Class 1–7
  for (let i = 1; i <= 7; i++) {
    const name = `Class ${i}`;
    const exists = await prisma.schoolClass.findFirst({
      where: { educationLevelId: levels.primary.id, name },
    });
    if (!exists) {
      await prisma.schoolClass.create({
        data: { educationLevelId: levels.primary.id, name, sortOrder: i },
      });
    }
  }

  // Secondary: Form 1–6
  const formNames = ['Form One', 'Form Two', 'Form Three', 'Form Four', 'Form Five', 'Form Six'];
  for (const [i, name] of formNames.entries()) {
    const exists = await prisma.schoolClass.findFirst({
      where: { educationLevelId: levels.secondary.id, name },
    });
    if (!exists) {
      await prisma.schoolClass.create({
        data: { educationLevelId: levels.secondary.id, name, sortOrder: i + 1 },
      });
    }
  }

  // --- 5. Universities + Faculties (UDSM, UDOM from sketch) ---
  const udsm = await prisma.university.upsert({
    where: { name: 'University of Dar es Salaam (UDSM)' },
    update: {},
    create: { name: 'University of Dar es Salaam (UDSM)' },
  });

  const udom = await prisma.university.upsert({
    where: { name: 'University of Dodoma (UDOM)' },
    update: {},
    create: { name: 'University of Dodoma (UDOM)' },
  });

  const facultyNames = [
    'Faculty of Science', 'Faculty of Arts and Social Sciences',
    'Faculty of Law', 'Faculty of Education', 'Faculty of Engineering',
  ];

  for (const uni of [udsm, udom]) {
    for (const name of facultyNames) {
      await prisma.faculty.upsert({
        where: { universityId_name: { universityId: uni.id, name } },
        update: {},
        create: { universityId: uni.id, name },
      });
    }
  }

  // --- 6. Starter subscription plans ---
  await prisma.subscriptionPlan.upsert({
    where: { slug: 'monthly-basic' },
    update: {},
    create: {
      name: 'Monthly Basic',
      slug: 'monthly-basic',
      description: 'Access to recorded lessons and notes library.',
      price: 5000,
      currency: 'TZS',
      durationDays: 30,
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { slug: 'monthly-premium' },
    update: {},
    create: {
      name: 'Monthly Premium',
      slug: 'monthly-premium',
      description: 'Access to live classes, recordings, quizzes, and notes library.',
      price: 12000,
      currency: 'TZS',
      durationDays: 30,
    },
  });

  // --- 7. Nursery games (from founder's original sketch: Baby 1/2/3) ---
  const nurseryGameDefs = [
    { title: 'Baby 1 — Reading Adventure', type: 'VIDEO_READING', babyGroup: 'Baby 1' },
    { title: 'Baby 2 — Number Fun', type: 'VIDEO_MATH', babyGroup: 'Baby 2' },
    { title: 'Baby 3 — Word Match Game', type: 'READING_GAME', babyGroup: 'Baby 3' },
  ];

  for (const def of nurseryGameDefs) {
    const exists = await prisma.nurseryGame.findFirst({ where: { title: def.title } });
    if (!exists) {
      await prisma.nurseryGame.create({
        data: {
          title: def.title,
          type: def.type,
          babyGroup: def.babyGroup,
          contentUrl: `nursery-games/${def.babyGroup.toLowerCase().replace(' ', '-')}/placeholder.mp4`,
          status: 'PUBLISHED',
        },
      });
    }
  }

  // --- 8. Academic calendar (starter year + two semesters) ---
  const academicYear = await prisma.academicYear.upsert({
    where: { name: '2026/2027' },
    update: {},
    create: {
      name: '2026/2027',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-07-31'),
      isActive: true,
    },
  });

  const semesterNames = ['Semester 1', 'Semester 2'];
  for (const [i, name] of semesterNames.entries()) {
    const exists = await prisma.semester.findFirst({
      where: { academicYearId: academicYear.id, name },
    });
    if (!exists) {
      await prisma.semester.create({
        data: { academicYearId: academicYear.id, name, sortOrder: i + 1, isActive: i === 0 },
      });
    }
  }

  // --- 9. Department under UDSM (higher ed structure example) ---
  const udsmFaculty = await prisma.faculty.findFirst({
    where: { university: { name: udsm.name }, name: 'Faculty of Science' },
  });
  if (udsmFaculty) {
    const dept = await prisma.department.upsert({
      where: { facultyId_name: { facultyId: udsmFaculty.id, name: 'Department of Computer Science' } },
      update: {},
      create: { facultyId: udsmFaculty.id, name: 'Department of Computer Science' },
    });

    await prisma.academicProgramme.upsert({
      where: { departmentId_name: { departmentId: dept.id, name: 'BSc. Computer Science' } },
      update: {},
      create: {
        departmentId: dept.id,
        name: 'BSc. Computer Science',
        awardLevel: 'BACHELOR',
        durationYears: 3,
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
