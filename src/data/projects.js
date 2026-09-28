import todoImg from '../assets/project-todo.png'
import calculatorImg from '../assets/project-calculator.png'
import weatherImg from '../assets/project-weather.png'
import chorvabozorImg from '../assets/project-chorvabozor.png'

export const projectMeta = [
  {
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: todoImg,
    demo: '/portfolio/projects/todo-app/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/todo-app',
  },
  {
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: calculatorImg,
    demo: '/portfolio/projects/calculator/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/calculator',
  },
  {
    tags: ['JavaScript', 'Fetch API'],
    image: weatherImg,
    demo: '/portfolio/projects/weather-app/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/weather-app',
  },
  {
    tags: ['Cloudflare Workers', 'D1', 'React'],
    image: chorvabozorImg,
    demo: 'https://chorvabozor.bek8896ok.workers.dev',
    code: 'https://github.com/ogabek-karimov/livestock-marketplace',
  },
  {
    tags: ['Cloudflare Workers', 'Telegram Bot API', 'Cron'],
    icon: '🎥',
    code: 'https://github.com/ogabek-karimov/zoom-elon-bot',
  },
  {
    tags: ['Python', 'aiogram', 'Telegram Mini App'],
    icon: '📚',
    code: 'https://github.com/ogabek-karimov/talim-yordamchisi-bot',
  },
]

// Joins the language-independent meta with the translated title/description/chat.
export function localizeProjects(dict) {
  return projectMeta.map((meta, i) => ({ ...meta, ...dict.projects.items[i] }))
}
