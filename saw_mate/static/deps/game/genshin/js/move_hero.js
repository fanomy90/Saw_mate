import { HEROCARDS } from './genshin_hero_card.js';
export function moveHero(myActiveCardId, opponentActiveCardId) {
    console.log('карта игрока:', myActiveCardId);
    console.log('карта противника:', opponentActiveCardId);
    //console.log('btnAnimate1');
    //проверка наличия активной карты героя
    if (myActiveCardId !== null && opponentActiveCardId !== null) {
    // if (myActiveCardId !== null) {
        const myActiveCard = HEROCARDS[myActiveCardId]; //костыль т.к. карта не совпалает
        const opponentActiveCard = HEROCARDS[opponentActiveCardId];
        //console.log('карт игрока:', myActiveCardId);
    //создаем таймлайн анимации хода игрока
    const t1 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    // console.log('начало анимации 1');
    //вперед
    t1.to(myActiveCard.position, { y: 0.96, z: -3.8 })
    .to(myActiveCard.rotation, { z: 3.5 }, 0)
    .to(myActiveCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(myActiveCard.position, { z: -2.4 }, 0.4)
    //обратно
    .to(myActiveCard.rotation, { y: 0, z: 3.1 }, 0.8)
    .to(myActiveCard.scale, { x: 1.2, y: 1.2, z: 1.2 }, 0.8)
    .to(myActiveCard.position, { x: 0.25, y: 1, z: -3.3 }, 0.8); 
    //карта героя оппонента
    //создаем таймлайн анимации хода противника
    const t2 = gsap.timeline({
        defaults: {duration: 0.4, delay: 0.1}
    });
    console.log('начало анимации 2');
    //вперед
    t2.to(opponentActiveCard.position, { y: 0.92}, 0)
    .to(opponentActiveCard.rotation, { z: 3 }, 0)
    .to(opponentActiveCard.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0)
    .to(opponentActiveCard.position, { z: -2.4 }, 0.4)
    //обратно
    .to(opponentActiveCard.rotation, { y: 0, z: 3.1 }, 0.8)
    .to(opponentActiveCard.scale, { x: 1.2, y: 1.2, z: 1.2 }, 0.8)
    .to(opponentActiveCard.position, { x: 0.25, y: 1, z: -1.7 }, 0.8); 
    } else {
        console.log('ошибка - не была выбрана активная карта перед началом раунда')
    }
}