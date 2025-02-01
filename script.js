// Btns
let allBtns = [...document.querySelectorAll(".calc__btn")];
const btnNumbers = [...document.querySelectorAll(".btn-num")];
const allClearBtn = document.querySelector(".clear-ac")
const oneClearBtn = document.querySelector(".clear-c")

// Displays
const calculationDisplayContainer = document.querySelector(".calc__display__calculation-container");
const calculationDisplayText = document.querySelector(".calc__display__calculation-text");
const calculationDisplayEqualSign = document.querySelector(".calc__display__calculation-equal-sign");
const resultContainer = document.querySelector(".calc__display__result")

// Mod Displays
const plusMinusSign = document.querySelector(".calc__display__calculation-minus-sign")
let equalSignWidth = calculationDisplayEqualSign.getBoundingClientRect().width;
calculationDisplayContainer.style.paddingLeft = equalSignWidth + "px";

let negNumber = false;

// Current Numbers
let newDigit;
let allNewDigits = "";
let liveResult;

// Operators
let newOpSymbol = "+";

// Calculations
let calcObjectArr = [];

// Keyboard
const calcBtnWrappers = [...document.querySelectorAll(".calc__btn-wrapper")]
let deleteBtnTexts = ["ac", "c"];
let operatorBtnTexts = ["%", "/", "x", "-", "+"]
let allExtraBtns = deleteBtnTexts.concat(operatorBtnTexts);
console.log(allExtraBtns);
let operatorsOpen = false;



function createCalcObject(base, newValue, operator, opSym) {
    return {
        base: base,
        new: newValue,
        operator: operator,
        opSym: opSym,
        sum: operator(base, newValue)
    }
}

function runCalculator() {
    let calcObjectAtEnd = calcObjectArr.at(-1);
    calcObjectAtEnd.sum = calcObjectAtEnd.operator(calcObjectAtEnd.base, calcObjectAtEnd.new);

}

function operate(num1, num2, operator) {
    return parseFloat(operator(num1, num2))
}

function makeButtonEventsNumbers(allBtns) {
    btnNumbers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            btn.classList.contains("btn-num") && regNum(btn);
        displayCalcAndSum()
        
        })
    })
}

makeButtonEventsNumbers(allBtns)



function displayCalcAndSum() {
    let calcDisplayCalc = "";
    let latestCalcObject = calcObjectArr.at(-1);

    for (let i = 0; i < calcObjectArr.length; i++) {
        let object = calcObjectArr[i];
        let currentNewDigit = object.new < 0 ? `(${object.new})` : object.new;

        if (i < 1) {
            calcDisplayCalc = `${currentNewDigit}`
        } else if (object.new === undefined) {
            calcDisplayCalc += ` ${object.opSym}`
        } else {
            calcDisplayCalc += ` ${object.opSym} ${currentNewDigit}`
        }
    }
    calculationDisplayText.textContent = calcDisplayCalc;

    if (latestCalcObject.sum === Infinity || 
        latestCalcObject.new === undefined ||
        (latestCalcObject.opSym === "x" && latestCalcObject.new === 0)) {
        console.log("display last sum");
        liveResult = calcObjectArr.at(-2).sum
    } else {
        liveResult = latestCalcObject.sum
    }

    if (calcObjectArr.length > 1 && calcObjectArr[1].new !== 0) {
        calculationDisplayEqualSign.classList.add("show")
    }

    if (resultContainer.textContent != liveResult) {
        let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
        resultContainer.classList.add("fade")

        setTimeout(() => {
            resultContainer.classList.remove("fade")
            resultContainer.classList.remove("mini")

            liveResult = Math.round(liveResult * 100) / 100;
            resultContainer.textContent = liveResult;
        }, fadeTime);
    }
    console.log(calcObjectArr);
}


function clearCalc() {
    newDigit = "";
    allNewDigits = "";
}

function clearOneCalc() {
    allNewDigits = "";
    let currentObjectEntryNumber = calcObjectArr.at(-1).new
    if (currentObjectEntryNumber === 0) {
        calcObjectArr.pop()
        currentObjectEntryNumber = calcObjectArr.at(-1).new
        let newNumber = Number(String(currentObjectEntryNumber).slice(0, -1))
        calcObjectArr.at(-1).new = newNumber;
        console.log("0000");
    } else if (currentObjectEntryNumber < 10) {
        calcObjectArr.at(-1).new = 0;

        console.log("its under 10");
    } else {
        let newNumber = Number(String(currentObjectEntryNumber).slice(0, -1))
        calcObjectArr.at(-1).new = newNumber;
        console.log(newNumber);
    }
    runCalculator()
    console.log(currentObjectEntryNumber);
}

function regNum(btn) {

    newDigit = btn.textContent;
    allNewDigits += newDigit;
    console.log(allNewDigits);

    let compiledDigits = makeCompleteNumber(allNewDigits, negNumber)

    if (calcObjectArr.length === 0) {
        calcObjectArr.push(createCalcObject(0, compiledDigits, add, "+"))
    }

    calcObjectArr[calcObjectArr.length - 1].new = compiledDigits;

    if (!operatorsOpen) {
        showKeyboardOperators()
        operatorsOpen = true;
    } else {
        runCalculator()

    }

}

function plusMinus() {
    negNumber = !negNumber;
    compiledDigits = makeCompleteNumber(allNewDigits, negNumber)
    calcObjectArr[calcObjectArr.length - 1].new = compiledDigits;

    runCalculator()
}



const makeCompleteNumber = (allNewDigits, negNumber) => parseFloat(negNumber ? `-${allNewDigits}` : allNewDigits);

function opSymbol(btn) {
    let opSym = btn.textContent;
    let previousObject = calcObjectArr[calcObjectArr.length - 1]

    negNumber = false;
    console.log(negNumber);

    allNewDigits = "";
    let operator
    if (opSym === "-") {
        operator = sub;
    } else if (opSym === "x" || opSym === "*") {
        operator = multiply;
    } else if (opSym === "/") {
        operator = divide;
    } else { operator = add; }

    let newCalcObject = createCalcObject(calcObjectArr.at(-1).sum, undefined, operator, opSym);

    console.log(previousObject);
    console.log(newCalcObject);

    if (newCalcObject.new === previousObject.new && newCalcObject.base === previousObject.base && newCalcObject.opSym !== previousObject.opSym) {
        calcObjectArr[calcObjectArr.length - 1] = newCalcObject;
    } else if (JSON.stringify(newCalcObject) !== JSON.stringify(previousObject)) {
        calcObjectArr.push(newCalcObject)
    }
}


function add(a, b) { return a + b; }

function sub(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

let allOpButtons = []


function showKeyboardOperators() {
    console.log("this");
    calcBtnWrappers.forEach((wrapper, i) => {
        let element = document.createElement("div");
        let text = allExtraBtns[i]
        let animTime = 200;

        if (i < 2) {
            element.className = `calc__btn clear-${text}`
            text = text.toUpperCase()
        } else {
            element.classList.add("calc__btn", "btn-op", "op-add")
        }

        element.textContent = text;
        wrapper.append(element)
        element.style.animationDuration = animTime + "ms"
        element.style.animationDelay = animTime * i + "ms";
        element.classList.add("fold-down")   
    })
    allOpButtons = [...document.querySelectorAll(".calc__btn")];
    makeButtonEventsOps(allOpButtons)
}



function makeButtonEventsOps(allOpButtons) {
    allOpButtons.forEach(btn => {

        btn.addEventListener("click", (e) => {
            btn.classList.contains("clear-ac") && clearCalc();
            btn.classList.contains("clear-c") && clearOneCalc();
            btn.classList.contains("btn-plus-minus") && plusMinus(btn);
            btn.classList.contains("btn-op") && opSymbol(btn);
    
            displayCalcAndSum()
    
            console.log(allNewDigits);
    
        })
    })
}

