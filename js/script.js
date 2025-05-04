const MAX_SOLUTION_LENGTH = 9;
const OPERATORS = {
    ADD: "+",
    SUBTRACT: "−",
    MULTIPLY: "×",
    DIVIDE: "÷",
    MODULO: "%",
    NEGATE: "±",
    CLEAR: "AC",
    EQUALS: "="
};


let solutionDisplayContent = document.querySelector('.solution-display');
const equationDisplayContent = document.querySelector('.equation');
const buttons = document.querySelector('.buttons');

solutionDisplayContent.textContent = "";
let hasOperatorSelected = false;
let equation = {
    num1: 0, 
    num2: 0,
    operator: "",
}

buttons.addEventListener('click', (e) => {
    const button = e.target;
    const label  = button.textContent;
    
    if (button.classList.contains('selected')) {
        resetSelectedOperator();
    }
    else if (label === OPERATORS.CLEAR) {
        handleClear();
    } 
    else if (label === OPERATORS.MODULO) {
        handleUnary(percentage);
    }
    else if (label === OPERATORS.NEGATE) {
        handleUnary(negate);
    }
    else if (button.className === "operator") {
        handleOperatorInput(label, button);
    }
    else if (button.className === "equals") {
        handleEquals();
    }
    
    else {
        // anything else is a digit/decimal point
        handleDigitInput(label);
    }
})

function handleClear() {
    resetEquation();
    clearSolutionDisplay();
    clearPreviousEquation();
    resetSelectedOperator();
}

function handleUnary(fn) {
        // replace solution display with full result
        const text = solutionDisplayContent.textContent;
        const result = fn(Number(text));
        displaySolution(result);
}

function handleOperatorInput(label, button) {
    // if no operator has been selected before current one, clear and allow
    // user to enter second operand. changes color of selected operator
    if (!hasOperatorSelected) {
        button.classList.add('selected');
        
        // store operator and num1 for use later
        equation.operator = label;
        equation.num1 = Number(solutionDisplayContent.textContent);
        
        // clear display and set status
        displaySolution("");
        hasOperatorSelected = true;
    }
    else {
        // if this is second operator, compute solution and deselect prior
        // operator
        equation.num2 = Number(solutionDisplayContent.textContent);
        const solution = operate(equation.num1, equation.num2, equation.operator);

        displaySolution(solution);
        displayPreviousEquation(equation.num1, equation.num2, equation.operator);
        resetSelectedOperator();
        resetEquation(solution);
    }
}

function resetEquation(solutionOfPrevious = 0) {
    equation.operator = "";
    hasOperatorSelected = false;
    equation.num1 = solutionOfPrevious;
    equation.num2 = 0
}

function resetSelectedOperator() {
    const selectedButton = buttons.querySelector('.selected');
    selectedButton.classList.remove('selected');
    hasOperatorSelected = false;
}

function clearSolutionDisplay() {
    solutionDisplayContent.textContent = '';
}

function clearPreviousEquation() {
    equationDisplayContent.textContent = '';
}


function handleEquals() {
    if (!hasOperatorSelected) return;
    
    equation.num2 = Number(solutionDisplayContent.textContent);
    let solution = operate(equation.num1, equation.num2, equation.operator);

    displaySolution(solution);
    displayPreviousEquation(equation.num1, equation.num2, equation.operator);
    resetSelectedOperator();
}

function handleDigitInput(char) {
    if (solutionDisplayContent.textContent.length < MAX_SOLUTION_LENGTH) {
        displayChar(char);
    }
}

function displayChar(char) {
    solutionDisplayContent.textContent += char;
}

function displaySolution(solutionText) {
    solutionDisplayContent.textContent = solutionText;
}

function displayPreviousEquation(num1, num2, operator) {
    equationDisplayContent.textContent = `${num1}${operator}${num2}`;
}

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function percentage(num) {
    return num / 100;
}

function negate(num) {
    return -(num);
}

function operate (num1, num2, operator) {
    let solution; 
    
    switch (operator) {
        case '+': 
            solution = add(num1, num2);
            break;
        case '−': 
            solution = subtract(num1, num2);
            break;
        case '×': 
            solution = multiply(num1, num2);
            break;
        case '÷':
            solution = divide(num1, num2);
            break;
    }
    
    return solution;
}
