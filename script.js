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

// Welcome
const welcomeText = document.querySelector(".calc__welcome-text");

// Mod Displays
const plusMinusSign = document.querySelector(".calc__display__calculation-minus-sign")
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
    console.log(calcObjectAtEnd.new);
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
    console.log(latestCalcObject);
    console.log(calcObjectArr);

    for (let i = 0; i < calcObjectArr.length; i++) {
        let object = calcObjectArr[i];
        let currentNewDigit = object.new < 0 ? `(${object.new})` : object.new;

        if (i < 1) {
            calcDisplayCalc = `${currentNewDigit}`
        } else if (object.new === undefined || object.new === 0) {
            calcDisplayCalc += ` ${object.opSym}`
        } else {
            calcDisplayCalc += ` ${object.opSym} ${currentNewDigit}`
        }
    }
    calculationDisplayText.textContent = calcDisplayCalc;

    if (latestCalcObject.sum === Infinity || latestCalcObject.sum === -Infinity ||
        latestCalcObject.new === undefined ||
        (latestCalcObject.opSym === "x" && latestCalcObject.new === 0)) {
        console.log("display last sum");
        liveResult = calcObjectArr.at(-2).sum
    } else {
        liveResult = latestCalcObject.sum
    }

    if (resultContainer.textContent != liveResult) {
        let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
        resultContainer.classList.add("fade")
        console.log("hereee");

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
    calcObjectArr = [];
    calculationDisplayText.textContent = "";

    // resultContainer.classList.add("fade", "mini")
    // resultContainer.addEventListener("transitionend", e => {
    //     resultContainer.textContent = "";
    //     resultContainer.classList.remove("fade", "mini")

    // })
    resultContainer.textContent = "";


    calculationDisplayEqualSign.classList.remove("show")
    flipExtraBtns()
    // operatorsOpen = false;
}

function clearOneCalc() {
    allNewDigits = "";
    let currentObjectEntryNumber = calcObjectArr.at(-1).new
    if (currentObjectEntryNumber === undefined) {
        calcObjectArr.pop()
        currentObjectEntryNumber = calcObjectArr.at(-1).new
        let newNumber = Number(String(currentObjectEntryNumber).slice(0, -1))
        calcObjectArr.at(-1).new = newNumber;
        console.log("0000");
    } else if (currentObjectEntryNumber < 10) {
        calcObjectArr.at(-1).new = undefined;

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

    let newCalcObject = createCalcObject(calcObjectArr.at(-1).sum, undefined, operator, opSym);

    if (newCalcObject.new === previousObject.new || newCalcObject.new === undefined
        && newCalcObject.base === previousObject.base && newCalcObject.opSym !== previousObject.opSym) {
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
    console.log("this");

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

let buttonEventsForOpsMade = false;

function flipExtraBtns() {
    brackets.forEach(bracket => {
        bracket.classList.toggle("grow")
    })
    console.log(btnsFoldedOut);

    let animTime = 200;

    allOpButtons = [...document.querySelectorAll(".btn-fold-out")];
    console.log(allOpButtons);

    if (btnsFoldedOut) {
        console.log("were folding back");
        animTime = animTime / 2;
        for (let i = allOpButtons.length - 1; i >= 0; i--) {
            allOpButtons[i].style.animationDuration = animTime + "ms";
            allOpButtons[i].style.animationDelay = animTime * (allOpButtons.length - i) + "ms"
            allOpButtons[i].classList.remove("fold-out")
            allOpButtons[i].classList.add("fold-in")
            console.log(i);
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

    console.log(btnsFoldedOut);

    // allOpButtons[i].classList.toggle("flip");
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

            console.log(calcObjectArr.length);

            if (calcObjectArr.length > 0) {
                displayCalcAndSum()
            }

            // displayCalcAndSum()
        })
    })
}

console.log(allBtns);