import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three';

export function createTextObject(text, x, y, z) {
    const loader = new FontLoader();

    return new Promise((resolve, reject) => {
        loader.load('/static/assets/helvetiker_regular.typeface.json', function (font) {
            const geometry = new TextGeometry(text, {
                font: font, //размер текста
                size: 0.05, // Уменьшаем размер текста
                depth: 0.001, // Тонкий текст
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.0008,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const textMesh = new THREE.Mesh(geometry, material);
            // Устанавливаем начальные координаты
            textMesh.position.set(x, y, z);
            textMesh.rotation.set(-Math.PI / 2, 0, 3.1);
            resolve(textMesh);
        }, undefined, (error) => {
            reject(error);
        });
    });
}