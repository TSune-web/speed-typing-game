const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById("timer");

let curr = 0;
let result = 0;
const currPoint = document.createElement('p');
const lastPoint = document.createElement('p');

quoteInputElement.addEventListener('input', (e) => {
    const arrQuote = quoteDisplayElement.querySelectorAll('span');
    const arrValue = quoteInputElement.value.split('');
    let correct = true;

    arrQuote.forEach((charSpan, index) => {
        const char = arrValue[index];

        if (char == null) {
            charSpan.classList.remove('correct');
            charSpan.classList.remove('incorrect');
            correct = false;
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');

            // add score when typed correctly
            // bug - calculate even when clicked delete button
            //     - calculate every typed characters
            addCurrentScore();
        } else {
            charSpan.classList.remove('correct');
            charSpan.classList.add('incorrect');

            // subtract score when typed incorrectly
            // bug - calculate even when clicked delete button
            //     - calculate every typed characters
            subtractCurrentScore();
            correct = false;
        }
    })

    if (correct) renderNextQuote();
})

function startScore() {
    currPoint.innerText = curr;
    currPoint.classList.add('score');
    document.body.appendChild(currPoint);

    lastPoint.innerHTML = result;
    lastPoint.classList.add('result');
    document.body.appendChild(lastPoint);
}

function addCurrentScore() {
    curr += 10;
    currPoint.innerHTML = curr;
}
function subtractCurrentScore() {
    curr -= 10;
    currPoint.innerHTML = curr;
}

async function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(res => res.json())
        .then(data => data.content)
        .catch(e => console.log(e))
}

async function renderNextQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerText = '';

    // Check each letter as user types
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplayElement.appendChild(charSpan);
    });

    quoteInputElement.value = null;
    startTimer();
    startScore();
}

let startTime;

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();

    setInterval(() => {
        timer.innerText = getTimerTime();
    }, 1000)
}

// Get time as accurate as possible
function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

renderNextQuote();
