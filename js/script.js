const MAX_SOLUTION = 999999999;
const OPERATORS = {
    ADD: "+",
    SUBTRACT: "−",
    MULTIPLY: "×",
    DIVIDE: "÷",
    MODULO: "%",
    NEGATE: "±",
    BACKSPACE: "DEL",
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
let equation = {
    num1: 0,
    num2: 0,
    operator: "",
}

let solutionDisplayContent = document.querySelector('.solution-display');
let hasOperatorSelected = false;
let hasDecimalSelected = false;
let hasSolutionDisplayed = false;

const equationDisplayContent = document.querySelector('.equation');
const buttons = document.querySelector('.buttons');
solutionDisplayContent.textContent = "";

buttons.addEventListener("click", onEvent);
document.addEventListener("keydown", (e) => {
    const keyMap = {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%",
        ".": ".",
        "Enter": "=",
        "=": "=",
        "Backspace": "DEL",
        "Clear": "AC",
        "Escape": "AC"
    };
    
    if (keyMap[e.key]) {
        // Find button matching the key
        const matchingButton = [...document.querySelectorAll("button")]
            .find(btn => btn.textContent === keyMap[e.key]);

        if (matchingButton) {
            // Fabricate a mock event
            const fakeEvent = { target: matchingButton };
            onEvent(fakeEvent);
        }
    }
});

function onEvent(event) {
    const currentButton = event.target;
    const currentButtonLabel  = currentButton.textContent;
    const currentSolutionDisplayText   = solutionDisplayContent.textContent;
    const clearAndBackspaceButton = document.querySelector('.clear');

    // If an operator is already selected, clear it
    if (currentButton.classList.contains('selected')) {
        resetSelectedOperator();
        displayPreviousEquation(equation.num1, "", "")
        return;
    }
    
    // Clear currentButton
    if (currentButtonLabel === OPERATORS.CLEAR) {
        handleClear();
        return;
    }

    // For modulo, negate or equals, do nothing if display is empty
    if ([OPERATORS.MODULO, OPERATORS.NEGATE, OPERATORS.EQUALS, OPERATORS.BACKSPACE].includes(currentButtonLabel)
        && !currentSolutionDisplayText) {

        return;
    }
    
    if (currentButtonLabel === OPERATORS.BACKSPACE) {
        handleBackspace();
    }

    // Unary operations
    if (currentButtonLabel === OPERATORS.MODULO || currentButtonLabel === OPERATORS.NEGATE) {
        handleUnary(currentButtonLabel);
        return;
    }

    // Equals
    if (currentButtonLabel === OPERATORS.EQUALS) {
        handleEquals();
        hasSolutionDisplayed = true;
    }

    // Decimal
    if (currentButtonLabel === OPERATORS.DECIMAL) {
        handleDecimal(currentButtonLabel);
    }

    // Binary operators (+, −, ×, ÷)
    if (currentButton.classList.contains('operator')) {
        handleOperatorInput(currentButtonLabel, currentButton);
    }

    // Digits
    if (currentButton.classList.contains('number')) {
        if (hasSolutionDisplayed) {
            clearSolutionDisplay();
            hasSolutionDisplayed = false;
            resetDecimalSelected();
        }
        handleDigitInput(currentButtonLabel);
    }
    
    if (solutionDisplayContent.textContent.length > 0 && !(hasSolutionDisplayed)) {
        clearAndBackspaceButton.textContent = OPERATORS.BACKSPACE;
    }
    else {
        clearAndBackspaceButton.textContent = OPERATORS.CLEAR;
    }
}

function handleClear() {
    resetEquation();
    clearSolutionDisplay();
    clearPreviousEquation();
    resetSelectedOperator();
    resetDecimalSelected();
}

function handleBackspace() {
    let currentText = solutionDisplayContent.textContent;
    solutionDisplayContent.textContent = currentText.substring(0, currentText.length - 1);
}

function handleUnary(label) {
        // replace solution display with full result
        let num = solutionDisplayContent.textContent;
        const result = operate(label, num);
        displaySolution(result);
}

function handleEquals() {
    // do nothing if no operator yet
    if (!hasOperatorSelected) return;
    
    // compute solution
    equation.num2 = Number(solutionDisplayContent.textContent);
    let solution = operate(equation.operator, equation.num1, equation.num2);

    // Set displays and reset for next equation
    displaySolution(solution);
    displayPreviousEquation(equation.num1, equation.num2, equation.operator);
    resetSelectedOperator();
    resetEquation(solution);
    if (!checkDecimal(solution)) {
        resetDecimalSelected()
    }
}

function handleDecimal() {
    if (!hasDecimalSelected) {
        hasDecimalSelected = true;
        handleDigitInput(OPERATORS.DECIMAL);
    }
}

function handleOperatorInput(label, button) {
    const currentSolutionText = solutionDisplayContent.textContent;
    // if no operator has been selected before current one, clear and allow
    // user to enter second operand. changes color of selected operator
    if (!hasOperatorSelected) {
        if (solutionDisplayContent.textContent.length > 0) {
            // highlight selected operator
            button.classList.add('selected');
            hasOperatorSelected = true;
            
            // assigns equation vars
            equation.operator = label;
            equation.num1 = Number(currentSolutionText);
            
            // clear solution display and move to previous equation display
            clearSolutionDisplay();
            resetDecimalSelected();
            displayPreviousEquation(equation.num1, "", label);
        }
    }
    else {
        // if this is second operator and display is empty, user probably
        // wants to change the operator
        if (currentSolutionText.length === 0) {
            // deselect prior operator
            resetSelectedOperator();
            
            // select current operator
            button.classList.add('selected');
            equation.operator = label;
            hasOperatorSelected = true;

            // update operator on previous equation display
            displayPreviousEquation(equation.num1, "", equation.operator);
        }
        else {
            // otherwise compute solution and chain to next operator
            equation.num2 = Number(currentSolutionText);
            const solutionString = operate(equation.operator, equation.num1, equation.num2);
            const solution = Number(solutionString);
            
            // reset solution display and operator
            if (!checkDecimal(solutionString)) {
                resetDecimalSelected()
            }
            resetSelectedOperator();
            resetEquation(solution);
            clearSolutionDisplay();
            
            // update selected operator with new operator
            hasOperatorSelected = true;
            button.classList.add('selected');
            
            // start new equation
            equation.operator = label;
            equation.num1 = solution;
            displayPreviousEquation(equation.num1, "", equation.operator);
        }
    }
}

function checkDecimal(numString) {
    return !!numString.includes(".");
}

function resetEquation(solutionOfPrevious = 0) {
    equation.operator = "";
    hasOperatorSelected = false;
    equation.num1 = solutionOfPrevious;
    equation.num2 = 0
}

function resetDecimalSelected() {
    hasDecimalSelected = false;
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
    let number = Number(num1);
    if (number > MAX_SOLUTION) {
        number = number.toExponential(2);
    }
    equationDisplayContent.textContent = `${number}${operator}${num2}`;
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
