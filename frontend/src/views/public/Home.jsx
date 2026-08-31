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
  },
  {
    title: 'Quality Learning Content',
    description:
      'Access organized lessons, notes and educational resources.',
  },
  {
    title: 'For Every Learner',
    description:
      'Supporting learners across different stages of education.',
  },
  {
    title: 'Connected Education',
    description:
      'Students, teachers, parents and schools can connect through one platform.',
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
  },
  {
    role: 'teacher',
    label: 'Teachers',
    description:
      'Share knowledge, manage learning activities and connect with learners.',
  },
  {
    role: 'parent',
    label: 'Parents',
    description:
      'Stay connected with your child’s educational journey and progress.',
  },
  {
    role: 'school',
    label: 'Schools',
    description:
      'Use digital tools to support teaching, learning and educational activities.',
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


        {/* HERO IMAGE */}

        <img
          src={heroImage}
          alt="Students learning"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />


        {/* =====================================
            OVERLAY
            Dark on left for text,
            transparent on right for image
        ====================================== */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-ink
            via-ink/70
            to-transparent
          "
        />


        {/* MOBILE OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-ink/20
            md:hidden
          "
        />


        {/* BOTTOM OVERLAY */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-40
            bg-gradient-to-t
            from-ink/80
            to-transparent
          "
        />


        {/* =====================================
            DECORATION
        ====================================== */}

        <div className="absolute bottom-0 left-6 top-0 w-px bg-marigold/30 md:left-10" />

        <div className="absolute bottom-0 left-[26px] top-0 w-px bg-paper/10 md:left-[42px]" />


        {/* =====================================
            HERO CONTENT
        ====================================== */}

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
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-white
                  shadow-lg
                "
              >

                <img
                  src={logo}
                  alt="ELMKUSOMA Logo"
                  className="
                    h-full
                    w-full
                    object-contain
                    p-1
                  "
                />

              </div>


              <div>

                <h2 className="font-display text-xl font-bold tracking-wide">

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

              Access learning opportunities, educational resources and
              digital tools from wherever you are.

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

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-paper/70 sm:gap-6">

              <span>Accessible anywhere</span>

              <span className="text-marigold">•</span>

              <span>Built for Tanzania</span>

              <span className="text-marigold">•</span>

              <span>One platform</span>

            </div>


          </div>


        </div>


        {/* =====================================
            BOTTOM MARQUEE
        ====================================== */}

        <div
          className="
            relative
            z-10
            border-t
            border-paper/20
            bg-ink/30
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
        className="border-b border-forest/15 bg-white"
      >

        <div className="mx-auto max-w-6xl px-6 py-24">


          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">


            {/* LEFT */}

            <div>

              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-forest">

                About ELMKUSOMA

              </p>


              <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-5xl">

                One digital space for the future of education.

              </h2>

            </div>


            {/* RIGHT */}

            <div className="text-base leading-relaxed text-muted">


              <p>

                ELMKUSOMA is built to make education more accessible,
                connected and flexible. It provides a digital environment
                where people involved in education can access tools and
                information relevant to them.

              </p>


              <p className="mt-6">

                Whether you are a student looking for learning opportunities,
                a teacher sharing knowledge, a parent following educational
                progress, or a school exploring digital education,
                ELMKUSOMA brings these possibilities together.

              </p>


            </div>


          </div>


        </div>


      </section>



      {/* =====================================
          WHY ELMKUSOMA / FEATURES
      ====================================== */}

      <section className="bg-ink text-paper">


        <div className="mx-auto max-w-6xl px-6 py-24">


          {/* SECTION HEADER */}

          <div className="mb-14 max-w-2xl">


            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-marigold">

              Why ELMKUSOMA

            </p>


            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">

              Education designed for today's world.

            </h2>


            <p className="mt-5 leading-relaxed text-paper/60">

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
                  rounded-xl
                  border
                  border-paper/10
                  bg-paper/[0.03]
                  p-7
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:border-marigold/50
                  hover:bg-paper/[0.07]
                "
              >


                {/* NUMBER */}

                <span className="font-mono text-sm text-marigold/70">

                  {String(index + 1).padStart(2, '0')}

                </span>


                <h3 className="mt-6 font-display text-xl font-semibold">

                  {feature.title}

                </h3>


                <p className="mt-4 text-sm leading-relaxed text-paper/60">

                  {feature.description}

                </p>


              </div>

            ))}


          </div>


        </div>


      </section>



      {/* =====================================
          WHO IS IT FOR
      ====================================== */}

      <section className="border-y border-forest/10 bg-forest/5">


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

              Different people have different roles in education.
              ELMKUSOMA is designed to support each of them.

            </p>


          </div>



          {/* USERS GRID */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


            {USERS.map((user) => (

              <div
                key={user.role}
                className="
                  rounded-xl
                  border
                  border-forest/15
                  bg-white
                  p-7
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-2
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
                    rounded-lg
                    bg-forest/10
                    font-display
                    text-lg
                    font-bold
                    text-forest
                  "
                >

                  {user.label.charAt(0)}

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
                    to="/register"
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

                    Learn More

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

      <section className="relative overflow-hidden bg-white">


        <div className="mx-auto max-w-4xl px-6 py-24 text-center">


          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-forest">

            Join ELMKUSOMA

          </p>


          <h2 className="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">

            Your journey starts with one step.

          </h2>


          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">

            Create your account and become part of a growing digital
            education community built to connect learning opportunities.

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