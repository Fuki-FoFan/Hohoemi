const itemNameA = 'itemA';
const itemNameB = 'itemB';
const extra = 'bird';
const special = 'pidan';
const scoreSetting = {
    [itemNameA]: 3,
    [itemNameB]: 5,
    [extra]: 20,
    [special]: 30,
};
const scoreLog = {
    [itemNameA]: 0,
    [itemNameB]: 0,
    [extra]: 0,
    [special]: 0,
    bestscore: [],
};
const frequency = {
    [itemNameA]: 50,
    [itemNameB]: 48,
    [extra]: 1.5,
    [special]: 0.5,
};
let gameTimeSeconds = 15;

const svgHTML = `<svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="black" stroke-width="7" fill="none" />
                <line x1="50" y1="50" x2="75" y2="50" stroke="black" stroke-width="9" />
                <line x1="50" y1="50" x2="50" y2="18" stroke="black" stroke-width="7" />
                <circle cx="50" cy="50" r="2" fill="black" />
                </svg>`;

document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const itemContainer = document.getElementById('item-container'); // アイテムを含むコンテナ
    let score = 0;

    function randomPosition() {
        return Math.floor(Math.random() * 900); // 画面内のランダムな位置を返す
    }

    function updateScore(item) {
        const classes = item.classList;
        classes.forEach(className => {
            switch (className) {
                case itemNameA:
                    score += scoreSetting[itemNameA];
                    scoreLog[itemNameA]++;
                    break;

                case itemNameB:
                    score += scoreSetting[itemNameB];
                    scoreLog[itemNameB]++;
                    break;

                case extra:
                    score += scoreSetting[extra];
                    scoreLog[extra]++;
                    break;

                case special:
                    score += scoreSetting[special];
                    scoreLog[special]++;
                    break;
            }
        });
        document.getElementById('score').innerText = `Score: ${score}`;
    }

    function moveCharacter(e) {
        let x;
        if (e.type === 'touchmove') {
            x = e.touches[0].clientX;
        } else {
            x = e.clientX;
        }
        character.style.left = `${x}px`;
    }

    function dropItem(flag) {
        const item = document.createElement('div'); // 新しいアイテムを作成
        item.className = flag; // CSSクラスを追加

        item.style.left = `${randomPosition()}px`; // ランダムな位置に設定
        item.style.top = '0'; // アイテムの初期位置を設定
        itemContainer.appendChild(item); // アイテムをコンテナに追加
    }

    function fallItem(className, fallDistance) {
        const items = document.getElementsByClassName(className);

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemTop = parseInt(item.style.top) || 0; // 初期値がない場合にNaNとなるのを防ぐため、0を指定
            if (itemTop >= window.innerHeight) {
                item.remove(); // 画面外に出たらアイテムを削除
            } else {
                item.style.top = `${itemTop + fallDistance}px`; // 移動量に応じて下に移動
            }
        }
    }

    function moveExtra() {
        const birds = document.querySelectorAll('.' + extra);
        if (birds.length == 0) {
            return;
        }
        birds.forEach(bird => {
            const itemTop = parseInt(bird.style.top);
            let moveDistance = 3;
            if (Math.random() < 0.13) {
                moveDistance = -10;
            }
            if (itemTop >= window.innerHeight) {
                bird.remove(); // 画面外に出たらアイテムを削除
            } else {
                bird.style.top = `${itemTop + moveDistance}px`; // 移動量に応じて下に移動
            }
        });
    }

    function checkCollision() {
        const characterRect = character.getBoundingClientRect();
        const items = document.querySelectorAll('.' + itemNameA + ', .' + itemNameB + ', .' + extra + ', .' + special);
        if (items.length == 0) {
            return;
        }

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (
                characterRect.top <= itemRect.bottom &&
                characterRect.bottom >= itemRect.top &&
                characterRect.left <= itemRect.right &&
                characterRect.right >= itemRect.left
            ) {
                updateScore(item);
                item.remove(); // 衝突したアイテムを削除
            }
        });
    }

    function score2localstrage() {
        localStorage.removeItem('score');
        let s = localStorage.getItem('scorelog');
        if (s === null) {
            scoreLog.bestscore = [0, 0, 0]
        } else {
            scoreLog.bestscore = (JSON.parse(s)).bestscore;
        }
        scoreLog.bestscore.push(score);
        scoreLog.bestscore.sort(function (a, b) {
            return b - a;
        });
        scoreLog.bestscore.pop();
        localStorage.setItem('score', score);
        localStorage.setItem('scorelog', JSON.stringify(scoreLog));
    }

    document.addEventListener('mousemove', moveCharacter);
    document.addEventListener('touchmove', moveCharacter);

    let dropItemInterval = setInterval(() => {
        // アイテムを動かす
        fallItem(itemNameA, 6);
        fallItem(itemNameB, 8);
        fallItem(special, 13);
        moveExtra();
        // moveSpecial();

        checkCollision(); //衝突検知

        //アイテム落下
        let drop = Math.random();
        if (drop < 0.09) {
            let rand = Math.random() * 100;
            if (rand < frequency[itemNameA]) {
                dropItem(itemNameA);
            } else if (rand < frequency[itemNameA] + frequency[itemNameB]) {
                dropItem(itemNameB);
            } else if (rand < frequency[itemNameA] + frequency[itemNameB] + frequency[extra]) {
                dropItem(extra);
            } else if (rand < frequency[itemNameA] + frequency[itemNameB] + frequency[extra] + frequency[special]) {
                dropItem(special);
            }
        }
    }, 10); // 0.01秒ごとに衝突をチェック

    let start = document.getElementById('start');
    let opa = 1;
    let startMessage = setInterval(() => {
        if (opa <= 0) {
            clearInterval(startMessage);
            start.style.display = 'none';
        }
        start.style.opacity = opa;
        opa -= 0.1;
    }, 100);

    document.getElementById('timer').innerHTML = svgHTML + `: ${gameTimeSeconds}`;
    let countdownTimer = setInterval(() => {
        gameTimeSeconds--;
        document.getElementById('timer').innerHTML = svgHTML + `: ${gameTimeSeconds}`;
    }, 1000);

    setTimeout(() => {
        clearInterval(dropItemInterval);
        clearInterval(countdownTimer);
        document.getElementById("finish").innerText = "FINISH!";
        score2localstrage();
        setTimeout(() => {
            window.location.href = './finish.html'
        }, 2000);
    }, 15010); // 15秒後に停止
});
