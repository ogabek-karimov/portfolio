const STORAGE_KEY = 'todo-app-tasks'

const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const emptyState = document.getElementById('empty-state')
const itemsLeft = document.getElementById('items-left')
const clearCompletedBtn = document.getElementById('clear-completed')
const filterButtons = document.querySelectorAll('.filter-btn')

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
let currentFilter = 'all'

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function render() {
  list.innerHTML = ''

  const filtered = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.done
    if (currentFilter === 'completed') return task.done
    return true
  })

  filtered.forEach((task) => {
    const li = document.createElement('li')
    li.className = `todo-item ${task.done ? 'completed' : ''}`

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked
      save()
      render()
    })

    const span = document.createElement('span')
    span.textContent = task.text

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '✕'
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id)
      save()
      render()
    })

    li.append(checkbox, span, deleteBtn)
    list.appendChild(li)
  })

  emptyState.style.display = filtered.length === 0 ? 'block' : 'none'
  itemsLeft.textContent = `${tasks.filter((t) => !t.done).length} ta vazifa qoldi`
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return

  tasks.push({ id: Date.now(), text, done: false })
  input.value = ''
  save()
  render()
})

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.done)
  save()
  render()
})

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    currentFilter = btn.dataset.filter
    render()
  })
})

render()
