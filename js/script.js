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

buttons.addEventListener('click', (e) => {
    const button = e.target;
    const label  = button.textContent;
    
    if (label === OPERATORS.CLEAR) {
        handleClear();
    } 
    else if (label === OPERATORS.MODULO) {
        handleUnary(percentage);
    }
    else if (label === OPERATORS.NEGATE) {
        handleUnary(negate);
    }
    else if (button.className === "operator") {
        handleOperatorInput(label);
    }
    else if (button.className === "equals") {
        handleEquals();
    }
    
    else {
        // anything else is a digit/decimal point
        handleDigitInput(label);
    }
})

/**
 * Parse the current display into its parts.
 */
function getExpressionParts() {
    const text = solutionDisplayContent.textContent;
    const operatorIndex = text.search(/[÷×−+]/);
    const operator = text[operatorIndex];
    const firstNum = Number(text.slice(0, operatorIndex));
    const secondNum = Number(text.slice(operatorIndex + 1));
    return { text, operatorIndex, operator, firstNum, secondNum };
}

function handleClear() {
    clear();
}

function handleUnary(fn) {
    // e.g. fn = percentage or negate; appendSymbol is "%" or "+/−"
    const { text, operatorIndex } = getExpressionParts();

    if (hasOperatorSelected) {
        // only act if there's actually a second operand
        if (operatorIndex + 1 !== text.length) {
            const secondNum = Number(text.slice(operatorIndex + 1));
            const resultText = text.slice(0, operatorIndex + 1)
                + fn(secondNum);
            displaySolution(resultText);
        }
    } else {
        // show the symbol briefly, then compute full result
        solutionDisplayContent.textContent = text;
        const result = fn(Number(text));
        displaySolution(result);
    }
}

function handleOperatorInput(newOp) {
    const { text, operatorIndex, firstNum, secondNum, operator } = getExpressionParts();

    if (hasOperatorSelected) {
        if (operatorIndex + 1 !== text.length) {
            // compute existing then start new operator
            const solution = operate(firstNum, secondNum, operator);
            displaySolution(solution);
            displayChar(newOp);
            displayPreviousEquation(`${firstNum}${operator}${secondNum}`);
        } 
        else {
            // user changed their mind about operator
            displaySolution(text.slice(0, operatorIndex));
            displayChar(newOp);
        }
    } 
    else {
        hasOperatorSelected = true;
        displayChar(newOp);
    }
}


function handleEquals() {
    const { text, operatorIndex, firstNum, secondNum, operator } = getExpressionParts();

    if (!hasOperatorSelected) return;

    if (operatorIndex + 1 !== text.length) {
        const solution = operate(firstNum, secondNum, operator);
        displaySolution(solution);
        displayPreviousEquation(`${firstNum}${operator}${secondNum}`);
    } 
    else {
        // trailing operator—just roll back to firstNum
        displaySolution(text.slice(0, operatorIndex));
    }

    hasOperatorSelected = false;
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

function displayPreviousEquation(equationText) {
    equationDisplayContent.textContent = equationText;
}

function clear() {
    solutionDisplayContent.textContent = '';
    equationDisplayContent.textContent = '';
    hasOperatorSelected = false;
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
