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
let shakeBtn = false;


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
        elClass: ["btn-plus-minus", "btn-op btn-remainder"],
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
        // activeBtn.classList.add("active");
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
    // activeClickBtn.classList.add("active")
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
    // console.log(shakeBtn);
    if (shakeBtn && !activeBtn.classList.contains("btn-op")) {
        console.log("no op");
        shakeBtn = false;
    }

    activeBtn.classList.add("active")


    activeBtn.style.transitionDuration = "";

    if (activeBtn.matches(".clear-ac")) {
        clearCalc();
    } else if (activeBtn.matches(".clear-c")) {
        clearOneCalc()
    } else {
        if (activeBtn.matches(".btn-num")) regNum(activeBtn);
        if (activeBtn.matches(".btn-plus-minus")) plusMinus();
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

/*
    I CHANGED THIS- START
*/

//this function will format the newCalArray into n,f,n,f then display it in expression conatiner then solve it by calling runCalc....
function displayCalcAndSum() {
    if (newCalcArray.length === 0) {
        clearCalc();
    } else if (newCalcArray.length > 2) {
        calculationDisplayEqualSign.classList.add("show");
    } else {
        calculationDisplayEqualSign.classList.remove("show");
    }

    let reduceArray = showCalculation(newCalcArray); //reduceArray is the formatted array 
    calculationDisplayText.textContent = reduceArray.join(" "); // to show in the text display

    liveResult = runCalcOnAllObjects(reduceArray);//solve the formatted array and return the result as number saving in liveResult

    if (Number.isNaN(liveResult) || liveResult === undefined) {
        // console.log("live result is " + liveResult);
        console.log("Result is NaN");
    } else if (resultContainer.textContent !== liveResult.toString()) {
        // console.log("live result is " + liveResult);
        fadeInLiveResult(liveResult);
    }
}

//this function convert the array from [n,f,n,f,f,n] to [n,f,n,f,n...]
function showCalculation(calcArray) {
    let newArr = []; //new Array conatainer for formatted newCalcArray


    //we iterate all the elements of calcArray>>newCalcArray
    for (let i = 0; i < calcArray.length; i++) {
        let currentItem = calcArray[i];


        if (typeof currentItem === 'string') {
            if (String(currentItem).startsWith("-")) {
                newArr.push(`(${currentItem})`);
            } else {
                newArr.push(currentItem);
            }
            

        } else if (typeof currentItem === 'function') {
            let operatorName = currentItem.name;
            if (operatorName === 'remainder') {
                if (calcArray[i - 1].name === 'remainder' || typeof calcArray[i + 1] === 'string') {
                    newArr.push('%'); //if this is the second remainder then we make it as an operator
                } else {
                    if (Number(calcArray[i - 1] < 0)) {
                        newArr[newArr.length - 1] = "(" + String(calcArray[i - 1]) + "%)";
                    } else {
                        newArr[newArr.length - 1] += `%`; // if last element is number then we just add % to it example 9,% becomes 9%
                    }
                }
            } else if (operatorName === 'add') {
                newArr.push('+');
            } else if (operatorName === 'sub') {
                newArr.push('-');
            } else if (operatorName === 'multiply') {
                newArr.push('×');
            } else if (operatorName === 'divide') {
                newArr.push('÷');
            } else {
                newArr.push(operatorName);
            }
        }
    }
    console.log(newCalcArray);
    console.log(`NEW ARR AFTER SHOWCALCU: ` + newArr);
    return newArr;
}


//perform MDAS here
function runCalcOnAllObjects(arr) {
    let resultArr = [...arr];

    let i = 1;
    while (i < resultArr.length) {
        //we look for mult div and mod first
        if (resultArr[i] === '×' || resultArr[i] === '÷' || resultArr[i] === `%`) {
            //i could simplify this by just checking if elements have % or not using .includes and only call the checkAndDIvidebyPercent for those
            let num1 = checkAndDivideByPercent(resultArr[i - 1]); //alwasy check if theres % in the element 
            let operator = resultArr[i];
            let num2 = checkAndDivideByPercent(resultArr[i + 1]);

            let result = performCalculation(num1, operator, num2);
            //index:0 1 2 3 4
            //example resultArr[1,+,3,/,3...]
            //we are at i =3, we solve 3 / 3 so result is 1, we want to insert that 1 to [1,+,(3,/,3)...]
            resultArr.splice(i - 1, 3, result);
            //we are expecting this [1,+,(1)...]
            //everytime we remove/add item from resultArr the length of resultArr change too

            //current index i is 3,

            i -= 2;//so we compensate the removal of 2 elements  with this

        }
        i += 2; //we only iterate for odd numbers in the array since those are the postions of operators
        // index 0 1 2 3 4 5,7
        //      [1,+,3,*,6,/,8 ]   operators happen at 1, 3, 5 and so on
    }

    i = 1;
    //then we look for add sub
    while (i < resultArr.length) {
        if (resultArr[i] === '+' ||
            resultArr[i] === '-'
        ) {
            const operator = resultArr[i];
            const num1 = checkAndDivideByPercent(resultArr[i - 1]);
            let num2 = String(resultArr[i + 1]).endsWith('%')
                ? num1 * checkAndDivideByPercent(resultArr[i + 1])
                : checkAndDivideByPercent(resultArr[i + 1]);

            let result = performCalculation(num1, operator, num2);

            // resultArr[i - 1] = result;
            resultArr.splice(i - 1, 3, result);
            i -= 2;
        }
        i += 2;

    }

    //this is the final result
    let finalResult = checkAndDivideByPercent(resultArr[0]);
    // console.log(`finalResult: ${finalResult}`);
    return Number(finalResult);
}

//helper function to solve the operator and the number before and after it
function performCalculation(num1, operator, num2) {
    if (operator === '×') return num1 * num2;
    if (operator === '÷') return num1 / num2;
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
    if (operator === `%`) return num1 % num2;
}

//if item has % in it this function will divide the number by 100 and return the value
function checkAndDivideByPercent(element) {

    const el = String(element).replace(/[()]/g, "");
    if (el.includes('%')) {
        let number = parseFloat(el.replace('%', ''));
        return number / 100;
    }
    return parseFloat(el);
}

/*
    I CHANGED THIS- END
*/

function fadeInLiveResult(liveResult) {
    let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
    resultContainer.classList.add("fade")

    setTimeout(() => {
        resultContainer.classList.remove("fade", "mini")
        liveResult = Math.round(liveResult * 10000) / 10000;
        // console.log(liveResult);
        let nanOrNot = isNaN(liveResult) ? "0" : liveResult
        // let formattedNumber = new Intl.NumberFormat('en-US').format(liveResult);
        // console.log(nanOrNot);
        resultContainer.textContent = new Intl.NumberFormat('en-US').format(nanOrNot);
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

            // negNumber = false;
            flipExtraBtns()
            loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
        },
        { once: true }
    );
    console.log("delete all!");
}

function clearOneCalc() {
    allNewDigits = "";
    console.log(newCalcArray);

    if (typeof newCalcArray.at(-1) === "string") {
        let stringNumber = newCalcArray.at(-1);

        if (stringNumber === "(-)") {
            // console.log("dfgddf");
            // plusMinus()
            newCalcArray.pop();
            // console.log(calculationDisplayText.textContent);

            // allNewDigits = "";

        } else if (stringNumber.length >= 2) {
            console.log("oahaha");
            let newSlicedNumber = stringNumber.slice(0, -1);
            newCalcArray[newCalcArray.length - 1] = newSlicedNumber === "-" ? "(-)" : newSlicedNumber;
            allNewDigits = newSlicedNumber;
            console.log(allNewDigits);
        } else {
            newCalcArray.pop();
            allNewDigits = "";
            // negNumber = false;
        }
    } else if (typeof newCalcArray.at(-1) === "function") {
        console.log("its a func");
        newCalcArray.pop();

        if (typeof newCalcArray.at(-1) === "function") {
            allNewDigits = "";
        } else {
            allNewDigits = newCalcArray.at(-1) ?? null;
        }

    }
    displayCalcAndSum();

}

function regNum(btn) {

    cancelAnimationFrame(loopBtnAnim)
    newDigit = btn.textContent;

    if (calculationDisplayText.classList.contains("shrink")) {
        setTimeout(() => {
            calculationDisplayText.classList.remove("shrink")
        }, 1000);
    }

    console.log(`ALLNEWDIGS` + allNewDigits);
    if (newDigit === "." && allNewDigits.includes(".")) {
    } else if ((allNewDigits === "0" || allNewDigits === "-0") && newDigit !== ".") {
        allNewDigits = newDigit;
    } else if ((allNewDigits === "" || allNewDigits === "-") && newDigit === ".") {
        allNewDigits = "0.";
    } else {
        allNewDigits += newDigit;
    }
    // console.log("new digits are ", typeof allNewDigits, allNewDigits);

    // allNewDigits = allNewDigits.charAt(0) === "-" ? allNewDigits.slice(1) : allNewDigits;

    let negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);
    // let negOrNotDigits = allNewDigits;

    if (newCalcArray.length === 0 || typeof (newCalcArray.at(-1)) === "function") {
        newCalcArray.push(negOrNotDigits)
    } else {
        newCalcArray[newCalcArray.length - 1] = negOrNotDigits;
    }

    if (!btnsFoldedOut) {
        flipExtraBtns()
        welcomeText.classList.add("fly-out")
    }
    // console.log(newCalcArray);

    displayCalcAndSum();
}

function makeNegNumberOrNot(allNewDigits, negNumber) {

    let endsWithDot = false;
    let startsWithMinus = false;
    if (allNewDigits.at(-1) === ".") endsWithDot = true;
    if (allNewDigits.at(1) === "-") startsWithMinus = true;


    allNewDigits = negNumber 
    ? (allNewDigits.startsWith("-") ? allNewDigits.slice(1) : "-" + allNewDigits) 
    : allNewDigits;

    // console.log(allNewDigits);
    // if (endsWithDot && negNumber) allNewDigits += ".";
    if (startsWithMinus && negNumber) allNewDigits = String("-" + allNewDigits);


    // console.log(`ALLNEWDIGITS:`, allNewDigits);

    return allNewDigits;
}


function plusMinus() {
    negNumber = !negNumber;
    console.log(negNumber);

    if (newCalcArray.at(-1) === "(-)") {
        newCalcArray.pop(); // Remove "(-)" if it's the last element
    } else if (!isNaN(newCalcArray.at(-1))) { //If lastEl is a number we toggle the - sign
        newCalcArray[newCalcArray.length - 1] = 
        String(newCalcArray.at(-1)).startsWith("-") 
        ? String(newCalcArray.at(-1)).slice(1) 
        : "-" + newCalcArray.at(-1);
       
        
        //Special case where lastEl is % but before it is a number
    } else if (typeof newCalcArray[newCalcArray.length - 2] === "string" && newCalcArray[newCalcArray.length - 1]?.name === "remainder") {
        newCalcArray[newCalcArray.length - 2] = 
        String(newCalcArray.at(-2)).startsWith("-") 
        ? String(newCalcArray.at(-2)).slice(1) 
        : "-" + newCalcArray.at(-2);
    } else {// lastEl is operator/function normal case
        newCalcArray.push("(-)");
    }
    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on");
    displayCalcAndSum();
}


function opSymbol(btn) {

    if (newCalcArray.at(-1) !== undefined && newCalcArray.at(-1) !== null && String(newCalcArray.at(-1)).includes(".") && typeof newCalcArray.at(-1) !== "function") { 
        console.log(`Entered incluide decimal pioit`);
        let [beforeDot, afterDot] = String(newCalcArray.at(-1)).split(".");
        if (isNaN(afterDot[0])) {
            newCalcArray[newCalcArray.length - 1] = (beforeDot + afterDot).toString();
        }
    }

    console.log(btn);
    if (shakeBtn) {
        shakeOpsOnPress(btn)
        return;
    }
    let opSym = btn.textContent;

    negNumber = false;
    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")

    allNewDigits = "";
    let operator
    if (opSym === "-") { operator = sub; }
    else if (opSym === "x" || opSym === "*") { operator = multiply; }
    else if (opSym === "%") { operator = remainder; }
    else if (opSym === "/") { operator = divide; }
    else { operator = add; }

    console.log(newCalcArray.at(-1));

    if (typeof (newCalcArray.at(-1)) === "function") {
        let prevOperator = newCalcArray.at(-1)
        if (prevOperator.name !== "remainder" && typeof newCalcArray.at(-2) !== "function") {
            newCalcArray[newCalcArray.length - 1] = operator
        } else if (prevOperator.name === "remainder" && typeof newCalcArray.at(-2) !== "function") {
            newCalcArray.push(operator)
        } else if (newCalcArray.at(-2).name === "remainder" && operator.name !== "remainder") {
            newCalcArray[newCalcArray.length - 1] = operator
        } else if (newCalcArray.at(-2).name === "remainder" && operator.name === "remainder") {
        }
    } else if (newCalcArray.at(-1) === "(-)") {
        console.log("this is (-)");
        negNumber = true;
        negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")
        shakeBtn = true;
        pressABtn(btn)
    
        // console.log(btnOperators);

        // newCalcArray[newCalcArray.length - 1] = operator
    } else {
        newCalcArray.push(operator)
    }
    
    displayCalcAndSum();

}

function shakeOpsOnPress(btn) {
    console.log(btn);

    btn.parentElement.classList.add("shake");
    setTimeout(() => {
        btn.parentElement.classList.remove("shake");
    }, 500);
}

function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

function remainder(a, b) {
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
    // console.log('flippin extra buttons');
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
        // console.log(matchedElement);
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