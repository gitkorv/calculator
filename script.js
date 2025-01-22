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

let calculationArray = [0, 0];
let individualDigits = [];
let decimal = false;
let numberBuilder;
let liveCalcResult;
let activeOperator = add;
let tempResult;
let storedResults = [0];
let previousCalcDisplayText;


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
        
        console.log(calculationArray);

        btn.classList.contains("btn-op") && opNum(btn, numberBuilder);

        numberBuilder = parseFloat(individualDigits.reduce((acc, number) => acc * 1 + number, 0));

        // liveCalcResult = operate(calculationArray.at(-2), calculationArray.at(-1), activeOperator)
        // console.log(liveCalcResult);
        tempResult = operate(calculationArray.at(-1), numberBuilder, activeOperator)
        console.log(parseFloat(tempResult));
        resultContainer.textContent = tempResult.toFixed(2);


    })
})

function clearOneCalc() {
    individualDigits.pop()
    calculationDisplayText.textContent = previousCalcDisplayText;
    // resultContainer.textContent = storedResults.at(-1)
    // console.log(calculationArray);
    // console.log(poppedDigits);
}

function opNum(btn, numberBuilder) {
    individualDigits = []
    storedResults.push(tempResult)
    calculationArray.push(tempResult);
    tempResult = [];
    numberBuilder = []
    console.log(calculationArray);

    calculationDisplayText.textContent += btn.textContent;


    // Get operator symbol from calc button

    if (btn.textContent === "-") {
        activeOperator = subtract
    } else {
        activeOperator = add;
    }
}
function plusMinus() {
    console.log(totalTypedNow);

}
function regNum(btn) {
    let digit = btn.textContent

    previousCalcDisplayText = calculationDisplayText.textContent;

    
    if (digit === ".") {
        console.log("its a dott");
        calculationDisplayText.textContent = calculationDisplayText.textContent += digit;
        decimal = true;
    } else if (decimal === true) {
        let decimalDigit = `.${digit}`;
        individualDigits.push(decimalDigit)
        calculationDisplayText.textContent = calculationDisplayText.textContent += digit;
        decimal = false;
    } else {
        individualDigits.push(digit)
        calculationDisplayText.textContent = calculationDisplayText.textContent += digit;

    }
    console.log(individualDigits);
    // individualDigits.push(btn)
    // console.log(thisNumber);
    // thisNumber = 0;


}

function calcLiveResult(totalTypedNow) {

}

function displayCalculation(totalTypedNow) {

}

function add(a, b) {return a + b;}

function subtract(a, b) {return a - b;}

function multiply(a, b) {return a * b;}

function divide(a, b) {return a / b;}

// console.log(add(2,-8));

function clearCalc() {

}