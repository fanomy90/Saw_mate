import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Установка размеров через объект renderer
const renderer = new THREE.WebGLRenderer();
// Желаемая ширина и высота
renderer.setSize(1000, 800);
//получаем тег в который будем добавлять сцену
const sceneBox = document.getElementById('scene-box');
sceneBox.appendChild(renderer.domElement);


const planeGeometry = new THREE.PlaneGeometry(10, 10);
planeGeometry.rotateX(THREE.MathUtils.degToRad(30)); // Преобразуйте угол в радианы
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const fogColor = "#000";
const fogNear = 2;
const fogFAR = 8;
scene.fog = new THREE.Fog(fogColor, fogNear, fogFAR);

const threeJsShapes = [];

// Пример объекта shapes для тестирования
// const shapes = [
//     { type: 1, color: 0xff0000 },
//     { type: 2, color: 0x00ff00 },
    // Добавьте больше объектов при необходимости
// ];

for (const el of shapes) {
    const { type, color } = el;
    let geometry;

    switch (type) {
        case 1:
            geometry = new THREE.SphereGeometry(1, 50, 50);
            break;
        case 2:
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        default:
            const radiusTop = Math.random() * 0.5 + 0.1;
            const radiusBottom = Math.random() * 0.5 + 0.1;
            const height = Math.random() * 2 + 1;
            const radialSegments = 32;
            geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
            break;
    }
    const material = new THREE.MeshPhongMaterial({ color: color });
    const shape = new THREE.Mesh(geometry, material);

    shape.position.x = (Math.random() - 0.5) * 5;
    shape.position.y = Math.random() * 2 + 1;
    shape.position.z = (Math.random() - 0.5) * 5;

    scene.add(shape);
    threeJsShapes.push(shape);
}

const ambientLight = new THREE.AmbientLight("#ffffff", 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

// управление сценой
const controls = new OrbitControls(camera, renderer.domElement)
const loader = new GLTFLoader();


const animate = () => {
    //анимация фигур
    threeJsShapes.forEach(shape => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
    });
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate();