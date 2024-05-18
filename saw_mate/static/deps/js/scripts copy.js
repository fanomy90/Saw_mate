import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CARDS, emperorTexture,  slaveTexture } from './hero_card.js';
//import * as gsap from 'gsap';

const gltfLoader = new GLTFLoader();

//анимация
let hoveredCard;
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//рендер из курса
// const renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

//мой рендер
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(1000, 600);
const sceneBox = document.getElementById('scene-box');
sceneBox.appendChild(renderer.domElement);

//белый фон
// Sets the color of the background
// renderer.setClearColor(0xFEFEFE);
// renderer.shadowMap.enabled = true;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Camera positioning
camera.position.set(0, 10, 6);
camera.lookAt(new THREE.Vector3(0, 6, 2));

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

//сетка
// Sets a 12 by 12 gird helper
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

CARDS.forEach(function(card) {
    scene.add(card);
});
//анимация
window.addEventListener('click', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if(intersects.length > 0) {
        if(intersects[0].object.name.includes('playerCard'))
            hoveredCard = intersects[0].object;

        // Анимация объекта
        const targetRotation = new THREE.Vector3(0, Math.PI, 0);
        const targetPosition = new THREE.Vector3(-2, 3.18, 0.9);
        const targetScale = new THREE.Vector3(1.5, 1.5, 1.5);

        // Создаем анимацию путем изменения значений свойств объекта
        const animationDuration = 0.4;
        const delay = 0.1;

        // Анимация вращения
        new TWEEN.Tween(hoveredCard.rotation)
            .to(targetRotation, animationDuration)
            .delay(delay)
            .start();

        // Анимация позиции
        new TWEEN.Tween(hoveredCard.position)
            .to(targetPosition, animationDuration)
            .delay(delay)
            .start();

        // Анимация масштаба
        new TWEEN.Tween(hoveredCard.scale)
            .to(targetScale, animationDuration)
            .delay(delay)
            .start();
    }
});

function animate() {
    renderer.render(scene, camera);
    TWEEN.update(); // Обновление анимации
}

renderer.setAnimationLoop(animate);


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});