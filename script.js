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
}

function runCalcOnAllObjects() {

    function splitByAdditionAndSubtraction(arr) {
        let result = [];
        let temp = [];
    
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
    
            if (item === add || item === sub) {
                result.push(temp);  // Store previous group
                result.push([item]); // Store the operator separately
                temp = [];           // Start a new group
            } else {
                temp.push(item);
            }
        }
    
        if (temp.length) {
            result.push(temp);  // Add the last group
        }
    
        return result;
    }
    
    // Example usage:
    // const arr = [2, "x", 3, "+", 5, "/", 7, "-", 1];
    let thisOne = splitByAdditionAndSubtraction(newCalcArray);
    console.log(thisOne);
    
    


    function reorderNumbersWithOperators(arr, priorityOps = [multiply, divide]) {
        // Step 1: Identify priority numbers (numbers before "multiply" or "divide")
        let priorityPairs = [];
        let otherPairs = [];

        let orderedCalcArray = []

        for (let i = 0; i < arr.length - 2; i++) {
            let num = arr[i];
            let op = arr[i + 1];
            let nextNum = arr[i + 2];

            if (i === 1) {
                orderedCalcArray.push(num)
            } else {
                if (op === multiply || op === divide) {

                }
            }
    
            // if (priorityOps.includes(op)) {
            //     if (priorityPairs.some(pair => priorityOps.includes(pair[1]))) {
            //         priorityPairs.push([op, nextNum]);
            //     } else {
            //         priorityPairs.push([num, op, nextNum]);
            //     }
            // } else {
            //     otherPairs.push([op, num]);
            // }
            
        }

        // The last number is not followed by an operator, add it separately
        let lastNum = arr[arr.length - 1];

        // Step 2: Sort priority numbers
        // priorityPairs.sort((a, b) => a[0] - b[0]); // Sort by number

        // Step 3: Merge priority and other pairs back
        let sortedArr = [...priorityPairs.flat(), ...otherPairs.flat()];

        // if (arr.length % 2 !== 0) {
        //     sortedArr.push(arr[arr.length - 1]);
        // }

        console.log(sortedArr);

    }

    // reorderNumbersWithOperators(newCalcArray);


    
}

function makeCalcDisplayForAllObjects() {
    const calcString = calcObjectArr.map((calculation, i) => {
        // Check if the next element exists in the array (i + 1)
        if (calcObjectArr[i + 1]) {
            console.log("hoho");
            return `${calculation.newValueString} ${calcObjectArr[i + 1].opSym}`;
        } else {
            console.log("haha");
            return calculation.newValueString;
        }
    }).join(" ");
    console.log(calcString);
    return calcString
}



/// BUTTON EVENTS

let activeBtn;

btnContainer.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Optional: Prevents default behavior

    const target = e.target;

    // Ensure the target is a button
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
    activeBtn.style.transitionDuration = "";

    if (activeBtn.matches(".btn-num")) {
        regNum(activeBtn);
        displayCalcAndSum()
    } else if (activeBtn.matches(".calc__btn")) {
        if (activeBtn.matches(".clear-ac")) clearCalc();
        if (activeBtn.matches(".clear-c")) clearOneCalc();
        if (activeBtn.matches(".btn-plus-minus")) plusMinus(activeBtn);
        if (activeBtn.matches(".btn-op")) opSymbol(activeBtn);

        if (calcObjectArr.length > 0) {
            displayCalcAndSum()
        }
    }
    setTimeout(() => activeBtn.classList.remove("active"), 300);

    runCalcOnAllObjects()
    makeCalcDisplayForAllObjects()
    console.log(newCalcArray);

}

btnContainer.addEventListener("mouseover", e => {
    if (e.target.matches(".calc__btn")) {
        e.target.style.transitionDuration = ".25s";
    }
})

function displayCalcAndSum() {

    let displayCalculation = "";
    let latestCalcObject = calcObjectArr.at(-1);

    for (let i = 0; i < calcObjectArr.length; i++) {
        let object = calcObjectArr[i];
        let currentNewDigit = object.newValue < 0 ? `${object.newValueString}` : object.newValueString;
        // let currentNewDigit = negNumber ? `(${object.newValueString})` : object.newValueString;


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

    calculationDisplayText.textContent = makeCalcDisplayForAllObjects();

    if (calcObjectArr.length > 1 && calcObjectArr.at(-1).newValue !== undefined) {
        calculationDisplayEqualSign.classList.add("show")
    } else {
        calculationDisplayEqualSign.classList.remove("show")
    }
    // console.log(calcObjectArr);

    liveResult = runCalcOnAllObjects() ?? latestCalcObject.baseValue;

    console.log(liveResult);

    if (Number.isNaN(liveResult) || liveResult === undefined) {
        console.log("Number is NaN or Undefined");
        liveResult = calcObjectArr.at(-1).sum || calcObjectArr.at(-2).sum;
        fadeInLiveResult()
    } else if (resultContainer.textContent !== liveResult.toString()) {
        console.log("result is not same as last result");
        fadeInLiveResult()
    }

    negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";
}

function fadeInLiveResult() {
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
        console.log("currentFontSize", resultContainerFontSize);
        resultContainer.style.fontSize = resultContainerFontSize - shrinkFont + "px";
    }
    resultContainer.removeEventListener("transitionend", handleResultTransitionEnd);
}

function clearCalc() {
    newDigit = "";
    allNewDigits = "";
    calcObjectArr = [];
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

    console.log("delete!");
}

let digitsFromPreviousObject;

function clearOneCalc() {
    allNewDigits = "";
    let currentObjectNewValue = calcObjectArr.at(-1).newValue;
    let currentObjectNewValueLength = currentObjectNewValue?.toString().length;


    // Object has no value
    if (currentObjectNewValue === undefined) {
        console.log("undefined");

        calcObjectArr.pop()
        digitsFromPreviousObject = calcObjectArr.at(-1).newValue.toString();
        console.log("undef", digitsFromPreviousObject);
        allNewDigits = digitsFromPreviousObject
        console.log(allNewDigits);
        // negNumber = false;
        plusMinusBtn.classList.remove("is-on")

        // Object value is more than one digit long
    } else if (currentObjectNewValueLength > 1) {
        console.log("newValue is over 1 in length");
        // Take last digit out from value
        let newValueString = String(currentObjectNewValue).slice(0, -1);
        // Object value is just a "-"
        if (newValueString === "-") {
            // negNumber = true;
            console.log("new value string is -");
            calcObjectArr.at(-1).newValueString = "";
            allNewDigits = ""
            calcObjectArr.at(-1).newValue = "";
            calcObjectHasNoValue = true;
            plusMinus()
        } else {
            console.log("yo");
            console.log("newValueString", newValueString);
            allNewDigits = newValueString;
            console.log(allNewDigits);
            console.log(negNumber);

            allNewDigits = allNewDigits.charAt(0) === "-" ? allNewDigits.slice(1) : allNewDigits;


            negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);
            negOrNotString = negNumber ? `(-${allNewDigits})` : allNewDigits;

            calcObjectArr.at(-1).newValueString = negOrNotString;

            let newNumber = Number(negOrNotDigits)
            calcObjectArr.at(-1).newValue = newNumber;
        }

        // Only one digit left in value
    } else if (calcObjectArr.length === 1) {
        console.log("calcArr length 1");

        let buttonZero = document.querySelector(".btn-zero")
        calcObjectArr.pop()
        regNum(buttonZero)
    } else {
        console.log("calcArr length 1 else");

        calcObjectHasNoValue = true;
        calcObjectArr.at(-1).newValue = undefined;
        calcObjectArr.at(-1).sum = undefined;
        runCalculator()
    }
    displayCalcAndSum()
}

function regNum(btn) {
    calcObjectHasNoValue = false;

    cancelAnimationFrame(loopBtnAnim)
    newDigit = btn.textContent;

    if (calculationDisplayText.classList.contains("shrink")) {
        setTimeout(() => {
            calculationDisplayText.classList.remove("shrink")
        }, 1000);
    }
    console.log(allNewDigits);
    if (newDigit === "." && allNewDigits.includes(".")) {
        // Do nothing to prevent multiple decimal points
    } else if (allNewDigits === "0" && newDigit !== ".") {
        // Replace leading "0" if the new digit isn’t a "."
        allNewDigits = newDigit;
    } else {
        // Append the new digit
        allNewDigits += newDigit;
    }
    // if (newDigit === "." && allNewDigits.includes(".")) {
    // } else if (allNewDigits.length > 0 && allNewDigits.charAt(0) === "0" && allNewDigits.charAt(1) !== ".") {
    //     allNewDigits += newDigit;
    //     // console.log("we are slicing");
    //     allNewDigits = allNewDigits.slice(1)
    // } else {
    //     allNewDigits += newDigit;
    // }
    allNewDigits = allNewDigits.charAt(0) === "-" ? allNewDigits.slice(1) : allNewDigits;

    let negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    let negOrNotString = negNumber ? `(-${allNewDigits})` : allNewDigits;

    if (calcObjectArr.length === 0) {
        calcObjectArr.push(createCalcObject(0, negOrNotDigits, negOrNotString, add, "+"))
    }

    if (newCalcArray.length === 0 || typeof(newCalcArray.at(-1)) === "function") {
        newCalcArray.push(negOrNotDigits)

    } else {
        newCalcArray[newCalcArray.length - 1] = negOrNotDigits

    }


    console.log(newCalcArray);

    calcObjectArr[calcObjectArr.length - 1].newValue = negOrNotDigits;
    calcObjectArr[calcObjectArr.length - 1].newValueString = negOrNotString;





    console.log(calcObjectArr);

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
    negOrNotString = negNumber ? `(-${allNewDigits})` : allNewDigits;
    calcObjectArr[calcObjectArr.length - 1].newValue = compiledDigits;
    calcObjectArr[calcObjectArr.length - 1].newValueString = negOrNotString;


    newCalcArray[newCalcArray.length - 1] = compiledDigits


    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")

    runCalculator()
}

const makeNegNumberOrNot = (allNewDigits, negNumber) => parseFloat(negNumber ? `-${allNewDigits}` : allNewDigits);

let calcObjectHasNoValue;

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

    let newCalcObject

    // console.log(typeof(newCalcArray.at(-1)));

    if (typeof (newCalcArray.at(-1)) === "function") {
        console.log("its a function");
        newCalcArray[newCalcArray.length - 1] = operator
    } else {
        newCalcArray.push(operator)
    }


    // If there is no new value but different operator

    if (calcObjectHasNoValue === true) {
        console.log("object has no value");
        previousObject.opSym = opSym;
        previousObject.operator = operator;
        // runCalculator()
    } else {
        newCalcObject = createCalcObject(calcObjectArr.at(-1).sum, undefined, undefined, operator, opSym);

        if (calcObjectArr.length === 1 && newCalcObject.opSym === "-") {
            console.log("pushing");
            calcObjectArr.push(newCalcObject)
        } else if (JSON.stringify(newCalcObject) !== JSON.stringify(previousObject)) {
            calcObjectArr.push(newCalcObject)
        }
        calcObjectHasNoValue = true;

    }


    // if (calcObjectArr.length > 1 && 
    //     newCalcObject.opSym !== previousObject.opSym && 
    //     newCalcObject.newValue === undefined &&
    //     newCalcObject.baseValue === previousObject.baseValue) {
    //     console.log("replacing");
    //     let ppp = previousObject.newValue;
    //     console.log(ppp);
    //     newCalcObject.baseValue = ppp;
    //     calcObjectArr[calcObjectArr.length - 1].operator = newCalcObject.operator;
    //     calcObjectArr[calcObjectArr.length - 1].opSym = newCalcObject.opSym;
    //     // If objects are not identical
    // } else if (JSON.stringify(newCalcObject) !== JSON.stringify(previousObject)) {
    //     calcObjectArr.push(newCalcObject)
    // }
    // console.log(calcObjectArr);


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

let lastTime = 0;
let delay = 500;

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

// blobBtnNumbers()

