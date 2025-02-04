// Btns
let allBtns = [...document.querySelectorAll(".calc__btn")];
const btnNumbers = [...document.querySelectorAll(".btn-num")];
const allClearBtn = document.querySelector(".clear-ac")
const oneClearBtn = document.querySelector(".clear-c")

// Displays
const calcDisplayContainer = document.querySelector(".calc__display")
const calcDisplayWidth = calcDisplayContainer.offsetWidth;
const calculationDisplayContainer = document.querySelector(".calc__display__calculation-container");
const calculationDisplayText = document.querySelector(".calc__display__calculation-text");
const calculationDisplayEqualSign = document.querySelector(".calc__display__calculation-equal-sign");
const resultContainer = document.querySelector(".calc__display__result")
let resultContainerFontSize = window.getComputedStyle(resultContainer).fontSize;
let resultContainerWidth;


// Welcome
const welcomeText = document.querySelector(".calc__welcome-text");

// Mod Displays
// const plusMinusSign = document.querySelector(".calc__display__calculation-minus-sign")
let equalSignWidth = calculationDisplayEqualSign.getBoundingClientRect().width;
calculationDisplayContainer.style.paddingLeft = equalSignWidth + "px";

let negNumber = false;

// Display brackets
const brackets = [...document.querySelectorAll(".bracket-line-container")];

// Current Numbers
let newDigit;
let allNewDigits = "";
let liveResult;

// Operators
let btnsFoldedOut = false;

// Calculations
let calcObjectArr = [];

// Keyboard
const foldOutBtnContainers = [];

const extraButtons = {
    operatorBtns: {
        parentContainer: document.querySelector(".calc__keyboard__operators"),
        btnTexts: ["/", "x", "-", "+"],
        elClass: ["btn-op"],
        elements: []
    },
    restBtns: {
        parentContainer: document.querySelector(".calc__keyboard__extras"),
        btnTexts: ["±", "%"],
        elClass: ["btn-plus-minus", "btn-op btn-reminder"],
        elements: []
    },
    deleteBtns: {
        parentContainer: document.querySelector(".calc__keyboard__deletes"),
        btnTexts: ["ac", "c"],
        elClass: ["clear clear-ac", "clear clear-c"],
        elements: []
    }
}

function createCalcObject(baseValue, newValue, newValueString, operator, opSym) {
    return {
        baseValue: baseValue,
        newValue: newValue,
        newValueString: newValueString,
        operator: operator,
        opSym: opSym,
        sum: operator(baseValue, newValue)
    }
}

function runCalculator() {
    let calcObjectAtEnd = calcObjectArr.at(-1);
    // console.log(calcObjectAtEnd);
    calcObjectAtEnd.sum = calcObjectAtEnd.operator(parseFloat(calcObjectAtEnd.baseValue), calcObjectAtEnd.newValue);
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
        let currentNewDigit = object.newValue < 0 ? `(${object.newValueString})` : object.newValueString;
        console.log("cur dig", currentNewDigit);
        console.log(calcObjectArr);

        if (i < 1 && currentNewDigit === undefined) {
            calcDisplayCalc = "";
            negNumber = false;
        } else if (i < 1) {
            console.log("drum");
            calcDisplayCalc = `${currentNewDigit}`
        } else if (object.newValue === undefined) {
            console.log("undefined");
            calcDisplayCalc += ` ${object.opSym}`
        } else {
            calcDisplayCalc += ` ${object.opSym} ${currentNewDigit}`
        }
        console.log("i is ", i);
    }
    console.log(calcDisplayCalc);
    calculationDisplayText.textContent = calcDisplayCalc;

    // if (i < 1 && object.newValue === undefined && object.opSym === "-") {
    //     console.log("damn");
    //     calcDisplayCalc += `${object.baseValue} ${object.opSym} `
    // } else 

    console.log(calcObjectArr);

    if (calcObjectArr.length > 1 && calcObjectArr.at(-1).newValue !== undefined) {
        calculationDisplayEqualSign.classList.add("show")
    } else {
        calculationDisplayEqualSign.classList.remove("show")

    }

    liveResult = latestCalcObject.sum ?? latestCalcObject.baseValue;

    // console.log(Number.isNaN(liveResult));

    if (Number.isNaN(liveResult)) {
        console.log("Number is NaN");
    } else if (resultContainer.textContent !== liveResult.toString()) {
        console.log("this is going on");
        let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
        resultContainer.classList.add("fade")

        setTimeout(() => {
            resultContainer.classList.remove("fade", "mini")

            liveResult = Math.round(liveResult * 100) / 100;
            resultContainer.textContent = liveResult;

            resultContainer.addEventListener("transitionend", e => {
                resultContainerWidth = resultContainer.getBoundingClientRect().width;

                if (resultContainerWidth + 70 > calcDisplayWidth) {
                    resultContainerFontSize = parseInt(window.getComputedStyle(resultContainer).fontSize);
                    console.log("currentFontSize", resultContainerFontSize);
                    resultContainer.style.fontSize = resultContainerFontSize - 4 + "px";
                    // resultContainer.style.fontSize = 
                }
            })
        }, fadeTime);
    }
    negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";

    // console.log(calcObjectArr);
}

function clearCalc() {
    resultContainer.classList.add("mini");
    resultContainer.addEventListener("transitionend", foldUp, true);    
        // operatorsOpen = false;
}

function foldUp() {
    newDigit = "";
    allNewDigits = "";
    calcObjectArr = [];
    calculationDisplayText.textContent = "";
    resultContainer.textContent = "";
    calculationDisplayEqualSign.classList.remove("show")
    negNumber = false;
    flipExtraBtns()
    resultContainer.removeEventListener("transitionend", foldUp, true);
}

function clearOneCalc() {
    // negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";

    allNewDigits = "";
    console.log(calcObjectArr.length);
    let currentObjectNewValue = calcObjectArr.at(-1).newValue;
    let currentObjectNewValueLength = currentObjectNewValue.toString().length
    console.log(currentObjectNewValue);
    console.log(currentObjectNewValueLength);

    if (currentObjectNewValueLength > 1) {
        let newValueString = String(currentObjectNewValue).slice(0, -1);
        console.log(newValueString);
        if (newValueString === "-") {
            calcObjectArr.at(-1).newValueString = undefined;
            allNewDigits = ""
            calcObjectArr.at(-1).newValue = undefined;
        } else {
            allNewDigits = newValueString;
            calcObjectArr.at(-1).newValueString = newValueString;

            let newNumber = Number(newValueString)
            calcObjectArr.at(-1).newValue = newNumber;
        }



        runCalculator()

        // console.log(newNumber);
    } else if (calcObjectArr.length === 1) {
        console.log("here");
        // allNewDigits = "0"
        let buttonZero = document.querySelector(".btn-zero")
        console.log(buttonZero);
        calcObjectArr.pop()
        regNum(buttonZero)
        // clearCalc()
    } else {
        calcObjectArr.pop()

    }

}

function regNum(btn) {

    newDigit = btn.textContent;

    console.log(allNewDigits.length);

    if (newDigit === "." && allNewDigits.includes(".")) {
        console.log("it includes a dot");
    } else if (allNewDigits.length > 0 && allNewDigits.charAt(0) === "0" && allNewDigits.charAt(1) !== ".") {
        allNewDigits += newDigit;
        console.log("we are slicing");
        console.log(allNewDigits.charAt(1));
        allNewDigits = allNewDigits.slice(1)
    } else {
        allNewDigits += newDigit;
    }

    let negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    let negOrNotString = negNumber ? `-${allNewDigits}` : allNewDigits;
    // console.log(negOrNotString);
    // console.log(negOrNotDigits);

    if (calcObjectArr.length === 0) {
        calcObjectArr.push(createCalcObject(0, negOrNotDigits, negOrNotString, add, "+"))
    }

    calcObjectArr[calcObjectArr.length - 1].newValue = negOrNotDigits;
    calcObjectArr[calcObjectArr.length - 1].newValueString = negOrNotString;

    if (!btnsFoldedOut) {
        flipExtraBtns()

        welcomeText.classList.add("fly-out")
        welcomeText.addEventListener("transitionend", e => {
            welcomeText.remove();
        })
        // operatorsOpen = true;
    } else {
        runCalculator()
    }
    console.log(calcObjectArr);
}

function plusMinus() {
    negNumber = !negNumber;
    compiledDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    negOrNotString = negNumber ? `-${allNewDigits}` : allNewDigits;
    calcObjectArr[calcObjectArr.length - 1].newValue = compiledDigits;
    calcObjectArr[calcObjectArr.length - 1].newValueString = negOrNotString;

    runCalculator()
}

const makeNegNumberOrNot = (allNewDigits, negNumber) => parseFloat(negNumber ? `-${allNewDigits}` : allNewDigits);

function opSymbol(btn) {
    let opSym = btn.textContent;
    let previousObject = calcObjectArr[calcObjectArr.length - 1]

    negNumber = false;
    console.log(negNumber);
    console.log(opSym);

    allNewDigits = "";
    let operator
    if (opSym === "-") {
        operator = sub;
    } else if (opSym === "x" || opSym === "*") {
        operator = multiply;
    } else if (opSym === "%") {
        operator = reminder;
    } else if (opSym === "/") {
        operator = divide;
    } else { operator = add; }

    let newCalcObject = createCalcObject(calcObjectArr.at(-1).sum, undefined, undefined, operator, opSym);
    console.log(calcObjectArr.at(-1).sum);
    console.log(previousObject);
    console.log(newCalcObject);

    if (calcObjectArr.length === 1 && newCalcObject.opSym === "-") {
        calcObjectArr.push(newCalcObject)
    } else if (newCalcObject.newValue === previousObject.newValue || newCalcObject.newValue === undefined
        && newCalcObject.baseValue === previousObject.baseValue && newCalcObject.opSym !== previousObject.opSym) {
        console.log("write over last object");
        console.log(calcObjectArr);
        newCalcObject.baseValue = calcObjectArr.at(-1).sum;
        calcObjectArr[calcObjectArr.length - 1] = newCalcObject;
    } else if (JSON.stringify(newCalcObject) !== JSON.stringify(previousObject)) {
        calcObjectArr.push(newCalcObject)
    }
}

function add(a, b) { return a + b; }

function sub(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

function reminder(a, b) { return a % b; }

let allOpButtons = []
const decimalBtn = document.querySelector(".btn-decimal")

function createKeyboardOperators() {

    for (let key in extraButtons) {

        let container = extraButtons[key].parentContainer;
        foldOutBtnContainers.push(container)
        let allSymbols = extraButtons[key].btnTexts;
        let elClasses = extraButtons[key].elClass;

        allSymbols.forEach((symbol, i) => {
            let wrapper = document.createElement("div");
            wrapper.className = "calc__btn-wrapper";
            let element = document.createElement("div");
            element.textContent = symbol;
            let uniqueClassName = elClasses[i] ? elClasses[i] : elClasses[0];
            element.className = `calc__btn ${uniqueClassName} btn-fold-out`

            wrapper.append(element)
            container.append(wrapper)
        })
    }


}

createKeyboardOperators()

const plusMinusBtn = document.querySelector(".btn-plus-minus")

let buttonEventsForOpsMade = false;

function flipExtraBtns() {
    brackets.forEach(bracket => {
        bracket.classList.toggle("grow")
    })

    let animTime = 200;
    allOpButtons = [...document.querySelectorAll(".btn-fold-out")];

    if (btnsFoldedOut) {
        console.log("were folding back");
        animTime = animTime / 2;
        for (let i = allOpButtons.length - 1; i >= 0; i--) {
            allOpButtons[i].style.animationDuration = animTime + "ms";
            allOpButtons[i].style.animationDelay = animTime * (allOpButtons.length - i) + "ms"
            allOpButtons[i].classList.remove("fold-out")
            allOpButtons[i].classList.add("fold-in")
        }
    } else {
        for (let i = 0; i < allOpButtons.length; i++) {
            allOpButtons[i].style.animationDuration = animTime + "ms";
            allOpButtons[i].style.animationDelay = animTime * i + "ms"
            allOpButtons[i].classList.remove("fold-in")
            allOpButtons[i].classList.add("fold-out")
        }
    }

    decimalBtn.classList.toggle("hidden")
    btnsFoldedOut = !btnsFoldedOut;

    if (!buttonEventsForOpsMade) {
        makeButtonEventsOps(allOpButtons)
        buttonEventsForOpsMade = true;

    }


}

function makeButtonEventsOps(allOpButtons) {
    allOpButtons.forEach(btn => {

        btn.addEventListener("click", (e) => {
            btn.classList.contains("clear-ac") && clearCalc();
            btn.classList.contains("clear-c") && clearOneCalc();
            btn.classList.contains("btn-plus-minus") && plusMinus(btn);
            btn.classList.contains("btn-op") && opSymbol(btn);
            // btn.classList.contains("btn-reminder") && opSymbol(btn);

            if (calcObjectArr.length > 0) {
                displayCalcAndSum()
            }
        })

    })
}

// console.log(allBtns);