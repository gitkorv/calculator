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

let calcResultsArray = [];
let calcWholeNumbers = [];
let operatorRun = [];
let individualDigits = [];
let decimal = false;
let numberBuilder;
let liveCalcResult;
let activeOperator = add;
let tempResult;
let previousCalcDisplayText;
let previousCalcDisplayTextBeforeDot;
let lastOperatorSymbol;
const allOperatorSymbols = ["+", "-", "x", "/", "%"];
let joinedDigits;
let calcDisplayArray = []
let joinedCalcDisplayArray;
let calcSumsArray = []
let negDigit = false;
let minusSign = "";

let calcWholeNumbersLength;
let calcResultArrayLength;


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
        btn.classList.contains("btn-plus-minus") ? minusPlus = true : minusPlus = false;


        btn.classList.contains("btn-op") && opNum(btn, numberBuilder);

        numberBuilder = parseFloat(individualDigits.reduce((acc, number) => acc * 1 + number, 0));

        
        joinedCalcDisplayArray = calcDisplayArray.join("")

        calculationDisplayText.textContent = joinedCalcDisplayArray;

    })
})

function clearOneCalc() {
    individualDigits.pop()
    if (decimal) {
        calculationDisplayText.textContent = previousCalcDisplayTextBeforeDot;
        decimal = false;
    } else {
        calculationDisplayText.textContent = previousCalcDisplayText;
    }

}

function opNum(btn) {
    lastOperatorSymbol = btn.textContent;

    if (allOperatorSymbols.some(symbol => ` ${symbol} ` === calcDisplayArray[calcDisplayArray.length - 1])) {
        console.log("its two ops in row");
        calcDisplayArray[calcDisplayArray.length - 1] = ` ${lastOperatorSymbol} `;
    } else {
        calcDisplayArray.push(` ${lastOperatorSymbol} `)
    }
    individualDigits = []
    // calcWholeNumbers.push(parseFloat(joinedDigits))
    joinedDigits;

    if (btn.textContent === "-") { activeOperator = subtract } else { activeOperator = add; }
}
function plusMinus() {

    let currentDigits = individualDigits;
    console.log(currentDigits);

    if (currentDigits.length === 0) {
        console.log("its 0");
        currentDigits.push("-")
    } else if (currentDigits.length === 1 && currentDigits[0] === "-") {
        console.log("its 1");
        currentDigits.shift()
    } else if (currentDigits.length > 1 && currentDigits[0] === "-") {
        console.log("its over 1");
        currentDigits.shift()
    } else {
        currentDigits.unshift("-")
    }

    if (currentDigits.length !== 0) {
        individualDigits = currentDigits;   
    }

    joinedDigits = individualDigits.join("")

    if (individualDigits.length < 2 && calcDisplayArray.length >= 2) {
        calcDisplayArray.push(joinedDigits)
        calcWholeNumbers.push(parseFloat(joinedDigits))
    } else {
        console.log("here");
        calcDisplayArray[calcDisplayArray.length - 1] = joinedDigits;
        calcWholeNumbers[calcWholeNumbers.length - 1] = parseFloat(joinedDigits);
    }
}

function regNum(btn) {
    let digit = btn.textContent
    previousCalcDisplayText = calculationDisplayText.textContent;


    individualDigits.push(digit)
    joinedDigits = individualDigits.join("")
    if (individualDigits.length < 2) {
        calcDisplayArray.push(joinedDigits)
        calcWholeNumbers.push(parseFloat(joinedDigits))
    } else {
        console.log("here");
        calcDisplayArray[calcDisplayArray.length - 1] = joinedDigits;
        calcWholeNumbers[calcWholeNumbers.length - 1] = parseFloat(joinedDigits);
    }
}

function calcLiveResult(totalTypedNow) {

}

function displayCalculation(totalTypedNow) {

}

function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

// console.log(add(2,-8));

function clearCalc() {
    individualDigits = []
    joinedDigits;
    calcDisplayArray = []
    joinedCalcDisplayArray;
}