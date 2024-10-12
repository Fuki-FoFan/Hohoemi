let score = 0;
let counter = [0,0,0,0];
let bestscore = JSON.parse(localStorage.getItem("bestscore"));
if (bestscore===null) {bestscore = [];}
if (bestscore.length < 3) {
    bestscore.push(0);
    bestscore.push(0);
    bestscore.push(0);
}

const myMouseDown = function(event) {
    let grape = event.target;

    // アイテムをいい感じに動かせるようにしてるところ
    let shiftX = event.clientX - grape.getBoundingClientRect().left;
    let shiftY = event.clientY - grape.getBoundingClientRect().top;
  
    grape.style.position = 'absolute';
    grape.style.zIndex = 1000;
    document.body.appendChild(grape);
  
    moveAt(event.pageX, event.pageY);
  
    function moveAt(pageX, pageY) {
        let newX = pageX - shiftX;
        let newY = pageY - shiftY;

        // 画面端に到達したら位置を修正する
        if (newX < 0) {
            newX = 0;
        } else if (newX > window.innerWidth - grape.offsetWidth) {
            newX = window.innerWidth - grape.offsetWidth;
        }
        if (newY < 0) {
            newY = 0;
        } else if (newY > window.innerHeight - grape.offsetHeight) {
            newY = window.innerHeight - grape.offsetHeight;
        }

        grape.style.left = newX + 'px';
        grape.style.top = newY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // mousemoveでアイテムを移動する
    document.addEventListener('mousemove', onMouseMove);
  
    // アイテムをドロップ、不要なハンドラを消去
    grape.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      grape.onmouseup = null;
      const grapeRect = grape.getBoundingClientRect();
      let dropZone = document.getElementById('disappear');
      const dropZoneRect = dropZone.getBoundingClientRect();
      if (
        grapeRect.left < dropZoneRect.right &&
        grapeRect.right > dropZoneRect.left &&
        grapeRect.top < dropZoneRect.bottom &&
        grapeRect.bottom > dropZoneRect.top)
        {
            scoreCount(grape);
            document.body.removeChild(grape);
            addGrape();
        };
    };
  
};

//スマホ用
const myTouchStart = function(event) {
    let grape = event.target;
    let touch = event.targetTouches[0];

    // タッチ位置とアイテムのオフセットを計算
    let shiftX = touch.pageX - grape.getBoundingClientRect().left;
    let shiftY = touch.pageY - grape.getBoundingClientRect().top;

    // アイテムを移動可能な状態に設定
    grape.style.position = 'absolute';
    grape.style.zIndex = 1000;
    document.body.appendChild(grape);

    // アイテムの移動開始位置を設定
    moveAt(touch.pageX, touch.pageY);

    function moveAt(pageX, pageY) {
        let newX = pageX - shiftX;
        let newY = pageY - shiftY;

        // 画面端に到達したら位置を修正する
        if (newX < 0) {
            newX = 0;
        } else if (newX > window.innerWidth - grape.offsetWidth) {
            newX = window.innerWidth - grape.offsetWidth;
        }
        if (newY < 0) {
            newY = 0;
        } else if (newY > window.innerHeight - grape.offsetHeight) {
            newY = window.innerHeight - grape.offsetHeight;
        }

        grape.style.left = newX + 'px';
        grape.style.top = newY + 'px';
    }

    function onTouchMove(event) {
        let touch = event.targetTouches[0];
        moveAt(touch.pageX, touch.pageY);
    }

    // タッチ移動時の処理を追加
    document.addEventListener('touchmove', onTouchMove);

    // アイテムをドロップ、不要なハンドラを消去
    grape.ontouchend = function() {
        document.removeEventListener('touchmove', onTouchMove);
        grape.ontouchend = null;
        const grapeRect = grape.getBoundingClientRect();
        let dropZone = document.getElementById('disappear');
        const dropZoneRect = dropZone.getBoundingClientRect();
        if (
            grapeRect.left < dropZoneRect.right &&
            grapeRect.right > dropZoneRect.left &&
            grapeRect.top < dropZoneRect.bottom &&
            grapeRect.bottom > dropZoneRect.top) {
            scoreCount(grape);
            document.body.removeChild(grape);
            addGrape();
        };
    };
};

function getRandomCoordinates(parentElementId) {
    // 親要素を取得
    var parentElement = document.getElementById(parentElementId);
    
    // 親要素の枠内の座標を取得
    var parentRect = parentElement.getBoundingClientRect();
    var parentLeft = parentRect.left;
    var parentTop = parentRect.top;
    var parentWidth = parentRect.width;
    var parentHeight = parentRect.height;
    
    // アイテムの幅と高さを取得
    var grapeWidth = 80;
    var grapeHeight = 100;
    
    // ランダムなx座標とy座標を生成
    var randomX = Math.floor(Math.random() * (parentWidth - grapeWidth)) + parentLeft;
    var randomY = Math.floor(Math.random() * (parentHeight - grapeHeight)) + parentTop;
    
    // オブジェクトで返す
    return { x: randomX, y: randomY };
};

function addGrape(){
    let grape = document.createElement('div');
    grape.classList.add('grape');
    let odds = Math.floor(Math.random() * 100);
    if(odds<3){
        grape.classList.add('whitegrape');
    }else if(odds<13){
        grape.classList.add('greengrape');
    }else{
        if(Math.floor(Math.random() * 2)<1){
            grape.classList.add('blackgrape');
        }else{
            grape.classList.add('redgrape');
        }
    }
    var coordinates = getRandomCoordinates("appear");
    grape.style.left = coordinates.x + "px";
    grape.style.top = coordinates.y + "px";
    grape.onmousedown = function(event) {myMouseDown(event)};
    grape.ondragstart = function() {
        return false;
    };
    grape.ontouchstart = function(event) {myTouchStart(event)};
    document.body.appendChild(grape);
};

function scoreCount(elem){
    if(elem.classList.contains('greengrape')){
        score+=10;
        counter[1]++;
        document.getElementById('vidal').style.backgroundImage = "url('./resource/vidal2.png')";
    }else if(elem.classList.contains('whitegrape')){
        score+=30;
        counter[0]++;
        document.getElementById('vidal').style.backgroundImage = "url('./resource/vidal3.png')";
    }else if(elem.classList.contains('redgrape')){
        score+=3;
        counter[2]++;
        document.getElementById('vidal').style.backgroundImage = "url('./resource/vidal1.png')";
    }else{
        score+=2;
        counter[3]++;
        document.getElementById('vidal').style.backgroundImage = "url('./resource/vidal1.png')";
    }
    document.getElementById('score').innerText = `Score: ${score}`;
};

function hideStartText() {
    let startText = document.getElementById('start');
    let opacity = 1; // 最初は不透明

    let interval = setInterval(function() {
        opacity -= 0.1;
        startText.style.opacity = opacity;
        // opacityが0以下になったらタイマーを停止して要素非表示
        if (opacity <= 0) {
            clearInterval(interval);
            startText.style.display = 'none';
        }else if(opacity === 0.8){
            startText.style.zIndex = 10;
        }
    }, 50);
};

function startCountdown() {
    var count = 10;
    var countdownDisplay = document.getElementById('remaining');

    var countdownInterval = setInterval(function() {
        countdownDisplay.textContent = count;
        count--;

        // カウント0でタイマー停止ページ移動
        if (count < 0) {
            clearInterval(countdownInterval);
            localStorage.setItem("score",score);
            localStorage.setItem("counter", JSON.stringify(counter));
            bestscore.push(score);
            bestscore.sort((a, b) => b - a);
            bestscore.slice(0, 3);
            localStorage.setItem("bestscore", JSON.stringify(bestscore));
            window.location.href = './finish.html';
        }
    }, 1000); // 1000ミリ秒（1秒）ごと
};

window.onload = function(){
    //スマホ用スクロール阻止
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, { passive: false });
    for(i=0;i<10;i++){
        addGrape();
    };
    hideStartText();
    startCountdown();
};
