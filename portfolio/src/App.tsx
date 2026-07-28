import { useEffect, useState } from 'react'
import {
  education,
  experience,
  projects,
  site,
  skillGroups,
} from './data/content'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <a className="brand" href="#top" onClick={closeMenu}>
          Abhishek<span>.</span>Sutaria
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a className="resume-link" href={site.resumeUrl} target="_blank" rel="noreferrer">
                Resume
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
        </button>
      </header>

      <div className={`mobile-nav${menuOpen ? ' is-open' : ''}`}>
        <a href="#about" onClick={closeMenu}>
          About
        </a>
        <a href="#experience" onClick={closeMenu}>
          Experience
        </a>
        <a href="#projects" onClick={closeMenu}>
          Projects
        </a>
        <a href="#skills" onClick={closeMenu}>
          Skills
        </a>
        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
        <a href={site.resumeUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
          Resume
        </a>
      </div>

      <main id="top">
        <section className="hero" aria-label="Introduction">
          <div className="hero-media" aria-hidden="true">
            <img src="/profile.jpg" alt="" />
          </div>
          <div className="hero-content">
            <h1 className="hero-brand">{site.name}</h1>
            <p className="hero-title">{site.title}</p>
            <p className="hero-copy">{site.tagline}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">
                Get in touch
              </a>
              <a className="btn btn-ghost" href={site.resumeUrl} target="_blank" rel="noreferrer">
                Download resume
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <p className="section-kicker">About</p>
          <h2 className="section-title">From market data pipelines to multi-agent AI.</h2>
          <p className="section-lead">
            I design and ship AI systems that hold up in production — tutoring agents, clinical
            Text-to-SQL, and large-scale data platforms — with a focus on latency, evaluation, and
            real user outcomes.
          </p>
          <div className="about-grid">
            <div className="about-photo">
              <img src="/portrait.jpg" alt="Abhishek Sutaria on a coastal boardwalk" />
            </div>
            <div>
              <p className="section-lead">
                Currently pursuing an MS in Data Science at Indiana University while building
                research and product systems across education, healthcare, and nonprofit analytics.
              </p>
              <div className="about-meta">
                <p>
                  <strong>Education</strong>
                  {education.degree}
                  <br />
                  {education.school} · {education.dates}
                  <br />
                  GPA {education.gpa}
                </p>
                <p>
                  <strong>Based in</strong>
                  {site.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <p className="section-kicker">Experience</p>
          <h2 className="section-title">Where the work happened.</h2>
          <p className="section-lead">
            Research engineering, applied AI, and data platforms across academia, startups, and
            markets.
          </p>
          <div className="timeline">
            {experience.map((job) => (
              <article className="job" key={`${job.org}-${job.role}`}>
                <div className="job-header">
                  <h3 className="job-role">{job.role}</h3>
                  <p className="job-org">{job.org}</p>
                  <p className="job-dates">{job.dates}</p>
                </div>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="projects">
          <p className="section-kicker">Selected work</p>
          <h2 className="section-title">Projects & wins.</h2>
          <p className="section-lead">
            A few systems and hackathon builds that show how I think about reliability, users, and
            measurable impact.
          </p>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.name}>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <p className="section-kicker">Skills</p>
          <h2 className="section-title">Tools I reach for.</h2>
          <p className="section-lead">
            Comfortable across the stack — from feature pipelines and vector search to agent
            orchestration and cloud deploy.
          </p>
          <div className="skills">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.label}>
                <h3>{group.label}</h3>
                <p>{group.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section contact" id="contact">
          <p className="section-kicker">Contact</p>
          <h2 className="section-title">Let’s build something useful.</h2>
          <div className="contact-panel">
            <p className="section-lead">
              Open to full-time AI / ML / data roles and collaborations. Reach me directly or
              connect on LinkedIn and GitHub.
            </p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a
                className="btn btn-ghost"
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn btn-ghost"
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.domain}</span>
      </footer>
    </>
  )
}

export default App
