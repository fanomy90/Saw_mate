import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CARDS, emperorTexture, slaveTexture } from './genshin_hero_card.js';
import { HEROCARDS, myHero1Texture, myHero2Texture, myHero3Texture, opponentHero1Texture, opponentHero2Texture, opponentHero3Texture } from './genshin_hero_card.js';
//добавляем загрузчик 3д моделей
const gltfLoader = new GLTFLoader();
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
// Sets the color of the background
// renderer.setClearColor(0xFEFEFE);
// renderer.shadowMap.enabled = true;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;

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
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

CARDS.forEach(function(card) {
    scene.add(card);
    const v = new THREE.Vector3();
    v.copy(card.position);
    initialCardsPositions.push(v);
    initialCardsRotations.push(card.rotation.z);
});
HEROCARDS.forEach(function(card) {
    scene.add(card);
    const v = new THREE.Vector3();
    v.copy(card.position);
    initialHeroCardsPositions.push(v);
    initialHeroCardsRotations.push(card.rotation.z);
});
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