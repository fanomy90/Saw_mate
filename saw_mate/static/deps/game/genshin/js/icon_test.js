import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three';
//Объявляем массив для хранения карточек героев
const TEXTBLOCKS = [];
export function createTextObject(text, x, y, z, color = 0xff0000) {
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
            const material = new THREE.MeshBasicMaterial({ color: color });
            const textMesh = new THREE.Mesh(geometry, material);
            // Устанавливаем начальные координаты
            textMesh.position.set(x, y, z);
            textMesh.rotation.set(-Math.PI / 2, 0, 3.1);
            //добавляем объект в массив и возвращаем его id
            const textObjectId = TEXTBLOCKS.length;
            TEXTBLOCKS.push(textMesh); //убрать
            resolve({ id: textObjectId, object: textMesh });
        }, undefined, (error) => {
            reject(error);
        });
    });
}

// Пример изменения текста объекта
function updateTextObject(id, newText, newColor = null) {
    const textObject = TEXTBLOCKS[id];
    if (textObject) {
        const geometry = new TextGeometry(newText, {
            font: textObject.geometry.parameters.options.font,
            size: textObject.geometry.parameters.options.size,
            height: textObject.geometry.parameters.options.height,
            curveSegments: textObject.geometry.parameters.options.curveSegments,
            bevelEnabled: textObject.geometry.parameters.options.bevelEnabled,
            bevelThickness: textObject.geometry.parameters.options.bevelThickness,
            bevelSize: textObject.geometry.parameters.options.bevelSize,
            bevelOffset: textObject.geometry.parameters.options.bevelOffset,
            bevelSegments: textObject.geometry.parameters.options.bevelSegments
        });
        textObject.geometry.dispose(); // Освобождаем память, связанную со старой геометрией
        textObject.geometry = geometry;

        if (newColor !== null) {
            textObject.material.color.set(newColor);
        }
    }
}

export {TEXTBLOCKS} //убрать

