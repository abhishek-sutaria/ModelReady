import { Link } from 'react-router-dom'
import { projects, site } from '../data/content'

export function Projects() {
  return (
    <article className="article">
      <header>
        <h1 className="page-title">Selected Projects</h1>
      </header>

      <div className="list">
        {projects.map((project) => (
          <div className="list-item" key={project.name}>
            <div className="list-item-header">
              <h2 className="list-item-title">
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-link"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h2>
              <span className="list-item-meta">{project.year}</span>
            </div>
            <p className="list-item-summary">{project.summary}</p>
          </div>
        ))}
      </div>

      <div className="list-footer">
        Full profile:{' '}
        <a
          href={site.links.github}
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-link"
        >
          GitHub
        </a>
        {' · '}
        <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-link">
          Resume
        </a>
        {' · '}
        <Link to="/experience" className="inline-link">
          Experience
        </Link>
      </div>
    </article>
  )
}
