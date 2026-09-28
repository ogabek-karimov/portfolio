import useInView from '../hooks/useInView'

// Shared section header: a scroll cue that draws down to the title, then the title
// with a dotted rule (or a framed title with `boxed`) and an optional mono subtitle.
function SectionHeading({ title, subtitle, boxed = false, as: Tag = 'h2' }) {
  const [ref, inView] = useInView(0.4)

  return (
    <header ref={ref} className={`section-heading${boxed ? ' is-boxed' : ''}${inView ? ' is-visible' : ''}`}>
      <span className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue-mouse" />
        <span className="scroll-cue-line" />
        <span className="scroll-cue-dot" />
      </span>
      <Tag className="section-heading-title">{title}</Tag>
      {!boxed && <span className="section-heading-rule" aria-hidden="true" />}
      {subtitle && <p className="section-heading-sub">{subtitle}</p>}
    </header>
  )
}

export default SectionHeading
