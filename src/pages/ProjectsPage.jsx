import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { localizeProjects } from '../data/projects'
import useDocumentTitle from '../hooks/useDocumentTitle'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import ProjectsBackdrop from '../components/ProjectsBackdrop'
import './SubPage.css'

function ProjectsPage() {
  const { dict } = useLanguage()
  useDocumentTitle(dict.projects.allTitle)
  const projects = localizeProjects(dict)

  return (
    <section className="subpage subpage-projects">
      <ProjectsBackdrop />
      <div className="container">
        <Link to="/" className="back-link">
          {dict.projects.backLink}
        </Link>

        <SectionHeading as="h1" title={dict.projects.allTitle} subtitle={dict.projects.allSubtitle} />

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard project={project} dict={dict} key={project.code} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsPage
