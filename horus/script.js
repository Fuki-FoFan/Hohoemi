function startGame() {
    score     =  0;
    document.getElementById('score').textContent = `スコア: ${score}`;
    document.getElementById('timer').textContent = `残り時間: ${timeLeft}秒`;

    if (gameInterval) clearInterval(gameInterval);
    if (timerInterval) clearInterval(timerInterval);

    gameInterval = setInterval(() => moleAppear(1), 1000);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `残り時間: ${timeLeft}秒`;

        switch (true) {
            case (timeLeft === 10):
                clearInterval(gameInterval);
                gameInterval = setInterval(() => moleAppear(1), 800); // 500msに変更
                break;
            case (timeLeft === 5):
                clearInterval(gameInterval);
                gameInterval = setInterval(() => moleAppear(2), 800); // 800msに変更
                break;
            case (timeLeft <= 0):
                moleReset();
                clearInterval(gameInterval);
                clearInterval(timerInterval);
                endGame();
                break;
        }
    }, 1000);
}

function endGame() {
    localStorage.setItem("score_horus_easy",score);
    window.location.href = './finish.html';
}

function getRandomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function moleReset() {
    holes.forEach(hole => {
        hole.className = 'hole';
        hole.dataset.hole = 0;
        hole.dataset.timer = 0;
        hole.removeEventListener('click', whackAMole);
    });
}

function moleAppear(n){
    for(let i=0; i<n; i++){
        const randomHole = getRandomHole();
        const randomMoleIndex = Math.floor(Math.random() * tableLength);
        const tableKey = tablekeys[randomMoleIndex];
        if (randomHole.dataset.timer !== '0') {
            clearTimeout(Number(randomHole.dataset.timer));
            randomHole.className = 'hole';
            randomHole.dataset.timer = 0;
        }
        if (randomHole.dataset.hole !== '0') randomHole.className = 'hole';
        randomHole.classList.add(tableKey);
        randomHole.dataset.hole = scoreTable[tableKey];
        moleDisappear(randomHole);
    }
}

function whackAMole(event) {
    const whackedMole = event.target;
    const thisScore = Number(whackedMole.dataset.hole);
    if (thisScore !== 0) {
        score += thisScore;
        document.getElementById('score').textContent = `スコア: ${score}`;
        whackedMole.dataset.hole = 0;
        whackedMole.classList.add('whacked');
        moleLeave(whackedMole);
        setTimeout(() => moleAppear(1), 200);
    }
}

function moleLeave(element) {
    clearTimeout(Number(element.dataset.timer));
    element.dataset.timer = setTimeout(() => {
        element.className = 'hole';
        element.dataset.timer = 0;
    }, 300);
}

function moleDisappear(element) {
    element.dataset.timer = setTimeout(() => {
        element.className = 'hole';
        element.dataset.hole = 0;
        element.dataset.timer = 0;
    }, 800);
}

function getMode() {
    const url = new URL(window.location.href);
    const mode = url.searchParams.get('mode');
    return mode === 'easy' || 'normal' || 'hard' ? mode : 'easy';
}

function getScoreTable(mode) {
    const moleArray1 = {
        cremeBrulee:    10,
        turducken:      10,
        panDeMuerto:    10,
        parfait:        20,
        blueCheese:     30,
    };
    
    const moleArray2 = {
        mousseCake:     -5,
        blueCheese:     -5,
        parfait:        10,
        schupfnudel:    10,
        moussaka:       10,
        kaiserschmarrn: 20,
        hakarl:         20,
        whisky:         30,
        minestrone:     30,
    };
    
    const moleArray3 = {
        mousseCake:     -5,
        blueCheese:     -5,
        parfait:        -5,
        cookie:         -5,
        reindeer:       -5,
        schupfnudel:    10,
        moussaka:       10,
        kaiserschmarrn: 20,
        hakarl:         20,
        whisky:         30,
        minestrone:     30,
    };

    switch (mode) {
        case 'easy':
            return moleArray1;
        case 'normal':
            return moleArray1;
        case 'hard':
            return moleArray1;
        default:
            return moleArray1;
            break;
    }
}

function getTimeLeft(mode) {
    switch (mode) {
        case 'easy':
            return 20;
        case 'normal':
            return 30;
        case 'hard':
            return 30;
        default:
            return 20;
            break;
    }
}

let score = 0;
let gameInterval = null;
let timeLeft = getTimeLeft(getMode());
let timerInterval = null;
const scoreTable = getScoreTable(getMode());
const tablekeys = Object.keys(scoreTable);
const tableLength = Object.keys(scoreTable).length;
const holes = document.querySelectorAll('.hole');
let bonusCount = 0;

holes.forEach(hole => {
    hole.addEventListener('click', whackAMole);
});


startGame();
