'use strict'

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    document.querySelector('.container').innerHTML = `<h2 class="mobile-block">Вы используете мобильное устройство (телефон или планшет). Пожалуйста, используйте ПК</h2>`;
    document.querySelector('.footer').remove();
} 

const inputElement = document.querySelector('#input');
const textExampleElement = document.querySelector('#textExample');
const button = document.querySelector('.button');

let textArray;

getTextArray ();

const text = textArray[Math.floor(Math.random() * textArray.length)];

inputElement.setAttribute("readonly", "true");

let counterId = 0;
let letterId = 1;

let timeCounter = 60;
let errorCounter = 0;
let speedCounter = 0;

const allText = getText(text);

updateTextExample();

elemToSpan();

function getTextArray () {
    let xhr = new XMLHttpRequest();
    let url = './db/db.json';
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status == 200) {
        let data = JSON.parse(xhr.responseText);
        textArray = data.map( item => {
            return item.text;
        });
    }
}

function getText (text) {
    const textLine = [];
    for (const letter of text) {
        counterId++;
        textLine.push({
            id: counterId,
            label: letter
        })
    }
    return textLine;
};

function elemToSpan(text) {
    const divElement = document.createElement('div');
    
    for (const letter of allText) {
        const spanElement = document.createElement('span');
        spanElement.textContent = letter.label;
        divElement.append(spanElement);
        
        if (letterId > letter.id) {
            spanElement.classList.add('done');
        }
    }
    return divElement;
};

function updateTextExample () {
    textExampleElement.innerHTML = '';
    const html = elemToSpan(allText);
    textExampleElement.append(html)
};

function getCurrentLetter () {
    for (const letter of allText) {
        if (letterId === letter.id) {
            return letter;
        }
    } 
};

function timer () {
    setInterval(function () {
        document.querySelector('.time__value').textContent = timeCounter;
        timeCounter--;
        if (timeCounter <= 0) {
            const resultInfo = document.querySelector('.result-info');
            resultInfo.innerHTML = `
                <div class="result-time result-time__finished">
                    <div class="time__sum">ВАШ РЕЗУЛЬТАТ:</div>
                    <div class="time__value"></div>
                </div>
                <div class="result-speed">
                    <div class="speed__sum">Символов:</div>
                    <div class="speed__value">${speedCounter}</div>
                </div>
                <div class="result-error">
                    <div class="error__sum">Ошибок:</div>
                    <div class="error__value">${errorCounter}</div>
                </div>
            `;
            inputElement.setAttribute("readonly", "true");
            resultInfo.classList.add('result-info__finished');
            inputElement.removeEventListener('keydown', KeyDownPressed);
            inputElement.value = 'Нажмите клавишу Enter для повторной попытки';
        }
    }, 1000);
};

const isKeyPressed = event => ['CapsLock', 'Shift', 'Tab', 'Enter', 'Delete', 'Alt', 'Control'].includes(event.key);

function KeyDownPressed(event) {
    
    const currentLetter = getCurrentLetter();
    const speedValue = document.querySelector('.speed__value');
    const errorValue = document.querySelector('.error__value');
    const element = document.querySelector(`[data-key="${event.key}"]`);

    if (event.key === currentLetter.label) {
        letterId++;
        speedCounter++;
        speedValue.textContent = speedCounter;

        if (speedCounter === text.length) {
            alert('Поздравляем, Вы справились меньше чем за минуту!')
            updateTextExample();
        }
        updateTextExample();

    } else if (isKeyPressed(event)) {
        event.preventDefault();

    }  else {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            errorCounter--;
        }
        errorCounter++;
        errorValue.textContent = errorCounter;
        errorValue.style.color = 'red';
        event.preventDefault();
        updateTextExample();
    } 

    if (element) {
        element.classList.add('press');
    }

    if (event.code === 'ShiftRight') {
        document.querySelector('#shiftRight').classList.add('press');
    }

    if (event.code === 'ShiftLeft') {
        document.querySelector('#shiftLeft').classList.add('press');
    }

    if (event.code === 'Backslash') {
        document.querySelector('#backslash').classList.add('press');
    }
};

function KeyUpPressed(event) {
    const element = document.querySelector(`[data-key="${event.key}"]`);
        
    if (element) {
        element.classList.remove('press');
    }

    if (event.code === 'ShiftRight') {
        document.querySelector('#shiftRight').classList.remove('press');
    }

    if (event.code === 'ShiftLeft') {
        document.querySelector('#shiftLeft').classList.remove('press');
    }

    if (event.code === 'Backslash') {
        document.querySelector('#backslash').classList.remove('press');
    }
}

button.addEventListener('click', () => {
    timer();
    button.classList.add('button-hidden');
    inputElement.removeAttribute("readonly", "true");
    inputElement.focus();
    inputElement.placeholder = "";
});

inputElement.addEventListener('keydown', KeyDownPressed);

inputElement.addEventListener('keyup', KeyUpPressed);
