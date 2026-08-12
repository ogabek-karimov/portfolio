const expressionEl = document.getElementById('expression')
const resultEl = document.getElementById('result')

let current = '0'
let previous = null
let operator = null
let justEvaluated = false

function updateDisplay() {
  resultEl.textContent = current
  expressionEl.textContent = previous !== null ? `${previous} ${symbolFor(operator)}` : ''
}

function symbolFor(action) {
  return { add: '+', subtract: '−', multiply: '×', divide: '÷' }[action] || ''
}

function inputNumber(num) {
  if (justEvaluated) {
    current = num
    justEvaluated = false
    return
  }
  current = current === '0' ? num : current + num
}

function inputDecimal() {
  if (justEvaluated) {
    current = '0.'
    justEvaluated = false
    return
  }
  if (!current.includes('.')) current += '.'
}

function chooseOperator(action) {
  if (operator && previous !== null && !justEvaluated) {
    evaluate()
  }
  previous = current
  operator = action
  current = '0'
  justEvaluated = false
}

function evaluate() {
  if (operator === null || previous === null) return
  const a = parseFloat(previous)
  const b = parseFloat(current)
  let result = 0

  switch (operator) {
    case 'add':
      result = a + b
      break
    case 'subtract':
      result = a - b
      break
    case 'multiply':
      result = a * b
      break
    case 'divide':
      result = b === 0 ? 0 : a / b
      break
  }

  current = String(Math.round(result * 1e10) / 1e10)
  previous = null
  operator = null
  justEvaluated = true
}

document.querySelectorAll('.key').forEach((btn) => {
  btn.addEventListener('click', () => {
    const num = btn.dataset.num
    const action = btn.dataset.action

    if (num !== undefined) {
      inputNumber(num)
    } else if (action === 'decimal') {
      inputDecimal()
    } else if (action === 'clear') {
      current = '0'
      previous = null
      operator = null
      justEvaluated = false
    } else if (action === 'sign') {
      current = String(parseFloat(current) * -1)
    } else if (action === 'percent') {
      current = String(parseFloat(current) / 100)
    } else if (action === 'equals') {
      evaluate()
    } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
      chooseOperator(action)
    }

    updateDisplay()
  })
})

updateDisplay()
