import { NavLink, Outlet } from 'react-router-dom'
import { nav, site } from '../data/content'

function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={className} aria-label="Primary">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Layout() {
  return (
    <div className="shell">
      <header className="mobile-header">
        <NavLink to="/" className="brand">
          {site.initials}
        </NavLink>
        <NavLinks className="mobile-nav" />
      </header>

      <div className="shell-body">
        <aside className="sidebar">
          <div className="sidebar-inner">
            <NavLink to="/" className="brand brand-lg">
              {site.initials}
            </NavLink>
            <NavLinks className="sidebar-nav" />
          </div>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </div>
  )
}
