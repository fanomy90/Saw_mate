import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import {
    MeshBasicMaterial,
    Mesh,
    ShapeGeometry,
    Group
} from 'three';

// Создаем загрузчики
const svgLoader = new SVGLoader();
const fontLoader = new FontLoader();

const texturePaths = document.getElementById('texture-paths');
const hpIconPath = texturePaths.dataset.health;

const hpIcon = new Group();

// Загрузка SVG-файла
svgLoader.load(hpIconPath, function (data) {
    const paths = data.paths;

    // Создание формы из SVG-пути
    const shapes = [];
    paths.forEach(function (path) {
        const shape = path.toShapes(true);
        shapes.push(...shape);
    });

    // Создание геометрии из формы
    const iconGeometry = new ShapeGeometry(shapes);

    // Загрузка встроенного шрифта
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        // Создание текстовой геометрии
        const textGeometry = new TextGeometry('Жизни: 5', {
            font: font,
            size: 0.1,
            depth: 0.02
        });

        // Позиционирование текста
        textGeometry.translate(-1, 0, 0);

        // Создание материала
        const material = new MeshBasicMaterial({ color: 0x00ff00 });

        // Создание меша для иконки и текста
        const mesh = new Mesh(iconGeometry, material);
        const textMesh = new Mesh(textGeometry, material);

        // Группирование мешей
        hpIcon.add(mesh);
        hpIcon.add(textMesh);
    });
});

export { hpIcon };
