// `name` is a brand name shown as is, or { uz, ru } when it needs translating.
// Icons are white on the brand color unless iconBg/iconFg say otherwise.
export const skills = [
  { id: 'html', name: 'HTML5', level: 90, icon: 'html5', color: '#E34F26' },
  { id: 'css', name: 'CSS3', level: 85, icon: 'css3', color: '#1572B6' },
  { id: 'js', name: 'JavaScript', level: 80, icon: 'javascript', color: '#E8C400' },
  { id: 'react', name: 'React', level: 75, icon: 'react', color: '#149ECA' },
  { id: 'figma', name: 'Figma', level: 80, icon: 'figma', color: '#F24E1E' },
  {
    id: 'photoshop',
    name: 'Photoshop',
    level: 70,
    icon: 'photoshop',
    color: '#31A8FF',
    // Adobe's own look: light blue "Ps" on dark navy, letters zoomed to fill the circle
    iconBg: '#001E36',
    iconFg: '#31A8FF',
    iconBox: '3.5 3 18 18',
  },
  { id: 'node', name: 'Node.js', level: 65, icon: 'node', color: '#5FA04E' },
  { id: 'python', name: 'Python', level: 60, icon: 'python', color: '#3776AB' },
  { id: 'bots', name: { uz: 'Telegram botlar', ru: 'Telegram-боты' }, level: 75, icon: 'telegram', color: '#26A5E4' },
  { id: 'git', name: 'Git / GitHub', level: 70, icon: 'git', color: '#F05032' },
]
