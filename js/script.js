const MAX_SOLUTION = 999999999;
const OPERATORS = {
    ADD: "+",
    SUBTRACT: "−",
    MULTIPLY: "×",
    DIVIDE: "÷",
    MODULO: "%",
    NEGATE: "±",
    CLEAR: "AC",
    EQUALS: "=",
    DECIMAL: "."
};
const operations = {
    [OPERATORS.ADD]:      (a, b) => a + b,
    [OPERATORS.SUBTRACT]: (a, b) => a - b,
    [OPERATORS.MULTIPLY]: (a, b) => a * b,
    [OPERATORS.DIVIDE]:   (a, b) => a / b,
    [OPERATORS.MODULO]:   x       => x / 100,
    [OPERATORS.NEGATE]:   x       => -x,
};


let solutionDisplayContent = document.querySelector('.solution-display');
const equationDisplayContent = document.querySelector('.equation');
const buttons = document.querySelector('.buttons');

solutionDisplayContent.textContent = "";
let hasOperatorSelected = false;
let hasDecimalSelected = false;
let equation = {
    num1: 0, 
    num2: 0,
    operator: "",
}

buttons.addEventListener("click", onButtonClick);

function onButtonClick(e) {
    const button = e.target;
    const label  = button.textContent;
    const text   = solutionDisplayContent.textContent;

    // If an operator is already selected, clear it
    if (button.classList.contains('selected')) {
        resetSelectedOperator();
        return;
    }

    // Clear button
    if (label === OPERATORS.CLEAR) {
        handleClear();
        return;
    }

    // For modulo, negate or equals, do nothing if display is empty
    if ([OPERATORS.MODULO, OPERATORS.NEGATE, OPERATORS.EQUALS].includes(label) && !text) {
        return;
    }

    // Unary operations
    if (label === OPERATORS.MODULO) {
        handleUnary(percentage);
        return;
    }
    if (label === OPERATORS.NEGATE) {
        handleUnary(negate);
        return;
    }

    // Equals
    if (label === OPERATORS.EQUALS) {
        handleEquals();
        return;
    }

    // Decimal
    if (label === OPERATORS.DECIMAL) {
        if (hasDecimalSelected) {
            return;
        }
        else {
            hasDecimalSelected = true;
            handleDigitInput(label); 
        }
    }

    // Binary operators (+, −, ×, ÷)
    if (button.classList.contains('operator')) {
        handleOperatorInput(label, button);
        return;
    }

    // Digits
    if (button.classList.contains('number')) {
        handleDigitInput(label);
    }
}

function handleClear() {
    resetEquation();
    clearSolutionDisplay();
    clearPreviousEquation();
    resetSelectedOperator();
    hasDecimalSelected = false;
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
        if (solutionDisplayContent.textContent.length > 0) {
            button.classList.add('selected');

            // store operator and num1 for use later
            equation.operator = label;
            equation.num1 = Number(solutionDisplayContent.textContent);
            displayPreviousEquation(equation.num1, "", label);

            // clear display and set status
            displaySolution("");
            hasOperatorSelected = true;
        }
    }
    else {
        // if this is second operator and display is empty, user probably
        // wants to change the operator
        const currentSolutionText = solutionDisplayContent.textContent;
        if (currentSolutionText.length === 0) {
            resetSelectedOperator();
            button.classList.add('selected');
            equation.operator = label;

            // store operator for use later
            equation.operator = label;
            displayPreviousEquation(equation.num1, "", label);
            hasOperatorSelected = true;
        }
        else {
            // otherwise compute solution and deselect prior operator
            equation.num2 = Number(currentSolutionText);
            const solution = operate(equation.operator, equation.num1, equation.num2);

            displaySolution(solution);
            displayPreviousEquation(equation.num1, equation.num2, equation.operator);
            resetSelectedOperator();
            resetEquation(solution);
        }
        
        
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
    
    // check if no selected button to prevent errors
    if (selectedButton) {
        selectedButton.classList.remove('selected');
    }
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
    let solution = operate(equation.operator, equation.num1, equation.num2);

    displaySolution(solution);
    displayPreviousEquation(equation.num1, equation.num2, equation.operator);
    resetSelectedOperator();
}

function handleDigitInput(char) {
    if (solutionDisplayContent.textContent.length < String(MAX_SOLUTION).length){
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

function operate(operator, ...nums) {
    const operationFunction = operations[operator];
    let solution = operationFunction ? operationFunction(...nums) : undefined;
    
    if (solution > MAX_SOLUTION) {
        solution = solution.toExponential(2);
    }
    
    const s = String(solution);
    // if already fits, just return it
    if (s.length <= String(MAX_SOLUTION).length) return s;
    
    // split into integer and fractional parts
    const [intPart] = s.split('.');
    // how many decimals we can afford?
    let allowedDecimals = String(MAX_SOLUTION).length - intPart.length - 1;
    if (allowedDecimals < 0) {
        // integer part alone is too big—just truncate it
        return intPart.slice(0, String(MAX_SOLUTION).length);
    }

    // round to that many decimals
    let rounded = solution.toFixed(allowedDecimals);

    // drop any trailing zeros, and a trailing dot if it ends up there
    rounded = rounded.replace(/\.?0+$/, '');

    // safety: if rounding pushed it over the limit (e.g. 9.99 → “10.0”), truncate
    if (rounded.length > String(MAX_SOLUTION).length) {
        return rounded.slice(0, String(MAX_SOLUTION).length);
    }

    return rounded;
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
