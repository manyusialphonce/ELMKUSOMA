import { Link } from 'react-router-dom';
import Marquee from '../../components/common/Marquee';

import heroImage from '../../assets/images/hero.jpg';
import logo from '../../assets/images/logo.png';

// ==========================================
// PLATFORM FEATURES
// ==========================================

const FEATURES = [
  {
    title: 'Learn Anywhere',
    description:
      'Access education using your phone, tablet or computer wherever you are.',
    icon: '◉',
  },
  {
    title: 'Quality Learning Content',
    description:
      'Access organized lessons, notes and educational resources.',
    icon: '▤',
  },
  {
    title: 'For Every Learner',
    description:
      'Supporting learners across different stages of education.',
    icon: '⊙',
  },
  {
    title: 'Connected Education',
    description:
      'Students, teachers, parents and schools can connect through one platform.',
    icon: '↔',
  },
];

// ==========================================
// WHO CAN USE ELMKUSOMA
// ==========================================

const USERS = [
  {
    role: 'student',
    label: 'Students',
    description:
      'Access educational content, learning resources and continue your learning journey.',
    icon: 'S',
  },
  {
    role: 'teacher',
    label: 'Teachers',
    description:
      'Share knowledge, manage learning activities and connect with learners.',
    icon: 'T',
  },
  {
    role: 'parent',
    label: 'Parents',
    description:
      'Stay connected with your child’s educational journey and progress.',
    icon: 'P',
  },
  {
    role: 'school',
    label: 'Schools',
    description:
      'Use digital tools to support teaching, learning and educational activities.',
    icon: 'E',
  },
];

// ==========================================
// MARQUEE ITEMS
// ==========================================

const SCOPE_ITEMS = [
  'NURSERY',
  'PRIMARY',
  'SECONDARY',
  'ADVANCED',
  'VETA',
  'COLLEGE',
  'UNIVERSITY',
  '•',
  'TANZANIA',
  '•',
  'DIGITAL EDUCATION',
  '•',
  'LEARN ANYWHERE',
];

// ==========================================
// HOME COMPONENT
// ==========================================

export default function Home() {
  return (
    <div className="overflow-hidden bg-white">

      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section className="relative min-h-[700px] overflow-hidden bg-ink text-paper">

        <img
          src={heroImage}
          alt="Students learning"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-ink
            via-ink/80
            to-ink/20
          "
        />

        {/* MOBILE OVERLAY */}

        <div className="absolute inset-0 bg-ink/30 md:hidden" />

        {/* BOTTOM OVERLAY */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-48
            bg-gradient-to-t
            from-ink/90
            to-transparent
          "
        />

        {/* DECORATION */}

        <div className="absolute bottom-0 left-6 top-0 w-px bg-marigold/30 md:left-10" />

        <div className="absolute bottom-0 left-[26px] top-0 w-px bg-paper/10 md:left-[42px]" />


        {/* HERO CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[650px]
            max-w-6xl
            items-center
            px-6
            py-20
            md:px-12
            lg:px-16
          "
        >

          <div className="max-w-3xl">

            {/* LOGO */}

            <div className="mb-8 flex items-center gap-4">

              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  bg-white/95
                  p-1
                  shadow-xl
                  backdrop-blur-sm
                "
              >

                <img
                  src={logo}
                  alt="ELMKUSOMA Logo"
                  className="h-full w-full object-contain"
                />

              </div>


              <div>

                <h2 className="font-display text-xl font-bold tracking-wide text-white">
                  ELMKUSOMA
                </h2>

                <p className="text-xs tracking-wider text-paper/70">
                  DIGITAL EDUCATION PLATFORM
                </p>

              </div>

            </div>


            {/* SMALL LABEL */}

            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-marigold">
              Tanzania Digital Education Platform
            </p>


            {/* MAIN HEADING */}

            <h1
              className="
                font-display
                text-4xl
                font-black
                leading-[1.08]
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              Education without limits.

              <span className="mt-3 block text-marigold">
                Learn. Connect. Grow.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-paper/90 md:text-lg">

              ELMKUSOMA is a digital education platform designed to connect
              learners, teachers, parents and educational institutions in one
              place.

              <br />
              <br />

              Access learning opportunities, educational resources and digital
              tools from wherever you are.

            </p>


            {/* BUTTONS */}

            <div className="mt-10 flex flex-wrap items-center gap-4">

              <Link
                to="/register"
                className="
                  rounded-lg
                  bg-marigold
                  px-7
                  py-3.5
                  font-semibold
                  text-ink
                  shadow-lg
                  transition
                  duration-300
                  hover:scale-[1.03]
                  hover:bg-marigold-deep
                "
              >
                Get Started
              </Link>


              <a
                href="#about"
                className="
                  border-b
                  border-paper/50
                  px-2
                  py-3
                  font-medium
                  text-paper
                  transition
                  hover:border-marigold
                  hover:text-marigold
                "
              >
                Learn More ↓
              </a>

            </div>


            {/* TRUST TEXT */}

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-paper/70 sm:gap-6">

              <span>Accessible anywhere</span>

              <span className="text-marigold">•</span>

              <span>Built for Tanzania</span>

              <span className="text-marigold">•</span>

              <span>One platform</span>

            </div>

          </div>

        </div>


        {/* BOTTOM MARQUEE */}

        <div
          className="
            relative
            z-10
            border-t
            border-paper/20
            bg-ink/40
            py-4
            backdrop-blur-sm
          "
        >

          <Marquee
            items={SCOPE_ITEMS}
            className="text-paper"
          />

        </div>

      </section>


      {/* =====================================
          ABOUT ELMKUSOMA
      ====================================== */}

      <section
        id="about"
        className="
          relative
          overflow-hidden
          border-b
          border-forest/10
          bg-[#F7F9F8]
        "
      >

        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-forest/5 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-marigold/10 blur-3xl" />


        <div className="relative mx-auto max-w-6xl px-6 py-24">

          <div
            className="
              grid
              overflow-hidden
              rounded-3xl
              border
              border-forest/10
              shadow-lg
              lg:grid-cols-2
            "
          >


            {/* =========================
                LEFT SIDE
            ========================== */}

            <div
              className="
                relative
                overflow-hidden
                bg-forest
                px-8
                py-14
                text-paper
                sm:px-12
                lg:px-14
                lg:py-20
              "
            >

              {/* LEFT SIDE DECORATION */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-paper/10" />

              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-paper/5" />

              <div className="pointer-events-none absolute bottom-10 right-10 h-20 w-20 rounded-full border border-marigold/20" />


              <div className="relative">

                {/* LABEL */}

                <div className="mb-8 flex items-center gap-3">

                  <div className="h-px w-10 bg-marigold" />

                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold">
                    About ELMKUSOMA
                  </p>

                </div>


                {/* HEADING */}

                <h2
                  className="
                    max-w-xl
                    font-display
                    text-3xl
                    font-bold
                    leading-tight
                    sm:text-4xl
                    md:text-5xl
                  "
                >

                  One digital space

                  <span className="mt-2 block text-marigold">
                    for the future of education.
                  </span>

                </h2>


                {/* DESCRIPTION */}

                <p className="mt-8 max-w-md leading-relaxed text-paper/70">

                  Connecting people, opportunities and educational resources
                  through one modern digital platform.

                </p>


                {/* BOTTOM FEATURE */}

                <div className="mt-10 flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-paper/10
                      text-xl
                      text-marigold
                    "
                  >
                    ↗
                  </div>


                  <div>

                    <p className="text-sm font-semibold text-paper">
                      Built for Tanzania
                    </p>

                    <p className="mt-1 text-sm text-paper/60">
                      Designed for a connected future.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =========================
                RIGHT SIDE
            ========================== */}

            <div
              className="
                flex
                items-center
                bg-white
                px-8
                py-14
                sm:px-12
                lg:px-14
                lg:py-20
              "
            >

              <div className="w-full">

                {/* LABEL */}

                <div className="mb-6 flex items-center gap-3">

                  <div className="h-2 w-2 rounded-full bg-sky-500" />

                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-forest">
                    Our Vision
                  </p>

                </div>


                {/* MAIN TEXT */}

                <p className="text-lg leading-relaxed text-ink md:text-xl">

                  ELMKUSOMA is built to make education more accessible,
                  connected and flexible.

                </p>


                {/* DESCRIPTION */}

                <p className="mt-6 leading-relaxed text-muted">

                  It provides a digital environment where people involved in
                  education can access tools, resources and information
                  relevant to their educational journey.

                </p>


                {/* DIVIDER */}

                <div className="my-8 h-px w-full bg-forest/10" />


                {/* SECOND TEXT */}

                <p className="leading-relaxed text-muted">

                  Whether you are a student looking for learning opportunities,
                  a teacher sharing knowledge, a parent following educational
                  progress, or a school exploring digital education,
                  ELMKUSOMA brings these possibilities together.

                </p>


                {/* TAGS */}

                <div className="mt-10 flex flex-wrap gap-3">

                  <span
                    className="
                      rounded-full
                      bg-forest/5
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-forest
                    "
                  >
                    Accessible
                  </span>


                  <span
                    className="
                      rounded-full
                      bg-sky-50
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-sky-700
                    "
                  >
                    Connected
                  </span>


                  <span
                    className="
                      rounded-full
                      bg-marigold/10
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-ink
                    "
                  >
                    Future Ready
                  </span>

                </div>

              </div>

            </div>


          </div>

        </div>

      </section>


      {/* =====================================
          WHY ELMKUSOMA / FEATURES
          OCEAN BLUE BACKGROUND ONLY HERE
      ====================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-y
          border-sky-200
          bg-[#EAF6FA]
        "
      >

        {/* OCEAN BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />


        <div className="relative mx-auto max-w-6xl px-6 py-24">

          {/* SECTION HEADER */}

          <div className="mb-14 max-w-2xl">

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-sky-700">
              Why ELMKUSOMA
            </p>

            <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-5xl">
              Education designed for today's world.
            </h2>

            <p className="mt-5 leading-relaxed text-muted">
              A modern digital environment designed to make education more
              accessible and connected.
            </p>

          </div>


          {/* FEATURES GRID */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {FEATURES.map((feature, index) => (

              <div
                key={feature.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-sky-200
                  bg-white/90
                  p-7
                  shadow-sm
                  backdrop-blur-sm
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:border-sky-400
                  hover:bg-white
                  hover:shadow-xl
                "
              >

                {/* TOP ROW */}

                <div className="flex items-center justify-between">

                  <span className="font-mono text-sm text-sky-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>


                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-sky-100
                      text-lg
                      text-sky-700
                      transition
                      duration-300
                      group-hover:scale-110
                      group-hover:bg-sky-500
                      group-hover:text-white
                    "
                  >
                    {feature.icon}
                  </div>

                </div>


                {/* CONTENT */}

                <h3 className="mt-7 font-display text-xl font-semibold leading-snug text-ink">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>


                {/* BOTTOM LINE */}

                <div className="mt-7 h-px w-12 bg-sky-200 transition-all duration-300 group-hover:w-full group-hover:bg-sky-500" />

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          WHO IS IT FOR
      ====================================== */}

      <section className="border-y border-forest/10 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-24">

          {/* HEADER */}

          <div className="mb-14 text-center">

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-forest">
              Built For Everyone
            </p>

            <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">
              Education connects all of us.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
              Different people have different roles in education. ELMKUSOMA is
              designed to support each of them.
            </p>

          </div>


          {/* USERS GRID */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {USERS.map((user) => (

              <div
                key={user.role}
                className="
                  group
                  rounded-2xl
                  border
                  border-forest/15
                  bg-white
                  p-7
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:border-forest/30
                  hover:shadow-xl
                "
              >

                {/* ROLE ICON */}

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-forest/10
                    font-display
                    text-lg
                    font-bold
                    text-forest
                    transition
                    duration-300
                    group-hover:bg-forest
                    group-hover:text-white
                  "
                >
                  {user.icon}
                </div>


                <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                  {user.label}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {user.description}
                </p>


                {/* LINKS */}

                {user.role !== 'school' ? (

                  <Link
                    to={`/register?role=${user.role}`}
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-forest
                      transition
                      hover:gap-3
                      hover:text-ink
                    "
                  >
                    Get Started

                    <span>→</span>
                  </Link>

                ) : (

                  <Link
                    to="/schools"
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-forest
                      transition
                      hover:gap-3
                      hover:text-ink
                    "
                  >
                    Explore Schools

                    <span>→</span>
                  </Link>

                )}

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          FINAL CALL TO ACTION
      ====================================== */}

      <section className="relative overflow-hidden bg-[#F7F9F8]">

        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-marigold/10 blur-3xl" />


        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">

          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-forest">
            Join ELMKUSOMA
          </p>


          <h2 className="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">
            Your journey starts with one step.
          </h2>


          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">
            Create your account and become part of a growing digital education
            community built to connect learning opportunities.
          </p>


          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              to="/register"
              className="
                rounded-lg
                bg-forest
                px-8
                py-3.5
                font-semibold
                text-paper
                shadow-lg
                transition
                duration-300
                hover:scale-[1.02]
                hover:bg-ink
              "
            >
              Create an Account
            </Link>


            <Link
              to="/login"
              className="
                rounded-lg
                border
                border-forest/20
                bg-white
                px-8
                py-3.5
                font-semibold
                text-ink
                transition
                hover:bg-forest/5
              "
            >
              Log In
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}