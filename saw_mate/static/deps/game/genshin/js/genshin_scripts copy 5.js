import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CARDS, emperorTexture, slaveTexture } from './genshin_hero_card.js';
import { HEROCARDS, myHero1Texture, myHero2Texture, myHero3Texture, opponentHero1Texture, opponentHero2Texture, opponentHero3Texture } from './genshin_hero_card.js';

//Получаем пути к текстурам из атрибутов элемента
const audioPaths = document.getElementById('audio-paths');
const card_drop_audioPaths = audioPaths.dataset.card_drop;
const card_flip_audioPaths = audioPaths.dataset.card_flip;

// Получение кнопок
const btnSwitchHero1 = document.getElementById('btn-switchHero1');
const btnAnimate1 = document.getElementById('btn-animate1');
const btnAnimate2 = document.getElementById('btn-animate2');
const btnAnimate3 = document.getElementById('btn-animate3');

//добавляем загрузчик 3д моделей
const gltfLoader = new GLTFLoader();

//анимация
let hoveredCard;
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let x = -2;

//формируем набор карт противника
const opponentCards = [];
for(let i = 5; i < CARDS.length; i++) {
    opponentCards.push(CARDS[i]);
}
//формируем набор карт героев противника
const opponentHeroCards = [];
for(let i = 3; i < HEROCARDS.length; i++) {
    opponentHeroCards.push(HEROCARDS[i]);
}
//формируем набор карт игрока
const playerCards = [];
for(let i = 0; i < 5; i++) {
    playerCards.push(CARDS[i]);
}
//формируем набор карт героев противника
const playerHeroCards = [];
for(let i = 3; i < HEROCARDS.length; i++) {
    playerHeroCards.push(HEROCARDS[i]);
}
//объявляем константы для позиции и вращения карт
const initialCardsPositions = [];
const initialCardsRotations = [];
const initialHeroCardsPositions = [];
const initialHeroCardsRotations = [];

//логика табло побед
let playNext = true;
let round = 1;

//захват элементов шаблона для визуализации игровой статистики
const pScore = document.getElementById('player-score');
const oScore = document.getElementById('opponent-score');
const p1 = document.getElementById('p1');
const p2 = document.getElementById('p1');
let playerScore = 0;
let opponentScore = 0;
const loss = document.getElementById('loss');
const draw = document.getElementById('draw');
const victory = document.getElementById('victory');
const rematch = document.getElementById('rematch');
let finished = false;

//добавление звука в игру
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
let cardDrop = new THREE.Audio(listener);
let cardFlip = new THREE.Audio(listener);

//рендер из курса
const renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
//мой рендер
// const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(1000, 700);
//получение объекта куда будет передаваться canvas
const sceneBox = document.getElementById('scene-box');
sceneBox.appendChild(renderer.domElement);

//белый фон
renderer.setClearColor(0xFEFEFE);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50, //мастшаб
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
//управление сценой для отладки
const controls = new OrbitControls(camera, renderer.domElement)
// Camera positioning
// camera.position.set(0, 10, 6);
// camera.lookAt(new THREE.Vector3(0, 6, 2));
camera.position.set(0.25, 6, -3);
//camera.zoom.set = 1;
// camera.lookAt(new THREE.Vector3(10, -500, -8));
camera.lookAt(new THREE.Vector3(0.25, -50, 2));
// Вращение камеры по часовой стрелке (например, на 45 градусов)
// camera.rotation.x = -Math.PI / 4;
// camera.rotation.z = -Math.PI / 2;

//добавление звука
audioLoader.load(card_drop_audioPaths, function(buffer) {
    cardDrop.setBuffer(buffer);
    cardDrop.setVolume(2);
});
audioLoader.load(card_flip_audioPaths, function(buffer) {
    cardFlip.setBuffer(buffer);
    cardFlip.setVolume(2);
});

//игра со светом
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
directionalLight.position.y = 10;
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
const ambientLight = new THREE.AmbientLight(0xA3A3A3, 0.3);
scene.add(ambientLight);
const staticUrl = document.getElementById("scene-box").getAttribute("data-static-url");
gltfLoader.load(staticUrl, function(glb) {
    console.log(glb);
    const model = glb.scene;
    scene.add(model);
    model.rotateY(Math.PI / 2);
    model.scale.set(3, 3, 3);
    model.position.set(0.25, 0, 0.2);
    
    model.traverse(function(node) {
        if(node.isMesh)
            node.receiveShadow = true;
    });
});
//сетка Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

//добавление карточек из массива CARDS на сцену
CARDS.forEach(function(card) {
    scene.add(card);
    const v = new THREE.Vector3();
    v.copy(card.position);
    initialCardsPositions.push(v);
    initialCardsRotations.push(card.rotation.z);
});
//добавление карточек из массива HEROCARDS на сцену
HEROCARDS.forEach(function(card) {
    scene.add(card);
    const v = new THREE.Vector3();
    v.copy(card.position);
    initialHeroCardsPositions.push(v);
    initialHeroCardsRotations.push(card.rotation.z);
});
// обработка нового раунда
function nextRound() {
    if(CARDS[0].name === 'hand playerCard1 emperor') {
        CARDS[0].material[4].map = slaveTexture;
        CARDS[0].name = 'hand playerCard1 slave';
        CARDS[5].material[4].map = emperorTexture;
        CARDS[5].name = 'emperor';
        p1.style.background = 'linear-gradient(90deg, rgba(223, 207, 96, 0.8) 0%, rgba(255, 255, 255, 0) 100%)';
        p2.style.background = 'linear-gradient(90deg, rgba(83, 0, 0, 0.8) 0%, rgba(255, 255, 255, 0) 100%)';
    } 
    else if (CARDS[0].name === 'hand playerCard1 slave') {
        CARDS[0].material[4].map = emperorTexture;
        CARDS[0].name = 'hand playerCard1 emperor';
        CARDS[5].material[4].map = slaveTexture;
        CARDS[5].name = 'slave';
        p2.style.background = 'linear-gradient(90deg, rgba(223, 207, 96, 0.8) 0%, rgba(255, 255, 255, 0) 100%)';
        p1.style.background = 'linear-gradient(90deg, rgba(83, 0, 0, 0.8) 0%, rgba(255, 255, 255, 0) 100%)';
    }
}
//отображение результата игры и кнопки повторить игру
function showResult() {
    if(playerScore > opponentScore) {
        victory.style.display = 'inline-block';
        rematch.style.display = 'inline';
    }
    else if(playerScore < opponentScore) {
        loss.style.display = 'inline-block';
        rematch.style.display = 'inline';
    }
    else if(playerScore === opponentScore) {
        draw.style.display = 'inline-block';
        rematch.style.display = 'inline';
    }
}
//перемешивание элементов массива
function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
//обновление раунда игры
function resetAndUpdate(side, sideText) {

    x = -2;
    round++;

    if(side === 'player') {
        playerScore++;
        sideText.textContent = playerScore;
    } else if(side === 'opponent') {
        opponentScore++;
        sideText.textContent = opponentScore;
    }

    const arr1 = [];
    const arr2 = [];
    for(let i = 0; i < 5; i++) {
        arr1[i] = CARDS[i];
        arr2[i] = CARDS[i + 5];
    }
    shuffleArray(arr1);
    shuffleArray(arr2);

    for(let i = 0; i < 5; i++) {
        playerCards[i] = arr1[i];
        playerCards[i].position.copy(initialCardsPositions[i]);
        playerCards[i].rotation.set(-Math.PI / 2, 0, initialCardsRotations[i]);
        playerCards[i].scale.set(1, 1, 1);

        opponentCards[i] = arr2[i];
        opponentCards[i].position.copy(initialCardsPositions[i + 5]);
        opponentCards[i].rotation.set(Math.PI * 2, Math.PI, initialCardsRotations[i + 5]);
        opponentCards[i].scale.set(1, 1, 1);

        CARDS[i].name = 'hand ' + CARDS[i].name;
    }
    //инициализация карточек героев
    for(let i = 0; i < 3; i++) {
        playerHeroCards[i] = arr1[i];
        playerHeroCards[i].position.copy(initialCardsPositions[i]);
        playerHeroCards[i].rotation.set(-Math.PI / 2, 0, initialCardsRotations[i]);
        playerHeroCards[i].scale.set(1, 1, 1);

        opponentHeroCards[i] = arr2[i];
        opponentHeroCards[i].position.copy(initialCardsPositions[i + 3]);
        opponentHeroCards[i].rotation.set(Math.PI * 2, Math.PI, initialCardsRotations[i + 3]);
        opponentHeroCards[i].scale.set(1, 1, 1);

        HEROCARDS[i].name = 'hand ' + HEROCARDS[i].name;
    }
    //обработка событий раундов игры
    if(round === 4)
        nextRound();
    else if(round === 7) {
        finished = true;
        showResult();
    }
}
// Создаем объект для представления указателя мыши для отладки
const mousePointerGeometry = new THREE.CircleGeometry(0.05, 32);
const mousePointerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mousePointer = new THREE.Mesh(mousePointerGeometry, mousePointerMaterial);
scene.add(mousePointer);
// Обработчик события "mousemove"
window.addEventListener('mousemove', function(e) {
    // Обновляем позицию указателя мыши в соответствии с позицией мыши на экране
    const mousePositionX = (e.clientX / window.innerWidth) * 2 - 1;
    const mousePositionY = -(e.clientY / window.innerHeight) * 2 + 1;
    mousePointer.position.set(mousePositionX, mousePositionY, 0);
});

//моя тестовая анимация для работы с карточками героев
// Переменная для хранения ID карточки с заданными координатами
let myActiveCardId = null;
// Заданные координаты
const myActiveCardCoordinates = {
    position: { x: 0.25, y: 1, z: -3.3 },
    rotation: { y: 0, z: 3.1 },
    scale: { x: 1.2, y: 1.2, z: 1.2 }
};
//позиции для циклической смены карточек героев
const positions = [
    { position: { x: 0, y: 0.9, z: -3.8 }, rotation: { y: 0, z: 3.2 }, scale: { x: 1, y: 1, z: 1 } },
    { position: { x: 0.25, y: 1, z: -3.3 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { position: { x: 0.5, y: 0.91, z: -3.8 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1, y: 1, z: 1 } }
];
//счетчик нажатия на кнопку смены героя
let clickCount = 0;
// Добавление обработчиков событий для кнопок
// кнопка смены героя
btnSwitchHero1.addEventListener('click', function() {
    // Пример анимации для кнопки 1
    //console.log('btnAnimate1');
    //создаем таймлайн с настройками по умолчанию
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    //вперед
    for (let i = 0; i < 3; i++) {
        const animatedCard = HEROCARDS[i];
        const positionIndex = (clickCount + i) % 3;

        t1.to(animatedCard.position, {
            x: positions[positionIndex].position.x,
            y: positions[positionIndex].position.y,
            z: positions[positionIndex].position.z
        }, 0)
        .to(animatedCard.rotation, {
            y: positions[positionIndex].rotation.y,
            z: positions[positionIndex].rotation.z
        }, 0)
        .to(animatedCard.scale, {
            x: positions[positionIndex].scale.x,
            y: positions[positionIndex].scale.y,
            z: positions[positionIndex].scale.z
        }, 0);
        // Проверка, совпадают ли координаты с целевыми координатами
        if (positions[positionIndex].position.x === myActiveCardCoordinates.position.x &&
            positions[positionIndex].position.y === myActiveCardCoordinates.position.y &&
            positions[positionIndex].position.z === myActiveCardCoordinates.position.z &&
            positions[positionIndex].rotation.y === myActiveCardCoordinates.rotation.y &&
            positions[positionIndex].rotation.z === myActiveCardCoordinates.rotation.z &&
            positions[positionIndex].scale.x === myActiveCardCoordinates.scale.x &&
            positions[positionIndex].scale.y === myActiveCardCoordinates.scale.y &&
            positions[positionIndex].scale.z === myActiveCardCoordinates.scale.z) {
            myActiveCardId = i; // Сохраняем ID карточки
            console.log('myActiveCardId = ' + i);
        }
    }
    clickCount++;
    console.log('btnSwitchHero1 clicked and myActiveCardId');
    switchOpponentActiveCard();
});

// Переменная для хранения ID карточки противника с заданными координатами
let opponentActiveCardId = null;
// Заданные координаты
const opponentActiveCardCoordinates = {
    position: { x: 0.25, y: 1, z: -1.7 },
    rotation: { y: 0, z: 3.1 },
    scale: { x: 1.2, y: 1.2, z: 1.2 }
};
//позиции для циклической смены карточек героев
const positions2 = [
    { position: { x: 0, y: 0.9, z: -1.2 }, rotation: { y: 0, z: 3.2 }, scale: { x: 1, y: 1, z: 1 } },
    { position: { x: 0.25, y: 1, z: -1.7 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { position: { x: 0.5, y: 0.91, z: -1.2 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1, y: 1, z: 1 } }
];
//переключение карточек героев оппонента в виде функции
function switchOpponentActiveCard() {
    let Count = 0;
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    //вперед
    for (let i = 3; i < 6; i++) {
        const animatedCard = HEROCARDS[i];
        const positionIndex = (clickCount  + i) % 3;
        t1.to(animatedCard.position, {
            x: positions2[positionIndex].position.x,
            y: positions2[positionIndex].position.y,
            z: positions2[positionIndex].position.z
        }, 0)
        .to(animatedCard.rotation, {
            y: positions2[positionIndex].rotation.y,
            z: positions2[positionIndex].rotation.z
        }, 0)
        .to(animatedCard.scale, {
            x: positions2[positionIndex].scale.x,
            y: positions2[positionIndex].scale.y,
            z: positions2[positionIndex].scale.z
        }, 0);
        // Проверка, совпадают ли координаты с целевыми координатами
        if (positions2[positionIndex].position.x === opponentActiveCardCoordinates.position.x &&
            positions2[positionIndex].position.y === opponentActiveCardCoordinates.position.y &&
            positions2[positionIndex].position.z === opponentActiveCardCoordinates.position.z &&
            positions2[positionIndex].rotation.y === opponentActiveCardCoordinates.rotation.y &&
            positions2[positionIndex].rotation.z === opponentActiveCardCoordinates.rotation.z &&
            positions2[positionIndex].scale.x === opponentActiveCardCoordinates.scale.x &&
            positions2[positionIndex].scale.y === opponentActiveCardCoordinates.scale.y &&
            positions2[positionIndex].scale.z === opponentActiveCardCoordinates.scale.z) {
            opponentActiveCardId = i; // Сохраняем ID карточки
            console.log('opponentActiveCard = ' + i);
        }
    }
};

// Пример анимации для кнопки 1
btnAnimate1.addEventListener('click', function() {
    console.log('btnAnimate1');
    //проверка наличия активной карты героя
    if (myActiveCardId !== null) {
        const myActiveCard = HEROCARDS[myActiveCardId];

    //создаем таймлайн анимации хода игрока
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    console.log('начало анимации 1');
    //вперед
    t1.to(myActiveCard.position, { y: 0.96, z: -3.8 })
    .to(myActiveCard.rotation, { z: 3.5 }, 0)
    .to(myActiveCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(myActiveCard.position, { z: -2.4 }, 0.4)
    //обратно
    .to(myActiveCard.rotation, { y: 0, z: 3.1 }, 0.8)
    .to(myActiveCard.scale, { x: 4, y: 4, z: 4 }, 0.8)
    .to(myActiveCard.position, { x: 0.25, y: 1, z: -3.3 }, 0.8);

    //карта героя оппонента
    const animatedCard2 = HEROCARDS[opponentActiveCardId]; // Выбираем первую карточку для примера
    const t2 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    console.log('начало анимации 2');
    //вперед
    t2.to(animatedCard2.position, { y: 0.96, z: -1.7})
    .to(animatedCard2.rotation, { z: 3 }, 0)
    .to(animatedCard2.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(animatedCard2.position, { z: -2.4 }, 0.4)
    //обратно
    .to(animatedCard2.rotation, { y: 0, z: 3.1 }, 0.8)
    .to(animatedCard2.scale, { x: 1.2, y: 1.2, z: 1.2 }, 0.8)
    .to(animatedCard2.position, { x: 0.25, y: 1, z: -1.7 }, 0.8);

    } else {
        console.log('ошибка - не была выбрана активная карта перед началом раунда')
    }
});

//{ position: { x: 0.25, y: 1, z: -1.7 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },

btnAnimate2.addEventListener('click', function() {
    // Пример анимации для кнопки 2
    console.log('btnAnimate2');
    const animatedCard = HEROCARDS[1]; // Выбираем первую карточку для примера
    //создаем таймлайн с настройками по умолчанию
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    //вперед
    t1.to(animatedCard.position, { y: 0.96, z: -3.8 })
    .to(animatedCard.rotation, { z: 3.5 }, 0)
    .to(animatedCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(animatedCard.position, { z: -2.4 }, 0.4)
    //обратно
    .to(animatedCard.rotation, { z: 3.1 }, 0.8)
    .to(animatedCard.scale, { x: 1, y: 1, z: 1 }, 0.8)
    .to(animatedCard.position, { y: 0.91, z: -3.5 }, 0.8);

    //карта героя оппонента
    const animatedCard2 = HEROCARDS[4]; // Выбираем первую карточку для примера
    const t2 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    //вперед
    t2.to(animatedCard2.position, { y: 0.94}, 0)
    .to(animatedCard2.rotation, { z: 3 }, 0)
    .to(animatedCard2.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(animatedCard2.position, { z: -2.4 }, 0.4)
    //обратно
    .to(animatedCard2.rotation, { z: 3.2 }, 0.8)
    .to(animatedCard2.scale, { x: 1, y: 1, z: 1 }, 0.8)
    .to(animatedCard2.position, { y: 0.91, z: -1.5 }, 0.8);
    console.log('btnAnimate2 clicked and animation started');
});

btnAnimate3.addEventListener('click', function() {
    // Пример анимации для кнопки 3
    console.log('btnAnimate3');
    const animatedCard = HEROCARDS[2]; // Выбираем первую карточку для примера
    //создаем таймлайн с настройками по умолчанию
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    //вперед
    t1.to(animatedCard.position, { y: 0.96, z: -3.8 })
    .to(animatedCard.rotation, { z: 3.5 }, 0)
    .to(animatedCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(animatedCard.position, { z: -2.4 }, 0.4)
    //обратно
    .to(animatedCard.rotation, { z: 3.1 }, 0.8)
    .to(animatedCard.scale, { x: 1, y: 1, z: 1 }, 0.8)
    .to(animatedCard.position, { y: 0.92, z: -3.5 }, 0.8);

    //карта героя оппонента
    const animatedCard2 = HEROCARDS[5]; // Выбираем первую карточку для примера
    const t2 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    //вперед
    t2.to(animatedCard2.position, { y: 0.94}, 0)
    .to(animatedCard2.rotation, { z: 3 }, 0)
    .to(animatedCard2.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(animatedCard2.position, { z: -2.4 }, 0.4)
    //обратно
    .to(animatedCard2.rotation, { z: 3.2 }, 0.8)
    .to(animatedCard2.scale, { x: 1, y: 1, z: 1 }, 0.8)
    .to(animatedCard2.position, { y: 0.92, z: -1.5 }, 0.8);
    console.log('btnAnimate3 clicked and animation started');
});

//анимация
window.addEventListener('click', function(e) {
    //mouseMoveIndicator.position.set(e.clientX, e.clientY, 0); // установка позиции круга
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
    // mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    // mousePosition.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObject(scene);
    if(intersects.length > 0) {
        if(intersects[0].object.name.includes('hand playerCard') && !finished) {
            hoveredCard = intersects[0].object;
            //console.log(hoveredCard); // Выводим значение hoveredCard в консоль
            intersects[0].object.name = hoveredCard.name.replace('hand ', '');
        }
    }
    if(hoveredCard && playNext && !finished) {
        playNext = false;
        //запуск звука
        cardFlip.play();
        const t1 = gsap.timeline({
            defaults: {duration: 0.4, delay: 0.1}
        });
        //анимации карт игрока
        t1.to(hoveredCard.rotation, { y: Math.PI, z: 0 })
        .to(hoveredCard.position, { y: 0.91, z: -2.9, x }, 0)
        // .to(hoveredCard.position, { y: 3.18, z: 0.9, x }, 0)
        .to(hoveredCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
        // .to(hoveredCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
        .to(hoveredCard.rotation, { y: 0, delay: 1,
            //запуск звука
            onComplete: function() {
                cardDrop.play();
            }
        }, 0)
        .to(hoveredCard.position, { y: 0.91, delay: 1 }, 0)
        // .to(hoveredCard.position, { y: 3.88, delay: 1 }, 0)
        .to(hoveredCard.position, { y: 0.91, duration: 0.3, delay: 1.2 }, 0);
        // .to(hoveredCard.position, { y: 3.18, duration: 0.3, delay: 1.2 }, 0);

        let hoveredCName = hoveredCard.name;
        hoveredCard = null;

        const minimum = 0;
        let maximum = opponentCards.length - 1;
        let randomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        let oppCname = opponentCards[randomNumber].name;

        const t2 = new gsap.timeline({
            defaults: {duration: 0.4, delay: 0.4}
        });

        t2.to(opponentCards[randomNumber].rotation, { x: 2 * Math.PI - Math.PI / 2, z: Math.PI })
        .to(opponentCards[randomNumber].position, { y: 3.18, z: -0.7, x }, 0)
        .to(opponentCards[randomNumber].scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
        .to(opponentCards[randomNumber].rotation, { y: 0, delay: 1 }, 0)
        .to(opponentCards[randomNumber].position, { y: 3.88, delay: 1 }, 0)
        .to(opponentCards[randomNumber].position, { y: 3.18, duration: 0.3, delay: 1.2,
            //запуск звука
            onComplete: function() {
                playNext = true;
                if(hoveredCName.includes('emperor') && oppCname.includes('slave'))
                    resetAndUpdate('opponent', oScore);
                if(hoveredCName.includes('emperor') && oppCname.includes('citizen'))
                    resetAndUpdate('player', pScore);
                if(hoveredCName.includes('citizen') && oppCname.includes('slave'))
                    resetAndUpdate('player', pScore);
                if(hoveredCName.includes('slave') && oppCname.includes('emperor'))
                    resetAndUpdate('player', pScore);
                if(hoveredCName.includes('slave') && oppCname.includes('citizen'))
                    resetAndUpdate('opponent', oScore);
                if(hoveredCName.includes('citizen') && oppCname.includes('emperor'))
                    resetAndUpdate('opponent', oScore);
            }
        }, 0);

        if(x < 2)
            x++;
        opponentCards.splice(randomNumber, 1);
        }
    }
);
//обработка кнопки повторить игру
rematch.addEventListener('click', function() {
    finished = false;
    round = 1;
    playerScore = 0;
    opponentScore = 0;
    oScore.textContent = opponentScore;
    pScore.textContent = playerScore;
    rematch.style.display = 'none';
    victory.style.display = 'none';
    draw.style.display = 'none';
    loss.style.display = 'none';
});

function animate() {
    let sizes = {};
    sizes.width = 1000;
    sizes.height = 700;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    //renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //проверка calculateRender
    renderer.render(scene, camera);
    // calculateRender("Startapp");
}
renderer.setAnimationLoop(animate);