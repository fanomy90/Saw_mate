import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const textureLoader = new THREE.TextureLoader();
//const gltfLoader = new GLTFLoader();

// Функция для инициализации сцены для каждой карточки
function initProductCard(productBox, texturePaths) {
    if (!texturePaths) {
        console.error('Texture paths element not found for product box');
        return;
    }

    // console.log('Product box:', productBox);
    // console.log('Texture paths:', texturePaths);
    //установка своих размеров
    const productBoxWidth = 267; // установите желаемую ширину карточки товара
    const productBoxHeight = 400; // установите желаемую высоту карточки товара
    productBox.style.width = `${productBoxWidth}px`;
    productBox.style.height = `${productBoxHeight}px`;

    const coverTexturePath = texturePaths.dataset.cover;
    const productTexturePath = texturePaths.dataset.product;

    // console.log('Cover texture path:', coverTexturePath);
    // console.log('Product texture path:', productTexturePath);

    if (!coverTexturePath || !productTexturePath) {
        console.error('Texture paths are missing');
        return;
    }

    const coverTexture = textureLoader.load(coverTexturePath);
    coverTexture.colorSpace = THREE.SRGBColorSpace;
    const productTexture = textureLoader.load(productTexturePath);
    productTexture.colorSpace = THREE.SRGBColorSpace;

    const productMat = [
        new THREE.MeshBasicMaterial(),
        new THREE.MeshBasicMaterial(),
        new THREE.MeshBasicMaterial(),
        new THREE.MeshBasicMaterial(),
        new THREE.MeshBasicMaterial({ map: productTexture }),
        new THREE.MeshBasicMaterial({ map: coverTexture })
    ];

    const cardGeo = new THREE.BoxGeometry(0.4, 0.6, 0.001);
    const productCard = new THREE.Mesh(cardGeo, productMat);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    productBox.appendChild(renderer.domElement);
    //установка своих размеров
    renderer.setSize(productBoxWidth, productBoxHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, productBox.clientWidth / productBox.clientHeight, 0.1, 1000);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0.025, 0, 0.75);
    // camera.position.set(0.25, 6, -3);
    // camera.rotation.y = -Math.PI / 2;
    //camera.lookAt(new THREE.Vector3(1, 0, 0));
    //camera.lookAt(new THREE.Vector3(0.25, -50, 2));

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.y = 10;
    scene.add(directionalLight);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    const ambientLight = new THREE.AmbientLight(0xA3A3A3, 0.3);
    scene.add(ambientLight);
    scene.add(productCard);

    function animate() {
        const sizes = { width: productBox.clientWidth, height: productBox.clientHeight };
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Добавляем анимацию камеры
    animateCameraAroundProduct(camera, productCard.position, 0.8); // Примерный радиус 3

    // Функция анимации камеры
    function animateCameraAroundProduct(camera, target, radius) {
        let angle = 0; // Угол начального положения камеры
        const speed = 0.02; // Скорость движения камеры по кругу
    
        // Функция анимации, обновляющая положение камеры в каждом кадре
        function updateCameraPosition() {
            angle += speed; // Увеличиваем угол для движения по кругу
            const x = radius * Math.sin(angle); // Вычисляем координату X
            const z = radius * Math.cos(angle); // Вычисляем координату Z
            camera.position.set(x, target.y, z); // Устанавливаем новое положение камеры
            camera.lookAt(target); // Обновляем точку взгляда камеры
        }
    
        // Запускаем анимацию
        function animate() {
            updateCameraPosition(); // Обновляем положение камеры
            renderer.render(scene, camera); // Рендерим сцену
            requestAnimationFrame(animate); // Планируем следующий кадр анимации
        }
    
        animate(); // Запускаем анимацию
    }
    
}

// Получаем все элементы карточек и инициализируем сцену для каждой
document.querySelectorAll('.product-box').forEach((productBox, index) => {
    const texturePaths = document.querySelectorAll('.texture-paths')[index];
    initProductCard(productBox, texturePaths);
});
