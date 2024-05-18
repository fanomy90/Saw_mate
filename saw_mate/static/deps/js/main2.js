//работа со статичными моделями
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Создание сцены Three.js
const scene = new THREE.Scene();
// Создание камеры с позицией и углами
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera.position.z = 40;
camera.position.set(0, 0, -2); // Задать новые координаты камеры

//плоскость
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10), 
    new THREE.MeshStandardMaterial({ 
        color: 'f444444', 
        metalness: 0, 
        roughness: 0.5,
    }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

// Установка размеров через объект renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(1200, 800);
const sceneBox = document.getElementById('scene-box');
sceneBox.appendChild(renderer.domElement);

let object;
let objToRender = 'gawr_gura';
const loader = new GLTFLoader();

// const staticUrl = document.getElementById("scene-box").getAttribute("data-static-url");

// loader.load(
//     staticUrl,
//     function (gltf) {
//         object = gltf.scene;
//         //object.position.y = 2;
//         object.position.set(0, -0.3, 0);
//         scene.add(object);
//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     function (error) {
//         console.error(error);
//     }
// );

//Вариант передачи нескольких моделей
const loadModelsButton1 = document.getElementById('load-models-button1');
const loadModelsButton2 = document.getElementById('load-models-button2');
const loadModelsButton3 = document.getElementById('load-models-button3');
let currentModel = null;
// Функция для загрузки модели по URL
function loadModel(url) {
    loader.load(
        url,
        function (gltf) {
            // Удаляем предыдущую модель из сцены, если она есть
            if (currentModel) {
                scene.remove(currentModel);
            }
            // Добавляем новую модель в сцену
            currentModel = gltf.scene;
            currentModel.position.set(0, 0, 0);
            scene.add(currentModel);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% загружено');
        },
        function (error) {
            console.error('Произошла ошибка при загрузке модели:', error);
        }
    );
}
// Обработчики событий для кнопок
loadModelsButton1.addEventListener('click', function() {
    const url = loadModelsButton1.getAttribute('data-static-url');
    loadModel(url);
});

loadModelsButton2.addEventListener('click', function() {
    const url = loadModelsButton2.getAttribute('data-static-url');
    loadModel(url);
});

loadModelsButton3.addEventListener('click', function() {
    const url = loadModelsButton3.getAttribute('data-static-url');
    loadModel(url);
});


//задние объекты затеняются
// const fogColor = "#000";
// const fogNear = 2;
// const fogFAR = 40;
// scene.fog = new THREE.Fog(fogColor, fogNear, fogFAR);

//обработки света на сцене
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement)
const animate = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate();
