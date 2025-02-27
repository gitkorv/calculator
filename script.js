// Body
const calcWrapper = document.querySelector(".calc--wrapper")

// Btns
const btnContainer = document.querySelector(".calc__keyboard")
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

// Mod Displays
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
let newCalcArray = [];

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

/// BUTTON EVENTS

let activeBtn;

btnContainer.addEventListener("touchstart", (e) => {
    e.preventDefault(); 

    const target = e.target;

    if (target.classList.contains("calc__btn")) {
        if (activeBtn) activeBtn.classList.remove("active");
        activeBtn = target;
        activeBtn.classList.add("active");
    }
});

btnContainer.addEventListener(
    "touchmove",
    (event) => {
        const touch = event.touches[0];
        const targetBtn = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetBtn && targetBtn !== activeBtn && targetBtn.classList.contains("calc__btn")) {
            if (activeBtn) activeBtn.classList.remove("active");
            activeBtn = targetBtn;
            activeBtn.classList.add("active");
        }
    },
    { passive: false }
);

btnContainer.addEventListener("touchend", (event) => {
    if (activeBtn) {
        pressABtn(activeBtn)
        activeBtn = null;
    }
});

btnContainer.addEventListener("click", (e) => {
    let activeClickBtn = e.target
    activeClickBtn.classList.add("active")
    pressABtn(activeClickBtn)
})

btnContainer.addEventListener("mouseover", (e) => {
    let hoveredBtn = e.target;
    if (hoveredBtn.classList.contains("calc__btn")) {
        hoveredBtn.classList.add("hover")
    }
})

btnContainer.addEventListener("mouseout", (e) => {
    let hoveredBtn = e.target;
    if (hoveredBtn.classList.contains("calc__btn")) {
        hoveredBtn.classList.remove("hover")
    }
})

function pressABtn(activeBtn) {
    console.log("we pressed a btn");
    activeBtn.style.transitionDuration = "";

    if (activeBtn.matches(".clear-ac")) {
        clearCalc();
    } else if (activeBtn.matches(".clear-c")) {
        clearOneCalc()
    }  else {   
        if (activeBtn.matches(".btn-num")) regNum(activeBtn);
        if (activeBtn.matches(".btn-plus-minus")) plusMinus(activeBtn);
        if (activeBtn.matches(".btn-op")) opSymbol(activeBtn);
        displayCalcAndSum()
    }
    setTimeout(() => activeBtn.classList.remove("active"), 300);
}

btnContainer.addEventListener("mouseover", e => {
    if (e.target.matches(".calc__btn")) {
        e.target.style.transitionDuration = ".25s";
    }
})


function runCalcOnAllObjects(newCalcArray) {

    function splitByAdditionAndSubtraction(arr) {
        let result = [];
        let temp = [];
    
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
    
            if (item === add || item === sub) {
                result.push(temp);
                result.push([item]);
                temp = [];
            } else {
                temp.push(item);
            }
        }
        if (temp.length) {
            result.push(temp);
        }
        return result;
    }

    console.log(newCalcArray);
    const numberedNewCalcArr = newCalcArray.map(item =>
        typeof item === "string" ? parseFloat(item) : item
    );

    let calcArrSplitByAddSub = splitByAdditionAndSubtraction(numberedNewCalcArr);
    console.log(calcArrSplitByAddSub);
    let addAndSubLeft = []

    if (calcArrSplitByAddSub.length === 1) {
        calcArrSplitByAddSub[0].forEach(item => {
            addAndSubLeft.push(item);
        });
    } else {
        calcArrSplitByAddSub.forEach(calcItem => {
            if (calcItem.length > 2) {
                const sum = calcItem.reduce((acc, curr, i, arr) => {
                    if (typeof curr === "function" && i > 0) { 
                        return curr(acc, arr[i + 1]);
                    }
                    return acc;
                }, calcItem[0]);
                addAndSubLeft.push(sum);
            } else {
                addAndSubLeft.push(calcItem[0]);
            }
        });
    }

    let finalResult = addAndSubLeft.reduce((acc, curr, index, array) => {
        if (typeof curr === "function") {
            return curr(acc, array[index + 1]);
        }
        return acc;
    }, addAndSubLeft[0]);
    
    return finalResult
}

function showCalculation() {
        let displayString = "";
        console.log(newCalcArray);

        newCalcArray.forEach(item => {
            if (typeof item === "function" ) {
                if (item.name === "multiply") displayString += "x ";
                if (item.name === "divide") displayString += "/ ";
                if (item.name === "add") displayString += "+ ";
                if (item.name === "sub") displayString += "- ";
                if (item.name === "reminder") displayString += "% ";
            } else {
                if (item < 0) {
                    displayString +=`(${item}) `;
                } else {
                    displayString += `${item} `;
                }
            }
        })
        return displayString
}

let lastLiveResult = []

function displayCalcAndSum() {

    if (newCalcArray.length === 0) {
        clearCalc()
    } else if (newCalcArray.length > 2) {
        calculationDisplayEqualSign.classList.add("show")
    } else {
        calculationDisplayEqualSign.classList.remove("show")
    }

    calculationDisplayText.textContent = showCalculation();
    liveResult = runCalcOnAllObjects(newCalcArray);
    console.log(typeof liveResult);

    if (Number.isNaN(liveResult) || liveResult === undefined) {
        console.log("Result is NaN");
        let slicedResult = runCalcOnAllObjects(newCalcArray.slice(0, -1));
        if (slicedResult) {
            fadeInLiveResult(slicedResult)            
        }
    } else if (resultContainer.textContent !== liveResult.toString()) {
        console.log("live result is " + liveResult);
        fadeInLiveResult(liveResult)
    }
    negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";
}

function fadeInLiveResult(liveResult) {
    let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
    resultContainer.classList.add("fade")

    setTimeout(() => {
        resultContainer.classList.remove("fade", "mini")
        liveResult = Math.round(liveResult * 100) / 100;
        let formattedNumber = new Intl.NumberFormat('us-US').format(liveResult);
        resultContainer.textContent = formattedNumber;
        resultContainer.addEventListener("transitionend", handleResultTransitionEnd);
    }, fadeTime);
}

function handleResultTransitionEnd() {
    resultContainerWidth = resultContainer.getBoundingClientRect().width;
    resultContainerFontSize = window.getComputedStyle(resultContainer).fontSize;
    let shrinkFont;
    window.innerWidth > 768 ? shrinkFont = 8 : shrinkFont = 4;

    if (resultContainerWidth + 100 > calcDisplayWidth) {
        resultContainerFontSize = parseInt(window.getComputedStyle(resultContainer).fontSize);
        resultContainer.style.fontSize = resultContainerFontSize - shrinkFont + "px";
    }
    resultContainer.removeEventListener("transitionend", handleResultTransitionEnd);
}

function clearCalc() {
    newDigit = "";
    allNewDigits = "";
    newCalcArray = [];
    calculationDisplayEqualSign.style.transitionDuration = ".25s"
    calculationDisplayEqualSign.classList.remove("show")
    calculationDisplayText.classList.add("shrink");
    negNumber = false;
    plusMinusBtn.classList.remove("is-on");
    resultContainer.style.fontSize = "";
    resultContainer.classList.add("mini");
    resultContainer.addEventListener(
        "transitionend",
        (e) => {
            calculationDisplayText.textContent = "";
            calculationDisplayEqualSign.style.transitionDuration = ""

            resultContainer.textContent = "";
            welcomeText.innerHTML = `You stink at maths!<br>Let's try again`
            welcomeText.classList.remove("fly-out")

            negNumber = false;
            flipExtraBtns()
            loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
        },
        { once: true }
    );
    console.log("delete all!");
}

function clearOneCalc() {
    allNewDigits = "";

    if (typeof newCalcArray.at(-1) === "string") {
        let stringNumber = newCalcArray.at(-1);
        console.log(`Clear one: The stringNumber to delete from is ${stringNumber}`);
    
        if (stringNumber.length >= 2) {  // Better check for two-digit numbers
            let newSlicedNumber = stringNumber.slice(0, -1);
            newCalcArray[newCalcArray.length - 1] = newSlicedNumber; // Correct assignment
            allNewDigits = newSlicedNumber;
        } else {
            newCalcArray.pop(); // Properly remove last item
            allNewDigits = "";
        }
    } else if (typeof newCalcArray.at(-1) === "function") {
        console.log("Clear one: its a function");
        newCalcArray.pop(); // Properly remove last item
        allNewDigits = newCalcArray.at(-1) ?? null;
    }
    displayCalcAndSum()
}

function regNum(btn) {

    cancelAnimationFrame(loopBtnAnim)
    newDigit = btn.textContent;

    if (calculationDisplayText.classList.contains("shrink")) {
        setTimeout(() => {
            calculationDisplayText.classList.remove("shrink")
        }, 1000);
    }

    if (newDigit === "." && allNewDigits.includes(".")) {
    } else if (allNewDigits === "0" && newDigit !== ".") {
        allNewDigits = newDigit;
    } else {
        allNewDigits += newDigit;
    }

    console.log(allNewDigits);

    allNewDigits = allNewDigits.charAt(0) === "-" ? allNewDigits.slice(1) : allNewDigits;

    let negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    console.log(negOrNotDigits);

    if (newCalcArray.length === 0 || typeof(newCalcArray.at(-1)) === "function") {
        newCalcArray.push(negOrNotDigits)
    } else {
        newCalcArray[newCalcArray.length - 1] = negOrNotDigits
    }

    if (!btnsFoldedOut) {
        flipExtraBtns()
        welcomeText.classList.add("fly-out")
    } 
}

function plusMinus() {
    negNumber = !negNumber;
    compiledDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    newCalcArray[newCalcArray.length - 1] = compiledDigits
    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")
}

function makeNegNumberOrNot(allNewDigits, negNumber) {
    const newDigs = negNumber ? `-${allNewDigits}` : allNewDigits;
    return newDigs; // Keep as string until calculation is required
}


function opSymbol(btn) {
    let opSym = btn.textContent;

    negNumber = false;
    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")

    allNewDigits = "";
    let operator
    if (opSym === "-") {operator = sub;} 
    else if (opSym === "x" || opSym === "*") {operator = multiply;} 
    else if (opSym === "%") {operator = reminder;} 
    else if (opSym === "/") {operator = divide;} 
    else { operator = add; }

    if (typeof (newCalcArray.at(-1)) === "function") {
        newCalcArray[newCalcArray.length - 1] = operator
    } else {
        newCalcArray.push(operator)
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
    console.log('flippin extra buttons');
    if (isRunning) return;
    isRunning = true;

    brackets.forEach(bracket => {
        bracket.classList.toggle("grow")
    })
    decimalBtn.style.pointerEvents = decimalBtn.style.pointerEvents === "none" ? "" : "none";

    let animTime = 200;
    allOpButtons = [...document.querySelectorAll(".btn-fold-out")];

    if (btnsFoldedOut) {
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
let keyDown = false;

document.addEventListener("keydown", (event) => {

    if (event.key === key1) {
        key1Pressed = true;
    } else if (event.key === key2) {
        key2Pressed = true;
    }

    if (key1Pressed && key2Pressed) {
        clearCalc()
    } else if (!keyDown && event.key >= "0" && event.key <= "9" || event.key === ".") {
        const matchedElement = btnNumbers.find(element => element.textContent.trim() === event.key)
        console.log(matchedElement);
        regNum(matchedElement)
        displayCalcAndSum()
        keyDown = true;
    } else if (event.key === "Backspace") {
        if (btnsFoldedOut) {
            if (newCalcArray.length === 0) {
                clearCalc()
            } else {
                clearOneCalc()
            }
        }
        event.preventDefault()
    } else if (["+", "-", "*", "x", "/", "%"].includes(event.key)) {
        let operatorSymbol = event.key;
        operatorSymbol = operatorSymbol === "*" ? "x" : operatorSymbol;
        const matchedElement = btnOperators.find(element => element.textContent.trim() === operatorSymbol)
        if (btnsFoldedOut) {
            opSymbol(matchedElement)
            displayCalcAndSum()
        }
    }
});

document.addEventListener("keyup", event => {
    if (event.key === key1) {
        key1Pressed = false;
    } else if (event.key === key2) {
        key2Pressed = false;
    }
    keyDown = false;
})

let lastTime = 0;
let delay = 500;

let loopBtnAnim;
function blobBtnNumbers(currentTime) {

    if (!lastTime) lastTime = currentTime;
    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= delay) {
        let onlyShowingNumbers = btnNumbers.filter(
            (el) => el.textContent >= "0" && el.textContent <= "9"
        )
        let randomBtn = Math.floor(Math.random() * 9) + 1
        let currentBtn = onlyShowingNumbers[randomBtn];
        currentBtn.style.transitionDuration = "2s"

        if (currentBtn.classList.contains("blob")) {
            currentBtn.classList.remove("blob")
        } else {
            currentBtn.classList.add("blob")
            setTimeout(() => {
                currentBtn.classList.remove("blob")
                currentBtn.style.transitionDuration = ""
            }, 2000);
        }
        lastTime = currentTime;
    }
    loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
}

loopBtnAnim = requestAnimationFrame(blobBtnNumbers)