import re

with open('apps/web/src/pages/home/HomeHeader.tsx', 'r') as f:
    content = f.read()

# 1. Import useAuth
if 'import { useAuth }' not in content:
    content = content.replace('import { Link, NavLink, useNavigate } from "react-router-dom";', 'import { Link, NavLink, useNavigate } from "react-router-dom";\nimport { useAuth } from "../../context/AuthContext";')

# 2. Add hook call
if 'const { isAuthenticated, user } = useAuth();' not in content:
    content = content.replace('const navigate = useNavigate();', 'const navigate = useNavigate();\n  const { isAuthenticated, user } = useAuth();')

# 3. Replace DESKTOP auth buttons
old_desktop = '''          {/* SIGN IN */}

          <Link
            to="/login"
            className="signin-link"
            onClick={closeMobileMenu}
          >
            Sign In
          </Link>

          {/* GET STARTED */}

          <Link
            to="/signup"
            className="header-get-started"
            onClick={closeMobileMenu}
          >
            Get Started
          </Link>'''

new_desktop = '''          {/* AUTH ACTIONS */}
          
          {isAuthenticated && user ? (
            <Link
              to="/dashboard"
              className="header-avatar"
              title={user.fullName}
              onClick={closeMobileMenu}
            >
              {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Link>
          ) : (
            <>
              {/* SIGN IN */}
              <Link
                to="/login"
                className="signin-link"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>

              {/* GET STARTED */}
              <Link
                to="/signup"
                className="header-get-started"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </>
          )}'''

content = content.replace(old_desktop, new_desktop)

# 4. Replace MOBILE auth buttons
old_mobile = '''        {/* SIGN IN */}

        <Link
          to="/login"
          onClick={closeMobileMenu}
        >
          Sign In
        </Link>

        {/* GET STARTED */}

        <Link
          to="/signup"
          className="mobile-start"
          onClick={closeMobileMenu}
        >
          Get Started
        </Link>'''

new_mobile = '''        {/* AUTH ACTIONS */}

        {isAuthenticated && user ? (
          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
          >
            Go to Dashboard ({user.fullName.split(' ')[0]})
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="mobile-start"
              onClick={closeMobileMenu}
            >
              Get Started
            </Link>
          </>
        )}'''

content = content.replace(old_mobile, new_mobile)

with open('apps/web/src/pages/home/HomeHeader.tsx', 'w') as f:
    f.write(content)

