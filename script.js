// Btns
const allBtns = [...document.querySelectorAll(".calc__btn")];
const btnNumbers = [...document.querySelectorAll(".btn-num")];
const btnOperators = [...document.querySelectorAll(".btn-op")];
const allClearBtn = document.querySelector(".clear-ac")
const oneClearBtn = document.querySelector(".clear-c")
// Displays
const calculationDisplayContainer = document.querySelector(".calc__display__calculation-container");
const calculationDisplayTotalText = document.querySelector(".calc__display__calculation-total-text");
const calculationDisplayText = document.querySelector(".calc__display__calculation-text");
const calculationDisplayEqualSign = document.querySelector(".calc__display__calculation-equal-sign");
const resultContainer = document.querySelector(".calc__display__result")

// Mod Displays
const plusMinusSign = document.querySelector(".calc__display__calculation-minus-sign")
let equalSignWidth = calculationDisplayEqualSign.getBoundingClientRect().width;
// console.log(equalSignWidth);
calculationDisplayContainer.style.paddingLeft = equalSignWidth + "px";

let negNumber = false;

// Current Numbers
let newDigit;
let allNewDigits = "";

// Operators
let newOpSymbol = "+";

// Calc components


// let calcObject = {
//     base: 0,
//     new: 0,
//     operator: add,
//     sum: 0
// }

// console.log(calcObject);

let calcObjectArr = []

function createCalcObject(base, newValue, operator) {
    return {
        base: base,
        new: newValue,
        operator: operator,
        sum: operator(base, newValue)
    }
}

calcObjectArr.push(createCalcObject(0, 0, add))



function runCalculator() {
    let calcObjectAtEnd = calcObjectArr.at(-1);
    calcObjectAtEnd.sum = calcObjectAtEnd.operator(calcObjectAtEnd.base, calcObjectAtEnd.new);

}

function operate(num1, num2, operator) {
    return parseFloat(operator(num1, num2))
}

allBtns.forEach(btn => {

    btn.addEventListener("click", (e) => {
        let tempCalc;
        btn.classList.contains("clear-ac") && clearCalc();
        btn.classList.contains("clear-c") && clearOneCalc();
        btn.classList.contains("btn-num") && regNum(btn);
        btn.classList.contains("btn-plus-minus") && plusMinus(btn);
        // btn.classList.contains("btn-plus-minus") ? minusPlus = true : minusPlus = false;
        btn.classList.contains("btn-op") && opSymbol(btn);
        btn.classList.contains("btn-result") && equals(btn);

        let calcDisplayCalc = "";

        for (let i = 0; i < calcObjectArr.length; i++) {
            let object = calcObjectArr[i];
            console.log(object);
            let calcSymbol
            // if (object.operator == "undefined") calcSymbol = ""
            if (object.operator === add) calcSymbol = "+"
            if (object.operator === sub) calcSymbol = "-"
            console.log(calcSymbol);
            if (object.new !== 0) {
                if (i === 0) {
                    calcDisplayCalc += `${object.new} ${calcSymbol}` ;
    
                } else {
                    calcDisplayCalc += ` ${object.new} ${calcSymbol}` ;
                }
            }

            
        }

        calculationDisplayText.textContent = calcDisplayCalc;


        console.log(calcDisplayCalc);
        console.log(calcObjectArr);


        resultContainer.textContent = calcObjectArr.at(-1).sum
    })
})
function clearCalc() {
    newDigit = "";
    allNewDigits = "";
}

function clearOneCalc() {

}

function regNum(btn) {
    newDigit = btn.textContent;
    allNewDigits += newDigit;

    let compiledDigits = makeCompleteNumber(allNewDigits, negNumber)
    calcObjectArr[calcObjectArr.length -1].new = compiledDigits;
        runCalculator()

}

function plusMinus() {
    negNumber = !negNumber;
    compiledDigits = makeCompleteNumber(allNewDigits, negNumber)
    calcObjectArr[calcObjectArr.length -1].new = compiledDigits;
    runCalculator()
}



const makeCompleteNumber = (allNewDigits, negNumber) => parseFloat(negNumber ? `-${allNewDigits}` : allNewDigits);

function opSymbol(btn) {
    allNewDigits = "";
    newOpSymbol = btn.textContent;
    let operator
    if (newOpSymbol === "-") { operator = sub } else { operator = add; }
    calcObjectArr.push(createCalcObject(calcObjectArr.at(-1).sum, 0, add))
    calcObjectArr[calcObjectArr.length -1].operator = operator;


}



function equals() {
    return operate(calcObject.base, calcObject.new, calcObject.operator)

}

function add(a, b) { return a + b; }

function sub(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

// console.log(add(2,-8));

