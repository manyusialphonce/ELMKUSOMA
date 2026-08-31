import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../stores/authStore';

// ==========================================
// LOGO
// ==========================================

import logo from '../assets/images/logo.png';


// ==========================================
// PUBLIC LAYOUT
// ==========================================

export default function PublicLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(query.trim())}`
      );

      setMobileMenuOpen(false);
    }
  };


  // ==========================================
  // GET USER ROLES
  // ==========================================

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : [];


  // ==========================================
  // GET DASHBOARD BY ROLE
  // ==========================================

  const getDashboardPath = () => {

    if (
      roles.some((role) =>
        [
          'admin',
          'super_admin',
          'school_admin',
          'ADMINISTRATOR',
          'SUPER_ADMINISTRATOR',
          'SCHOOL_ADMINISTRATOR',
        ].includes(role)
      )
    ) {
      return '/admin';
    }


    if (
      roles.some((role) =>
        ['teacher', 'TEACHER'].includes(role)
      )
    ) {
      return '/teacher';
    }


    if (
      roles.some((role) =>
        ['parent', 'PARENT'].includes(role)
      )
    ) {
      return '/parent';
    }


    return '/dashboard';
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setMobileMenuOpen(false);

      navigate('/', {
        replace: true,
      });
    }
  };


  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  return (
    <div className="flex min-h-screen flex-col bg-white">


      {/* =====================================
          NAVBAR
      ====================================== */}

      <header className="sticky top-0 z-50 border-b border-forest/15 bg-white/95 backdrop-blur">

        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">


          {/* =====================================
              LOGO
          ====================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex shrink-0 items-center gap-3"
          >

            <img
              src={logo}
              alt="ELMKUSOMA Logo"
              className="
                h-11
                w-11
                rounded-xl
                object-contain
              "
            />


            <div className="hidden sm:block">

              <h1 className="font-display text-lg font-bold text-ink">
                ELMKUSOMA
              </h1>

              <p className="text-[10px] text-muted">
                Digital Education Platform
              </p>

            </div>

          </Link>


          {/* =====================================
              SEARCH - DESKTOP
          ====================================== */}

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 max-w-xs flex-1 lg:block"
          >

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons, schools..."
              className="
                w-full
                min-w-0
                rounded-full
                border
                border-forest/25
                px-4
                py-2
                text-sm
                outline-none
                transition
                focus:border-forest
                focus:ring-2
                focus:ring-marigold/50
              "
            />

          </form>


          {/* =====================================
              NAVIGATION LINKS - DESKTOP
          ====================================== */}

          <div className="hidden items-center gap-5 whitespace-nowrap text-sm text-charcoal/80 xl:flex">


            <Link
              to="/"
              className="transition hover:text-forest"
            >
              Home
            </Link>


            <Link
              to="/schools"
              className="transition hover:text-forest"
            >
              Schools
            </Link>


            <Link
              to="/notes-library"
              className="transition hover:text-forest"
            >
              Notes Library
            </Link>


            <a
              href="/#about"
              className="transition hover:text-forest"
            >
              About
            </a>


          </div>


          {/* =====================================
              AUTH SECTION
          ====================================== */}

          <div className="flex shrink-0 items-center gap-3">


            {/* NOT LOGGED IN */}

            {!user ? (
              <>


                <Link
                  to="/login"
                  className="
                    hidden
                    text-sm
                    font-semibold
                    text-charcoal/80
                    transition
                    hover:text-forest
                    sm:block
                  "
                >
                  Login
                </Link>


                <Link
                  to="/register"
                  className="
                    hidden
                    rounded-lg
                    bg-marigold
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-ink
                    shadow-sm
                    transition
                    hover:bg-marigold-deep
                    sm:block
                  "
                >
                  Get Started
                </Link>


              </>
            ) : (
              <>


                {/* USER INFO */}

                <div className="hidden text-right 2xl:block">

                  <p className="max-w-[150px] truncate text-sm font-semibold text-ink">
                    {user.fullName}
                  </p>


                  <p className="text-xs capitalize text-muted">
                    {roles.join(', ')}
                  </p>

                </div>


                {/* DASHBOARD */}

                <Link
                  to={getDashboardPath()}
                  onClick={closeMobileMenu}
                  className="
                    hidden
                    rounded-lg
                    border
                    border-forest/20
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-forest
                    transition
                    hover:bg-forest/5
                    sm:block
                  "
                >
                  Dashboard
                </Link>


                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    hidden
                    rounded-lg
                    border
                    border-red-200
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-red-600
                    transition
                    hover:bg-red-50
                    md:block
                  "
                >
                  Logout
                </button>


              </>
            )}


            {/* =====================================
                MOBILE MENU BUTTON
            ====================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((open) => !open)
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-forest/20
                text-xl
                text-ink
                transition
                hover:bg-forest/5
                xl:hidden
              "
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >

              {mobileMenuOpen ? '×' : '☰'}

            </button>


          </div>

        </nav>


        {/* =====================================
            MOBILE / TABLET MENU
        ====================================== */}

        {mobileMenuOpen && (

          <div className="border-t border-forest/10 bg-white px-4 py-4 shadow-lg xl:hidden">

            <div className="mx-auto max-w-7xl">


              {/* SEARCH */}

              <form
                onSubmit={handleSearch}
                className="mb-4 lg:hidden"
              >

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lessons, schools..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-forest/25
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-forest
                    focus:ring-2
                    focus:ring-marigold/50
                  "
                />

              </form>


              {/* NAVIGATION */}

              <div className="space-y-1">


                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="
                    block
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-charcoal/80
                    transition
                    hover:bg-forest/5
                    hover:text-forest
                  "
                >
                  Home
                </Link>


                <Link
                  to="/schools"
                  onClick={closeMobileMenu}
                  className="
                    block
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-charcoal/80
                    transition
                    hover:bg-forest/5
                    hover:text-forest
                  "
                >
                  Schools
                </Link>


                <Link
                  to="/notes-library"
                  onClick={closeMobileMenu}
                  className="
                    block
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-charcoal/80
                    transition
                    hover:bg-forest/5
                    hover:text-forest
                  "
                >
                  Notes Library
                </Link>


                <a
                  href="/#about"
                  onClick={closeMobileMenu}
                  className="
                    block
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-charcoal/80
                    transition
                    hover:bg-forest/5
                    hover:text-forest
                  "
                >
                  About ELMKUSOMA
                </a>


              </div>


              {/* =====================================
                  MOBILE AUTH
              ====================================== */}

              <div className="mt-4 border-t border-forest/10 pt-4">


                {!user ? (

                  <div className="grid grid-cols-2 gap-3">


                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        border
                        border-forest/20
                        px-4
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-forest
                      "
                    >
                      Login
                    </Link>


                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        bg-marigold
                        px-4
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-ink
                      "
                    >
                      Get Started
                    </Link>


                  </div>

                ) : (

                  <div className="space-y-3">


                    {/* USER INFO */}

                    <div className="rounded-lg bg-forest/5 px-4 py-3">

                      <p className="font-semibold text-ink">
                        {user.fullName}
                      </p>


                      <p className="mt-1 text-xs capitalize text-muted">
                        {roles.join(', ')}
                      </p>

                    </div>


                    {/* DASHBOARD */}

                    <Link
                      to={getDashboardPath()}
                      onClick={closeMobileMenu}
                      className="
                        block
                        rounded-lg
                        bg-forest
                        px-4
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      Go to Dashboard
                    </Link>


                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-red-200
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      Logout
                    </button>


                  </div>

                )}


              </div>

            </div>

          </div>

        )}

      </header>


      {/* =====================================
          PAGE CONTENT
      ====================================== */}

      <main className="flex-1">

        <Outlet />

      </main>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="mt-16 border-t border-forest/15 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12">


          <div className="grid gap-10 md:grid-cols-3">


            {/* =================================
                BRAND
            ================================== */}

            <div>

              <div className="flex items-center gap-3">

                <img
                  src={logo}
                  alt="ELMKUSOMA Logo"
                  className="
                    h-12
                    w-12
                    rounded-xl
                    object-contain
                  "
                />


                <div>

                  <h3 className="font-display text-lg font-bold text-ink">
                    ELMKUSOMA
                  </h3>

                  <p className="text-xs text-muted">
                    Digital Education Platform
                  </p>

                </div>

              </div>


              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">

                Empowering learners, teachers, parents and educational
                institutions through technology.

              </p>

            </div>


            {/* =================================
                PLATFORM LINKS
            ================================== */}

            <div>

              <h4 className="font-display font-semibold text-ink">
                Platform
              </h4>


              <div className="mt-4 flex flex-col gap-3 text-sm text-muted">


                <Link
                  to="/"
                  className="transition hover:text-forest"
                >
                  Home
                </Link>


                <Link
                  to="/schools"
                  className="transition hover:text-forest"
                >
                  Schools
                </Link>


                <Link
                  to="/notes-library"
                  className="transition hover:text-forest"
                >
                  Notes Library
                </Link>


                <a
                  href="/#about"
                  className="transition hover:text-forest"
                >
                  About ELMKUSOMA
                </a>


              </div>

            </div>


            {/* =================================
                OUR MISSION
            ================================== */}

            <div>

              <h4 className="font-display font-semibold text-ink">
                Our Mission
              </h4>


              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">

                To make education more accessible, connected and flexible
                through digital technology.

              </p>


              <p className="mt-5 text-sm font-medium text-forest">

                Built for Tanzania.

              </p>

            </div>


          </div>


          {/* =================================
              COPYRIGHT
          ================================== */}

          <div className="
            mt-10
            flex
            flex-col
            gap-3
            border-t
            border-forest/10
            pt-6
            text-center
            md:flex-row
            md:items-center
            md:justify-between
          ">


            <p className="text-xs text-muted">

              © {new Date().getFullYear()} ELMKUSOMA.
              All rights reserved.

            </p>


            <p className="text-xs text-muted">

              Education without limits.

            </p>


          </div>


        </div>

      </footer>


    </div>
  );
}