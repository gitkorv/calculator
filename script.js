// Body
const calcWrapper = document.querySelector(".calc--wrapper")

// Btns
const btnContainer = document.querySelector(".calc__keyboard")
console.log(btnContainer);
let allBtns = [...document.querySelectorAll(".calc__btn")];
const btnNumbers = [...document.querySelectorAll(".btn-num")];
const clearAllBtn = document.querySelector(".clear-ac")
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
console.log(welcomeText);

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
    let sum = calcObjectAtEnd.operator(parseFloat(calcObjectAtEnd.baseValue), calcObjectAtEnd.newValue);

    sum = isNaN(sum) ? calcObjectAtEnd.baseValue : sum;
    calcObjectAtEnd.sum = sum;
    // console.log(calcObjectAtEnd);
    // calcObjectAtEnd.sum = calcObjectAtEnd.operator(parseFloat(calcObjectAtEnd.baseValue), calcObjectAtEnd.newValue);
    console.log(calcObjectAtEnd);
}

/// BUTTON EVENTS

let activeBtn;

btnContainer.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Optional: Prevents default behavior

    const target = e.target;

    // Ensure the target is a button
    if (target.classList.contains("calc__btn")) {
        if (activeBtn) activeBtn.classList.remove("active"); // Reset previous active button
        activeBtn = target; // Set the new active button
        activeBtn.classList.add("active");
        // console.log('Touch started on:', activeBtn);
    }
});

btnContainer.addEventListener(
    "touchmove",
    (event) => {
        const touch = event.touches[0];
        const targetBtn = document.elementFromPoint(touch.clientX, touch.clientY);

        // If swiping over a new button, update activeBtn
        if (targetBtn && targetBtn !== activeBtn && targetBtn.classList.contains("calc__btn")) {
            if (activeBtn) activeBtn.classList.remove("active"); // Remove "active" from previous button
            activeBtn = targetBtn; // Update the new active button
            activeBtn.classList.add("active");
            // console.log("Touch moved to:", activeBtn);
        }
    },
    { passive: false } // Prevent scrolling while touching
);

btnContainer.addEventListener("touchend", (event) => {
    if (activeBtn) {
        // console.log('Touch ended on:', activeBtn);

        pressABtn(activeBtn)

        // activeBtn.classList.remove("active"); // Remove the active class
        activeBtn = null; // Reset activeBtn
    }
});

btnContainer.addEventListener("click", (e) => {
    // console.log(e.target);
    let activeClickBtn = e.target
    activeClickBtn.classList.add("active")
    pressABtn(activeClickBtn)
})

btnContainer.addEventListener("mouseover", (e) => {
    // console.log(e.target);
    let hoveredBtn = e.target;
    if (hoveredBtn.classList.contains("calc__btn")) {
        // console.log(hoveredBtn);
        hoveredBtn.classList.add("hover")

    }
})

btnContainer.addEventListener("mouseout", (e) => {
    // console.log(e.target);
    let hoveredBtn = e.target;
    if (hoveredBtn.classList.contains("calc__btn")) {
        // console.log("leaving ", hoveredBtn);
        hoveredBtn.classList.remove("hover")

    }
})

function pressABtn(activeBtn) {
    activeBtn.style.transitionDuration = "";
    // activeBtn.classList.remove("active"); // Remove the active class

    // Perform actions based on button type
    if (activeBtn.matches(".btn-num")) {
        regNum(activeBtn);
        displayCalcAndSum()
    } else if (activeBtn.matches(".calc__btn")) {
        // Perform specific actions for calc__btn
        if (activeBtn.matches(".clear-ac")) clearCalc();
        if (activeBtn.matches(".clear-c")) clearOneCalc();
        if (activeBtn.matches(".btn-plus-minus")) plusMinus(activeBtn);
        if (activeBtn.matches(".btn-op")) opSymbol(activeBtn);

        if (calcObjectArr.length > 0) {
            displayCalcAndSum()
        }
    }
    setTimeout(() => activeBtn.classList.remove("active"), 300);
}

btnContainer.addEventListener("mouseover", e => {
    if (e.target.matches(".calc__btn")) {
        // console.log(e.target);
        e.target.style.transitionDuration = ".25s";

    }
})

function displayCalcAndSum() {

    let displayCalculation = "";
    let latestCalcObject = calcObjectArr.at(-1);

    for (let i = 0; i < calcObjectArr.length; i++) {
        let object = calcObjectArr[i];
        let currentNewDigit = object.newValue < 0 ? `(${object.newValueString})` : object.newValueString;

        if (i < 1 && currentNewDigit === undefined) {
            displayCalculation = "";
            negNumber = false;
        } else if (i < 1) {
            displayCalculation = `${currentNewDigit}`
        } else if (object.newValue === undefined) {
            displayCalculation += ` ${object.opSym}`
        } else {
            displayCalculation += ` ${object.opSym} ${currentNewDigit}`
        }
    }

    calculationDisplayText.textContent = displayCalculation;

    if (calcObjectArr.length > 1 && calcObjectArr.at(-1).newValue !== undefined) {
        calculationDisplayEqualSign.classList.add("show")
    } else {
        calculationDisplayEqualSign.classList.remove("show")

    }

    liveResult = latestCalcObject.sum || latestCalcObject.baseValue;

    if (Number.isNaN(liveResult)) {
        console.log("Number is NaN");
    } else if (resultContainer.textContent !== liveResult.toString()) {
        let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
        resultContainer.classList.add("fade")

        setTimeout(() => {
            resultContainer.classList.remove("fade", "mini")

            liveResult = Math.round(liveResult * 100) / 100;
            resultContainer.textContent = liveResult;
            resultContainer.addEventListener("transitionend", handleResultTransitionEnd);

        }, fadeTime);
    }

    negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";
}

function handleResultTransitionEnd() {
    resultContainerWidth = resultContainer.getBoundingClientRect().width;
    resultContainerFontSize = window.getComputedStyle(resultContainer).fontSize;
    let shrinkFont;
    window.innerWidth > 768 ? shrinkFont = 8 : shrinkFont = 4;

    if (resultContainerWidth + 100 > calcDisplayWidth) {
        resultContainerFontSize = parseInt(window.getComputedStyle(resultContainer).fontSize);
        console.log("currentFontSize", resultContainerFontSize);
        resultContainer.style.fontSize = resultContainerFontSize - shrinkFont + "px";
    }

    // Remove the event listener after handling
    resultContainer.removeEventListener("transitionend", handleResultTransitionEnd);
}

function clearCalc() {
    calculationDisplayText.classList.add("shrink");
    negNumber = false;
    plusMinusBtn.classList.remove("is-on");


    resultContainer.style.fontSize = "";
    resultContainer.classList.add("mini");

    resultContainer.addEventListener(
        "transitionend",
        (e) => {
            console.log("trans end");
            newDigit = "";
            allNewDigits = "";
            calcObjectArr = [];
            calculationDisplayText.textContent = "";
            // calculationDisplayText.classList.remove("shrink");

            resultContainer.textContent = "";
            calculationDisplayEqualSign.classList.remove("show")
            welcomeText.innerHTML = `You stink at maths!<br>Let's try again`
            welcomeText.classList.remove("fly-out")

            negNumber = false;
            flipExtraBtns()
            loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
        },
        { once: true } // Automatically removes the listener after the first execution
    );
    
    console.log("delete!");
}

let savedDigitBeforePop;

function clearOneCalc() {
    // negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";

    allNewDigits = "";
    let currentObjectNewValue = calcObjectArr.at(-1).newValue;
    let currentObjectNewValueLength = currentObjectNewValue?.toString().length;

    console.log(calcObjectArr.length);
    console.log(currentObjectNewValue);

    if (currentObjectNewValue === undefined) {

        calcObjectArr.pop()
        savedDigitBeforePop = calcObjectArr.at(-1).newValue.toString();
        console.log("undef", savedDigitBeforePop);
        allNewDigits = savedDigitBeforePop

        negNumber = false;
        plusMinusBtn.classList.remove("is-on")
        console.log(calcObjectArr);
        // runCalculator()
        // displayCalcAndSum()
    } else if (currentObjectNewValueLength > 1) {
        console.log("hereeee");
        let newValueString = String(currentObjectNewValue).slice(0, -1);
        if (newValueString === "-") {
            console.log("one");
            calcObjectArr.at(-1).newValueString = undefined;
            allNewDigits = ""
            calcObjectArr.at(-1).newValue = undefined;
        } else {
            console.log("two");
            allNewDigits = newValueString;
            calcObjectArr.at(-1).newValueString = newValueString;

            let newNumber = Number(newValueString)
            calcObjectArr.at(-1).newValue = newNumber;
        }
        runCalculator()

    } else if (calcObjectArr.length === 1) {
        console.log("the one");
        let buttonZero = document.querySelector(".btn-zero")
        console.log("darn");
        calcObjectArr.pop()
        regNum(buttonZero)
    } else {
        calcObjectArr.at(-1).newValue = undefined;
    }

}

function regNum(btn) {
    cancelAnimationFrame(loopBtnAnim)
    console.log(btn);

    console.log(calcObjectArr);

    newDigit = btn.textContent;
    console.log(newDigit);

    if (calculationDisplayText.classList.contains("shrink")) {
        setTimeout(() => {
            calculationDisplayText.classList.remove("shrink")
        }, 1000);
    }


    if (newDigit === "." && allNewDigits.includes(".")) {
        // console.log("it includes a dot");
    } else if (allNewDigits.length > 0 && allNewDigits.charAt(0) === "0" && allNewDigits.charAt(1) !== ".") {
        allNewDigits += newDigit;
        // console.log("we are slicing");
        allNewDigits = allNewDigits.slice(1)
    } else {
        allNewDigits += newDigit;
    }

    let negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    let negOrNotString = negNumber ? `-${allNewDigits}` : allNewDigits;

    if (calcObjectArr.length === 0) {
        calcObjectArr.push(createCalcObject(0, negOrNotDigits, negOrNotString, add, "+"))
    }

    calcObjectArr[calcObjectArr.length - 1].newValue = negOrNotDigits;
    calcObjectArr[calcObjectArr.length - 1].newValueString = negOrNotString;

    if (!btnsFoldedOut) {
        flipExtraBtns()

        welcomeText.classList.add("fly-out")
        welcomeText.addEventListener("transitionend", e => {
            // welcomeText.remove();
        })
        // operatorsOpen = true;
    } else {
        runCalculator()
    }
}

function plusMinus() {
    negNumber = !negNumber;
    compiledDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    negOrNotString = negNumber ? `-${allNewDigits}` : allNewDigits;
    calcObjectArr[calcObjectArr.length - 1].newValue = compiledDigits;
    calcObjectArr[calcObjectArr.length - 1].newValueString = negOrNotString;

    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")

    runCalculator()
}

const makeNegNumberOrNot = (allNewDigits, negNumber) => parseFloat(negNumber ? `-${allNewDigits}` : allNewDigits);

function opSymbol(btn) {
    let opSym = btn.textContent;
    let previousObject = calcObjectArr[calcObjectArr.length - 1]

    negNumber = false;
    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")


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

    if (calcObjectArr.length === 1 && newCalcObject.opSym === "-") {
        calcObjectArr.push(newCalcObject)
    } else if (newCalcObject.newValue === previousObject.newValue || newCalcObject.newValue === undefined
        && newCalcObject.baseValue === previousObject.baseValue && newCalcObject.opSym !== previousObject.opSym) {
        // console.log("write over last object");
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

function reminder(a, b) { 
    let result = a % b;
    return result < 0 ? Math.abs(result) : result;
}

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

let isRunning = false;

function flipExtraBtns() {
    if (isRunning) return;
    isRunning = true;

    brackets.forEach(bracket => {
        bracket.classList.toggle("grow")
    })
    decimalBtn.style.pointerEvents = decimalBtn.style.pointerEvents === "none" ? "" : "none";


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

    isRunning = false;
}

function elementsToStopTransition(...elements) {
    elements.forEach(element => {
        if (Array.isArray(element)) {
            element.forEach(el => {
                el.style.transition = el.style.transition === "none" ? "" : "none";
            })
        } else {
            element.style.transition = element.style.transition === "none" ? "" : "none";
        }
    })
}

allBtns = [...document.querySelectorAll(".calc__btn")];
const stopTransElements = [allBtns, welcomeText, brackets]

window.addEventListener('load', () => {
    elementsToStopTransition(...stopTransElements)

    if (welcomeText) {
        welcomeText.style.transitionDuration = "1s"
        welcomeText.classList.remove("fade-in")

        welcomeText.addEventListener("transitionend", () => {
            welcomeText.style.transitionDuration = "";
        }, { once: true })
    }
});

elementsToStopTransition(...stopTransElements)
welcomeText.classList.add("fade-in")
decimalBtn.style.pointerEvents = "none"

const btnOperators = [...document.querySelectorAll(".btn-op")]

let key1Pressed = false;
let key2Pressed = false;

const key1 = "Shift"
const key2 = "Backspace"

document.addEventListener("keydown", (event) => {

    if (event.key === key1) {
        key1Pressed = true;
    } else if (event.key === key2) {
        key2Pressed = true;
    }

    if (key1Pressed && key2Pressed) {
        clearCalc()
        console.log("both are pressed");
    } else if (event.key >= "0" && event.key <= "9" || event.key === ".") {
        const matchedElement = btnNumbers.find(element => element.textContent.trim() === event.key)
        console.log(matchedElement);
        regNum(matchedElement)
        displayCalcAndSum()
    } else if (event.key === "Backspace") {
        console.log("Backspace pressed!");
        if (btnsFoldedOut) {
            clearOneCalc()
            if (calcObjectArr.length > 0) {
                displayCalcAndSum()
            }
        }
        event.preventDefault()
    } else if (["+", "-", "*", "x", "/", "%"].includes(event.key)) {
        console.log(`Operator pressed: ${event.key}`);
        let operatorSymbol = event.key;
        operatorSymbol = operatorSymbol === "*" ? "x" : operatorSymbol;
        const matchedElement = btnOperators.find(element => element.textContent.trim() === operatorSymbol)
        if (btnsFoldedOut) {
            opSymbol(matchedElement)
            if (calcObjectArr.length > 0) {
                displayCalcAndSum()
            }
        }
    }
});

document.addEventListener("keyup", event => {
    if (event.key === key1) {
        key1Pressed = false;
    } else if (event.key === key2) {
        key2Pressed = false;
    }
})

let blob = false

let lastTime = 0;
let delay = 300;

let loopBtnAnim;

function blobBtnNumbers(currentTime) {

    if (!lastTime) lastTime = currentTime;

    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= delay) {
        // console.log(btnNumbers);
        let onlyShowingNumbers = btnNumbers.filter(
            (el) => el.textContent >= "0" && el.textContent <= "9"
        )
        // console.log(onlyShowingNumbers);
        let randomBtn = Math.floor(Math.random() * 9) + 1
        let currentBtn = onlyShowingNumbers[randomBtn];


        if (currentBtn.classList.contains("blob")) {
            currentBtn.classList.remove("blob")
        } else {
            currentBtn.classList.add("blob")
            setTimeout(() => {
                currentBtn.classList.remove("blob")
            }, 2000);
        }
        lastTime = currentTime;
    }


    loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
}

loopBtnAnim = requestAnimationFrame(blobBtnNumbers)

// blobBtnNumbers()

