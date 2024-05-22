//логика работы карточек героев
import {
    MeshBasicMaterial,
    BoxGeometry,
    Mesh,
    SRGBColorSpace,
    TextureLoader,
    Vector3
} from 'three';

const textureLoader = new TextureLoader();
//создание объекта карточки с указанными размерами
const cardGeo = new BoxGeometry(0.4, 0.6, 0.001);
// const cardGeo = new BoxGeometry(0.4, 0.6, 0.001);
//проблема с доступам к файлам текстур из скрипта, нужно 
//использовать npm, либо менять настройки путей, либо попробовать 
//передавать текстуры из шаблона
//Получаем пути к текстурам из атрибутов элемента
const texturePaths = document.getElementById('texture-paths');
const citizen1TexturePath = texturePaths.dataset.citizen1;
const citizen2TexturePath = texturePaths.dataset.citizen2;
const citizen3TexturePath = texturePaths.dataset.citizen3;
const citizen4TexturePath = texturePaths.dataset.citizen4;
const coverTexturePath = texturePaths.dataset.cover;
const emperorTexturePath = texturePaths.dataset.emperor;
const slaveTexturePath = texturePaths.dataset.slave;

//карточки игрока
const myHero1TexturePath = texturePaths.dataset.emperor;
const myHero2TexturePath = texturePaths.dataset.emperor;
const myHero3TexturePath = texturePaths.dataset.emperor;

//карточки противника
const opponentHero1TexturePath = texturePaths.dataset.slave;
const opponentHero2TexturePath = texturePaths.dataset.slave;
const opponentHero3TexturePath = texturePaths.dataset.slave;


const citizen1Texture = textureLoader.load(citizen1TexturePath);
citizen1Texture.colorSpace = SRGBColorSpace;

const citizen2Texture = textureLoader.load(citizen2TexturePath);
citizen2Texture.colorSpace = SRGBColorSpace;

const citizen3Texture = textureLoader.load(citizen3TexturePath);
citizen3Texture.colorSpace = SRGBColorSpace;

const citizen4Texture = textureLoader.load(citizen4TexturePath);
citizen4Texture.colorSpace = SRGBColorSpace;

const coverTexture = textureLoader.load(coverTexturePath);
coverTexture.colorSpace = SRGBColorSpace;

const emperorTexture = textureLoader.load(emperorTexturePath);
emperorTexture.colorSpace = SRGBColorSpace;

const slaveTexture = textureLoader.load(slaveTexturePath);
slaveTexture.colorSpace = SRGBColorSpace;

//карточки игрока загрузка текстур
const myHero1Texture = textureLoader.load(myHero1TexturePath);
myHero1Texture.colorSpace = SRGBColorSpace;
const myHero2Texture = textureLoader.load(myHero2TexturePath);
myHero2Texture.colorSpace = SRGBColorSpace;
const myHero3Texture = textureLoader.load(myHero3TexturePath);
myHero3Texture.colorSpace = SRGBColorSpace;

//карточки баффов
const opponentHero1Texture = textureLoader.load(opponentHero1TexturePath);
opponentHero1Texture.colorSpace = SRGBColorSpace;
const opponentHero2Texture = textureLoader.load(opponentHero2TexturePath);
opponentHero2Texture.colorSpace = SRGBColorSpace;
const opponentHero3Texture = textureLoader.load(opponentHero3TexturePath);
opponentHero3Texture.colorSpace = SRGBColorSpace;

//создание констант в виде списка словарей которые текстуры передней и задней стороны карточки
const card1Mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: emperorTexture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card2Mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: citizen1Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card3Mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: citizen2Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card4Mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: citizen3Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card5Mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: citizen4Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card6Mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: slaveTexture}),
    new MeshBasicMaterial({map: coverTexture})
];

//карточки героев
const card1Hero = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: myHero1Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card2Hero = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: myHero2Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card3Hero = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: myHero3Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card4Hero = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: opponentHero1Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card5Hero = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: opponentHero2Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const card6Hero = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({map: opponentHero3Texture}),
    new MeshBasicMaterial({map: coverTexture})
];

const CARDS = [];

//позиционирование карточек
const myCardsPositions = [
    new Vector3 (0.75, 0.9, -4.5),
    // new Vector3 (0.5, 6.004, 4.21),
    new Vector3 (0.5, 0.91, -4.5),
    // new Vector3 (0.25, 6.003, 4.17),
    new Vector3 (0.25, 0.92, -4.5),
    // new Vector3 (0, 6.002, 4.15),
    new Vector3 (0,0.93, -4.5),
    // new Vector3 (-0.25, 6.001, 4.17),
    new Vector3 (-0.25, 0.94, -4.5),
    // new Vector3 (-0.5, 6, 4.21),
];
//поворот карточек
const myCardsRotations = [
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, -0.15),
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, -0.10),
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, 0),
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, 0.10),
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, 0.15),
];

//добавление свойств карточке
function configureCard(card, pos, rot, rNumb, name) {
    card.name = name; //имя карточки
    card.castShadow = true; //включение теней
    card.position.copy(pos[rNumb]); //установка позиции карточки
    card.rotation.set(rot[rNumb].x, rot[rNumb].y, rot[rNumb].z); // установка вращения
    pos.splice(rNumb, 1); //удаление позиции карточки
    rot.splice(rNumb, 1); // удаление вращения
    CARDS.push(card); // добавление карточки в массив
}
//генерация массива случайных чисел по координатам карточек
const minimum = 0;
let maximum1 = myCardsPositions.length - 1;
//генерация случайного числа
let randomNumber1 = Math.floor(Math.random() * (maximum1 - minimum + 1)) + minimum;
// конфигурирование карточек
const card1 = new Mesh(cardGeo, card1Mat);
configureCard(card1, myCardsPositions, myCardsRotations, randomNumber1, 'hand playerCard1 emperor');

const card2 = new Mesh(cardGeo, card2Mat);
maximum1 = myCardsPositions.length - 1;
randomNumber1 = Math.floor(Math.random() * (maximum1 - minimum + 1)) + minimum;
configureCard(card2, myCardsPositions, myCardsRotations, randomNumber1, 'hand playerCard2 citizen');

const card3 = new Mesh(cardGeo, card3Mat);
maximum1 = myCardsPositions.length - 1;
randomNumber1 = Math.floor(Math.random() * (maximum1 - minimum + 1)) + minimum;
configureCard(card3, myCardsPositions, myCardsRotations, randomNumber1, 'hand playerCard3 citizen');

const card4 = new Mesh(cardGeo, card4Mat);
maximum1 = myCardsPositions.length - 1;
randomNumber1 = Math.floor(Math.random() * (maximum1 - minimum + 1)) + minimum;
configureCard(card4, myCardsPositions, myCardsRotations, randomNumber1, 'hand playerCard4 citizen');

const card5 = new Mesh(cardGeo, card5Mat);
maximum1 = myCardsPositions.length - 1;
randomNumber1 = Math.floor(Math.random() * (maximum1 - minimum + 1)) + minimum;
configureCard(card5, myCardsPositions, myCardsRotations, randomNumber1, 'hand playerCard5 citizen');

const opponentCardsPositions = [
    new Vector3(0.75, 0.9, -0.5),
    // new Vector3(0.5, 8.47, 2.5),
    new Vector3(0.5, 0.91, -0.5),
    // new Vector3(0.25, 8.5, 2.501),
    new Vector3(0.25, 0.92, -0.5),
    // new Vector3(0, 8.515, 2.502),
    new Vector3(0, 0.93, -0.5),
    // new Vector3(-0.25, 8.5, 2.503),
    new Vector3(-0.25, 0.94, -0.5),
    // new Vector3(-0.5, 8.47, 2.504),
];

const opponentCardsRotations = [
    new Vector3(Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, 0.15),
    new Vector3(Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, 0.10),
    new Vector3(Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, 0),
    new Vector3(Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, -0.10),
    new Vector3(Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, -0.15),
];

let maximum2 = opponentCardsPositions.length - 1;
let randomNumber2 = Math.floor(Math.random() * (maximum2 - minimum + 1)) + minimum;

const card6 = new Mesh(cardGeo, card6Mat);
configureCard(card6, opponentCardsPositions, opponentCardsRotations, randomNumber2, 'slave');

const card7 = new Mesh(cardGeo, card2Mat);
maximum2 = opponentCardsPositions.length - 1;
randomNumber2 = Math.floor(Math.random() * (maximum2 - minimum + 1)) + minimum;
configureCard(card7, opponentCardsPositions, opponentCardsRotations, randomNumber2, 'citizen');

const card8 = new Mesh(cardGeo, card3Mat);
maximum2 = opponentCardsPositions.length - 1;
randomNumber2 = Math.floor(Math.random() * (maximum2 - minimum + 1)) + minimum;
configureCard(card8, opponentCardsPositions, opponentCardsRotations, randomNumber2, 'citizen');

const card9 = new Mesh(cardGeo, card4Mat);
maximum2 = opponentCardsPositions.length - 1;
randomNumber2 = Math.floor(Math.random() * (maximum2 - minimum + 1)) + minimum;
configureCard(card9, opponentCardsPositions, opponentCardsRotations, randomNumber2, 'citizen');

const card10 = new Mesh(cardGeo, card5Mat);
maximum2 = opponentCardsPositions.length - 1;
randomNumber2 = Math.floor(Math.random() * (maximum2 - minimum + 1)) + minimum;
configureCard(card10, opponentCardsPositions, opponentCardsRotations, randomNumber2, 'citizen');

export {CARDS, emperorTexture, slaveTexture};

const HEROCARDS = [];
//позиционирование карточек
const myHeroCardsPositions = [
    new Vector3 (0.75, 0.9, -3.5),
    // new Vector3 (0.5, 6.004, 4.21),
    new Vector3 (0.5, 0.91, -3.5),
    // new Vector3 (0.25, 6.003, 4.17),
    new Vector3 (0.25, 0.92, -3.5),
    // new Vector3 (0, 6.002, 4.15),
];
//поворот карточек
const myHeroCardsRotations = [
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, -0.15),
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, -0.10),
    new Vector3(-Math.PI / 2, 0, 3.1),
    // new Vector3(-Math.PI / 2, 0, 0),
];
//конфигурируем карточки героев игрока
let maximum3 = myHeroCardsPositions.length -1;
let randomNumber3 = Math.floor(Math.random() * (maximum3 - minimum + 1)) + minimum;
//конфигурируем карточки героев
const myHeroCard1 = new Mesh(cardGeo, card1Hero);
configureCard(myHeroCard1, myHeroCardsPositions, myHeroCardsRotations, randomNumber3, 'hand playerHeroCard1 hero1');

const myHeroCard2 = new Mesh(cardGeo, card2Hero);
maximum3 = myHeroCardsPositions.length -1;
randomNumber3 = Math.floor(Math.random() * (maximum3 - minimum + 1)) + minimum;
configureCard(myHeroCard2, myHeroCardsPositions, myHeroCardsRotations, randomNumber3, 'hand playerHeroCard2 hero2');

const myHeroCard3 = new Mesh(cardGeo, card3Hero);
maximum3 = myHeroCardsPositions.length -1;
randomNumber3 = Math.floor(Math.random() * (maximum3 - minimum + 1)) + minimum;
configureCard(myHeroCard3, myHeroCardsPositions, myHeroCardsRotations, randomNumber3, 'hand playerHeroCard3 hero3');

const opponentHeroCardsPositions = [
    new Vector3(0.75, 0.9, -1.5),
    // new Vector3(0.5, 8.47, 2.5),
    new Vector3(0.5, 0.91, -1.5),
    // new Vector3(0.25, 8.5, 2.501),
    new Vector3(0.25, 0.92, -1.5),
    // new Vector3(0, 8.515, 2.502),
];

const opponentHeroCardsRotations = [
    new Vector3(-Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, 0.15),
    new Vector3(-Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, 0.10),
    new Vector3(-Math.PI / 2, 0, 3.2),
    // new Vector3(2 * Math.PI, Math.PI, 0),
];

//конфигурируем карточки героев противника
let maximum4 = opponentHeroCardsPositions.length -1;
let randomNumber4 = Math.floor(Math.random() * (maximum4 - minimum + 1)) + minimum;
//конфигурируем карточки героев
const opponentHeroCard1 = new Mesh(cardGeo, card4Hero);
configureCard(opponentHeroCard1, opponentHeroCardsPositions, opponentHeroCardsRotations, randomNumber3, 'hero4');

const opponentHeroCard2 = new Mesh(cardGeo, card5Hero);
maximum4 = myHeroCardsPositions.length -1;
randomNumber4 = Math.floor(Math.random() * (maximum4 - minimum + 1)) + minimum;
configureCard(opponentHeroCard2, opponentHeroCardsPositions, opponentHeroCardsRotations, randomNumber3, 'hhero5');

const opponentHeroСard3 = new Mesh(cardGeo, card6Hero);
maximum4 = myHeroCardsPositions.length -1;
randomNumber4 = Math.floor(Math.random() * (maximum4 - minimum + 1)) + minimum;
configureCard(opponentHeroСard3, opponentHeroCardsPositions, opponentHeroCardsRotations, randomNumber3, 'hero6');

export {HEROCARDS, 
    myHero1Texture, 
    myHero2Texture, 
    myHero3Texture, 
    opponentHero1Texture, 
    opponentHero2Texture, 
    opponentHero3Texture}
