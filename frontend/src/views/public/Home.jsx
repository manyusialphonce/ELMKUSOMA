import { Link } from 'react-router-dom';
import Marquee from '../../components/Marquee';

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
// STATISTICS
// ==========================================

const STATS = [
  {
    number: '7+',
    title: 'Education Levels',
    description: 'From Nursery to University',
    icon: '▣',
    color: 'green',
  },
  {
    number: '4',
    title: 'User Groups',
    description: 'Learners, Teachers, Parents & Schools',
    icon: '♧',
    color: 'blue',
  },
  {
    number: '1',
    title: 'Connected Platform',
    description: 'Education brought together',
    icon: '◈',
    color: 'yellow',
  },
  {
    number: '24/7',
    title: 'Learning Access',
    description: 'Learn anytime, anywhere',
    icon: '◷',
    color: 'purple',
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
          CUSTOM MICRO ANIMATIONS
      ====================================== */}

      <style>
        {`
          /* =====================================
             HERO CONTENT ANIMATION
          ====================================== */

          @keyframes heroFadeUp {
            0% {
              opacity: 0;
              transform: translateY(18px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }


          /* =====================================
             SOFT FLOAT
          ====================================== */

          @keyframes softFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }


          /* =====================================
             SOFT PULSE
          ====================================== */

          @keyframes pulseSoft {
            0%,
            100% {
              opacity: 0.35;
              transform: scale(1);
            }

            50% {
              opacity: 0.65;
              transform: scale(1.05);
            }
          }


          /* =====================================
             HERO WORDS - LEARN
          ====================================== */

          @keyframes learnGlow {
            0%,
            100% {
              color: #79C74B;
              transform: translateY(0) scale(1);
              text-shadow:
                0 2px 5px rgba(0, 0, 0, 0.45),
                0 0 0 rgba(121, 199, 75, 0);
            }

            50% {
              color: #A8E86D;
              transform: translateY(-6px) scale(1.08);
              text-shadow:
                0 4px 12px rgba(0, 0, 0, 0.4),
                0 0 25px rgba(121, 199, 75, 0.85),
                0 0 50px rgba(121, 199, 75, 0.45);
            }
          }


          /* =====================================
             HERO WORDS - CONNECT
          ====================================== */

          @keyframes connectGlow {
            0%,
            100% {
              color: #38BDF8;
              transform: translateY(0) scale(1);
              text-shadow:
                0 2px 5px rgba(0, 0, 0, 0.45),
                0 0 0 rgba(56, 189, 248, 0);
            }

            50% {
              color: #7DD3FC;
              transform: translateY(-6px) scale(1.08);
              text-shadow:
                0 4px 12px rgba(0, 0, 0, 0.4),
                0 0 25px rgba(56, 189, 248, 0.85),
                0 0 50px rgba(56, 189, 248, 0.45);
            }
          }


          /* =====================================
             HERO WORDS - GROW
          ====================================== */

          @keyframes growGlow {
            0%,
            100% {
              color: #F4B942;
              transform: translateY(0) scale(1);
              text-shadow:
                0 2px 5px rgba(0, 0, 0, 0.45),
                0 0 0 rgba(244, 185, 66, 0);
            }

            50% {
              color: #FFD166;
              transform: translateY(-6px) scale(1.08);
              text-shadow:
                0 4px 12px rgba(0, 0, 0, 0.4),
                0 0 25px rgba(244, 185, 66, 0.85),
                0 0 50px rgba(244, 185, 66, 0.45);
            }
          }


          /* =====================================
             HERO FADE CLASSES
          ====================================== */

          .hero-fade-1 {
            animation: heroFadeUp 0.7s ease-out both;
          }

          .hero-fade-2 {
            animation: heroFadeUp 0.7s ease-out 0.15s both;
          }

          .hero-fade-3 {
            animation: heroFadeUp 0.7s ease-out 0.3s both;
          }

          .hero-fade-4 {
            animation: heroFadeUp 0.7s ease-out 0.45s both;
          }


          /* =====================================
             FLOATING ELEMENTS
          ====================================== */

          .soft-float {
            animation:
              softFloat
              5s
              ease-in-out
              infinite;
          }

          .soft-pulse {
            animation:
              pulseSoft
              6s
              ease-in-out
              infinite;
          }


          /* =====================================
             HERO WORDS
          ====================================== */

          .hero-word {
            display: inline-block;
            font-weight: 900;
            will-change: transform, color, text-shadow;
          }


          .word-learn {
            color: #79C74B;
            animation:
              learnGlow
              3.6s
              ease-in-out
              infinite;
          }


          .word-connect {
            color: #38BDF8;
            animation:
              connectGlow
              3.6s
              ease-in-out
              1.2s
              infinite;
          }


          .word-grow {
            color: #F4B942;
            animation:
              growGlow
              3.6s
              ease-in-out
              2.4s
              infinite;
          }


          /* =====================================
             MOBILE HERO WORDS
          ====================================== */

          @media (max-width: 640px) {

            .hero-words-container {
              gap: 0.45rem;
            }

          }


          /* =====================================
             REDUCE MOTION
          ====================================== */

          @media (prefers-reduced-motion: reduce) {

            .hero-word,
            .soft-float,
            .soft-pulse {
              animation: none !important;
            }

          }
        `}
      </style>


      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section className="relative min-h-[760px] overflow-hidden bg-ink text-paper">

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


        {/* MAIN DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/60
            via-black/30
            to-black/65
          "
        />


        {/* SIDE OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/30
            via-transparent
            to-black/25
          "
        />


        {/* CENTER READABILITY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/10
          "
        />


        {/* MOBILE OVERLAY */}

        <div className="absolute inset-0 bg-black/20 md:hidden" />


        {/* BACKGROUND DECORATION */}

        <div
          className="
            soft-pulse
            pointer-events-none
            absolute
            -left-32
            top-20
            h-96
            w-96
            rounded-full
            bg-sky-500/10
            blur-3xl
          "
        />

        <div
          className="
            soft-pulse
            pointer-events-none
            absolute
            -right-32
            bottom-20
            h-96
            w-96
            rounded-full
            bg-marigold/10
            blur-3xl
          "
        />


        {/* DECORATIVE LINES */}

        <div
          className="
            absolute
            bottom-0
            left-6
            top-0
            w-px
            bg-marigold/30
            md:left-10
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-[26px]
            top-0
            w-px
            bg-white/20
            md:left-[42px]
          "
        />


        {/* HERO CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[700px]
            max-w-6xl
            items-center
            justify-center
            px-6
            py-24
            text-center
            md:px-12
            lg:px-16
          "
        >

          <div className="flex max-w-4xl flex-col items-center">


            {/* LOGO */}

            <div className="hero-fade-1 mb-8 flex items-center gap-4">

              <div
                className="
                  soft-float
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
                  shadow-2xl
                  shadow-black/30
                "
              >

                <img
                  src={logo}
                  alt="ELMKUSOMA Logo"
                  className="
                    h-full
                    w-full
                    object-contain
                  "
                />

              </div>


              <div className="text-left">

                <h2
                  className="
                    font-display
                    text-xl
                    font-bold
                    tracking-wide
                    text-white
                    drop-shadow-lg
                  "
                >
                  ELMKUSOMA
                </h2>

                <p
                  className="
                    text-xs
                    tracking-wider
                    text-white/80
                  "
                >
                  DIGITAL EDUCATION PLATFORM
                </p>

              </div>

            </div>


            {/* SMALL LABEL */}

            <div
              className="
                hero-fade-2
                mb-6
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-marigold/50
                bg-black/25
                px-5
                py-2.5
                shadow-lg
                shadow-black/10
                backdrop-blur-md
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-marigold
                  shadow
                  shadow-marigold/60
                "
              />

              <p
                className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-marigold
                  sm:text-xs
                "
              >
                Tanzania Digital Education Platform
              </p>

            </div>


            {/* MAIN HEADING */}

            <h1
              className="
                hero-fade-2
                font-display
                text-4xl
                font-black
                leading-[1.08]
                text-white
                drop-shadow-2xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              Education without limits.
            </h1>


            {/* DESCRIPTION */}

            <p
              className="
                hero-fade-3
                mx-auto
                mt-7
                max-w-2xl
                text-base
                leading-relaxed
                text-white
                drop-shadow-lg
                md:text-lg
              "
            >
              ELMKUSOMA is a digital education platform designed to connect
              learners, teachers, parents and educational institutions in one
              place.

              <br />

              <br />

              Access learning opportunities, educational resources and digital
              tools from wherever you are.
            </p>


            {/* =====================================
                ANIMATED HERO WORDS
                ALL WORDS REMAIN VISIBLE
            ====================================== */}

            <div
              className="
                hero-words-container
                hero-fade-3
                mt-10
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-3
                gap-y-2
                sm:gap-x-5
                md:gap-x-7
              "
            >

              {/* LEARN */}

              <span
                className="
                  hero-word
                  word-learn
                  whitespace-nowrap
                  font-display
                  text-4xl
                  font-black
                  sm:text-5xl
                  md:text-6xl
                "
              >
                Learn.
              </span>


              {/* CONNECT */}

              <span
                className="
                  hero-word
                  word-connect
                  whitespace-nowrap
                  font-display
                  text-4xl
                  font-black
                  sm:text-5xl
                  md:text-6xl
                "
              >
                Connect.
              </span>


              {/* GROW */}

              <span
                className="
                  hero-word
                  word-grow
                  whitespace-nowrap
                  font-display
                  text-4xl
                  font-black
                  sm:text-5xl
                  md:text-6xl
                "
              >
                Grow.
              </span>

            </div>


            {/* BUTTONS */}

            <div
              className="
                hero-fade-4
                mt-12
                flex
                flex-col
                items-center
                justify-center
                gap-4
                sm:flex-row
              "
            >

              {/* GET STARTED */}

              <Link
                to="/register"
                className="
                  group
                  inline-flex
                  min-w-[190px]
                  items-center
                  justify-center
                  gap-4
                  rounded-2xl
                  bg-marigold
                  px-7
                  py-4
                  font-semibold
                  text-ink
                  shadow-xl
                  shadow-black/30
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-marigold-deep
                  hover:shadow-2xl
                "
              >

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white/80
                    text-sm
                    transition
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

                <span>
                  Get Started
                </span>

              </Link>


              {/* LEARN MORE */}

              <a
                href="#about"
                className="
                  group
                  inline-flex
                  min-w-[190px]
                  items-center
                  justify-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/60
                  bg-black/25
                  px-7
                  py-4
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-black/10
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:border-white
                  hover:bg-white/15
                "
              >

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    text-xs
                    transition
                    duration-300
                    group-hover:translate-y-1
                  "
                >
                  ↓
                </span>

                <span>
                  Learn More
                </span>

              </a>

            </div>


            {/* TRUST TEXT */}

            <div
              className="
                hero-fade-4
                mt-12
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                text-sm
                text-white/85
                drop-shadow
                sm:gap-6
              "
            >

              <span>
                Accessible anywhere
              </span>

              <span className="text-marigold">
                •
              </span>

              <span>
                Built for Tanzania
              </span>

              <span className="text-marigold">
                •
              </span>

              <span>
                One platform
              </span>

            </div>

          </div>

        </div>


        {/* BOTTOM MARQUEE */}

        <div
          className="
            relative
            z-10
            border-t
            border-white/25
            bg-black/35
            py-4
            backdrop-blur-md
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

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-10
            h-80
            w-80
            rounded-full
            bg-forest/5
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            -right-32
            h-80
            w-80
            rounded-full
            bg-marigold/10
            blur-3xl
          "
        />


        <div className="relative mx-auto max-w-6xl px-6 py-24">

          <div
            className="
              grid
              overflow-hidden
              rounded-3xl
              border
              border-forest/10
              shadow-lg
              transition
              duration-500
              hover:shadow-xl
              lg:grid-cols-2
            "
          >

            {/* LEFT SIDE */}

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

              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-paper/10" />

              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-paper/5" />

              <div className="pointer-events-none absolute bottom-10 right-10 h-20 w-20 rounded-full border border-marigold/20" />


              <div className="relative">

                <div className="mb-8 flex items-center gap-3">

                  <div className="h-px w-10 bg-marigold" />

                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold">
                    About ELMKUSOMA
                  </p>

                </div>


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


                <p className="mt-8 max-w-md leading-relaxed text-paper/70">
                  Connecting people, opportunities and educational resources
                  through one modern digital platform.
                </p>


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


            {/* RIGHT SIDE */}

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

                {/* OUR VISION */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-sky-100
                    bg-sky-50/70
                    p-6
                    transition
                    duration-300
                    hover:border-sky-200
                    hover:shadow-md
                  "
                >

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-sm font-bold text-white">
                      V
                    </div>

                    <div>

                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-700">
                        Our Vision
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Where we want education to go.
                      </p>

                    </div>

                  </div>


                  <p className="text-lg leading-relaxed text-ink">
                    ELMKUSOMA is built to make education more accessible,
                    connected and flexible.
                  </p>


                  <p className="mt-4 leading-relaxed text-muted">
                    We envision a modern digital environment where people can
                    access the opportunities, resources and information they
                    need throughout their educational journey.
                  </p>

                </div>


                {/* OUR MISSION */}

                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-forest/10
                    bg-forest/[0.03]
                    p-6
                    transition
                    duration-300
                    hover:border-forest/20
                    hover:shadow-md
                  "
                >

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-sm font-bold text-white">
                      M
                    </div>

                    <div>

                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-forest">
                        Our Mission
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        What we are working to achieve.
                      </p>

                    </div>

                  </div>


                  <p className="leading-relaxed text-muted">
                    To connect students, teachers, parents and educational
                    institutions through digital tools that make learning
                    opportunities easier to access, share and grow.
                  </p>

                </div>


                {/* MODERN TAGS */}

                <div className="mt-8 flex flex-wrap gap-3">

                  <span
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-forest/15
                      bg-white
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-forest
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-forest/30
                      hover:shadow-md
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-forest transition group-hover:scale-125" />
                    Accessible
                  </span>


                  <span
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-sky-200
                      bg-sky-50
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-sky-700
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-sky-300
                      hover:shadow-md
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-sky-500 transition group-hover:scale-125" />
                    Connected
                  </span>


                  <span
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-marigold/30
                      bg-marigold/10
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-ink
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-marigold/60
                      hover:shadow-md
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-marigold transition group-hover:scale-125" />
                    Future Ready
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          STATISTICS SECTION
      ====================================== */}

      <section className="relative overflow-hidden bg-white">

        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-forest/5 blur-3xl" />


        <div className="relative mx-auto max-w-6xl px-6 py-24">

          <div className="mb-14 text-center">

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-forest">
              ELMKUSOMA IN NUMBERS
            </p>

            <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">
              Building impact together.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
              One platform designed to connect different parts of the
              educational journey.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {STATS.map((stat) => (

              <div
                key={stat.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-forest/10
                  bg-white
                  p-7
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-xl
                "
              >

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    text-xl
                    transition
                    duration-300
                    group-hover:scale-110
                    ${
                      stat.color === 'green'
                        ? 'bg-forest/10 text-forest'
                        : ''
                    }
                    ${
                      stat.color === 'blue'
                        ? 'bg-sky-100 text-sky-700'
                        : ''
                    }
                    ${
                      stat.color === 'yellow'
                        ? 'bg-marigold/10 text-marigold-deep'
                        : ''
                    }
                    ${
                      stat.color === 'purple'
                        ? 'bg-purple-100 text-purple-600'
                        : ''
                    }
                  `}
                >
                  {stat.icon}
                </div>


                <p
                  className={`
                    mt-7
                    font-display
                    text-4xl
                    font-black
                    ${
                      stat.color === 'green'
                        ? 'text-forest'
                        : ''
                    }
                    ${
                      stat.color === 'blue'
                        ? 'text-sky-600'
                        : ''
                    }
                    ${
                      stat.color === 'yellow'
                        ? 'text-marigold-deep'
                        : ''
                    }
                    ${
                      stat.color === 'purple'
                        ? 'text-purple-600'
                        : ''
                    }
                  `}
                >
                  {stat.number}
                </p>


                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {stat.title}
                </h3>


                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {stat.description}
                </p>


                <div className="mt-6 h-px w-10 bg-forest/15 transition-all duration-300 group-hover:w-full" />

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          WHY ELMKUSOMA
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

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />


        <div className="relative mx-auto max-w-6xl px-6 py-24">

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


                <h3 className="mt-7 font-display text-xl font-semibold leading-snug text-ink">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>


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
                    group-hover:scale-110
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
                      transition-all
                      duration-300
                      hover:gap-3
                      hover:text-ink
                    "
                  >
                    Get Started

                    <span>
                      →
                    </span>

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
                      transition-all
                      duration-300
                      hover:gap-3
                      hover:text-ink
                    "
                  >
                    Explore Schools

                    <span>
                      →
                    </span>

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

        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-marigold/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-forest/5 blur-3xl" />


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
                rounded-xl
                bg-forest
                px-8
                py-4
                font-semibold
                text-paper
                shadow-lg
                transition
                duration-300
                hover:-translate-y-1
                hover:bg-ink
                hover:shadow-xl
              "
            >
              Create an Account
            </Link>


            <Link
              to="/login"
              className="
                rounded-xl
                border
                border-forest/20
                bg-white
                px-8
                py-4
                font-semibold
                text-ink
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:bg-forest/5
                hover:shadow-md
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
