const STORAGE_KEY = 'todo-app-tasks-v2'

const addBtn = document.getElementById('add-btn')
const tableView = document.getElementById('table-view')
const todoForm = document.getElementById('todo-form')
const formTitle = document.getElementById('form-title')
const cancelBtn = document.getElementById('cancel-btn')
const tbody = document.getElementById('todo-tbody')
const emptyState = document.getElementById('empty-state')
const itemsLeft = document.getElementById('items-left')
const clearCompletedBtn = document.getElementById('clear-completed')
const filterButtons = document.querySelectorAll('.filter-btn')

const fName = document.getElementById('f-name')
const fDesc = document.getElementById('f-desc')
const fCategory = document.getElementById('f-category')
const fDate = document.getElementById('f-date')
const fTime = document.getElementById('f-time')
const fPriority = document.getElementById('f-priority')
const fFulfillment = document.getElementById('f-fulfillment')
const fFulfillmentValue = document.getElementById('f-fulfillment-value')

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
let currentFilter = 'all'
let editingId = null

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function priorityClass(priority) {
  if (priority === 'Yuqori') return 'priority-yuqori'
  if (priority === "O'rta") return 'priority-orta'
  return 'priority-past'
}

function formatWhen(task) {
  if (!task.date && !task.time) return '-'
  const parts = []
  if (task.date) {
    const [y, m, d] = task.date.split('-')
    parts.push(`${d}.${m}.${y}`)
  }
  if (task.time) parts.push(task.time)
  return parts.join(' ')
}

function render() {
  tbody.innerHTML = ''

  const filtered = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.done
    if (currentFilter === 'completed') return task.done
    return true
  })

  filtered.forEach((task) => {
    const tr = document.createElement('tr')
    tr.className = task.done ? 'completed' : ''

    tr.innerHTML = `
      <td><input type="checkbox" class="check-btn" ${task.done ? 'checked' : ''} /></td>
      <td class="task-name">${escapeHtml(task.name)}</td>
      <td>${escapeHtml(task.desc || '-')}</td>
      <td>${escapeHtml(task.category || '-')}</td>
      <td>${formatWhen(task)}</td>
      <td><span class="priority-pill ${priorityClass(task.priority)}">${task.priority}</span></td>
      <td>${task.fulfillment}%</td>
      <td>
        <div class="row-actions">
          <button class="edit-icon" title="Tahrirlash">✏️</button>
          <button class="delete-icon" title="O'chirish">🗑️</button>
        </div>
      </td>
    `

    tr.querySelector('.check-btn').addEventListener('change', (e) => {
      task.done = e.target.checked
      save()
      render()
    })

    tr.querySelector('.edit-icon').addEventListener('click', () => openForm(task))
    tr.querySelector('.delete-icon').addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id)
      save()
      render()
    })

    tbody.appendChild(tr)
  })

  emptyState.style.display = filtered.length === 0 ? 'block' : 'none'
  itemsLeft.textContent = `${tasks.filter((t) => !t.done).length} ta vazifa qoldi`
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function openForm(task) {
  editingId = task ? task.id : null
  formTitle.textContent = task ? 'Vazifani tahrirlash:' : 'Yangi vazifa qo’shish:'

  fName.value = task ? task.name : ''
  fDesc.value = task ? task.desc : ''
  fCategory.value = task ? task.category : ''
  fDate.value = task ? task.date : ''
  fTime.value = task ? task.time : ''
  fPriority.value = task ? task.priority : "O'rta"
  fFulfillment.value = task ? task.fulfillment : 0
  fFulfillmentValue.textContent = `${fFulfillment.value}%`

  tableView.classList.add('hidden')
  todoForm.classList.remove('hidden')
  fName.focus()
}

function closeForm() {
  editingId = null
  todoForm.reset()
  todoForm.classList.add('hidden')
  tableView.classList.remove('hidden')
}

addBtn.addEventListener('click', () => openForm(null))
cancelBtn.addEventListener('click', closeForm)

fFulfillment.addEventListener('input', () => {
  fFulfillmentValue.textContent = `${fFulfillment.value}%`
})

todoForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = fName.value.trim()
  if (!name) return

  const data = {
    name,
    desc: fDesc.value.trim(),
    category: fCategory.value.trim(),
    date: fDate.value,
    time: fTime.value,
    priority: fPriority.value,
    fulfillment: Number(fFulfillment.value),
  }

  if (editingId) {
    tasks = tasks.map((t) => (t.id === editingId ? { ...t, ...data } : t))
  } else {
    tasks.push({ id: Date.now(), done: false, ...data })
  }

  save()
  closeForm()
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
