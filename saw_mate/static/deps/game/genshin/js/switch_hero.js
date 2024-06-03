//import * as THREE from 'three';
import { HEROCARDS } from './genshin_hero_card.js';
// Переменная для хранения состояния циклической смены карточек героев
import { TEXTBLOCKS, createTextObject } from './icon_test.js';
let count = 0;
// Заданные координаты для активной карточки игрока - убрать когда получится использовать координаты из цикла смены
const myActiveCardCoordinates = {
    position: { x: 0.25, y: 0.92, z: -3.3 },
    rotation: { y: 0, z: 3.1 },
    scale: { x: 1.2, y: 1.2, z: 1.2 }
};
// Заданные координаты для активной карточки противника - убрать когда получится использовать координаты из цикла смены
const opponentActiveCardCoordinates = {
    position: { x: 0.25, y: 0.92, z: -1.7 },
    rotation: { y: 0, z: 3.1 },
    scale: { x: 1.2, y: 1.2, z: 1.2 }
};
// Позиции для циклической смены карточек героев
const myHeroCardCoordinates = [
    { position: { x: 0, y: 0.9, z: -3.8 }, rotation: { y: 0, z: 3.2 }, scale: { x: 1, y: 1, z: 1 } },
    { position: { x: 0.25, y: 0.92, z: -3.3 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { position: { x: 0.5, y: 0.91, z: -3.8 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1, y: 1, z: 1 } }
];
// Позиции для циклической смены карточек героев противника
const opponentHeroCardCoordinates = [
    { position: { x: 0, y: 0.9, z: -1.2 }, rotation: { y: 0, z: 3.2 }, scale: { x: 1, y: 1, z: 1 } },
    { position: { x: 0.25, y: 0.92, z: -1.7 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { position: { x: 0.5, y: 0.91, z: -1.2 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1, y: 1, z: 1 } }
];
// Функция для анимации карточек героев
export function HeroSwitch(cards, cardsHp, positions, targetCoordinates, offset) {
    const t1 = gsap.timeline({
        defaultS: { duration: 0.4, delay: 0.1 }
    });
    let activeCardId = null;
    let activeCardHpId = null;
    for (let i = 0; i < cards.length; i++) {
        const animatedCard = cards[i];
        const animatedCardHp = cardsHp[i];
        const positionIndex = (count + i) % 3;
        t1.to(animatedCard.position, {
            x: positions[positionIndex].position.x,
            y: positions[positionIndex].position.y,
            z: positions[positionIndex].position.z
        }, 0)
        .to(animatedCard.rotation, {
            y: positions[positionIndex].rotation.y,
            z: positions[positionIndex].rotation.z
        }, 0)
        .to(animatedCard.scale, {
            x: positions[positionIndex].scale.x,
            y: positions[positionIndex].scale.y,
            z: positions[positionIndex].scale.z
        }, 0);
        
        // Анимация шкалы жизни карточек
        t1.to(animatedCardHp.position, {
            x: positions[positionIndex].position.x + 0.05,
            y: positions[positionIndex].position.y + 0.05,
            z: positions[positionIndex].position.z + 0.2
        }, 0);
        
        // Вычисление активной карты героя
        if (positions[positionIndex].position.x === targetCoordinates.position.x &&
            positions[positionIndex].position.y === targetCoordinates.position.y &&
            positions[positionIndex].position.z === targetCoordinates.position.z &&
            positions[positionIndex].rotation.y === targetCoordinates.rotation.y &&
            positions[positionIndex].rotation.z === targetCoordinates.rotation.z &&
            positions[positionIndex].scale.x === targetCoordinates.scale.x &&
            positions[positionIndex].scale.y === targetCoordinates.scale.y &&
            positions[positionIndex].scale.z === targetCoordinates.scale.z) 
        {
            activeCardId = i + offset;
            activeCardHpId = i + offset;
        }
    }
    count++;
    return { activeCardId, activeCardHpId };
}
// Обработчик для кнопки 1
export function switchHero(type) {
    if (type === 'mySwitch') {
        //let myActiveCardId = null;
        //myActiveCardId = HeroSwitch(HEROCARDS.slice(0, 3), TEXTBLOCKS.slice(0, 3), myHeroCardCoordinates, myActiveCardCoordinates, 0);
        //console.log('switchHero1 переключил героев игрока и myActiveCardId' + myActiveCardId);
        //return myActiveCardId, myActiveCardHpId;
        const { activeCardId, activeCardHpId } = HeroSwitch(HEROCARDS.slice(0, 3), TEXTBLOCKS.slice(0, 3), myHeroCardCoordinates, myActiveCardCoordinates, 0);
        //console.log('switchHero1 переключил героев игрока и activeCardId', activeCardId);
        //console.log('switchHero1 переключил героев игрока и activeCardHpId', activeCardHpId);
        //return { activeCardId, activeCardHpId };
        return { myActiveCardId: activeCardId, myActiveCardHpId: activeCardHpId };
    } else if (type === 'opponentSwitch') {
        // let opponentActiveCardId = null;
        // let opponentActiveCardHpId = null;
        // opponentActiveCardId = HeroSwitch(HEROCARDS.slice(3, 6), TEXTBLOCKS.slice(3, 6), opponentHeroCardCoordinates, opponentActiveCardCoordinates, 3);
        // //console.log('switchHero1 переключил героев противника и opponentActiveCardId' + opponentActiveCardId);
        // return opponentActiveCardId, opponentActiveCardHpId;
        const { activeCardId, activeCardHpId } = HeroSwitch(HEROCARDS.slice(3, 6), TEXTBLOCKS.slice(3, 6), opponentHeroCardCoordinates, opponentActiveCardCoordinates, 3);
        return { opponentActiveCardId: activeCardId, opponentActiveCardHpId: activeCardHpId };
    }
}