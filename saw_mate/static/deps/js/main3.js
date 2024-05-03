import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Создание сцены Three.js
const scene = new THREE.Scene();
// Создание камеры с позицией и углами
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera.position.z = 40;
camera.position.set(0, 0, -2); // Задать новые координаты камеры

//плоскость
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10), 
    new THREE.MeshStandardMaterial({ 
        color: '#f44444', 
        metalness: 0, 
        roughness: 0.5,
    }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
//добавить плоскость в сцену
//scene.add(floor);

// Установка размеров через объект renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(1200, 800);
const sceneBox = document.getElementById('scene-box');
sceneBox.appendChild(renderer.domElement);



//создание пустой переменной анимации
let mixer = null;
//обработка кадров анимации модели
const clock = new THREE.Clock();
//добавляем дельту времени для анимации
const delta = clock.getDelta();
// Здесь 60 фреймов в секунду, но вы можете изменить это значение
const fixedDelta = 1 / 120; 
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    
    //обновляем миксер
    if (mixer) {
        mixer.update(fixedDelta);
    }
    window.requestAnimationFrame(tick);
};
//обработки света на сцене
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);


const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

// Создание экземпляра OrbitControls
// const controls = new OrbitControls(camera, canvas);
// 	controls.enableDamping = true;

const controls = new OrbitControls(camera, renderer.domElement)
const animate = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

//добавление загрузчика модели
const loader = new GLTFLoader();

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
            //лог файла
            console.log(gltf);
            // Добавляем новую модель в сцену
            currentModel = gltf.scene;
            currentModel.position.set(0, -1, 0);
            currentModel.rotation.y = -Math.PI * 2.5;
            //добавление анимации
            mixer = new THREE.AnimationMixer(gltf.scene);
            //для анимированных моделей, убрать для простых моделей
            const action = mixer.clipAction(gltf.animations[0]);
            //запуск анимации, убрать для простых моделей
            action.play();
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

//запуск для анимированных моделей, убрать для простых моделей
tick();
//запуск для простых моделей
//animate();
