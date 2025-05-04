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
    let button = e.target;
    let currentText = solutionDisplayContent.textContent;
    let currentTextLength = currentText.length;
    
    if (button.textContent === OPERATORS.CLEAR) {
        clear();
    } 
    else if (button.textContent === OPERATORS.MODULO) {
        if (hasOperatorSelected) {
            let operatorIndex = currentText.search(/[÷×−+]/);
            if (operatorIndex + 1 !== currentText.length) {
                let secondNum = Number(currentText.slice(operatorIndex + 1));
                currentText = currentText.slice(0, operatorIndex + 1) + percentage(secondNum);
                displaySolution(currentText);
            }
        } 
        else {
            solutionDisplayContent.textContent = currentText + "%";
            let solution = percentage(currentText);
            displaySolution(solution)
        }
    }
    else if (button.textContent === OPERATORS.NEGATE) {
        if (hasOperatorSelected) {
            let operatorIndex = currentText.search(/[÷×−+]/);
            if (operatorIndex + 1 !== currentText.length) {
                let secondNum = Number(currentText.slice(operatorIndex + 1));
                currentText = currentText.slice(0, operatorIndex + 1) + negate(secondNum);
                displaySolution(currentText);
            }
        }
        else {
            solutionDisplayContent.textContent = currentText + "%";
            let solution = negate(currentText);
            displaySolution(solution)
        }
    }
    else if (button.className === "operator") {
        if (hasOperatorSelected) {
            let operatorIndex = currentText.search(/[÷×−+]/);
            if (operatorIndex + 1 !== currentText.length) {
                let firstNum = Number(currentText.slice(0, operatorIndex));
                let secondNum = Number(currentText.slice(operatorIndex + 1));
                let operator = currentText.slice(operatorIndex, operatorIndex + 1);
                let solution = operate(firstNum, secondNum, operator);

                displaySolution(solution)
                displayChar(button.textContent);
                displayPreviousEquation(firstNum + operator + secondNum);
            }
            else {
                displaySolution(currentText.slice(0, operatorIndex));
                displayChar(button.textContent);
            }
        }
        else {
            let operator = button.textContent;
            hasOperatorSelected = true;
            displayChar(operator); 
        }
    }
    else if (currentTextLength < MAX_SOLUTION_LENGTH) {
        let character = button.textContent;
        displayChar(character);
    }
})



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
    switch (operator) {
        case '+': return add(num1, num2);
        case '−': return subtract(num1, num2);
        case '×': return multiply(num1, num2);
        case '÷': return divide(num1, num2);
    }
}
