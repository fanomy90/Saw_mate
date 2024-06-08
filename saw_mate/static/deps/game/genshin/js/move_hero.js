import { HEROCARDS } from './genshin_hero_card.js';
import { TEXTBLOCKS, createTextObject } from './icon_test.js';
export function moveHero(myActiveCardId, opponentActiveCardId, myactiveCardHpId, opponentActiveCardHpId) {
    console.log('карта игрока:', myActiveCardId);
    console.log('карта противника:', opponentActiveCardId);
    //console.log('btnAnimate1');
    //проверка наличия активной карты героя
    if (myActiveCardId !== null && opponentActiveCardId !== null) {
        const myActiveCard = HEROCARDS[myActiveCardId];
        const opponentActiveCard = HEROCARDS[opponentActiveCardId];
        const myActiveHpCard = TEXTBLOCKS[myactiveCardHpId];
        const opponentActiveHpCard = TEXTBLOCKS[opponentActiveCardHpId];

        const myHeroCardCoordinates = [
            { position: { x: 0.25, y: 0.96, z: -3.8 }, rotation: { y: 0, z: 3.5 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 0.96, z: -2.4 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 0.92, z: -3.3 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } }
        ];

        const opponentHeroCardCoordinates = [
            { position: { x: 0.25, y: 0.92, z: -1.2 }, rotation: { y: 0, z: 3 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 0.92, z: -2.4 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
            { position: { x: 0.25, y: 0.92, z: -1.7 }, rotation: { y: 0, z: 3.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } }
        ];
        //console.log('карт игрока:', myActiveCardId);
        //создаем таймлайн анимации хода игрока
        const t1 = gsap.timeline({ defaults: { duration: 0.4, delay: 0.1 } });

        myHeroCardCoordinates.forEach((coords, index) => {
            t1.to(myActiveCard.position, coords.position, index * 0.4)
                .to([myActiveCard.rotation, myActiveHpCard.rotation], coords.rotation, index * 0.4)
                .to([myActiveCard.scale, myActiveHpCard.scale], coords.scale, index * 0.4)
                // Анимация шкалы жизни карточек
                .to(myActiveHpCard.position, {
                    x: coords.position.x + 0.05,
                    y: coords.position.y + 0.05,
                    z: coords.position.z + 0.2
                }, index * 0.4);
                //.to(myActiveHpCard.rotation, coords.rotation, index * 0.4);
        });
        //карта героя оппонента
        //создаем таймлайн анимации хода противника
        const t2 = gsap.timeline({ defaults: { duration: 0.4, delay: 0.1 } });

        opponentHeroCardCoordinates.forEach((coords, index) => {
            t2.to(opponentActiveCard.position, coords.position, index * 0.4)
                .to([opponentActiveCard.rotation, opponentActiveHpCard.rotation], coords.rotation, index * 0.4)
                .to([opponentActiveCard.scale, opponentActiveHpCard.scale], coords.scale, index * 0.4)
                .to(opponentActiveHpCard.position, {
                    x: coords.position.x + 0.05,
                    y: coords.position.y + 0.05,
                    z: coords.position.z + 0.2
                }, index * 0.4);
        });
        
        } else {
            console.log('ошибка - не была выбрана активная карта перед началом раунда')
        }
}