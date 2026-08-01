import { education, experience, site } from '../data/content'

export function Experience() {
  return (
    <article className="article">
      <header>
        <h1 className="page-title">Experience</h1>
      </header>

      <div className="list">
        {experience.map((job) => (
          <div className="list-item" key={`${job.org}-${job.role}`}>
            <div className="list-item-header">
              <div className="list-item-title">
                <h2 className="experience-role">{job.role}</h2>
                <p className="experience-org">
                  {job.href ? (
                    <a
                      href={job.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-link"
                    >
                      {job.org}
                    </a>
                  ) : (
                    job.org
                  )}
                </p>
              </div>
              <span className="list-item-meta">{job.dates}</span>
            </div>
            <p className="list-item-summary">{job.summary}</p>
          </div>
        ))}
      </div>

      <header>
        <h2 className="section-title">Education</h2>
      </header>

      <div className="list">
        <div className="list-item">
          <div className="list-item-header">
            <div className="list-item-title">
              <h2 className="experience-role">{education.graduate.degree}</h2>
              <p className="experience-org">{education.graduate.school}</p>
            </div>
            <span className="list-item-meta">{education.graduate.dates}</span>
          </div>
          <p className="list-item-summary">GPA {education.graduate.gpa}</p>
        </div>
        <div className="list-item">
          <div className="list-item-header">
            <div className="list-item-title">
              <h2 className="experience-role">{education.undergrad.degree}</h2>
              <p className="experience-org">{education.undergrad.school}</p>
            </div>
            <span className="list-item-meta">{education.undergrad.dates}</span>
          </div>
          <p className="list-item-summary">GPA {education.undergrad.gpa}</p>
        </div>
      </div>

      <div className="list-footer">
        <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-link">
          Download resume (PDF)
        </a>
      </div>
    </article>
  )
}
