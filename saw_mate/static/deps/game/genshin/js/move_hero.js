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
        //console.log('карт игрока:', myActiveCardId);
    //создаем таймлайн анимации хода игрока
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    // console.log('начало анимации 1');
    //вперед
    t1.to([myActiveCard.position, myActiveHpCard.position], { y: 0.96, z: -3.8 })
    .to([myActiveCard.rotation, myActiveHpCard.rotation], { z: 3.5 }, 0)
    .to([myActiveCard.scale, myActiveHpCard.scale], { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to([myActiveCard.position, myActiveHpCard.position], { z: -2.4 }, 0.4)
    //обратно
    .to([myActiveCard.rotation, myActiveHpCard.rotation], { y: 0, z: 3.1 }, 0.8)
    .to([myActiveCard.scale, myActiveHpCard.scale], {  x: 1.2, y: 1.2, z: 1.2 }, 0.8)
    .to([myActiveCard.position, myActiveHpCard.position], { x: 0.25, y: 0.92, z: -3.3 }, 0.8); 
    //карта героя оппонента
    //создаем таймлайн анимации хода противника
    const t2 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    console.log('начало анимации 2');
    //вперед
    t2.to([opponentActiveCard.position, opponentActiveHpCard.position], { y: 0.92}, 0)
    .to([opponentActiveCard.rotation, opponentActiveHpCard.rotation], { z: 3 }, 0)
    .to([opponentActiveCard.scale, opponentActiveHpCard.scale], { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to([opponentActiveCard.position, opponentActiveHpCard.position], { z: -2.4 }, 0.4)
    //обратно
    .to([opponentActiveCard.rotation, opponentActiveHpCard.rotation], { y: 0, z: 3.1 }, 0.8)
    .to([opponentActiveCard.scale, opponentActiveHpCard.scale], { x: 1.2, y: 1.2, z: 1.2 }, 0.8)
    .to([opponentActiveCard.position, opponentActiveHpCard.position], { x: 0.25, y: 0.92, z: -1.7 }, 0.8); 
    } else {
        console.log('ошибка - не была выбрана активная карта перед началом раунда')
    }
}