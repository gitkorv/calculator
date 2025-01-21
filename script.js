// Btns
const allBtns = [...document.querySelectorAll(".calc__btn")];
const btnNumbers = [...document.querySelectorAll(".btn-num")];
const btnOperators = [...document.querySelectorAll(".btn-op")];
const allClearBtn = document.querySelector(".all-clear")
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

let totalTypedNow;
let typingTotalNumber;
let displayFormula;
let minusPlus = false;
let activeOperator = add;
let baseNumber = calculationArray[calculationArray.length - 2];
let newNumber = calculationArray[calculationArray.length - 1];
let liveCalcResult;
let calcDisplayAllValues = []
let numberLocked = false;
// let newNumber = 0;

function operate(num1, num2, operator) {
    return operator(num1, num2)
}

allBtns.forEach(btn => {

    btn.addEventListener("click", (e) => {
        let tempCalc;
        btn.classList.contains("op-all-clear") && clearCalc();
        btn.classList.contains("btn-num") && regNum(btn);
        btn.classList.contains("btn-op") && opNum(btn);
        btn.classList.contains("btn-plus-minus") && plusMinus(btn);
        btn.classList.contains("btn-plus-minus") ? minusPlus = true : minusPlus = false;
        console.log(calculationArray);
    })
})

function opNum(btn) {
    // Get operator symbol from calc button
    let operatorPick = btn.textContent;
    // Add operator symbol to calc array
    calculationArray.push(liveCalcResult);
    // Clear previous total number
    totalTypedNow = "";
    // Add operator symbol to calc display
    calculationDisplayText.textContent += operatorPick;

    if (operatorPick === "-") {
        activeOperator = subtract
    } else {
        activeOperator = add;
    }

}
function plusMinus() {
    console.log(totalTypedNow);

    // totalTypedNow = parseInt(`-${totalTypedNow}`)
    // calcLiveResult(parseInt(totalTypedNow))
    // console.log(currentNumbers);
    // plusMinusSign.classList.toggle("show");
    // console.log(calculationTotalText.textContent);
}
function regNum(btn) {

    // Get the pressed numbers text content
    let numberPick = btn.textContent;
    // If current number is empty set to button text content, otherwise add number to text content
    if (totalTypedNow === undefined) {
        totalTypedNow = numberPick;
    } else {
        totalTypedNow += numberPick;
    }

    if (minusPlus) {
        totalTypedNow = `-${totalTypedNow}`
    }
    // Add new numbers to calculation display
    // typingTotalNumber = numberPick;
    console.log(calcDisplayAllValues);


    totalTypedNow = parseInt(totalTypedNow)
    if (!numberLocked) {
        calcDisplayAllValues[calcDisplayAllValues.length -1] = totalTypedNow;
    } else {
        calcDisplayAllValues.push(totalTypedNow)

    }
    console.log(calcDisplayAllValues);



    displayCalculation(totalTypedNow)
    calculationDisplayText.textContent = totalTypedNow;


    calcLiveResult(parseInt(totalTypedNow))
    // console.log(baseNumber, newNumber);
}

function calcLiveResult(totalTypedNow) {
    liveCalcResult = operate(calculationArray.at(-1), totalTypedNow, activeOperator)
    resultContainer.textContent = liveCalcResult;

    // console.log(totalTypedNow + calculationArray.at(-1));
}

function displayCalculation(totalTypedNow) {
    calcDisplayAllValues[calcDisplayAllValues.length - 1] = totalTypedNow;

}

function add(a, b) {return a + b;}

function subtract(a, b) {return a - b;}

function multiply(a, b) {return a * b;}

function divide(a, b) {return a / b;}

// console.log(add(2,-8));

function clearCalc() {
    calculationDisplayText.textContent = "";
    resultContainer.textContent = "";
    totalTypedNow = "";
    plusMinusSign.classList.remove("show");
    calculationArray = [0, 0];
    baseNumber = calculationArray[calculationArray.length - 2];
    newNumber = calculationArray[calculationArray.length - 1];
    minusPlus = false;
    activeOperator = add;
}