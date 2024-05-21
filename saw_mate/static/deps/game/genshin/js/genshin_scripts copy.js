import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CARDS, emperorTexture,  slaveTexture } from './genshin_hero_card.js';
//Получаем пути к текстурам из атрибутов элемента
const audioPaths = document.getElementById('audio-paths');
const card_drop_audioPaths = audioPaths.dataset.card_drop;
const card_flip_audioPaths = audioPaths.dataset.card_flip;
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
//формируем набор карт игрока
const playerCards = [];
for(let i = 0; i < 5; i++) {
    playerCards.push(CARDS[i]);
}
//обявляем константы для позиции и вращения карт
const initialCardsPositions = [];
const initialCardsRotations = [];
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
// const renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

//мой рендер
const renderer = new THREE.WebGLRenderer({ alpha: true });
//задаем размеры игрового окна
const zoomFactor = calculateZoomFactor();
//проверка calculateRender
renderer.setSize(1000, 700);
//получение объекта куда будет передаваться canvas
const sceneBox = document.getElementById('scene-box');
sceneBox.appendChild(renderer.domElement);

//белый фон
// Sets the color of the background
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
camera.position.set(0.25, 0.7, 0.9);
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
    model.scale.set(0.35, 0.35, 0.35);
    model.position.set(0.25, 0, 0);
    
    model.traverse(function(node) {
        if(node.isMesh)
            node.receiveShadow = true;
    });
});

//сетка Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

CARDS.forEach(function(card) {
    scene.add(card);
    const v = new THREE.Vector3();
    v.copy(card.position);
    initialCardsPositions.push(v);
    initialCardsRotations.push(card.rotation.z);
});

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

function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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
    if(round === 4)
        nextRound();
    else if(round === 7) {
        finished = true;
        showResult();
    }
}

// Создаем объект для представления указателя мыши
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
        t1.to(hoveredCard.rotation, {
            y: Math.PI,
            z: 0
        })
        .to(hoveredCard.position, {
            y: 3.18,
            z: 0.9,
            x
        }, 0)
        .to(hoveredCard.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5
        }, 0)
        .to(hoveredCard.rotation, {
            y: 0,
            delay: 1,
            //запуск звука
            onComplete: function() {
                cardDrop.play();
            }
        }, 0)
        .to(hoveredCard.position, {
            y: 3.88,
            delay: 1
        }, 0)
        .to(hoveredCard.position, {
            y: 3.18,
            duration: 0.3,
            delay: 1.2
        }, 0);

        let hoveredCName = hoveredCard.name;
        hoveredCard = null;

        const minimum = 0;
        let maximum = opponentCards.length - 1;
        let randomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        let oppCname = opponentCards[randomNumber].name;

        const t2 = new gsap.timeline({
            defaults: {duration: 0.4, delay: 0.4}
        });

        t2.to(opponentCards[randomNumber].rotation, {
            x: 2 * Math.PI - Math.PI / 2,
            z: Math.PI
        });
        t2.to(opponentCards[randomNumber].position, {
            y: 3.18,
            z: -0.7,
            x
        }, 0);
        t2.to(opponentCards[randomNumber].scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5
        }, 0);
        t2.to(opponentCards[randomNumber].rotation, {
            y: 0,
            delay: 1
        }, 0);
        t2.to(opponentCards[randomNumber].position, {
            y: 3.88,
            delay: 1
        }, 0);
        t2.to(opponentCards[randomNumber].position, {
            y: 3.18,
            duration: 0.3,
            delay: 1.2,
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
    //проверка calculateRender
    renderer.render(scene, camera);
    // calculateRender("Startapp");
}

renderer.setAnimationLoop(animate);

// адаптивность размера окна игры, ловим измение экрана
// window.addEventListener('resize', function() {
//     calculateRender("Resize");
// });
// window.addEventListener('resize', function() {
//     // Изменяем масштаб камеры, чтобы адаптировать его к новому размеру окна
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;
//     //меняем угол камеры т.к. изменяется соотношение сторон экрана
//     camera.aspect = window.innerWidth / window.innerHeight;
//     //меняем матрицу проекции
//     camera.updateProjectionMatrix();
//     //меняем рендер
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     // Изменяем масштаб камеры
//     // camera.zoom = zoomFactor;
//     // Обновляем состояние рендерера
//     renderer.render(scene, camera);
// });

// Функция для вычисления масштаба камеры
function calculateZoomFactor() {
    let zoomFactor;
    let sizes = {};
    zoomFactor = 0.5;
    // sizes.width = window.innerWidth;
    // sizes.height = window.innerHeight;
    sizes.width = 1000;
    sizes.height = 700;
    
    //>990 плохо - обрезка по правому краю стола
    //<1223 плохо - обрезка по правому краю вылезает белый фон

    //<1440 плохо - прыгнули размеры окна
    //>2559 плохо - мастштаб
    //Возврат зума камеры и размеров
    return { zoomFactor, ...sizes };
}

// адаптивность размера окна игры
// document.addEventListener('DOMContentLoaded', () => {
//     window.addEventListener('resize', () => {
//         console.log('Hello');
//     });
// });

// Функция адаптивного рендера
function calculateRender(settings) {
    let zoomFactor;
    let sizes = {};
    if (settings === "Startapp" && document.fullscreenElement === null) {
        renderer.setSize(1000, 700);
        renderer.render(scene, camera);
        //console.log('calculateRender Startapp');
    } if (settings === "Fullscreen") {
        zoomFactor = 0.5;
        sizes.width = 1000;
        sizes.height = 700;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.zoom = zoomFactor;
        renderer.render(scene, camera);
        console.log('calculateRender Fullscreen');
    } if (settings === "Resize" && document.fullscreenElement === null) {
        zoomFactor = 1;
        sizes.width = 1000;
        sizes.height = 700;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.zoom = zoomFactor;
        renderer.render(scene, camera);
        console.log('calculateRender Other');
    }
}

//Вход в полноэкранный режим. Нужно добавить смену размеров экрана через calculateZoomFactor
// window.addEventListener('dblclick', () => {
//     if (sceneBox) {
//         if (document.fullscreenElement) {
//             console.log('exitFullscreen');
//             document.exitFullscreen();
//         } else {
//             console.log('Fullscreen');
//             sceneBox.requestFullscreen();
//             calculateRender("Fullscreen");
//         }
//     } else {
//         console.log('Scene box element not found');
//     }
// });
