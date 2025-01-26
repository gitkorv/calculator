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
let completeNumber;

// Operators
let newOpSymbol = "+";

// Calc components
let activeOperator = add;
let sum = 0;
let newNumber = 0;
let newTempResult
let calcDisplayArray = [0]
let digitBuilderArr = []
let allCompleteNumbers = []
let reverseBase = 0;


let calcObject = {
    base: 0,
    new: 0,
    operator: add
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

        console.log(calcDisplayArray);
        console.log(allCompleteNumbers);

        let displayCalculation = "";
        calcDisplayArray.forEach((num, i) => {
            Number(num) && num < 0 ? num = `(${num})` : num = num;
            i === 0 ? num = num : num = ` ${num}`;
            displayCalculation += num
        })
        calculationDisplayText.textContent = displayCalculation;

        console.log(calcDisplayArray);
        if (calcDisplayArray.length >= 3 && calcDisplayArray[calcDisplayArray.length -1].length !== 0 ) {
            calculationDisplayEqualSign.classList.add("show")

            if (resultContainer.textContent != newTempResult) {
                let resultFadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration);
                console.log("its not");
                resultContainer.classList.add("fade")
                setTimeout(() => {
                    resultContainer.textContent = newTempResult;
                    resultContainer.classList.remove("fade")
                }, resultFadeTime * 1000);
            } 
        } else {
            resultContainer.textContent = ""
        }
        // console.log(digitBuilderArr);
        console.log(calcObject);
        console.log(resultContainer.textContent, newTempResult);





    })
})
function clearCalc() {
    newDigit = "";
    allNewDigits = "";
    completeNumber;
}

function clearOneCalc() {
    allCompleteNumbers.pop()
    let reverseDigit = allCompleteNumbers.at(-1);
    console.log(reverseDigit);
    calcObject.new = reverseDigit;
    calcObject.base = reverseBase;

    if (calcDisplayArray.length > 1 && typeof calcDisplayArray[calcDisplayArray.length -1] === "number" ) {
        console.log("its a number");
        if (calcDisplayArray[calcDisplayArray.length - 1] - 9 > 0) {
            console.log(allCompleteNumbers);
            console.log(calcDisplayArray[calcDisplayArray.length - 1].length);
            calcDisplayArray[calcDisplayArray.length - 1] = allCompleteNumbers[allCompleteNumbers.length - 1];
        } else {
            calcDisplayArray.pop();
            allCompleteNumbers.pop()
        }

    }
    // calcDisplayArray.pop();

    newTempResult = operate(calcObject.base, calcObject.new, calcObject.operator);


}

function regNum(btn) {
    newDigit = btn.textContent;
    allNewDigits += newDigit;
    calcWithLastCompleteNumber(allNewDigits, negNumber)
}

function plusMinus() {
    negNumber = !negNumber;
    calcWithLastCompleteNumber(allNewDigits, negNumber)
}

function calcWithLastCompleteNumber(allNewDigits, negNumber) {
    completeNumber = makeCompleteNumber(allNewDigits, negNumber);
    calcDisplayArray[calcDisplayArray.length -1] = completeNumber;
    allCompleteNumbers.push(completeNumber)
    console.log(allCompleteNumbers);
    calcObject.new = completeNumber;
    digitBuilderArr.push(calcObject.new)
    newTempResult = operate(calcObject.base, calcObject.new, calcObject.operator);
}

const makeCompleteNumber = (allNewDigits, negNumber) => parseFloat(negNumber ? `-${allNewDigits}` : allNewDigits);

function opSymbol(btn) {    
    console.log(newOpSymbol);
    let oldOp = newOpSymbol;
    newOpSymbol = btn.textContent;

    if (newOpSymbol !== oldOp) {
        console.log("its the same");
    }


    calcObject.base = newTempResult;
    reverseBase = calcObject.base


    newDigit = "";
    allNewDigits = "";
    completeNumber = 0;
    console.log(btn.textContent);
    if (newOpSymbol === "-") { calcObject.operator = subtract } else { calcObject.operator = add; }

    calcObject.new = 0;
    calcDisplayArray.push(newOpSymbol)
    calcDisplayArray.push([])
    negNumber = false;


    // if (newOpSymbol === oldOp || newOpSymbol === undefined) {
    // }

}



function equals() {
    return operate(calcObject.base, calcObject.new, calcObject.operator)

}

function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

// console.log(add(2,-8));

