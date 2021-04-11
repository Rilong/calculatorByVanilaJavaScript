const $operations = document.querySelectorAll('[data-type="operation"]')
const $keyboard = document.getElementById('calc_keyboard')
const $display = document.getElementById('calc_value')

const ADD = 'add'
const SUBTRACT = 'subtract'
const MULTIPLY = 'multiply'
const DIVISION = 'division'
const PERCENT = 'percent'
const ADD_SUBTRACT = 'addSubtract'
const CLEAR = 'clear'
const EQUAL = 'equal'

let calculator = {
  prev: '0',
  current: '0',
  symbol: '',
  selectedOperation: null,
  isEqualTouched: false,
  hasError: false
}

function renderDisplay(number) {
  $display.innerText = number
}

function keyboardHandler(event) {
  const type = event.target.dataset.type
  const text = event.target.innerText
  const operation = event.target.dataset.operation

  highlightControl(type, operation)

  if (type === 'number') {
    calculator.isEqualTouched = false
    insertToDisplay(text)
  } else if (type === 'operation') {
    operationHandler(event.target.dataset.operation)
  }
}

function insertToDisplay(text) {
  text = text.replace(',', '.')

  if (calculator.selectedOperation && calculator.current && !calculator.isEqualTouched) {
    calculator = inverseNumbers(calculator)
    calculator = prepareForNextNumber(calculator.selectedOperation)
    renderDisplay(calculator.current)
  }

  renderDisplay(currentAppend(text))
}

function currentAppend(text) {
  if ((calculator.current === '0' && text !== '.') || calculator.hasError) {
    calculator.current = ''
  }

  return calculator.current += text
}

function prepareForNextNumber(operation) {
  return {
    ...calculator,
    symbol: operationSymbol(operation),
    current: '',
    selectedOperation: null,
  }
}

function operationHandler(operation) {
  switch (operation) {
    case ADD:
    case SUBTRACT:
    case MULTIPLY:
    case DIVISION:
      commonOperation()
      break
    case EQUAL:
      equalOperation()
      break
    case CLEAR:
      clearOperation()
      break
  }
}

function commonOperation() {
  if (calculator.symbol && calculator.isEqualTouched) {
    calculator.isEqualTouched = false
    calculator.symbol = ''
  }

  if (calculator.prev !== '0' && calculator.current !== '0' && calculator.symbol) {
    calculate(calculator.prev, calculator.current)
  }
}

function equalOperation() {
  const {prev, current} = calculator

  if (!calculator.isEqualTouched) {
    calculator.isEqualTouched = true
    calculator = inverseNumbers(calculator)
  }
  calculate(prev, current)
}

function clearOperation() {
  calculator = {
    prev: '0',
    current: '0',
    symbol: '',
    selectedOperation: null,
    isEqualPressed: false,
    hasError: false
  }
  renderDisplay('0')
}

function highlightControl(type, operation) {
  const highlightable = [ADD, SUBTRACT, MULTIPLY, DIVISION]
  const notHighlightable = [CLEAR, EQUAL]


  if (type === 'number') {
    highlightOperationOff()
    return
  }

  if (!operation) {
    return
  }

  if (highlightable.includes(operation)) {
    calculator.selectedOperation = operation
    highlightOperationOn(operation)
  }

  if (notHighlightable.includes(operation)) {
    highlightOperationOff()
  }
}

function operationSymbol(operation) {
  switch (operation) {
    case ADD:
      return '+'
    case SUBTRACT:
      return '-'
    case MULTIPLY:
      return '*'
    case DIVISION:
      return '/'
    default:
      return ''
  }
}

function calculate(num1, num2) {
  const {symbol} = calculator

  const result = eval(num1 + symbol + num2)
  if (result === Infinity) {
    calculator.hasError = true
    renderDisplay('Division By Zero')
    return
  }
  calculator.current = result.toString()
  renderDisplay(calculator.current)
}

function inverseNumbers(calc) {
  return {...calc, prev: calc.current}
}

function highlightOperationOn() {
  const {selectedOperation} = calculator

  if (selectedOperation === null) {
    return
  }

  highlightOperationOff()
  document.querySelector(`[data-operation="${selectedOperation}"]`).classList.add('active')
}

function highlightOperationOff() {
  $operations.forEach($op => $op.classList.remove('active'))
}

function calculatorInit() {
  $keyboard.addEventListener('click', keyboardHandler)
}

calculatorInit()
